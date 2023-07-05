import * as gulp from 'gulp';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import axios from 'axios';
import {exec} from 'child_process';
import {CapacitorConfig} from '@capacitor/cli';
const variables = `:root {
	--ion-color-primary: #eb445a;
	--ion-color-primary-rgb: 235,68,90;
	--ion-color-primary-contrast: #ffffff;
	--ion-color-primary-contrast-rgb: 255,255,255;
	--ion-color-primary-shade: #cf3c4f;
	--ion-color-primary-tint: #ed576b;

	--ion-color-secondary: #5260ff;
	--ion-color-secondary-rgb: 82,96,255;
	--ion-color-secondary-contrast: #ffffff;
	--ion-color-secondary-contrast-rgb: 255,255,255;
	--ion-color-secondary-shade: #4854e0;
	--ion-color-secondary-tint: #6370ff;

	--ion-color-tertiary: #5260ff;
	--ion-color-tertiary-rgb: 82,96,255;
	--ion-color-tertiary-contrast: #ffffff;
	--ion-color-tertiary-contrast-rgb: 255,255,255;
	--ion-color-tertiary-shade: #4854e0;
	--ion-color-tertiary-tint: #6370ff;

	--ion-color-success: #2dd36f;
	--ion-color-success-rgb: 45,211,111;
	--ion-color-success-contrast: #000000;
	--ion-color-success-contrast-rgb: 0,0,0;
	--ion-color-success-shade: #28ba62;
	--ion-color-success-tint: #42d77d;

	--ion-color-warning: #ffc409;
	--ion-color-warning-rgb: 255,196,9;
	--ion-color-warning-contrast: #000000;
	--ion-color-warning-contrast-rgb: 0,0,0;
	--ion-color-warning-shade: #e0ac08;
	--ion-color-warning-tint: #ffca22;

	--ion-color-danger: #eb445a;
	--ion-color-danger-rgb: 235,68,90;
	--ion-color-danger-contrast: #ffffff;
	--ion-color-danger-contrast-rgb: 255,255,255;
	--ion-color-danger-shade: #cf3c4f;
	--ion-color-danger-tint: #ed576b;

	--ion-color-medium: #92949c;
	--ion-color-medium-rgb: 146,148,156;
	--ion-color-medium-contrast: #000000;
	--ion-color-medium-contrast-rgb: 0,0,0;
	--ion-color-medium-shade: #808289;
	--ion-color-medium-tint: #9d9fa6;

	--ion-color-light: #f4f5f8;
	--ion-color-light-rgb: 244,245,248;
	--ion-color-light-contrast: #000000;
	--ion-color-light-contrast-rgb: 0,0,0;
	--ion-color-light-shade: #d7d8da;
	--ion-color-light-tint: #f5f6f9;

}`;
interface Config {
  id: number;
  name: string;
  resources: {
    icon: string;
    splash: string;
  };
}
const jsonEditor = require('gulp-json-editor');
// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Task per il build e il deploy dell'app
gulp.task('build', async () => {
  try {
    const appId = process.argv[4];
    const apiUrl = `https://portapporta.webmapp.it/api/c/${appId}/config.json`;
    const instancePath = `./instances/${appId}`;
    const capacitorConfigPath = `${instancePath}/capacitor-config.json`;
    const variablesConfigPath = `projects/pap/src/theme/variables.scss`;
    const environmentProdPath = `projects/pap/src/environments/environment.prod.ts`;
    const deploys = await readJsonFile('deploys.json');
    const deploy = deploys[appId];
    const oldVariables = await readFileContent(variablesConfigPath);
    const oldCapacitorConfig = await readFileContent('capacitor.config.ts');

    const config: Config = await getConfig(apiUrl);
    console.log('Configurazione ottenuta:', config);
    const sku = deploy.sku;
    console.log('Sku:', sku);

    createFolder(instancePath);
    const capacitorConfig: CapacitorConfig = {
      appId: sku,
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
      companyId: appId,
      api: 'https://portapporta.webmapp.it',
      //api: 'http://127.0.0.1:8000/',
      GOOOGLEAPIKEY: '',
    };

    await writeFile(capacitorConfigPath, JSON.stringify(capacitorConfig));
    await writeFile(
      'capacitor.config.ts',
      `import {CapacitorConfig} from '@capacitor/cli';

      const capacitorConfig: CapacitorConfig = ${JSON.stringify(capacitorConfig)}
    
    export default capacitorConfig;`,
    );
    await writeFile(
      environmentProdPath,
      `export const environment = ${JSON.stringify(environment)}`,
    );
    await writeFile(variablesConfigPath, variables);
    await ionicBuild(capacitorConfigPath, instancePath);
    await ionicBuildIos(capacitorConfigPath, instancePath);
    await ionicPlathforms(config.resources);
    await ionicCapSync();

    await writeFile(variablesConfigPath, oldVariables);
    await writeFile('capacitor.config.ts', oldCapacitorConfig);
    await moveFoldersToInstance(instancePath);
    console.log('Build completed successfully.');
  } catch (err) {
    console.error('An error occurred during the build:', err);
    throw err;
  }
});
// Task predefinito
gulp.task('default', gulp.series('build'));
// Funzione per effettuare il login e ottenere il token di autenticazione
async function loginAndGetAuthToken(email: string, password: string): Promise<string> {
  const loginUrl = 'https://portapporta.webmapp.it/api/login'; // URL di login dell'API
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
const writeFile = (path: string, file: string): Promise<void> => {
  return new Promise((resolve, reject) => {
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
    throw err;
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
