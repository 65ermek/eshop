<template>
  <div>
    <!-- Кнопка бургер -->
    <button type="button" class="d-lg-none btn border" @click="toggleSidebar">
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>

    <!-- Боковое меню с классом, который контролирует видимость -->
    <div class="sidebar" :class="{ 'sidebar-open': showSidebar }">
      <div class="sidebar-content">
        <button type="button" class="btn btn-close" @click="toggleSidebar">
          <i class="fas fa-times"></i>
        </button>
        <div class="text-center mb-4">
          <h2 class="section-title px-5"><span class="px-2">Kategorie</span></h2>
        </div>
        <!-- Список категорий -->
        <ul class="navbar-nav w-100 overflow-hidden border border-bottom-0">
          <li v-for="category in categories" :key="category.id" class="nav-item">
            <a :href="`/category/${category.slug}`" class="nav-link">{{ category.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BurgerMenu',
  data() {
    return {
      showSidebar: false, // Управление состоянием бокового меню
    };
  },
  computed: {
    // Получаем категории из Vuex Store
    ...mapGetters('categories', ['allCategories']),
    categories() {
      return this.allCategories;
    },
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar; // Открытие/закрытие бокового меню
    },
  },
  async created() {
    // Загружаем категории, если они еще не были загружены
    if (!this.$store.state.categories.isLoaded) {
      await this.$store.dispatch('categories/loadCategories');
    }
  },
};
</script>

<style scoped>
/* Стили для иконки бургер */
.icon-bar {
  display: block;
  width: 22px;
  height: 2px;
  margin: 4px 0;
  background-color: #007bff; /* Голубой цвет полосок */
}

/* Боковое меню */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transform: translateX(-102%); /* Меню скрыто по умолчанию */
  transition: transform 0.5s ease; /* Плавный переход */
}

.sidebar-open {
  transform: translateX(0); /* Показываем меню */
}

.sidebar-content {
  padding: 20px;
}

.sidebar-content .btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
}

ul.navbar-nav {
  list-style: none;
  padding: 0;
}

ul.navbar-nav li.nav-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd; /* Добавляем нижнюю границу */
  padding-bottom: 10px; /* Немного внутреннего отступа для лучшего восприятия */
  padding-left: 10px;
}

ul.navbar-nav li.nav-item a.nav-link {
  display: block;
  color: #333;
  text-decoration: none;
}

ul.navbar-nav li.nav-item a.nav-link:hover {
  color: #007bff;
  text-decoration: underline;
}

@media (min-width: 992px) {
  .sidebar {
    display: none;
  }
}
</style>
