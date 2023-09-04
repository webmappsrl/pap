import {CapacitorConfig} from '@capacitor/cli';
const capacitorConfig: CapacitorConfig = {
  'appId': 'it.webmapp.portapportaesa',
  'appName': 'esa',
  'webDir': 'dist/pap/',
  'bundledWebRuntime': false,
  'cordova': {
    'preferences': {
      'ScrollEnabled': 'false',
      'BackupWebStorage': 'none',
      'SplashMaintainAspectRatio': 'true',
      'FadeSplashScreenDuration': '300',
      'SplashShowOnlyFirstTime': 'false',
      'SplashScreen': 'screen',
      'SplashScreenDelay': '3000',
    },
  },
  'plugins': {
    'PushNotifications': {
      'presentationOptions': ['badge', 'sound', 'alert'],
    },
  },
};
export default capacitorConfig;
