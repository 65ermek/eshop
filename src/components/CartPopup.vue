<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-content">
      <!-- Заголовок с текстом и иконкой закрытия -->
      <div class="popup-header">
        <span>Přidáno do košíku</span>
        <button class="close-button" @click="closePopup">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <!-- Содержимое для мобильной версии -->
      <div class="popup-mobile" v-if="isMobile">
        <!-- Изображение продукта -->
        <div class="image-container">
          <img :src="imageSrc" class="product-image" alt="Product Image">
        </div>

        <!-- Информация о продукте и кнопки управления -->
        <div class="info-container" v-if="item">
          <h5 class="product-name">{{ item.name }}</h5>
          <p class="product-price">{{ formatPrice(item.new_price) }} Kč</p>

          <!-- Выбор количества -->
          <div class="quantity-control">
            <button @click="updateQuantity(-1)" class="btn btn-primary btn-minus">
              <i class="fa fa-minus"></i>
            </button>
            <input type="text" class="quantity-display" :value="quantity" readonly>
            <button @click="updateQuantity(1)" class="btn btn-primary btn-plus">
              <i class="fa fa-plus"></i>
            </button>
          </div>

          <!-- Кнопки перехода -->
          <button class="btn btn-primary mt-3" @click="goToCart">Přejít do košíku</button>
          <button class="btn btn-secondary mt-2" @click="closePopup">Zpět na nakupování</button>
        </div>
      </div>

      <!-- Содержимое для десктопной версии -->
      <div class="popup-desktop" v-else>
        <div class="row" v-if="item">
          <!-- Изображение и название -->
          <div class="col-4">
            <img :src="imageSrc" class="product-image" alt="Product Image">
          </div>
          <div class="col-8">
            <h5 class="product-name">{{ item.name }}</h5>
            <p class="product-price">{{ formatPrice(item.new_price * quantity) }} Kč</p>
            <!-- Выбор количества -->
            <div class="quantity-control d-flex">
              <button @click="updateQuantity(-1)" class="btn btn-primary btn-minus">
                <i class="fa fa-minus"></i>
              </button>
              <input type="text" class="quantity-display mx-2" :value="quantity" readonly>
              <button @click="updateQuantity(1)" class="btn btn-primary btn-plus">
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <!-- Кнопки перехода -->
            <div class="mt-4">
              <button class="btn btn-primary mr-3" @click="addToCart">Přejít do košíku</button>
              <button class="btn btn-secondary" @click="addToCartAndClose">Zpět na nakupování</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isMobile: window.innerWidth <= 767.98,
      quantity: this.item ? this.item.qty : 1
    };
  },
  computed: {
    imageSrc() {
      return this.item && this.item.main_image
          ? `https://shop.avanpost.online/storage/${this.item.main_image}`
          : 'https://via.placeholder.com/150';
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    goToCart() {
      this.$emit('go-to-cart');
    },
    addToCart() {
      this.$emit('add-to-cart', { ...this.item, qty: this.quantity });
      this.closePopup(); // Закрываем popup после добавления
      this.$router.push({ name: 'Cart' });
    },
    addToCartAndClose() {
      this.$emit('add-to-cart', { ...this.item, qty: this.quantity });
      this.closePopup(); // Закрываем попап
    },
    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ');
    },
    updateQuantity(amount) {
      // Обновляем количество с проверкой
      const newQuantity = this.quantity + amount;
        this.quantity = newQuantity;
        this.$emit("update-quantity", { productId: this.item.id, amount });
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 767.98;
    },
    handleEscape(event) {
      if (event.key === "Escape") {
        this.closePopup();
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleEscape); // Добавляем обработчик для клавиши Esc
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleEscape); // Удаляем обработчик для клавиши Esc
  },
  watch: {
    item: {
      handler(newItem) {
        this.quantity = newItem ? newItem.qty : 1;
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 900px; /* Максимальная ширина для десктопной версии */
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.product-image {
  max-width: 200px;
  margin-right: 50px;
}

.quantity-display {
  width: 50px;
  text-align: center;
  padding: 0; /* Убирает лишнее внутреннее пространство */
  height: 36px; /* Пример высоты для выравнивания */
  line-height: 36px; /* Для вертикального выравнивания текста */
  font-size: 1rem; /* Настройка размера текста */
}

/* Мобильная версия */
@media (max-width: 767.98px) {
  .popup-content {
    width: 300px;
  }

  .popup-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  .product-image {
    width: 100%;
    max-width: 200px;
    height: auto;
  }

  .info-container {
    width: 100%;
    padding: 0 10px;
  }

  .product-name {
    font-size: 1.1rem;
    margin-top: 10px;
  }

  .product-price {
    font-size: 1rem;
    margin-top: 5px;
  }

  .quantity-control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .quantity-display {
    text-align: center;
    width: 50px;
    margin: 0 5px;
  }

  .btn {
    width: 100%;
  }
}
</style>
