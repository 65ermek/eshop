<template>
  <div class="container-fluid mb-5" style="padding-left: 0;padding-right: 0;">
    <div class="row border-top px-xl-5">
      <!-- Категории для главной страницы -->
      <div class="col-lg-3 d-none d-lg-block">
        <a
            class="btn shadow-none d-flex align-items-center justify-content-between bg-primary text-white w-100"
            data-toggle="collapse"
            href="#navbar-vertical"
            style="height: 65px; margin-top: -1px; padding: 0 30px;"
        >
          <h6 class="m-0">Kategorie</h6>
          <i class="fa fa-angle-down text-dark"></i>
        </a>
        <nav
            :class="{
            'collapse': !isHomePage,
            'show': isHomePage
          }"
            class="navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 navbar-overlay"
            id="navbar-vertical"
        >
          <div class="navbar-nav w-100 overflow-hidden">
            <!-- Динамический вывод категорий -->
            <div
                v-for="category in categories"
                :key="category.id"
                class="nav-item"
            >
              <a :href="`/category/${category.slug}`" class="nav-link">{{ category.name }}</a>
            </div>
          </div>
        </nav>
      </div>

      <!-- Контент для главной страницы или хлебные крошки -->
      <div class="col-lg-9">
        <div v-if="isHomePage" id="header-carousel" class="carousel slide pointer-event" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active" style="height: 410px;">
              <img class="img-fluid" :src="carouselImage1" alt="Image">
              <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div class="p-3" style="max-width: 700px;">
                  <h4 class="text-light text-uppercase font-weight-medium mb-3">První nákup s bonusem – slevu si nenechte ujít!</h4>
                  <h3 class="display-4 text-white font-weight-semi-bold mb-4">Maximální komfort, minimální spotřeba.</h3>
                  <a href="/shop" class="btn btn-light py-2 px-3">Nakupte teď</a>
                </div>
              </div>
            </div>
            <div class="carousel-item" style="height: 410px;">
              <img class="img-fluid" :src="carouselImage2" alt="Image">
              <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div class="p-3" style="max-width: 700px;">
                  <h4 class="text-light text-uppercase font-weight-medium mb-3">Poprvé u nás? Využijte slevu na vaši první objednávku!</h4>
                  <h3 class="display-4 text-white font-weight-semi-bold mb-4">Měkkost, která se o vás stará.</h3>
                  <a href="/shop" class="btn btn-light py-2 px-3">Nakupte teď</a>
                </div>
              </div>
            </div>
          </div>
          <a class="carousel-control-prev" href="#header-carousel" data-slide="prev">
            <div class="btn btn-dark" style="width: 45px; height: 45px;">
              <span class="carousel-control-prev-icon mb-n2"></span>
            </div>
          </a>
          <a class="carousel-control-next" href="#header-carousel" data-slide="next">
            <div class="btn btn-dark" style="width: 45px; height: 45px;">
              <span class="carousel-control-next-icon mb-n2"></span>
            </div>
          </a>
        </div>

        <!-- Хлебные крошки для всех страниц, кроме главной -->
        <nav v-else aria-label="breadcrumb" class="d-none d-md-block">
          <ol class="breadcrumb" style="height: 65px; margin-top: -1px; padding: 0 30px; display: flex; align-items: center;">
            <li class="breadcrumb-item"><a href="/">Domů</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ currentPage }}</li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    // Проверяем, находимся ли мы на главной странице
    isHomePage() {
      return this.$route.name === 'Home';
    },
    currentPage() {
      return this.$route.name;
    },
    // Пути к изображениям карусели
    carouselImage1() {
      return new URL('/public/img/carousel-1.jpg', import.meta.url).href;
    },
    carouselImage2() {
      return new URL('/public/img/carousel-2.jpg', import.meta.url).href;
    },
    // Получаем категории из Vuex Store
    ...mapGetters('categories', ['allCategories']),
    categories() {
      return this.allCategories;
    },
  },
  async created() {
    // Загружаем категории при необходимости
    if (!this.$store.state.categories.isLoaded) {
      await this.$store.dispatch('categories/loadCategories');
    }
  },
};
</script>

<style scoped>
/* Стили для категорий и карусели */
.container-fluid {
  padding: 0 15px;
}

.carousel-inner {
  height: 410px;
}

/* Добавляем стили для раскрытия navbar поверх других блоков */
.navbar-overlay {
  position: absolute;
  z-index: 1000;
  background-color: white;
  width: 100%;
}
@media (max-width: 768px) {
  .breadcrumb {
    display: none;
  }
}
</style>
