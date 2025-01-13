<template>
  <router-link to="/cart" class="btn border mx-1">
    <i class="fas fa-shopping-cart text-primary"></i>
    <span class="badge">{{ itemCount }}</span>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CartIcon',
  computed: {
    ...mapGetters('cart', ['itemCount']), // Используем геттер из модуля корзины
  },
};
</script>

<style scoped>
/* Стили для корзины */
</style>
