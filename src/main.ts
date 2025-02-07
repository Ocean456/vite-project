import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import {createPinia} from "pinia";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style/index.css'
import './style/dark/css-vars.css'
import router from "./router";
import './style/element-plus.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus, {locale: zhCn})
app.use(router)
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
