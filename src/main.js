import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import axios from 'axios';

// Настройка перехватчика для добавления authToken в каждый запрос
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['authToken'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Добавляем обработчик ошибок маршрутизации
router.onError((error) => {
    console.error('Ошибка при попытке маршрутизации:', error);
    alert('Произошла ошибка при переходе на другую страницу.');
});

createApp(App)
    .use(router)
    .use(store)
    .mount('#app');

