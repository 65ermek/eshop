<template>
  <div class="container-fluid">
    <div class="row align-items-center py-3 px-xl-5">
      <!-- Логотип -->
      <div class="col-lg-3 text-center text-lg-left d-none d-lg-block">
        <router-link to="/" class="text-decoration-none">
          <h1 class="m-0 display-5 font-weight-semi-bold">
            <span class="text-primary font-weight-bold border px-3 mr-1">E</span>VelkoObchodProfi
          </h1>
        </router-link>
      </div>

      <!-- Строка поиска и иконки -->
      <div class="col-lg-9 col-12 d-flex justify-content-between align-items-center">
        <!-- Иконка "домик" для мобильной версии -->
        <router-link to="/" class="btn border mx-1 d-md-none d-lg-none">
          <i class="fas fa-home text-primary"></i>
          <span class="badge text-primary large-letter">E</span>
        </router-link>

        <!-- Строка поиска -->
        <div class="flex-grow-1 mx-lg-3">
          <SearchBar />
        </div>

        <!-- Компонент BurgerMenu -->
        <BurgerMenu />

        <!-- Компонент авторизации (UserAuth) -->
        <UserAuth />

        <!-- Компонент корзины (CartIcon) -->
        <CartIcon />
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue';
import UserAuth from './UserAuth.vue';
import CartIcon from './CartIcon.vue';
import BurgerMenu from './BurgerMenu.vue';

export default {
  name: 'TopBar',
  components: {
    SearchBar,
    BurgerMenu,
    UserAuth,
    CartIcon,
  },
};
</script>

<style scoped>
/* Стили для контейнера и иконок */
.large-letter {
  font-size: 18px;
}

@media (max-width: 991px) {
  .large-letter {
    display: none;
  }
}
</style>
