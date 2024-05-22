import { createApp } from 'vue'
import App from './App.vue'
import { anu } from 'anu-vue'

// UnoCSS import
import 'uno.css'

// anu styles
import 'anu-vue/dist/style.css'

// default theme styles
import '@anu-vue/preset-theme-default/dist/style.css'

// Créez votre application Vue
const app = createApp(App)

// Utilisez `app.use(anu)` pour enregistrer le plugin anu
app.use(anu as any)

// Montez l'application sur l'élément avec l'ID 'app' dans le DOM
app.mount('#app')
