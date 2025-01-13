<template>
  <div id="app">
    <div class="container-fluid"><TopMenu /><TopBar /><NavBar /></div>
    <router-view />
    <FooterComponent />
  </div>
</template>

<script>
import TopMenu from './components/TopMenu.vue';
import TopBar from './components/TopBar.vue';
import NavBar from "./components/NavBar.vue";
import FooterComponent from "@/views/FooterComponent.vue";


export default {
  name: 'App',
  components: {
    FooterComponent,
    NavBar,
    TopMenu,
    TopBar
  },
  async created() {
    if (!this.$store.state.products.isLoaded) {
      await this.$store.dispatch('products/loadProducts');
    }
    if (!this.$store.state.categories.isLoaded) {
      await this.$store.dispatch('categories/loadCategories');
    }
  },
};
</script>

<style>
/* Ваши стили */
</style>
