<template>
  <div class="container-fluid">
    <div class="text-center">
      <h1 class="section-title px-5"><span class="px-2">{{ categoryName }}</span></h1>
    </div>

    <div class="row px-xl-5">
      <!-- Компонент фильтра -->
      <ShopFilter
          v-if="filteredProducts.length > 0"
          :colors="availableColors"
          :sizes="availableSizes"
          :priceRange="{min: minPrice, max: maxPrice}"
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
              @addToCart="addToCart(product)"
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
  </div>
</template>

<script>
import axios from 'axios';
import ProductCard from '@/components/ProductCard.vue';
import Pagination from '@/components/Pagination.vue';
import ShopFilter from "@/pages/shop/ShopFilter.vue"; // Подключаем фильтр

export default {
  components: { ShopFilter, ProductCard, Pagination },
  data() {
    return {
      products: [],
      filteredProducts: [],
      categoryName: '',
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
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = start + this.productsPerPage;
      return this.filteredProducts.slice(start, end);
    },
  },
  mounted() {
    this.fetchProductsByCategory(this.$route.params.slug); // Загружаем товары по slug категории
  },
  methods: {
    async fetchProductsByCategory(categorySlug) {
      try {
        const response = await axios.get(`https://shop.avanpost.online/api/categories/${categorySlug}/products`);
        this.products = response.data.products;
        this.categoryName = response.data.category;
        this.filteredProducts = this.products;
        console.log(response.data);

        // Устанавливаем доступные фильтры
        this.setAvailableFilters();

        // Определяем минимальные и максимальные цены
        this.minPrice = Math.min(...this.products.map(p => p.new_price));
        this.maxPrice = Math.max(...this.products.map(p => p.new_price));
      } catch (error) {
        console.error("Ошибка при загрузке категории или продуктов:", error);
      }
    },
    setAvailableFilters() {
      const colorsSet = new Set();
      const sizesSet = new Set();

      this.products.forEach(product => {
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
      this.filteredProducts = this.products.filter(product => {
        const matchesColor = this.selectedColors.length
            ? this.selectedColors.includes(product.color)
            : true;
        const matchesSize = this.selectedSizes.length
            ? this.selectedSizes.includes(product.size)
            : true;
        const matchesPrice = product.new_price >= this.minPrice && product.new_price <= this.maxPrice;
        return matchesColor && matchesSize && matchesPrice;
      });
    },
    sortProducts() {
      if (this.sortOption === 'price-asc') {
        this.filteredProducts.sort((a, b) => a.new_price - b.new_price);
      } else if (this.sortOption === 'price-desc') {
        this.filteredProducts.sort((a, b) => b.new_price - a.new_price);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    addToCart(product) {
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.new_price,
        qty: 1,
        main_image: product.main_image
      };
      this.$store.dispatch('cart/addToCart', productToAdd);
    },
  },
  watch: {
    '$route.params.slug'(newSlug) {
      this.fetchProductsByCategory(newSlug); // Подгружаем товары при смене категории
    }
  }
};
</script>

<style scoped>
/* Стили можно добавить по необходимости */
</style>
