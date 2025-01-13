<template>
  <div class="container-fluid">
    <div class="text-center">
      <h1 class="section-title px-5"><span class="px-2">Shop</span></h1>
    </div>

    <div class="row px-xl-5">
      <!-- Компонент фильтра -->
      <ShopFilter
          v-if="filteredProducts.length > 0"
          :colors="availableColors"
          :sizes="availableSizes"
          :priceRange="{ min: minPrice, max: maxPrice }"
          @filterColors="filterByColors"
          @filterSizes="filterBySizes"
          @filterPrice="filterByPrice"
      />

      <div class="col-lg-9 col-md-8">
        <!-- Сортировка -->
        <div class="col-12 mb-4">
          <div class="d-flex justify-content-end">
            <select v-model="sortOption" @change="sortProducts" class="form-control w-25">
              <option value="default">Seřadit podle</option>
              <option value="price-asc">Od nejlevnějšího</option>
              <option value="price-desc">Od nejdražšího</option>
            </select>
          </div>
        </div>

        <!-- Карточки товаров -->
        <div class="row">
          <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              @addToCart="addToCart"
          />
        </div>

        <!-- Пагинация -->
        <Pagination
            :totalPages="totalPages"
            :currentPage="currentPage"
            @changePage="changePage"
        />
      </div>
    </div>

    <!-- Сообщение, если нет продуктов -->
    <div v-if="filteredProducts.length === 0" class="text-center">
      <p>No products found matching your criteria.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '@/components/ProductCard.vue';
import Pagination from '@/components/Pagination.vue';
import ShopFilter from '@/pages/shop/ShopFilter.vue';

export default {
  components: { ShopFilter, ProductCard, Pagination },
  data() {
    return {
      filteredProducts: [],
      availableColors: [],
      availableSizes: [],
      minPrice: 0,
      maxPrice: 1000, // Максимальная цена по умолчанию
      selectedColors: [],
      selectedSizes: [],
      sortOption: 'default',
      currentPage: 1,
      productsPerPage: 6,
    };
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
  },
  watch: {
    allProducts: {
      immediate: true,
      handler(newProducts) {
        if (newProducts.length) {
          this.filteredProducts = [...newProducts];  // Начальное значение фильтрованных продуктов
          this.setAvailableFilters(newProducts);

          // Устанавливаем минимальные и максимальные цены
          this.minPrice = Math.min(...newProducts.map(p => p.new_price || 0));
          this.maxPrice = Math.max(...newProducts.map(p => p.new_price || 0));
        }
      },
    },
  },
  methods: {
    setAvailableFilters(products) {
      const colorsSet = new Set();
      const sizesSet = new Set();

      products.forEach(product => {
        if (product.color) {
          colorsSet.add(product.color);
        }
        if (product.size) {
          sizesSet.add(product.size);
        }
      });

      this.availableColors = Array.from(colorsSet);
      this.availableSizes = Array.from(sizesSet);
    },
    filterByColors(selectedColors) {
      this.selectedColors = selectedColors;
      this.applyFilters();
    },
    filterBySizes(selectedSizes) {
      this.selectedSizes = selectedSizes;
      this.applyFilters();
    },
    filterByPrice(priceRange) {
      this.minPrice = priceRange.min;
      this.maxPrice = priceRange.max;
      this.applyFilters();
    },
    applyFilters() {
      this.filteredProducts = this.allProducts.filter(product => {
        const matchesColor = this.selectedColors.length
            ? this.selectedColors.includes(product.color || '')
            : true;
        const matchesSize = this.selectedSizes.length
            ? this.selectedSizes.includes(product.size || '')
            : true;
        const matchesPrice = (product.new_price || 0) >= this.minPrice && (product.new_price || 0) <= this.maxPrice;
        return matchesColor && matchesSize && matchesPrice;
      });
    },
    sortProducts() {
      if (this.sortOption === 'price-asc') {
        this.filteredProducts.sort((a, b) => (a.new_price || 0) - (b.new_price || 0));
      } else if (this.sortOption === 'price-desc') {
        this.filteredProducts.sort((a, b) => (b.new_price || 0) - (a.new_price || 0));
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    addToCart(product) {
      console.log(`Product ${product.name} added to cart`);
    },
  },
};
</script>

<style scoped>
/* Добавьте стили для фильтров, пагинации или карточек товаров при необходимости */
</style>
