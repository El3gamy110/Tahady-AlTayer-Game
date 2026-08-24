import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.tahadyaltayer',
  appName: 'تحدي عالطاير',
  webDir: '.output/public',
  server: {
    url: 'https://tahady-altayer.lovable.app',
    cleartext: true
  }
};

export default config;
