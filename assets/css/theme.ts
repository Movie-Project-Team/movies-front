import { definePreset } from "@primevue/themes";
import Aura from '@primevue/themes/aura';

export const Theme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0f0ff',
      100: '#b3daff',
      200: '#80c2ff',
      300: '#4da9ff',
      400: '#2696ff',
      500: '#1F80E0', 
      600: '#1b72c8',
      700: '#165ba3',
      800: '#12457f',
      900: '#0d2f5a',
      950: '#081b3a'
    }
  }
});
