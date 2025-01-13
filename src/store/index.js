// index.js (основной Vuex store)
import { createStore } from 'vuex';
import { authModule } from './auth';  // Импорт модуля авторизации
import { cartModule } from './cart';  // Импорт модуля корзины
import { productsModule } from './products';
import { categoriesModule } from './categories';

// Плагин для автоматического сохранения состояния корзины в localStorage
const localStoragePlugin = (store) => {
    store.subscribe((mutation, state) => {
        if (state.cart) {
            localStorage.setItem('cartItems', JSON.stringify(state.cart.items));
        }
    });
};

// Создаем и экспортируем основное хранилище с модулями auth и cart
const store = createStore({
    modules: {
        auth: authModule,
        cart: cartModule,
        products: productsModule,
        categories: categoriesModule,
    },
    plugins: [localStoragePlugin],
});
export default store;

