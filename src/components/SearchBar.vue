<template>
  <div>
    <!-- Поиск для десктопной версии -->
    <div class="col-lg-8 col-12 col-md-8 text-center my-3 my-lg-0 d-none d-lg-block" style="position: relative;">
      <form @submit.prevent="performSearch" class="d-flex">
        <div class="input-group">
          <input
              v-model="searchQuery"
              type="text"
              class="form-control desktop-search-input"
              placeholder="desktop hledaný výraz"
              @input="handleInput"
              @keydown.down="navigateResults(1)"
              @keydown.up="navigateResults(-1)"
              @keydown.enter.prevent="selectResult"
          />
          <div class="input-group-append">
            <!-- Меняем иконку на крестик при введенных 3+ символах -->
            <button v-if="searchQuery.length < 3" type="submit" class="btn input-group-text bg-transparent text-primary">
              <i class="fa fa-search"></i>
            </button>
            <button v-else type="button" class="btn input-group-text bg-transparent text-primary" @click="clearSearch">
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
      </form>
      <!-- Сообщение при отсутствии результатов -->
      <div v-if="noResults && searchQuery.length >= 3" class="desktop-search-message">
        Pro tento hledaný výraz nebyly nalezeny žádné výsledky
      </div>
      <!-- Сообщение о минимальном количестве символов -->
      <div v-if="searchQuery.length > 0 && searchQuery.length < 3 && !noResults" class="desktop-search-message">
        Zadejte alespoň 3 znaky
      </div>

      <!-- Список результатов поиска для десктопной версии -->
      <ul v-if="filteredResults.length > 0" class="navbar-nav w-100 overflow-hidden border border-bottom-0 desktop-results">
        <li v-for="(result, index) in limitedResults" :key="index"
            class="nav-item d-flex align-items-center"
            :class="{ 'active-result': index === focusedResultIndex }">
          <!-- Изображение продукта -->
          <img :src="`https://shop.avanpost.online/storage/${result.main_image}`" alt="Product Image" class="product-image">
          <!-- Название продукта -->
          <a :href="`/product/${result.slug}`" class="nav-link product-name">{{ result.name }}</a>
        </li>
        <!-- Ссылка на все результаты -->
        <li v-if="searchQuery.length >= 3" class="nav-item d-flex align-items-center">
          <a :href="`/search?q=${searchQuery}`" class="nav-link product-name text-primary">Všechny výsledky</a>
        </li>
      </ul>
    </div>

    <!-- Иконка поиска для мобильной версии -->
    <a href="#" class="btn border mx-1 d-lg-none" @click="toggleMobileSearch">
      <i class="fa fa-search text-primary"></i>
    </a>

    <!-- Всплывающее окно поиска для мобильной версии -->
    <div v-if="showMobileSearch" class="search-popup" @click.self="toggleMobileSearch">
      <div class="search-popup-content">
        <form @submit.prevent="performSearch">
          <div class="input-group">
            <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Zadejte hledaný výraz"
                @input="handleInput"
                @keydown.down="navigateResults(1)"
                @keydown.up="navigateResults(-1)"
                @keydown.enter.prevent="selectResult"
            />
            <div class="input-group-append">
              <!-- Меняем иконку на крестик при введенных 3+ символах -->
              <button v-if="searchQuery.length < 3" type="submit" class="btn input-group-text bg-transparent text-primary">
                <i class="fa fa-search"></i>
              </button>
              <button v-else type="button" class="btn input-group-text bg-transparent text-primary" @click="clearSearch">
                <i class="fa fa-times"></i>
              </button>
            </div>
          </div>
        </form>

        <!-- Сообщение о минимальном количестве символов -->
        <div v-if="searchQuery.length < 3 && !noResults" class="search-message">
          Zadejte alespoň 3 znaky
        </div>

        <!-- Сообщение при отсутствии результатов -->
        <div v-if="noResults && searchQuery.length >= 3" class="search-message">
          Pro tento hledaný výraz nebyly nalezeny žádné výsledky
        </div>

        <!-- Список результатов поиска -->
        <ul v-else-if="filteredResults.length > 0" class="navbar-nav w-100 overflow-hidden border border-bottom-0">
          <li v-for="(result, index) in limitedResults" :key="index"
              class="nav-item d-flex align-items-center"
              :class="{ 'active-result': index === focusedResultIndex }">
            <!-- Изображение продукта -->
            <img :src="`https://shop.avanpost.online/storage/${result.main_image}`" alt="Product Image" class="product-image">
            <!-- Название продукта -->
            <a :href="`/product/${result.slug}`" class="nav-link product-name">{{ result.name }}</a>
          </li>
          <!-- Ссылка на все результаты -->
          <li v-if="searchQuery.length >= 3" class="nav-item d-flex align-items-center">
            <a :href="`/search?q=${searchQuery}`" class="nav-link product-name text-primary">Všechny výsledky</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "SearchBar",
  data() {
    return {
      searchQuery: "", // Поле для поискового запроса
      showMobileSearch: false, // Управление отображением мобильного поиска
      noResults: false, // Флаг для проверки наличия результатов поиска
      focusedResultIndex: -1 // Индекс текущего выбранного результата
    };
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    // Фильтруем продукты на основе введенного запроса только если длина запроса >= 3
    filteredResults() {
      if (this.searchQuery.length < 3) {
        return []; // Возвращаем пустой массив, если введено менее 3 символов
      }
      const query = this.searchQuery.toLowerCase();
      const results = this.allProducts.filter(product =>
          product.name.toLowerCase().includes(query)
      );

      // Если результатов нет, ставим флаг noResults в true
      this.noResults = results.length === 0 && this.searchQuery.length >= 3;

      return results;
    },
    // Ограничиваем число выводимых результатов до 5
    limitedResults() {
      return this.filteredResults.slice(0, 5);
    }
  },
  methods: {
    toggleMobileSearch() {
      this.showMobileSearch = !this.showMobileSearch;
    },
    clearSearch() {
      this.searchQuery = ""; // Очищаем строку поиска
      this.toggleMobileSearch(); // Закрываем окно поиска
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        console.log("Поиск запроса:", this.searchQuery);
        // Дополнительные действия при отправке формы
      }
    },
    handleInput() {
      // Для показа результатов минимальная длина поискового запроса должна быть >= 3
      if (this.searchQuery.length >= 3) {
        this.performSearch();
      }
    },
    // Перемещение по результатам поиска с помощью стрелок
    navigateResults(direction) {
      const maxIndex = this.limitedResults.length - 1;
      if (maxIndex < 0) return; // Если нет результатов, пропускаем
      this.focusedResultIndex += direction;
      if (this.focusedResultIndex < 0) {
        this.focusedResultIndex = maxIndex; // Возвращаемся к последнему элементу
      } else if (this.focusedResultIndex > maxIndex) {
        this.focusedResultIndex = 0; // Возвращаемся к первому элементу
      }
    },
    // Выбор текущего результата при нажатии Enter
    selectResult() {
      if (this.focusedResultIndex !== -1) {
        const selectedResult = this.limitedResults[this.focusedResultIndex];
        window.location.href = `/product/${selectedResult.slug}`;
      }
    }
  },
  async created() {
    // Проверяем, загружены ли продукты; если нет, загружаем их
    if (!this.$store.state.products.isLoaded) {
      await this.$store.dispatch('products/loadProducts');
    }
  }
};
</script>

<style scoped>
/* Стили для всплывающего поиска на мобильной версии */
.search-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
}

.search-popup-content {
  background: white;
  width: 100%;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-shadow {
  height: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 5px;
}

.search-message {
  padding: 10px;
  font-size: 14px;
  color: #666;
  text-align: center;
  width: 100%;
}

/* Стили для списка результатов поиска */
.navbar-nav {
  margin-top: 10px;
  padding: 0;
}

.nav-item {
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.nav-link {
  padding-left: 10px;
  display: block;
  color: #007bff;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-link:hover {
  background-color: #f8f9fa;
  text-decoration: none;
}

.product-image {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.desktop-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Подсветка активного элемента при навигации с помощью клавиатуры */
.active-result {
  background-color: #f1f1f1;
}

@media (min-width: 992px) {
  /* Прячем мобильное всплывающее окно поиска на десктопе */
  .search-popup {
    display: none;
  }
}
</style>
