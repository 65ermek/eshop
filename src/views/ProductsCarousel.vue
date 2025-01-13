<template>
  <div class="container-fluid">
    <div class="text-center mb-4 mt-4">
      <h2 class="section-title px-5"><span class="px-2">Trendy Products</span></h2>
    </div>
    <div class="product-carousel">
      <div v-if="shuffledProducts.length" class="owl-carousel owl-theme">
        <div v-for="(product, index) in shuffledProducts" :key="index" class="item product-item">
          <!-- Стикеры тегов -->
          <div class="product-badge" v-if="product.tags.length">
            <span
                v-for="tag in product.tags"
                :key="tag.id"
                :class="getBadgeClass(tag)"
            >
              {{ tag.name }}
            </span>
          </div>
          <!-- Ссылка на страницу деталей товара -->
          <a :href="`/product/${product.slug}`">
            <img :src="`https://shop.avanpost.online/storage/${product.main_image}`" alt="Product Image" />
          </a>
          <!-- Название продукта с троеточием -->
          <h5 class="product-name">{{ product.name }}</h5>
          <div class="price-section">
            <h6 v-if="product.new_price" class="text-primary">{{ formatPrice(product.new_price) }} Kč</h6>
            <h6 v-if="product.old_price" class="text-muted ml-2"><del>{{ formatPrice(product.old_price) }} Kč</del></h6>
          </div>
          <!-- Кнопка "Přidat do košíku" -->
          <button
              :class="['btn', isInCart(product.id) ? 'btn-success' : 'btn-primary', 'w-100', 'text-nowrap']"
              @click="openPopup(product)"
              :disabled="isInCart(product.id)"
          >
            {{ isInCart(product.id) ? 'Přidáno do košíku' : 'Přidat do košíku' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Компонент всплывающего окна -->
    <CartPopup
        v-if="selectedItem"
        :item="selectedItem"
        @close="closePopup"
        @go-to-cart="goToCart"
        @update-quantity="updateQuantity"
        @add-to-cart="addToCart"
    />
  </div>
</template>

<script>
import CartPopup from '@/components/CartPopup.vue';
import { mapGetters } from 'vuex';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

export default {
  name: 'TrendyProducts',
  components: {
    CartPopup,
  },
  data() {
    return {
      selectedItem: null,
    };
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    // Вычисляемое свойство для случайного порядка продуктов
    shuffledProducts() {
      return this.shuffleArray([...this.allProducts]);
    },
  },
  async created() {
    // Загружаем продукты через Vuex, если они еще не загружены
    if (!this.$store.state.products.isLoaded) {
      await this.$store.dispatch('products/loadProducts');
    }
  },
  watch: {
    shuffledProducts: {
      immediate: true,
      handler(newProducts) {
        // Инициализация карусели при загрузке товаров
        if (newProducts.length > 0) {
          this.$nextTick(() => {
            this.initializeCarousel();
          });
        }
      },
    },
  },
  methods: {
    // Метод для инициализации Owl Carousel
    initializeCarousel() {
      if (this.shuffledProducts.length > 0 && typeof $.fn.owlCarousel === 'function') {
        $('.owl-carousel').owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          dots: false,
          navText: [
            '<div class="btn btn-dark carousel-prev" style="position: absolute; top: 50%; left: 30px; transform: translateY(-50%); width: 45px; height: 45px; display: flex; justify-content: center; align-items: center"><i class="fas fa-chevron-left" style="font-size: 24px; color: white;"></i></div>',
            '<div class="btn btn-dark carousel-next" style="position: absolute; top: 50%; right: 30px; transform: translateY(-50%); width: 45px; height: 45px; display: flex; justify-content: center; align-items: center"><i class="fas fa-chevron-right" style="font-size: 24px; color: white;"></i></div>'
          ],
          responsive: {
            0: {items: 1},
            400: {items: 2},
            600: {items: 3},
            850: {items: 4},
            1000: {items: 5}
          }
        });
      } else {
        console.error('OwlCarousel не был инициализирован должным образом или отсутствуют элементы для карусели.');
      }
    },
    // Метод для перемешивания массива продуктов
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    // Добавление товара в корзину
    addToCart(product) {
      if (this.isInCart(product.id)) return;

      this.$store.commit('cart/addItemToCart', {
        id: product.id,
        name: product.name,
        price: product.new_price,
        qty: 1,
        main_image: product.main_image,
        unique_code: product.unique_code,
      });
      this.selectedItem = { ...product };
    },
    // Проверяем, есть ли продукт в корзине
    isInCart(productId) {
      return this.$store.getters['cart/isProductInCart'](productId);
    },
    // Открытие popup
    openPopup(item) {
      this.selectedItem = { ...item, qty: item.qty || 1 };
    },
    // Закрытие popup
    closePopup() {
      this.selectedItem = null;
    },
    updateQuantity({ productId, amount }) {
      this.$store.commit('cart/updateQuantity', { productId, amount });
      const updatedProduct = this.$store.getters['cart/cartItems'].find(item => item.id === productId);
      if (updatedProduct) {
        this.selectedItem.qty = updatedProduct.qty;
      }
    },
    // Метод форматирования цены
    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ', { minimumFractionDigits: 0 });
    },
    // Метод для получения класса стикера
    getBadgeClass(tag) {
      const tagSlug = tag.slug.toLowerCase();
      switch (tagSlug) {
        case 'novinky':
          return 'badge-novinky';
        case 'slevy':
          return 'badge-sleva';
        case 'top':
          return 'badge-top';
        case 'nejprodavanejsi':
          return 'badge-nejprodavanejsi';
        default:
          return '';
      }
    }
  }
};
</script>

<style scoped>
/* Ваши стили */
.product-carousel {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
}

.owl-carousel .item {
  text-align: center;
  padding: 20px;
}

.owl-carousel .item img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: 0 auto;
  display: block;
}

.product-item {
  width: 200px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.product-name {
  font-size: 16px;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.price-section h6 {
  margin: 0 5px;
}

.btn-primary {
  color: white;
  background-color: #007bff;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.owl-carousel .owl-nav {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.carousel-prev,
.carousel-next {
  pointer-events: auto;
  z-index: 2;
}

.owl-carousel .owl-dots {
  text-align: center;
  margin-top: 10px;
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
}

.product-badge span {
  display: block;
  padding: 5px 10px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 3px;
  margin-bottom: 5px;
}

.badge-novinky {
  background-color: red;
}

.badge-sleva {
  background-color: green;
}

.badge-top {
  background-color: blue;
}

.badge-nejprodavanejsi {
  background-color: #ffc800;
}
</style>
