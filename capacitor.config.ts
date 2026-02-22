import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.artvpp.app',
  appName: 'ArtVpp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
