<template>
  <div class="container cart-page py-4">
    <div v-if="cartItems.length === 0" class="text-center mb-4">
      <h2 class="section-title px-5"><span class="px-2">Košík je prázdný</span></h2>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-12 d-lg-none">
          <div v-for="item in cartItems" :key="item.id" class="card mb-3">
            <div class="card-body p-2">
              <div class="text-center mb-2">
                <router-link v-if="item.name" :to="{ name: 'ProductDetail', params: { slug: generateSlug(item.name) } }">
                  <img :src="item.main_image ? `https://shop.avanpost.online/storage/${item.main_image}` : 'https://via.placeholder.com/150'" class="img-fluid cart-product-img" alt="Product Image">
                </router-link>
              </div>
              <router-link v-if="item.name" :to="{ name: 'ProductDetail', params: { slug: generateSlug(item.name) } }" class="text-decoration-none">
                <h5 class="card-title text-truncate">{{ item.name }}</h5>
              </router-link>
              <p class="card-text text-muted mb-1">Objednací kód: {{ item.unique_code }}</p>
              <p class="card-text text-success mb-2">Skladem</p>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span v-if="item.qty > 1">{{ formatPrice(item.price) }} Kč/ks</span>
                <span>{{ formatPrice(item.price * item.qty) }} Kč</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="input-group quantity">
                  <div class="input-group-prepend">
                    <button @click="updateItemQuantity(item.id, -1)" class="btn btn-sm btn-primary btn-minus">
                      <i class="fa fa-minus"></i>
                    </button>
                  </div>
                  <input type="text" class="form-control form-control-sm bg-secondary text-center" :value="item.qty" readonly>
                  <div class="input-group-append">
                    <button @click="updateItemQuantity(item.id, 1)" class="btn btn-sm btn-primary btn-plus">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button @click="removeItem(item.id)" class="btn btn-sm btn-danger ml-2">
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="d-none d-lg-block w-100">
          <div class="table-responsive mb-4">
            <div v-for="(item, index) in cartItems" :key="item.id" :class="{'bg-light': index % 2 === 0, 'bg-white': index % 2 !== 0}" class="p-2 border-bottom d-flex align-items-center">
              <div class="d-flex align-items-center" style="width: 50%;">
                <img :src="item.main_image ? `https://shop.avanpost.online/storage/${item.main_image}` : 'https://via.placeholder.com/150'" style="width: 50px; margin-right: 10px;">
                <router-link v-if="item.name" :to="{ name: 'ProductDetail', params: { slug: generateSlug(item.name) } }" class="item-name text-truncate text-decoration-none">
                  {{ item.name }}
                </router-link>
              </div>
              <div class="text-center" style="width: 15%;">
                <div class="input-group quantity mx-auto" style="width: 100px;">
                  <div class="input-group-prepend">
                    <button @click="updateItemQuantity(item.id, -1)" class="btn btn-sm btn-primary btn-minus">
                      <i class="fa fa-minus"></i>
                    </button>
                  </div>
                  <input type="text" class="form-control form-control-sm bg-secondary text-center" :value="item.qty" readonly>
                  <div class="input-group-append">
                    <button @click="updateItemQuantity(item.id, 1)" class="btn btn-sm btn-primary btn-plus">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-center" style="width: 15%;">
                <span v-if="item.qty > 1">{{ formatPrice(item.price) }} Kč / ks</span>
              </div>
              <div class="text-center" style="width: 15%;">
                {{ formatPrice(item.price * item.qty) }} Kč
              </div>
              <div class="text-center" style="width: 5%;">
                <button @click="removeItem(item.id)" class="btn btn-sm btn-danger">
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12 text-right">
          <h5 class="mt-4" style="color: black;">Celkem za zboží
            <span style="color: red; margin-left: 50px">{{ formattedTotalPriceWithoutExtras }} Kč</span>
          </h5>
          <div class="d-flex justify-content-end align-items-center mb-2" v-if="deliveryMethod && deliveryPrice !== null">
            <div class="d-flex align-items-center">
              <h5 class="mt-4 doprava-title" style="color: black;">Doprava:
                <img :src="getDeliveryImage()" class="mr-2" alt="Delivery Logo" style="width: 30px;">
                {{ deliveryMethod }}
              </h5>
            </div>
            <span class="doprava-price">{{ deliveryPrice > 0 ? formatPrice(deliveryPrice) + ' Kč' : 'zdarma' }}</span>
          </div>
          <div class="d-flex justify-content-end align-items-center mb-2" v-if="selectedPaymentMethod !== null && selectedPaymentMethod !== ''">
            <h5 class="mr-4 doprava-title" style="color: black;">Platba: ({{ selectedPaymentMethodName }}):</h5>
            <span style="color: red;">{{ selectedPaymentMethodPrice > 0 ? formatPrice(selectedPaymentMethodPrice) + ' Kč' : 'zdarma' }}</span>
          </div>
          <h5 class="mt-4" style="color: black;">K úhradě
            <span style="color: red; margin-left: 50px">{{ formattedFinalTotalPrice }} Kč</span>
          </h5>
          <div v-if="!isChildRoute">
            <a href="/" class="btn btn-primary mr-3" style="color: #cccccc">Ještě nakupovat</a>
            <button class="btn btn-primary" style="color: #cccccc" @click="proceedToCheckout">K pokladně</button>
          </div>
        </div>
      </div>
    </div>
    <router-view v-if="cartItems.length > 0" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      isProceedingToCheckout: false,
    };
  },
  created() {
    console.log("Загрузка товаров корзины из localStorage...");
    this.loadCartFromLocalStorage();
    this.enrichCartItems();
  },
  computed: {
    ...mapGetters('cart', [
      'cartItems',
      'totalPrice',
      'deliveryPrice',
      'paymentPrice',
      'deliveryMethod',
      'paymentMethod'
    ]),
    selectedPaymentMethod() {
      return this.paymentMethod;
    },
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated;
    },
    selectedPaymentMethodName() {
      const paymentNames = {
        'cash': 'Hotově na místě',
        'card': 'Kartou на месте',
        'bank': 'Bankovním převodem',
        'kartou': 'Kartой ihned'
      };
      return paymentNames[this.selectedPaymentMethod] || 'Неизвестный способ оплаты';
    },
    formattedTotalPriceWithoutExtras() {
      const total = this.cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
      return Math.round(total).toLocaleString('cs-CZ');
    },
    formattedFinalTotalPrice() {
      const total = this.cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
      const totalWithExtras = total + (this.deliveryPrice || 0) + (this.paymentPrice || 0);
      return Math.round(totalWithExtras).toLocaleString('cs-CZ');
    },
    isCheckoutRoute() {
      return this.$route.name === 'Payment' || this.$route.name === 'Address';
    },
    isChildRoute() {
      // Проверяем, является ли текущий маршрут дочерним
      return ['Delivery', 'Payment', 'Address', 'Checkout'].includes(this.$route.name);
    },
  },
  mounted() {
    console.log("Текущие товары в корзине:", this.cartItems);
  },
  methods: {
    ...mapActions('cart', ['removeFromCart', 'saveCartToDatabase', 'fetchProductById']),
    ...mapMutations('cart', ['updateQuantity', 'setCartItems']),

    async removeItem(productId) {
      try {
        const cartId = this.$store.state.cart.cartId;
        const token = this.$store.state.auth.token;

        if (!cartId || !productId) {
          console.error("Некорректные данные для удаления: отсутствует cartId или productId.");
          return;
        }

        console.log(`Запрос на удаление: /api/cart/${cartId}/item/${productId}?api_token=${token}`);
        await this.$store.dispatch('cart/removeFromCart', productId);
        console.log(`Товар с ID ${productId} успешно удален.`);
      } catch (error) {
        console.error('Ошибка при удалении товара из корзины:', error);
      }
    },

    async enrichCartItems() {
      console.log("Обогащение данных товаров в корзине...");
      const formattedCartItems = await Promise.all(
          this.cartItems.map(async item => {
            if (!item.name) {
              const productData = await this.fetchProductById(item.product_id);
              if (productData) {
                return {
                  id: productData.id,
                  name: productData.name,
                  main_image: productData.main_image,
                  price: productData.price,
                  qty: item.quantity,
                  unique_code: productData.unique_code || '',
                };
              } else {
                console.error(`Не удалось загрузить данные для товара с ID ${item.product_id}`);
                return null;
              }
            } else {
              return {
                id: item.id || item.product_id,
                name: item.name,
                main_image: item.main_image || 'https://via.placeholder.com/150',
                price: item.price,
                qty: item.qty || item.quantity,
                unique_code: item.unique_code || '',
              };
            }
          })
      );

      const validCartItems = formattedCartItems.filter(item => item !== null);
      this.setCartItems(validCartItems);
      console.log("Обработанные товары для корзины:", validCartItems);
    },

    updateItemQuantity(productId, amount) {
      console.log(`Изменение количества товара с ID ${productId} на ${amount}`);
      this.updateQuantity({productId, amount});
    },

    loadCartFromLocalStorage() {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        this.setCartItems(parsedCart);
        console.log('Загруженные товары из localStorage:', parsedCart);
      }
    },

    async proceedToCheckout() {
      try {
        await this.saveCartToDatabase();
        this.$router.push({name: 'Delivery'});
      } catch (error) {
        console.error('Ошибка при переходе к оформлению заказа:', error);
      }
    },

    generateSlug(name) {
      if (!name) {
        console.error("Ошибка: имя товара отсутствует при попытке создания slug.");
        return '';
      }
      return name.toLowerCase().replace(/ /g, '-');
    },

    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ');
    },

    getDeliveryImage() {
      const deliveryImages = {
        'PPL': '/img/ppl.jpg',
        'Zasilkovna': '/img/zasilkovna.png',
        'Nase doprava': '/img/logo-id-web.ico',
        'Centrální sklad': '/img/logo-id-web.ico'
      };
      return deliveryImages[this.deliveryMethod] || '/img/default-delivery.png';
    }
  },
  watch: {
    $route(to) {
      this.isProceedingToCheckout = to.name === 'Delivery';
    }
  }
};
</script>

<style scoped>
.cart-page {
  padding-top: 40px;
}

.item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-2.border-bottom.d-flex {
  flex-wrap: wrap;
  width: 100%;
}

.doprava-title {
  margin: 0;
  line-height: 1.5;
}

.doprava-price {
  color: red;
  margin-left: 50px;
  padding-top: 20px;
}

@media (max-width: 767.98px) {
  .card {
    width: 100%;
  }

  .card-body {
    padding: 10px;
  }

  .card-title {
    font-size: 1rem;
  }

  .cart-product-img {
    max-width: 150px;
    height: auto;
  }

  .input-group {
    width: 100px !important;
  }

  .quantity {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .btn {
    padding: 5px 10px;
  }
}
</style>
