import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import CatalogPage from './pages/CatalogPage.vue'
import ProductPage from './pages/ProductPage.vue'
import AdminPage from './pages/AdminPage.vue'
import ProductFormPage from './pages/ProductFormPage.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: CatalogPage },
    { path: '/products/:id', component: ProductPage },
    { path: '/admin', component: AdminPage },
    { path: '/admin/products/new', component: ProductFormPage },
    { path: '/admin/products/:id', component: ProductFormPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

createApp(App).use(router).mount('#app')
