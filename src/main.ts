import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import {createPinia} from "pinia";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import 'element-plus/dist/index.css'
import './style/index.css'
import router from "./router";

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus, {locale: zhCn})
app.use(router)
app.use(pinia)
app.mount('#app')
