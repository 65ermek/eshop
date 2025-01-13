import axios from 'axios';
import { generateSessionId } from '@/utils/session';
import {commit} from "lodash/seq.js";

export const cartModule = {
    namespaced: true,
    state: () => ({
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        cartItems: [],
        total_price: 0,
        cartId: localStorage.getItem('cartId') || null,
        customerInfo: JSON.parse(localStorage.getItem('customerInfo')) || {
            name: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            postalCode: ''
        },
        paymentMethod: localStorage.getItem('paymentMethod') || '',
        paymentPrice: JSON.parse(localStorage.getItem('paymentPrice')) || 0,
        deliveryMethod: localStorage.getItem('deliveryMethod') || '',
        deliveryPrice: JSON.parse(localStorage.getItem('deliveryPrice')) || 0,
    }),

    mutations: {
        setCustomerInfo(state, customerInfo) {
            console.log('Mutation setCustomerInfo вызвана с данными:', customerInfo);
            state.customerInfo = customerInfo;
            localStorage.setItem('customerInfo', JSON.stringify(customerInfo)); // Сохраняем данные локально
        },
        setPaymentMethod(state, paymentMethod) {
            console.log("Выбранный способ оплаты:", paymentMethod);
            state.paymentMethod = paymentMethod;
            localStorage.setItem('paymentMethod', paymentMethod);
        },
        setDeliveryMethod(state, { method, price }) {
            state.deliveryMethod = method;
            state.deliveryPrice = price;
            localStorage.setItem('deliveryMethod', method);
            localStorage.setItem('deliveryPrice', JSON.stringify(price));
        },
        updateQuantity(state, { productId, amount }) {
            const item = state.items.find(item => item.id === productId || item.product_id === productId);
            if (item) {
                item.qty = Math.max(1, item.qty + amount); // Минимум 1 товар
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            }
        },
        setCart(state, { items, total_price, cartId }) {
            state.cartItems = items;
            state.total_price = total_price;
            state.cartId = cartId;
        },
        setCartItems(state, items) {
            state.items = items;
            localStorage.setItem('cartItems', JSON.stringify(items));
        },
        setCartId(state, cartId) {
            state.cartId = cartId;
            localStorage.setItem('cartId', cartId);
        },
        addItemToCart(state, product) {
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.qty += product.qty || 1;
            } else {
                state.items.push({ ...product, qty: product.qty || 1 });
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeFromCart(state, productId) {
            state.items = state.items.filter(item => item.id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        updateTotalPrice(state, total_price) {
            state.total_price = total_price;
        },
        clearCart(state) {
            state.items = [];
            state.total_price = 0;
            state.cartId = null;
            state.paymentMethod = '';
            state.paymentPrice = 0;
            state.deliveryMethod = '';
            state.deliveryPrice = 0;
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartId');
            localStorage.removeItem('paymentMethod');
            localStorage.removeItem('paymentPrice');
            localStorage.removeItem('deliveryMethod');
            console.log("Корзина успешно очищена.");
        },
        clearCustomerInfo(state) {
            state.customerInfo = {
                name: '',
                email: '',
                phone: '',
                street: '',
                city: '',
                postalCode: ''
            };
            localStorage.removeItem('customerInfo');
        },
    },

    actions: {
        saveCustomerInfo({ commit }, customerInfo) {
            console.log('Action saveCustomerInfo вызван с данными:', customerInfo);
            commit('setCustomerInfo', customerInfo); // Сохраняем данные в состоянии
        },
        // Получение данных о товаре по ID
        async fetchProductById(_, productId) {
            if (!productId) {
                console.warn("Запрос товара отклонен: отсутствует productId");
                return null;
            }
            try {
                const response = await axios.get(`https://shop.avanpost.online/api/products/${productId}`);
                console.log(`Данные для товара с ID ${productId} загружены:`, response.data);
                return response.data;
            } catch (error) {
                console.error(`Ошибка при загрузке данных товара с ID ${productId}:`, error);
                return null;
            }
        },
        async enrichCartItems({ state, rootState, commit }) {
            const enrichedItems = state.items.map(item => {
                const product = rootState.products.allProducts.find(p => p.id === item.id);
                if (product) {
                    return {
                        ...item,
                        name: product.name,
                        slug: product.slug,
                        main_image: product.main_image,
                        price: product.price,
                        unique_code: product.unique_code
                    };
                }
                return item; // Если продукт не найден, возвращаем оригинальный item
            });

            commit('setCartItems', enrichedItems);
        },
        clearCart({ commit }) {
            commit('clearCart');
        },
        async addToCart({ commit, state, dispatch }, product) {
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                commit('updateQuantity', { productId: product.id, amount: product.qty });
            } else {
                commit('addItemToCart', product);
            }

            await dispatch('saveCartToDatabase');
        },
        async loadCart({ commit, rootState, dispatch }) {
            const token = rootState.auth.token;
            try {
                const response = await axios.get(
                    'https://shop.avanpost.online/api/cart',
                    { params: { api_token: token } }
                );
                await dispatch('enrichCartItems', response.data.cart.items);
                commit('setCart', {
                    items: response.data.cart.items,
                    total_price: response.data.cart.total_price,
                    cartId: response.data.cart.id
                });
                console.log("Корзина загружена:", response.data.cart);
            } catch (error) {
                console.error("Ошибка при загрузке корзины:", error);
            }
        },
        async saveCartToDatabase({ state, rootState, commit }) {
            try {
                const isAuthenticated = rootState.auth.isAuthenticated; // Проверка авторизации
                const token = rootState.auth.token; // Токен для авторизованных пользователей

                // Генерация или извлечение session_id для неавторизованных пользователей
                const sessionId = isAuthenticated
                    ? null
                    : localStorage.getItem('session_id') || generateSessionId();

                if (!isAuthenticated && !localStorage.getItem('session_id')) {
                    localStorage.setItem('session_id', sessionId); // Сохраняем session_id
                }

                const cartData = {
                    customer_id: isAuthenticated ? rootState.auth.customerId : null,
                    customer_name: isAuthenticated ? rootState.auth.userName : null,
                    email: isAuthenticated ? rootState.auth.userEmail : null,
                    session_id: sessionId, // Добавляем session_id
                    total_price: state.items.reduce((total, item) => total + item.price * item.qty, 0),
                    items: state.items.map(item => ({
                        product_id: item.id,
                        quantity: item.qty,
                        price: item.price,
                        total_price: item.price * item.qty,
                    })),
                };

                const headers = isAuthenticated ? { params: { api_token: token } } : {};

                const response = await axios.post(
                    'https://shop.avanpost.online/api/cart/save',
                    cartData,
                    headers
                );

                const cartId = response.data.cart.id;
                commit('setCartId', cartId);
                localStorage.setItem('cartId', cartId);

                console.log("Корзина успешно сохранена/обновлена на сервере.");
            } catch (error) {
                console.error("Ошибка при сохранении корзины на сервере:", error);
            }
        },
        async saveFinishCartToDatabase({ state, rootState }, { session_id, customer_name, email }) {
            try {
                const isAuthenticated = rootState.auth.isAuthenticated;
                const token = isAuthenticated ? rootState.auth.token : null;
                const phone = rootState.auth.userPhone && rootState.auth.userPhone.length <= 20
                    ? rootState.auth.userPhone
                    : null;

                const address = {
                    street: rootState.auth.userStreet?.trim() || '',
                    city: rootState.auth.userCity?.trim() || '',
                    postal_code: rootState.auth.userPostalCode?.trim() || '',
                    country: 'CZ',
                    alt_address: rootState.auth.showAltAddress ? {
                        name: rootState.auth.deliveryName?.trim() || '',
                        company: rootState.auth.companyName?.trim() || '',
                        street: rootState.auth.deliveryStreet?.trim() || '',
                        city: rootState.auth.deliveryCity?.trim() || '',
                        postal_code: rootState.auth.deliveryPostalCode?.trim() || '',
                        contact_phone: rootState.auth.deliveryPhone?.trim() || '',
                    } : null,
                };

                const payload = {
                    customer_id: isAuthenticated ? rootState.auth.customerId : null,
                    customer_name,
                    email,
                    phone: phone || null,
                    cart_id: state.cartId,
                    delivery_method: state.deliveryMethod,
                    delivery_price: state.deliveryPrice,
                    payment_method: state.paymentMethod,
                    payment_price: state.paymentPrice,
                    total_price: state.items.reduce((sum, item) => sum + item.price * item.qty, 0) +
                        (state.deliveryPrice || 0) +
                        (state.paymentPrice || 0),
                    items: state.items.map(item => ({
                        product_id: item.id,
                        qty: item.qty,
                        price: item.price,
                    })),
                    address,
                };

                const headers = isAuthenticated ? { params: { api_token: token } } : undefined;

                console.log('Отправка данных на сервер:', payload);

                const response = await axios.post(
                    'https://shop.avanpost.online/api/cart/finish',
                    payload,
                    headers
                );

                console.log('Финальная корзина успешно сохранена:', response.data);

                return response.data;
            } catch (error) {
                console.error('Ошибка при сохранении финальной корзины:', error.response?.data || error.message);
                throw error;
            }
        },
        async removeFromCart({ commit, state, rootState }, productId) {
            const cartId = state.cartId;
            const token = rootState.auth.token;
            const isAuthenticated = rootState.auth.isAuthenticated;
            const sessionId = localStorage.getItem('session_id');

            if (!cartId && !sessionId) {
                console.error("Некорректные данные: ни cartId, ни sessionId не найдены");
                return;
            }

            try {
                const url = isAuthenticated
                    ? `https://shop.avanpost.online/api/cart/${cartId}/item/${productId}`
                    : `https://shop.avanpost.online/api/cart/session/${sessionId}/item/${productId}`;

                const headers = isAuthenticated ? { params: { api_token: token } } : {};

                const response = await axios.delete(url, headers);

                commit('removeFromCart', productId);
                commit('updateTotalPrice', response.data.total_price);

                console.log("Товар успешно удален.");
            } catch (error) {
                console.error("Ошибка при удалении товара из корзины:", error);
            }
        },

        async loadCartFromDatabase({ commit, rootState, dispatch }) {
            if (rootState.auth.isAuthenticated) {
                const token = rootState.auth.token;
                try {
                    const response = await axios.get(
                        'https://shop.avanpost.online/api/cart',
                        { params: { api_token: token } }
                    );
                    await dispatch('enrichCartItems', response.data.items);
                    commit('setCartItems', response.data.items);
                    commit('setCartId', response.data.cart.id);
                } catch (error) {
                    console.error('Ошибка при загрузке корзины:', error);
                }
            }
        },
        initializeCartFromLocalStorage({ commit }) {
            const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const savedCustomerInfo = JSON.parse(localStorage.getItem('customerInfo')) || null;

            if (savedItems.length) {
                commit('setCartItems', savedItems);
            }
            if (savedCustomerInfo) {
                commit('setCustomerInfo', savedCustomerInfo);
            }
        },
        created() {
            this.$store.dispatch('cart/initializeCartFromLocalStorage');
        },
        clearAllData({ commit }) {
            commit('clearCart');
            commit('clearCustomerInfo');
        }
    },

    getters: {
        itemCount: (state) => state.items.reduce((total, item) => total + item.qty, 0),
        cartItems: (state) => state.items || [],
        customerInfo: (state) => state.customerInfo,
        paymentMethod: (state) => state.paymentMethod,
        paymentPrice: (state) => state.paymentPrice,
        deliveryMethod: (state) => state.deliveryMethod,
        deliveryPrice: (state) => state.deliveryPrice,
        totalPrice: (state) => {
            const cartTotal = state.items.reduce((total, item) => total + item.price * item.qty, 0);
            return cartTotal + state.deliveryPrice + state.paymentPrice;
        },
        isProductInCart: (state) => (productId) => state.items.some(item => item.id === productId)
    }
};
