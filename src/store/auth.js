import axios from 'axios';

export const authModule = {
    namespaced: true,
    state: {
        token: localStorage.getItem('authToken') || null,
        customerId: localStorage.getItem('customerId') || null,
        userName: localStorage.getItem('userName') || null,
        userEmail: localStorage.getItem('userEmail') || null,
        userPhone: localStorage.getItem('userPhone') || null,
        companyName: localStorage.getItem('companyName') || null,
        userStreet: localStorage.getItem('userStreet') || null,
        userCity: localStorage.getItem('userCity') || null,
        userPostalCode: localStorage.getItem('userPostalCode') || null,
        deliveryName: localStorage.getItem('deliveryName') || null,
        deliveryStreet: localStorage.getItem('deliveryStreet') || null,
        deliveryCity: localStorage.getItem('deliveryCity') || null,
        deliveryPostalCode: localStorage.getItem('deliveryPostalCode') || null,
        deliveryPhone: localStorage.getItem('deliveryPhone') || null,
        cartId: localStorage.getItem('cartId') || null, // Добавлено поле для cart_id
        isAuthenticated: !!localStorage.getItem('authToken'),
        showAltAddress: localStorage.getItem('showAltAddress') === 'true',
    },
    mutations: {
        setUserPhone(state, phone) {
            state.userPhone = phone && phone.length <= 20 ? phone : null;
        },
        setShowAltAddress(state, value) {
            state.showAltAddress = value;
            localStorage.setItem('showAltAddress', value);
        },
        setAuth(state, {
            token,
            customer_id,
            name,
            userEmail,
            phone,
            company_name,
            street,
            city,
            postal_code,
            delivery_name,
            delivery_street,
            delivery_city,
            delivery_postal_code,
            delivery_contact_phone
        }) {
            state.token = token;
            state.customerId = customer_id;
            state.userName = name;
            state.userEmail = userEmail || ''; // Заменяем null на пустую строку
            state.userPhone = phone || '';
            state.companyName = company_name || '';
            state.userStreet = street || '';
            state.userCity = city || '';
            state.userPostalCode = postal_code || '';
            state.deliveryName = delivery_name || '';
            state.deliveryStreet = delivery_street || '';
            state.deliveryCity = delivery_city || '';
            state.deliveryPostalCode = delivery_postal_code || '';
            state.deliveryPhone = delivery_contact_phone || '';

            // Сохраняем данные в localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('customerId', customer_id);
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', state.userEmail);
            localStorage.setItem('userPhone', state.userPhone);
            localStorage.setItem('companyName', state.companyName);
            localStorage.setItem('userStreet', state.userStreet);
            localStorage.setItem('userCity', state.userCity);
            localStorage.setItem('userPostalCode', state.userPostalCode);
            localStorage.setItem('deliveryName', state.deliveryName);
            localStorage.setItem('deliveryStreet', state.deliveryStreet);
            localStorage.setItem('deliveryCity', state.deliveryCity);
            localStorage.setItem('deliveryPostalCode', state.deliveryPostalCode);
            localStorage.setItem('deliveryPhone', state.deliveryPhone);

            // Устанавливаем флаг авторизации
            state.isAuthenticated = true;
        },
        setCartId(state, cartId) {
            state.cartId = cartId;
            localStorage.setItem('cartId', cartId);
        },
        setCartItems(state, items) {
            state.items = items;
            localStorage.setItem('cartItems', JSON.stringify(items));
        },
        updateTotalPrice(state, totalPrice) {
            state.total_price = totalPrice;
        },
        clearCart(state) {
            state.items = [];
            state.total_price = 0;
            state.cartId = null;
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartId');
        },
        clearAuth(state) {
            state.token = null;
            state.customerId = null;
            state.userName = null;
            state.userEmail = null;
            state.userPhone = null;
            state.companyName = null;
            state.userStreet = null;
            state.userCity = null;
            state.userPostalCode = null;
            state.deliveryName = null;
            state.deliveryStreet = null;
            state.deliveryCity = null;
            state.deliveryPostalCode = null;
            state.deliveryPhone = null;
            state.isAuthenticated = false;

            // Удаляем данные из localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('customerId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPhone');
            localStorage.removeItem('companyName');
            localStorage.removeItem('userStreet');
            localStorage.removeItem('userCity');
            localStorage.removeItem('userPostalCode');
            localStorage.removeItem('deliveryName');
            localStorage.removeItem('deliveryStreet');
            localStorage.removeItem('deliveryCity');
            localStorage.removeItem('deliveryPostalCode');
            localStorage.removeItem('deliveryPhone');
        },
    },
    actions: {
        async login({ commit, dispatch }, { email, password }) {
            try {
                const response = await axios.post('https://shop.avanpost.online/api/customers/login', { email, password });

                const {
                    token,
                    customer_id,
                    name,
                    email: userEmail,
                    phone,
                    company_name,
                    ico_number,
                    dic_number,
                    street,
                    city,
                    postal_code,
                    delivery_name,
                    delivery_street,
                    delivery_city,
                    delivery_postal_code,
                    delivery_contact_phone,
                    cart, // данные корзины
                } = response.data;

                // Сохраняем данные пользователя в Vuex
                commit('setAuth', {
                    token,
                    customer_id,
                    name,
                    userEmail,
                    phone,
                    company_name,
                    ico_number,
                    dic_number,
                    street,
                    city,
                    postal_code,
                    delivery_name,
                    delivery_street,
                    delivery_city,
                    delivery_postal_code,
                    delivery_contact_phone,
                });

                console.log("Пользователь успешно авторизован:", {
                    customer_id,
                    name,
                    email: userEmail,
                });

                // Обработка корзины
                if (cart) {
                    console.log("Загружена корзина пользователя:", cart);

                    // Сохраняем корзину в Vuex и LocalStorage
                    commit('cart/setCartId', cart.id, { root: true });
                    commit('cart/setCartItems', cart.items, { root: true });
                    commit('cart/updateTotalPrice', cart.total_price, { root: true });

                    localStorage.setItem('cartId', cart.id);
                    localStorage.setItem('cartItems', JSON.stringify(cart.items));
                } else {
                    console.warn("У пользователя отсутствует корзина, создается новая.");
                    // Создаем новую корзину для авторизованного пользователя
                    await dispatch('cart/saveCartToDatabase');
                }

                return response.data;
            } catch (error) {
                console.error("Ошибка при авторизации:", error.response?.data || error.message);
                throw error;
            }
        },
        async logout({ commit, dispatch, state }) {
            try {
                if (state.token) {
                    // Если пользователь авторизован, отправляем запрос на сервер
                    await axios.post('https://shop.avanpost.online/api/customers/logout', {}, {
                        params: { api_token: state.token },
                    });
                    console.log("Авторизованный пользователь успешно вышел из системы.");
                } else {
                    console.log("Неавторизованный пользователь выполняет выход.");
                }

                // Очищаем данные авторизации и корзину
                commit('clearAuth'); // Очистка данных авторизации
                await dispatch('cart/clearCart', null, { root: true }); // Очистка корзины
                console.log("Данные пользователя и корзина успешно очищены.");
            } catch (error) {
                console.error("Ошибка при выходе из системы:", error);
            }
        },
        updateCartId({ commit }, cartId) {
            commit('setCartId', cartId);
        },
        clearCartId({ commit }) {
            commit('clearCartId');
        },
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        customerId: (state) => state.customerId,
        userName: (state) => state.userName,
        userEmail: (state) => state.userEmail,
        companyName: (state) => state.companyName,
        userPhone: (state) => state.userPhone,
        userStreet: (state) => state.userStreet,
        userCity: (state) => state.userCity,
        userPostalCode: (state) => state.userPostalCode,
        deliveryName: (state) => state.deliveryName,
        deliveryStreet: (state) => state.deliveryStreet,
        deliveryCity: (state) => state.deliveryCity,
        deliveryPostalCode: (state) => state.deliveryPostalCode,
        deliveryPhone: (state) => state.deliveryPhone,
    },
};
