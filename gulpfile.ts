import * as gulp from 'gulp';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import axios from 'axios';
import {exec} from 'child_process';
import {CapacitorConfig} from '@capacitor/cli';
const api = 'https://portapporta.webmapp.it';
interface Config {
  id: number;
  name: string;
  resources: {
    icon: string;
    splash: string;
    variables: string;
    logo: string;
    header_image: string;
    footer_image: string;
  };
  sku: string;
}
interface Paths {
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
    const companyId = process.argv[4];
    const paths: Paths = getPaths(companyId);

    const oldVariables = await readFileContent(paths.variablesConfigPath);

    const devVariables = await readFileContent(paths.devVariablesConfigPath);
    await execCmd(`rm -rf ${paths.devVariablesConfigPath}`);
    const oldCapacitorConfig = await readFileContent('capacitor.config.ts');

    const config: Config = await getConfig(paths.apiUrl);
    console.log('Configurazione ottenuta:', config);
    const sku = config.sku;
    console.log('Sku:', sku);

    createFolder(paths.instancePath);
    const capacitorConfig: CapacitorConfig = {
      appId: config.sku,
      appName: config.name,
      webDir: 'dist/pap/',
      bundledWebRuntime: false,
      cordova: {
        preferences: {
          ScrollEnabled: 'false',
          BackupWebStorage: 'none',
          SplashMaintainAspectRatio: 'true',
          FadeSplashScreenDuration: '300',
          SplashShowOnlyFirstTime: 'false',
          SplashScreen: 'screen',
          SplashScreenDelay: '3000',
        },
      },
    };
    const environment = {
      production: true,
      companyId: companyId,
      config,
      api,
      GOOOGLEAPIKEY: '',
    };

    await writeFile(paths.capacitorConfigPath, JSON.stringify(capacitorConfig));
    await writeFile(
      'capacitor.config.ts',
      `
      import {CapacitorConfig} from '@capacitor/cli';
      const capacitorConfig: CapacitorConfig = ${JSON.stringify(capacitorConfig)}
      export default capacitorConfig;
      `,
    );
    await writeFile(
      paths.environmentProdPath,
      `export const environment = ${JSON.stringify(environment).replace(/"([^"]+)":/g, '$1:')}`,
    );
    await writeFile(paths.variablesConfigPath, config.resources.variables);
    await writeFile(paths.devVariablesConfigPath, config.resources.variables);
    await ionicBuild(paths.capacitorConfigPath, paths.instancePath);
    await ionicBuildIos(paths.capacitorConfigPath, paths.instancePath);
    await ionicPlathforms(config.resources);
    await ionicCapSync();

    await writeFile(paths.variablesConfigPath, oldVariables);
    await writeFile('capacitor.config.ts', oldCapacitorConfig);
    await writeFile(paths.devVariablesConfigPath, devVariables);
    await moveFoldersToInstance(paths.instancePath);
    console.log('Build completed successfully.');
  } catch (err) {
    console.error('An error occurred during the build:', err);
    throw err;
  }
});

gulp.task('serve', async () => {
  const companyId = process.argv[4];
  const paths: Paths = getPaths(companyId);
  const config: Config = await getConfig(paths.apiUrl);

  await setDevEnvironment(paths, config);
  await writeFile(paths.devVariablesConfigPath, config.resources.variables);
  await setAssets(config);
  await execCmd(`ionic serve`);
});

gulp.task('init', async () => {
  await execCmd(`rm -rf android`);
  await execCmd(`rm -rf ios`);
  await execCmd(`rm -rf resources`);
  await execCmd(`rm -rf icons`);
  await execCmd(`npx cap add ios`);
  await execCmd(`cd ios/App && pod install`);
  await execCmd(`npx cap add android`);
});
// Task predefinito
gulp.task('default', gulp.series('build'));

async function setDevEnvironment(paths: Paths, config: Config): Promise<void> {
  const environment = {
    production: true,
    companyId: paths.companyId,
    config,
    api,
    //api: 'http://127.0.0.1:8000/',
    GOOOGLEAPIKEY: '',
  };

  await writeFile(
    paths.environmentDevPath,
    `export const environment = ${JSON.stringify(environment).replace(/"([^"]+)":/g, '$1:')}`,
  );
}
async function setProdEnvironment(paths: Paths, config: Config): Promise<void> {
  const environment = {
    production: true,
    companyId: paths.companyId,
    config,
    api,
    //api: 'http://127.0.0.1:8000/',
    GOOOGLEAPIKEY: '',
  };

  await writeFile(
    paths.environmentProdPath,
    `export const environment = ${JSON.stringify(environment).replace(/"([^"]+)":/g, '$1:')}`,
  );
}

async function setAssets(config: Config): Promise<void> {
  await download(config.resources.logo, `projects/pap/src/assets/icons/logo.png`);
  await download(config.resources.header_image, `projects/pap/src/assets/images/header.png`);
  await download(config.resources.footer_image, `projects/pap/src/assets/images/footer.png`);
}
function execCmd(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`${cmd}: START`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(`${cmd}: DONE`);
      resolve();
    });
  });
}
function getPaths(companyId: string): Paths {
  const instancePath = `./instances/${companyId}`;
  return {
    companyId,
    instancePath,
    apiUrl: `${api}/api/c/${companyId}/config.json`,
    capacitorConfigPath: `${instancePath}/capacitor-config.json`,
    variablesConfigPath: `projects/pap/src/theme/variables.scss`,
    devVariablesConfigPath: `projects/pap/src/theme/dev-variables.scss`,
    environmentProdPath: `projects/pap/src/environments/environment.prod.ts`,
    environmentDevPath: `projects/pap/src/environments/environment.ts`,
  };
}
// Funzione per effettuare il login e ottenere il token di autenticazione
async function loginAndGetAuthToken(email: string, password: string): Promise<string> {
  const loginUrl = `${api}/api/login`; // URL di login dell'API
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

const getConfig = (apiUrl: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    exec(`curl -s "${apiUrl}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error("Impossibile recuperare le informazioni dall'API:", err);
        return reject();
      }
      try {
        // Utilizza le variabili d'ambiente nel tuo script
        const email = process.env['EMAIL'] || '';
        const password = process.env['PASSWORD'] || '';
        const authToken = await loginAndGetAuthToken(email, password);

        const response = await axios.get(apiUrl, {
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

const createFolder = (path: string): void => {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      console.log(`Cartella "${path}" creata con successo.`);
    } else {
      console.log(`La cartella "${path}" esiste già.`);
    }
  } catch (error) {
    console.error(`Errore durante la creazione della cartella "${path}":`, error);
  }
};

const ionicBuild = (capacitorConfigPath: string, instancePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `ionic  build --prod`;
    console.log(`${cmd}: START`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(stdout);

      console.error(stderr);
      console.log(`${cmd}: DONE`);
      resolve();
    });
  });
};

const ionicBuildIos = (capacitorConfigPath: string, instancePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `ionic  build ios --prod`;
    console.log(`${cmd}: START`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(stdout);
      console.error(stderr);
      console.log(`${cmd}: DONE`);
      resolve();
    });
  });
};

const ionicPlathforms = (resources: {icon: string; splash: string}): Promise<void> => {
  return new Promise((resolve, reject) => {
    createFolder('resources');
    createFolder('android');
    createFolder('ios');
    createFolder('ios/');
    download(resources.icon, `resources/icon.png`);
    download(resources.icon, `resources/icon-only.png`);
    download(resources.icon, `resources/icon-foreground.png`);
    download(resources.icon, `resources/icon-background.png`);
    download(resources.splash, `resources/splash.png`);
    download(resources.splash, `resources/splash-dark.png`);
    const cmd = `npx capacitor-assets generate`;
    console.log(`${cmd}: START`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(stdout);
      console.error(stderr);
      console.log(`${cmd}: DONE`);
      resolve();
    });
  });
};
const ionicCapSync = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `npx cap sync`;
    console.log(`${cmd}: START`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        console.log(`${cmd}: ERROR`);
        reject();
      }
      console.log(stdout);
      console.error(stderr);
      console.log(`${cmd}: DONE`);
      resolve();
    });
  });
};
const writeFile = (path: string, file: string | null): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (file == null) reject();
    console.log(`${path}: START`);
    try {
      fs.writeFileSync(path, file);
      console.log(`${path}: DONE`);
      resolve();
    } catch (error) {
      console.error('Errore durante la scrittura del file temporaneo:', error);
      console.log(`${path}: ERROR`);
      reject(error);
    }
  });
};

const moveFoldersToInstance = (instancePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      fsExtra.copy('./dist/pap', `${instancePath}/www`);
    } catch (error) {
      console.log(error);
    }
    try {
      fsExtra.copy('./android', `${instancePath}/android`);
    } catch (error) {
      console.log(error);
    }
    try {
      fsExtra.copy('./ios', `${instancePath}/ios`);
    } catch (error) {
      console.log(error);
    }
    try {
      fsExtra.copy('./node_modules', `${instancePath}/node_modules`);
    } catch (error) {
      console.log(error);
    }
    try {
      fsExtra.copy('./resources', `${instancePath}/resources`);
    } catch (error) {
      console.log(error);
    }
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
  try {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    fs.writeFileSync(destinationPath, response.data);
    console.log('Il file  è stato scaricato con successo.');
  } catch (error) {
    console.error('Si è verificato un errore durante il download del file :', error);
  }
}
