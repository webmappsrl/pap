import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.webmapp.portapportaesa',
  appName: 'PortAPPorta ESA',
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

export default config;
