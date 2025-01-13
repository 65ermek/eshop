import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Импорт хранилища Vuex

// Ленивая загрузка компонентов
const Home = () => import('@/views/Home.vue');
const Login = () => import('@/components/Login.vue');
const Profile = () => import('@/components/customers/Profile.vue');
const Orders = () => import('@/components/customers/Orders.vue');
const Invoices = () => import('@/components/customers/Invoices.vue');
const PurchasedGoods = () => import('@/components/customers/PurchasedGoods.vue');
const BusinessUsers = () => import('@/components/customers/BusinessUsers.vue');
const RecommendedProducts = () => import('@/components/customers/RecommendedProducts.vue');
const Favorites = () => import('@/components/customers/Favorites.vue');
const Register = () => import('@/components/Register.vue');
const ForgotPassword = () => import('@/components/ForgotPassword.vue');
const ResetPassword = () => import('@/components/ResetPassword.vue');
const Shop = () => import('@/pages/shop/Shop.vue');
const ProductDetail = () => import('@/pages/ProductDetail.vue');
const Category = () => import('@/pages/Category.vue');
const Cart = () => import('@/pages/Cart.vue');
const Delivery = () => import('@/pages/Delivery.vue');
const Payment = () => import('@/pages/Payment.vue');
const Address = () => import('@/pages/Address.vue');
const Checkout = () => import('@/pages/Checkout.vue');

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/registrace', name: 'Registrace', component: Register, meta: { breadcrumb: 'Registrace' } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/profile/objednavky', name: 'Orders', component: Orders, meta: { requiresAuth: true } },
    { path: '/profile/faktury', name: 'Invoices', component: Invoices, meta: { requiresAuth: true } },
    { path: '/profile/zakoupene-zbozi', name: 'PurchasedGoods', component: PurchasedGoods, meta: { requiresAuth: true } },
    { path: '/profile/zakladni-informace', name: 'BusinessUsers', component: BusinessUsers, meta: { requiresAuth: true } },
    { path: '/profile/doporuceny-sortiment', name: 'RecommendedProducts', component: RecommendedProducts, meta: { requiresAuth: true } },
    { path: '/profile/oblibene', name: 'Favorites', component: Favorites, meta: { requiresAuth: true } },
    { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword }, // Маршрут для восстановления пароля
    { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
    { path: '/shop', name: 'Shop', component: Shop },
    { path: '/product/:slug', name: 'ProductDetail', component: ProductDetail, props: true },
    { path: '/category/:slug', name: 'Category', component: Category, props: true },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart, // Родительский компонент
        children: [
            {
                path: 'delivery', // Страница доставки
                name: 'Delivery',
                component: Delivery,
            },
            {
                path: 'payment', // Страница оплаты
                name: 'Payment',
                component: Payment,
            },
            {
                path: 'address', // Страница ввода адреса
                name: 'Address',
                component: Address,
            },
            {
                path: 'summary',
                name: 'Checkout',
                component: Checkout, // Ленивая загрузка Checkout.vue
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
