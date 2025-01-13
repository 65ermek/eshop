<template>
  <div class="container-fluid">
    <div class="text-center mb-4 mt-4">
      <h2 class="section-title px-5"><span class="px-2">Slevy</span></h2>
    </div>
    <div class="product-carousel">
      <div v-if="discountedProducts.length" class="owl-carousel owl-theme">
        <div v-for="(product, index) in discountedProducts" :key="index" class="item product-item">
          <!-- Стикер для отображения количества товара на складе или сообщение "na objednávku" -->
          <div v-if="product.stock_quantity > 0" class="stock-badge">
            Skladem celkem {{ product.stock_quantity }}
          </div>
          <div v-else class="stock-badge na-objednavku">
            Na objednávku
          </div>
          <!-- Ссылка на страницу деталей товара -->
          <a :href="`/product/${product.slug}`">
            <img :src="`https://shop.avanpost.online/storage/${product.main_image}`" alt="Product Image" />
          </a>
          <!-- Название продукта с троеточием -->
          <h5 class="product-name">{{ product.name }}</h5>
          <div class="price-section">
            <h6 v-if="product.new_price" class="text-primary">{{ formatPrice(product.new_price) }} Kč</h6>
            <h6 v-if="product.old_price" class="text-muted ml-2">
              <del>{{ formatPrice(product.old_price) }} Kč</del>
            </h6>
          </div>
          <!-- Кнопка "Přidat do košíku" -->
          <button
              :class="['btn', isInCart(product.id) ? 'btn-success' : 'btn-primary', 'w-100', 'text-nowrap']"
              @click="addToCart(product)"
              :disabled="isInCart(product.id)"
          >
            {{ isInCart(product.id) ? 'Přidáno do košíku' : 'Přidat do košíku' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Компонент всплывающего окна -->
    <CartPopup
        v-if="showPopup"
        :item="selectedItem"
        @close="closePopup"
        @go-to-cart="goToCart"
        @update-quantity="updateQuantity"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import CartPopup from "@/components/CartPopup.vue";

export default {
  name: 'DiscountCarousel',
  components: {
    CartPopup,
  },
  data() {
    return {
      showPopup: false,
      selectedItem: null, // Объект текущего выбранного товара для отображения в попапе
    };
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    discountedProducts() {
      return this.allProducts.filter(product =>
          product.tags.some(tag => tag.name.toLowerCase() === 'slevy')
      );
    }
  },
  watch: {
    discountedProducts: {
      immediate: true,
      handler(newProducts) {
        // Инициализация карусели после изменения списка товаров со скидками
        if (newProducts.length > 0) {
          this.$nextTick(() => {
            this.initializeCarousel();
          });
        }
      },
    },
  },
  async created() {
    // Проверяем, загружены ли продукты; если нет, загружаем их
    if (!this.$store.state.products.isLoaded) {
      await this.$store.dispatch('products/loadProducts');
    }
  },
  methods: {
    // Метод для инициализации Owl Carousel
    initializeCarousel() {
      if (this.discountedProducts.length > 0 && typeof $.fn.owlCarousel === 'function') {
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
    // Метод добавления товара в корзину и открытия попапа
    addToCart(product) {
      if (this.isInCart(product.id)) return;

      // Добавляем товар в корзину через Vuex
      this.$store.commit('cart/addItemToCart', {
        id: product.id,
        name: product.name,
        price: product.new_price,
        qty: 1,
        main_image: product.main_image,
        unique_code: product.unique_code,
      });

      // Отображаем попап с добавленным товаром
      this.selectedItem = {...product, qty: 1}; // Сохраняем информацию о добавленном товаре
      this.showPopup = true;
    },
    // Проверяем, есть ли продукт в корзине
    isInCart(productId) {
      return this.$store.getters['cart/isProductInCart'](productId);
    },
    // Закрытие попапа
    closePopup() {
      this.showPopup = false;
      this.selectedItem = null;
    },
    // Переход в корзину
    goToCart() {
      this.closePopup();
      this.$router.push({name: 'Cart'});
    },
    // Метод обновления количества товара
    updateQuantity({productId, amount}) {
      console.log(`Обновление количества для productId=${productId} на ${amount}`);
      this.$store.commit('cart/updateQuantity', {productId, amount});

      const updatedProduct = this.$store.getters['cart/cartItems'].find(item => item.id === productId);
      if (updatedProduct) {
        this.selectedItem.qty = updatedProduct.qty;
      }
    },
    // Метод форматирования цены
    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ', {minimumFractionDigits: 0});
    }
  }
};
</script>

<style scoped>
/* Стили из вашего исходного кода */
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

/* Все блоки продуктов одного размера */
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

.btn-primary:hover {
  background-color: #0056b3;
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

.stock-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: green;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 3px;
}

.na-objednavku {
  background-color: red;
}
</style>
