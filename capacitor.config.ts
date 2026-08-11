import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.tahadyaltayer',
  appName: 'Tahady Al Tayer',
  webDir: '.output/public',
  server: {
    url: 'https://screen-duplicate-hero.lovable.app',
    cleartext: true
  }
};

export default config;
