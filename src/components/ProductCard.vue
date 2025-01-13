<template>
  <div class="col-lg-4 col-md-6 mb-4">
    <div class="item product-item">
      <!-- Стикеры на товар -->
      <div v-if="product.tags && product.tags.length" class="product-badge">
        <span
            v-for="(tag, index) in product.tags"
            :key="index"
            :class="getBadgeClass(tag.name)"
            class="badge"
        >
          {{ tag.name }}
        </span>
      </div>

      <!-- Ссылка на страницу товара -->
      <a :href="`/product/${product.slug}`">
        <img :src="`https://shop.avanpost.online/storage/${product.main_image}`" alt="Product Image" />
      </a>

      <!-- Название продукта -->
      <h5 class="product-name">{{ product.name }}</h5>

      <!-- Секция цен -->
      <div class="price-section">
        <h6 v-if="product.new_price" class="text-primary">{{ formatPrice(product.new_price) }} Kč</h6>
        <h6 v-if="product.old_price" class="text-muted ml-2">
          <del>{{ formatPrice(product.old_price) }} Kč</del>
        </h6>
      </div>

      <!-- Кнопка добавления в корзину -->
      <button
          :class="['btn', isInCart ? 'btn-success' : 'btn-primary']"
          @click="openPopup(product)"
          :disabled="isInCart"
      >
        {{ isInCart ? 'Přidáno do košíku' : 'Přidat do košíku' }}
      </button>
    </div>

    <!-- Всплывающее окно с информацией о добавленном товаре -->
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
import CartPopup from "@/components/CartPopup.vue";

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    CartPopup
  },
  data() {
    return {
      showPopup: false,
      selectedItem: null, // Выбранный товар для показа в попапе
    };
  },
  computed: {
    // Проверяем, есть ли этот продукт в корзине
    isInCart() {
      return this.$store.getters['cart/isProductInCart'](this.product.id);
    }
  },
  methods: {
    addToCart() {
      if (this.isInCart) return;

      const productToAdd = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.new_price,
        qty: 1,
        main_image: this.product.main_image,
        unique_code: this.product.unique_code
      };
      this.$store.dispatch('cart/addToCart', productToAdd);
    },
    openPopup(product) {
      this.selectedItem = {...product, qty: 1};
      this.addToCart(); // Добавляем товар в корзину
      this.showPopup = true; // Открываем попап
    },
    closePopup() {
      this.showPopup = false;
      this.selectedItem = null;
    },
    goToCart() {
      this.closePopup();
      this.$router.push({name: 'Cart'});
    },
    updateQuantity({productId, amount}) {
      this.$store.commit('cart/updateQuantity', {productId, amount});
      const updatedProduct = this.$store.getters['cart/cartItems'].find(item => item.id === productId);
      if (updatedProduct) {
        this.selectedItem.qty = updatedProduct.qty;
      }
    },
    getBadgeClass(tag) {
      switch (tag.toLowerCase()) {
        case 'novinky':
          return 'badge-novinky';
        case 'slevy':
          return 'badge-sleva';
        case 'top':
          return 'badge-top';
        case 'nejprodávanější':
          return 'badge-nejprodavanejsi';
        default:
          return '';
      }
    },
    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ', {minimumFractionDigits: 0});
    },
  }
};
</script>

<style scoped>
/* Стили из вашего исходного кода */
.btn {
  font-size: 16px;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.item.product-item {
  position: relative;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  transition: box-shadow 0.3s ease;
  text-align: center;
}

.item.product-item:hover {
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.badge {
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  border-radius: 3px;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge-sleva {
  background-color: green;
}

.badge-top {
  background-color: red;
}

.badge-novinky {
  background-color: blue;
}

.badge-nejprodavanejsi {
  background-color: #ffc800;
}

.item.product-item img {
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 10px;
}

.product-name {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 10px 0;
}

.price-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.price-section h6 {
  margin: 0 5px;
}

.btn-primary {
  padding: 5px 15px;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
