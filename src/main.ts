import './assets/main.css'
import { anu } from 'anu-vue';
import { createApp } from 'vue';
import App from './App.vue';

import 'uno.css';

// anu styles
import 'anu-vue/dist/style.css';

// default theme styles
import '@anu-vue/preset-theme-default/dist/style.css';

createApp(App).use(anu, { registerComponents: false }).mount('#app');