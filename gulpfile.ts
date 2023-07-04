import * as gulp from 'gulp';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import axios from 'axios';
import {exec} from 'child_process';
import {CapacitorConfig} from '@capacitor/cli';

const jsonEditor = require('gulp-json-editor');
// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Task per il build e il deploy dell'app
gulp.task('build', async () => {
  const appId = process.argv[4];
  const apiUrl = `https://portapporta.webmapp.it/api/c/${appId}/config.json`;
  const instancePath = `./instances/${appId}`;
  const capacitorConfigPath = `${instancePath}/capacitor-config.json`;
  const environmentProdPath = `projects/pap/src/environments/environment.prod.ts`;
  const deploys = await readJsonFile('deploys.json');
  const deploy = deploys[appId];

  const config: any = await getConfig(apiUrl);
  console.log('Configurazione ottenuta:', config);
  const title = config.name;
  const sku = deploy.sku;

  console.log("Informazioni dall'API:");
  console.log('Titolo:', title);

  console.log('Sku:', sku);

  createFolder(instancePath);
  const capacitorConfig: CapacitorConfig = {
    appId: sku,
    appName: 'PortAPPorta ESA',
    webDir: instancePath,
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
  await writeFile(environmentProdPath, `export const environment = ${JSON.stringify(environment)}`);
  await ionicBuild(capacitorConfigPath, instancePath);
  await ionicPlathforms();
  await moveFoldersToInstance(instancePath);
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
    const cmd = `ionic build --prod --capacitor-config="${capacitorConfigPath}"`;
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        reject();
      }
      console.log(stdout);

      console.error(stderr);
      resolve();
    });
  });
};

const ionicPlathforms = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `capacitor-resources -p android,ios`;
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante la build di Ionic:', error);
        reject();
      }
      console.log(stdout);

      console.error(stderr);
      resolve();
    });
  });
};

const writeFile = (path: string, file: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(path, file);
      resolve();
    } catch (error) {
      console.error('Errore durante la scrittura del file temporaneo:', error);
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
  });
};
