import * as gulp from 'gulp';
import * as yargs from 'yargs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as xml2js from 'xml2js';
import axios from 'axios';
import {exec} from 'child_process';
import {CapacitorConfig} from '@capacitor/cli';
const args: any = <any>yargs.argv;
let version = '';
let paths: Paths = {} as Paths;
// const api = 'https://dev.portapporta.webmapp.it/api/v1';
const devApi = 'https://dev.portapporta.webmapp.it/api/v2';
const prodApi = 'https://portapporta.webmapp.it/api/v2';
// const api = 'http://127.0.0.1:8000/api/v1';
interface Config {
  app_name: string;
  id: number;
  name: string;
  resources: {
    icon: string;
    app_icon: string;
    splash: string;
    variables: string;
    logo: string;
    header_image: string;
    footer_image: string;
    other_info_url: string;
    push_notification_plist_url: string;
    push_notification_json_url: string;
  };
  sku: string;
}
interface Paths {
  api: string;
  apiUrl: string;
  capacitorConfigPath: string;
  companyId: string;
  devVariablesConfigPath: string;
  environmentDevPath: string;
  environmentProdPath: string;
  instancePath: string;
  variablesConfigPath: string;
}
const jsonEditor = require('gulp-json-editor');
// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Task per il build e il deploy dell'app
gulp.task('build', async () => {
  try {
    await init();
    const companyId = args.id || null;
    const prod = args.prod ? true : false;
    const packageJson = await readJsonFile('./package.json');
    version = packageJson.version;
    console.log('PROD', prod);
    paths = getPaths(companyId, prod);
    const config: Config = await getConfig(paths);
    await setEnvironment(paths, config);
    await setAssets(config);
    await ionicPlathforms(config.resources);
    await execCmd(`rm -rf ${paths.instancePath}`);
    createFolder(paths.instancePath);
    const capacitorConfig: CapacitorConfig = {
      appId: config.sku,
      appName: `${config.app_name}`,
      webDir: 'dist/pap/',
      bundledWebRuntime: false,
      plugins: {
        PushNotifications: {
          presentationOptions: ['badge', 'sound', 'alert'],
        },
        SplashScreen: {
          launchShowDuration: 3000,
          launchAutoHide: true,
          backgroundColor: '#ffffffff',
          androidSplashResourceName: 'splash',
          androidScaleType: 'CENTER_CROP',
          showSpinner: true,
          androidSpinnerStyle: 'large',
          iosSpinnerStyle: 'small',
          spinnerColor: '#999999',
          splashFullScreen: true,
          splashImmersive: true,
        },
      },
    };
    await writeFile('capacitor.config.ts', JSON.stringify(capacitorConfig, null, 2));

    await writeFile(paths.capacitorConfigPath, JSON.stringify(capacitorConfig, null, 2));
    await writeFile(
      'capacitor.config.ts',
      `
      import {CapacitorConfig} from '@capacitor/cli';
      const capacitorConfig: CapacitorConfig = ${JSON.stringify(capacitorConfig, null, 2)}
      export default capacitorConfig;
      `,
    );

    await writeFile(paths.variablesConfigPath, config.resources.variables);
    await writeFile(paths.devVariablesConfigPath, config.resources.variables);
    await download(
      config.resources.push_notification_plist_url,
      `ios/App/App/GoogleService-Info.plist`,
    );
    await download(config.resources.push_notification_json_url, `android/app/google-services.json`);
    await ionicBuild();
    await ionicBuildIos();
    await ionicBuildAndroid();
    try {
      await ensureWritableAndCopy(
        './android-custom/variables.gradle', // File sorgente
        './android/variables.gradle', // File di destinazione
        './android', // Directory
      );
    } catch (error) {
      console.error('Errore durante l’operazione di copia:', error);
    }

    await addPermissionsToAndroidManifest();
    await modifyStringsXml(config);
    console.log('VERSION: ', version);
    let buildV = buildVersion(version);
    if (config.id === 1) {
      buildV = `${buildV}000`;
    }
    console.log('BUILD VERSION: ', buildV);
    await execCmd(`npx capacitor-set-version -v ${version} -b ${buildV}`);
    await ionicCapSync();
    await ionicPlathforms(config.resources);
    await writeFile(paths.devVariablesConfigPath, config.resources.variables);
    await moveFoldersToInstance(paths.instancePath);

    const info = ((await readFileContent('./ios-custom/info.plist')) || '').replace(
      '<string>PortAPPorta</string>',
      `<string>${config.app_name}</string>`,
    );
    await writeFile(`${paths.instancePath}/ios/App/App/info.plist`, info);

    console.log('Build completed successfully.');
  } catch (err) {
    console.error('An error occurred during the build:', err);
    throw err;
  }
});

gulp.task('serve', async () => {
  const companyId = args.id || null;
  const prod = args.prod ? true : false;
  const paths: Paths = getPaths(companyId, prod);
  const config: Config = await getConfig(paths);

  await setAssets(config);
  await ionicPlathforms(config.resources);
  await setEnvironment(paths, config);
  await writeFile(paths.variablesConfigPath, config.resources.variables);
  await writeFile(paths.devVariablesConfigPath, config.resources.variables);
  await setAssets(config);
  await execCmd(`ionic serve`);
});
gulp.task('surge-deploy', async () => {
  const companyId = args.id || null;
  const paths: Paths = getPaths(companyId);
  const config: Config = await getConfig(paths);

  await setAssets(config);
  await ionicPlathforms(config.resources);
  await setEnvironment(paths, config);
  await writeFile(paths.variablesConfigPath, config.resources.variables);
  await writeFile(paths.devVariablesConfigPath, config.resources.variables);
  await setAssets(config);
  await ionicBuild('');
});

gulp.task('init', init);
// Task predefinito
gulp.task('default', gulp.series('build'));

async function setEnvironment(paths: Paths, config: Config): Promise<void> {
  const environment = {
    companyId: paths.companyId,
    config,
    api: paths.api,
    //api: 'http://127.0.0.1:8000/',
    GOOOGLEAPIKEY: '',
  };
  console.log(
    JSON.stringify({...environment, ...{production: true}}, null, 2).replace(/"([^"]+)":/g, '$1:'),
  );
  await writeFile(
    paths.environmentProdPath,
    `export const environment = ${JSON.stringify(
      {...environment, ...{production: true}},
      null,
      2,
    ).replace(/"([^"]+)":/g, '$1:')}`,
  );
  await writeFile(
    paths.environmentDevPath,
    `export const environment = ${JSON.stringify(
      {...environment, ...{production: false}},
      null,
      2,
    ).replace(/"([^"]+)":/g, '$1:')}`,
  );
}

async function setAssets(config: Config): Promise<void> {
  await download(config.resources.logo, `projects/pap/src/assets/icons/logo.png`);
  await download(config.resources.app_icon, `projects/pap/src/assets/icons/app_icon.png`);
  await download(config.resources.header_image, `projects/pap/src/assets/images/header.png`);
  await download(config.resources.footer_image, `projects/pap/src/assets/images/footer.png`);
}
function execCmd(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(`EXEC: ${cmd}`);
      resolve();
    });
  });
}
function getPaths(companyId: string, prod = false): Paths {
  const instancePath = `./instances/${companyId}`;
  const api = `${prod ? prodApi : devApi}`;
  return {
    companyId,
    instancePath,
    api,
    apiUrl: `${api}/c/${companyId}/config.json`,
    capacitorConfigPath: `${instancePath}/capacitor-config.json`,
    variablesConfigPath: `projects/pap/src/theme/variables.scss`,
    devVariablesConfigPath: `projects/pap/src/theme/dev-variables.scss`,
    environmentProdPath: `projects/pap/src/environments/environment.prod.ts`,
    environmentDevPath: `projects/pap/src/environments/environment.ts`,
  };
}
// Funzione per effettuare il login e ottenere il token di autenticazione
async function loginAndGetAuthToken(api: string, email: string, password: string): Promise<string> {
  const loginUrl = `${api}/login`; // URL di login dell'API
  const authData = {
    email,
    password,
  };

  try {
    const response = await axios.post(loginUrl, authData);
    const authToken = response.data.data.token; // Assume che il token sia restituito come campo "token" nella risposta

    return authToken;
  } catch (error) {
    console.error('Errore durante il login:', error);
    throw error;
  }
}
// Legge il contenuto di un file JSON
function readJsonFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    gulp
      .src(filePath)
      .pipe(
        jsonEditor((json: any) => {
          resolve(json);
        }),
      )
      .on('error', (err: any) => {
        console.log(err);
        return reject;
      });
  });
}
function init(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await execCmd(`rm -rf android`);
      await execCmd(`rm -rf ios`);
      await execCmd(`rm -rf resources`);
      await execCmd(`rm -rf icons`);
      await execCmd(`npm install --force`);
      try {
        await execCmd(`npx cap add android`);
        await execCmd(`npx cap add ios`);
      } catch (e) {
        console.log(e);
      }
      // Imposta la variabile di ambiente LANG su en_US.UTF-8
      process.env['LANG'] = 'en_US.UTF-8';
      await execCmd(`cd ios/App && pod install`);
      fsExtra.copyFile('./ios-custom/Podfile', `./ios/App/Podfile`);
      console.log(`INFO: update Podfile`);
      fsExtra.copyFile('./ios-custom/AppDelegate.swift', `./ios/App/App/AppDelegate.swift`);
      fsExtra.copyFile('./ios-custom/info.plist', `./ios/App/App/info.plist`);
      console.log(`init completato`);
      resolve();
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

const getConfig = (paths: Paths): Promise<any> => {
  return new Promise((resolve, reject) => {
    exec(`curl -s "${paths.apiUrl}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error("Impossibile recuperare le informazioni dall'API:", err);
        return reject();
      }
      try {
        // Utilizza le variabili d'ambiente nel tuo script
        const email = process.env['EMAIL'] || '';
        const password = process.env['PASSWORD'] || '';
        const authToken = await loginAndGetAuthToken(paths.api, email, password);

        const response = await axios.get(paths.apiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Elabora la risposta
        const config = response.data;
        resolve(config);
      } catch (error) {
        console.error('Errore durante il recupero della configurazione:', error);
        reject(error);
      }
    });
  });
};

const createFolder = (path: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (fs.existsSync(path)) {
        await execCmd(`rm -rf ${paths.instancePath}`);
      }
      try {
        fs.mkdirSync(path);
      } catch (_) {}
      console.log(`CREATE_FOLDER: ${path}`);
      resolve();
    } catch (error) {
      reject();
      console.error(`Errore durante la creazione della cartella "${path}":`, error);
    }
  });
};

const ionicBuild = (env = '--prod'): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const cmd = `ionic  build ${env}`;
    console.log(`EXEC: ${cmd}`);
    await exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      resolve();
    });
  });
};

const ionicBuildIos = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `ionic  build ios --prod`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(`EXEC: ${cmd}`);
      resolve();
    });
  });
};

const ionicBuildAndroid = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `ionic  build android --prod`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(`EXEC: ${cmd}`);
      resolve();
    });
  });
};
const addPermissionsToAndroidManifest = (): Promise<void> => {
  const androidManifestPath = './android/app/src/main/AndroidManifest.xml';
  return new Promise(async (resolve, reject) => {
    try {
      const parser = new xml2js.Parser();
      const builder = new xml2js.Builder();
      const manifestXML = fs.readFileSync(androidManifestPath, 'utf8');
      const manifest = await parser.parseStringPromise(manifestXML);

      const permissions = [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'CAMERA',
        'WRITE_EXTERNAL_STORAGE',
        'READ_EXTERNAL_STORAGE',
        'READ_MEDIA_IMAGES',
      ];
      permissions.forEach(permission => {
        if (
          !manifest['manifest']['uses-permission'] ||
          !manifest['manifest']['uses-permission'].some(
            (perm: any) => perm['$']['android:name'] === `android.permission.${permission}`,
          )
        ) {
          manifest['manifest']['uses-permission'] = manifest['manifest']['uses-permission'] || [];
          manifest['manifest']['uses-permission'].push({
            '$': {'android:name': `android.permission.${permission}`},
          });
        }
      });
      const updatedManifestXML = builder.buildObject(manifest);
      fs.writeFileSync(androidManifestPath, updatedManifestXML);
      resolve();
    } catch (e) {
      reject();
    }
  });
};
async function modifyStringsXml(config: Config): Promise<void> {
  const stringsPath = './android/app/src/main/res/values/strings.xml';

  return new Promise(async (resolve, reject) => {
    try {
      const stringsXML = fs.readFileSync(stringsPath, 'utf8');
      const parser = new xml2js.Parser();
      parser.parseString(stringsXML, (err, result) => {
        if (err) {
          throw err; // Gestisci l'errore di parsing
        }

        // Modifica l'oggetto JS in base al tuo config
        result.resources.string.forEach((str: any) => {
          if (str.$.name === 'app_name') {
            str._ = config.app_name; // Cambia il nome dell'app
          }
          if (str.$.name === 'title_activity_main') {
            str._ = config.app_name; // Cambia il nome dell'app
          }
          if (str.$.name === 'package_name') {
            str._ = config.sku; // Cambia il nome dell'app
          }
          if (str.$.name === 'custom_url_scheme') {
            str._ = config.sku; // Cambia il nome dell'app
          }
        });

        // Converti l'oggetto JS di nuovo in stringa XML
        const builder = new xml2js.Builder();
        const updatedXml = builder.buildObject(result);

        // Scrivi il nuovo XML nel file
        fs.writeFileSync(stringsPath, updatedXml);
        console.log('strings.xml has been updated successfully.');
        resolve();
      });
    } catch (e) {
      reject();
    }
  });
}
const ionicPlathforms = (resources: {icon: string; splash: string}): Promise<void> => {
  return new Promise((resolve, reject) => {
    createFolder('resources');
    createFolder('android');
    createFolder('ios');
    download(resources.icon, `resources/icon.png`);
    download(resources.icon, `resources/icon-only.png`);
    download(resources.icon, `resources/icon-foreground.png`);
    download(resources.icon, `resources/icon-background.png`);
    download(resources.splash, `resources/splash.png`);
    download(resources.splash, `resources/splash-dark.png`);
    const cmd = `npx capacitor-assets generate`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(`EXEC: ${cmd}`);
      resolve();
    });
  });
};
const ionicCapSync = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `npx cap sync`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(`EXEC: ${cmd}`);
      resolve();
    });
  });
};
const writeFile = (path: string, file: string | null): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (file == null) reject();
    try {
      fs.writeFileSync(path, file);
      console.log(`WRITE_FILE: ${path}`);

      resolve();
    } catch (error) {
      console.error('Errore durante la scrittura del file:', error);
      console.log(`${path}: ERROR`);
      reject(error);
    }
  });
};

const moveFoldersToInstance = (instancePath: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await fsExtra.copy('./dist/pap', `${instancePath}/www`, {overwrite: true});
    } catch (error) {
      console.log(error);
      reject();
    }
    try {
      await fsExtra.copy('./android', `${instancePath}/android`, {overwrite: true});
    } catch (error) {
      console.log(error);
      reject();
    }
    try {
      await fsExtra.copy('./ios', `${instancePath}/ios`, {overwrite: true});
    } catch (error) {
      console.log(error);
      reject();
    }
    try {
      await fsExtra.copy('./node_modules', `${instancePath}/node_modules`, {overwrite: true});
    } catch (error) {
      console.log(error);
      reject();
    }
    try {
      await fsExtra.copy('./resources', `${instancePath}/resources`, {overwrite: true});
    } catch (error) {
      console.log(error);
      reject();
    }
    resolve();
  });
};
async function readFileContent(filePath: string) {
  try {
    const data = await fsExtra.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error('Errore durante la lettura del file:', err);
    return null;
  }
}

async function download(url: string, destinationPath: string) {
  console.log(`DOWNLOAD: ${destinationPath}`);
  try {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    fs.writeFileSync(destinationPath, response.data);
  } catch (error) {
    console.error(`ERROR: ${error}`);
    console.log(`ERROR-url: ${url}`);
  }
}

function buildVersion(version: string): string {
  const numbers = version.split('.');

  // Verificare che ci siano esattamente tre elementi
  if (numbers.length !== 3) {
    throw new Error('Formato input non valido');
  }

  // Concatenare i numeri in una stringa senza punti
  return numbers.join('');
}

/**
 * Assicura che una directory sia scrivibile e copia un file al suo interno.
 * @param sourcePath - Percorso del file sorgente.
 * @param destinationPath - Percorso del file di destinazione.
 * @param directoryPath - Percorso della directory di destinazione.
 */
async function ensureWritableAndCopy(
  sourcePath: string,
  destinationPath: string,
  directoryPath: string,
): Promise<void> {
  try {
    // Assicura che la directory sia scrivibile
    await ensureWritableDirectory(directoryPath);

    // Copia il file nella destinazione
    await fsExtra.copy(sourcePath, destinationPath, {overwrite: true});
    console.log(`File copiato con successo da "${sourcePath}" a "${destinationPath}".`);
  } catch (error) {
    console.error(
      `Errore durante la copia del file "${sourcePath}" nella directory "${directoryPath}":`,
      error,
    );
    throw error;
  }
}

/**
 * Assicura che la directory abbia i permessi di lettura e scrittura.
 * Se non esiste, la crea.
 * @param path - Percorso della directory.
 */
async function ensureWritableDirectory(path: string): Promise<void> {
  try {
    // Verifica se la directory esiste
    if (!fs.existsSync(path)) {
      console.log(`Directory "${path}" non trovata, creazione in corso...`);
      fs.mkdirSync(path, {recursive: true}); // Crea la directory se non esiste
    }

    // Imposta i permessi di lettura e scrittura (775)
    fs.chmodSync(path, 0o775);
    console.log(`Permessi impostati per la directory: ${path}`);
  } catch (error) {
    console.error(`Errore nell'assicurare i permessi della directory "${path}":`, error);
    throw error;
  }
}
