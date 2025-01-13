<template>
  <div class="checkout-summary container py-4">
    <!-- Блок с выбранным способом доставки -->
    <div class="delivery-info mb-4">
      <h4 class="d-flex align-items-center">
        <i class="fa fa-truck mr-2 text-primary"></i> Zvolený způsob doručení
      </h4>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <i class="fa fa-check mr-2 text-success"></i>
          <div class="option-name">{{ deliveryMethod }} ({{ formatPrice(deliveryPrice) }} Kč)</div>
        </div>
        <a href="#" @click.prevent="changeDelivery">Změnit doručení</a>
      </div>
    </div>

    <!-- Блок с выбранным способом оплаты -->
    <div class="payment-info mb-4">
      <h4 class="d-flex align-items-center">
        <i class="fa fa-credit-card mr-2 text-primary"></i> Zvolený způsob platby
      </h4>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <i class="fa fa-check mr-2 text-success"></i>
          <div class="option-name">{{ paymentMethodName }} ({{ formatPrice(paymentPrice) }} Kč)</div>
        </div>
        <a href="#" @click.prevent="changePayment">Změnit платбу</a>
      </div>
    </div>

    <!-- Блок адресов: основной и альтернативный -->
    <div class="address-section">
      <!-- Блок с основным адресом -->
      <div class="address-info">
        <h4 class="d-flex align-items-center">
          <i class="fa fa-home mr-2 text-primary"></i> Dodací adresa
        </h4>
        <div class="d-flex flex-column">
          <div v-if="customerInfo.name">
            <strong>Jméno:</strong> {{ customerInfo.name }}
          </div>
          <div v-if="customerInfo.street">
            <strong>Ulice:</strong> {{ customerInfo.street }}
          </div>
          <div v-if="customerInfo.city">
            <strong>Město:</strong> {{ customerInfo.city }}
          </div>
          <div v-if="customerInfo.postal_code">
            <strong>PSČ:</strong> {{ customerInfo.postal_code }}
          </div>
          <div v-if="customerInfo.phone">
            <strong>Telefon:</strong> {{ customerInfo.phone }}
          </div>
          <div v-if="customerInfo.userEmail">
            <strong>Email:</strong> {{ customerInfo.userEmail }}
          </div>
          <div v-if="customerInfo.company_name">
            <strong>Název firmy:</strong> {{ customerInfo.company_name }}
          </div>
        </div>
      </div>

      <!-- Блок с альтернативным адресом -->
      <div class="alt-address-info" v-if="hasAltAddress">
        <h4 class="d-flex align-items-center">
          <i class="fa fa-home mr-2 text-primary"></i> Alternativní dodací adresa
        </h4>
        <div class="d-flex flex-column">
          <div v-if="customerInfo.delivery_name">
            <strong>Jméno:</strong> {{ customerInfo.delivery_name }}
          </div>
          <div v-if="customerInfo.delivery_company">
            <strong>Název firmy:</strong> {{ customerInfo.delivery_company }}
          </div>
          <div v-if="customerInfo.delivery_street">
            <strong>Ulice:</strong> {{ customerInfo.delivery_street }}
          </div>
          <div v-if="customerInfo.delivery_city">
            <strong>Město:</strong> {{ customerInfo.delivery_city }}
          </div>
          <div v-if="customerInfo.delivery_postal_code">
            <strong>PSČ:</strong> {{ customerInfo.delivery_postal_code }}
          </div>
          <div v-if="customerInfo.delivery_contact_phone">
            <strong>Telefon:</strong> {{ customerInfo.delivery_contact_phone }}
          </div>
        </div>
      </div>
    </div>

    <!-- Ссылка для изменения адреса -->
    <div class="d-flex justify-content-end mb-4">
      <a href="#" @click.prevent="changeAddress">Změnit адрес</a>
    </div>

    <!-- Поле для сообщения -->
    <div class="mt-4">
      <h5 class="font-weight-semi-bold">Zpráva pro nás</h5>
      <textarea v-model="message" class="form-control" rows="4" placeholder="Zanechte zprávu..."></textarea>
    </div>

    <!-- Чекбоксы -->
    <div class="mt-4">
      <div class="custom-control custom-checkbox mb-2">
        <input type="checkbox" v-model="termsAccepted" class="custom-control-input" id="termsConditions">
        <label class="custom-control-label" for="termsConditions">Souhlasím s obchodními podmínkami</label>
      </div>
      <div class="custom-control custom-checkbox mb-2">
        <input type="checkbox" v-model="dataProtectionAccepted" class="custom-control-input" id="dataProtection">
        <label class="custom-control-label" for="dataProtection">Souhlasím s ochranou os. údajů</label>
      </div>
      <div class="custom-control custom-checkbox mb-2">
        <input type="checkbox" v-model="newsletterAccepted" class="custom-control-input" id="newsletter">
        <label class="custom-control-label" for="newsletter">Souhlasím s odebíráním newsletterů, z kterých se můžete kdykoli odhlásit</label>
      </div>
    </div>

    <!-- Кнопка подтверждения заказа -->
    <button @click="confirmOrder" class="btn btn-primary btn-lg btn-block" :disabled="!canConfirmOrder">Potvrdit objednávku</button>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      message: '',
      termsAccepted: false,
      dataProtectionAccepted: false,
      newsletterAccepted: false,
    };
  },
  created() {
    this.$store.dispatch('cart/initializeCartFromLocalStorage');
    console.log('Данные customerInfo из Vuex:', this.customerInfo);
    console.log('Данные cartItems из Vuex:', this.cartItems);
  },
  computed: {
    ...mapGetters('cart', [
      'cartItems',
      'customerInfo',
      'deliveryMethod',
      'deliveryPrice',
      'paymentMethod',
      'paymentPrice',
    ]),
    ...mapGetters('auth', ['customerId']),
    hasAltAddress() {
      const altFields = [
        this.customerInfo.delivery_name,
        this.customerInfo.delivery_street,
        this.customerInfo.delivery_city,
        this.customerInfo.delivery_postal_code,
        this.customerInfo.delivery_contact_phone,
      ];
      return altFields.some(field => field);
    },
    canConfirmOrder() {
      return this.termsAccepted && this.dataProtectionAccepted;
    },
    totalPrice() {
      const cartTotal = this.cartItems?.reduce((sum, item) => sum + item.qty * item.price, 0) || 0;
      return cartTotal + (this.deliveryPrice || 0) + (this.paymentPrice || 0);
    },
  },
  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(value);
    },
    changeDelivery() {
      this.$router.push({ name: 'Delivery' });
    },
    changePayment() {
      this.$router.push({ name: 'Payment' });
    },
    changeAddress() {
      this.$router.push({ name: 'Address' });
    },
    confirmOrder() {
      console.log('cartItems:', this.cartItems);

      if (!this.cartItems || this.cartItems.length === 0) {
        alert('Корзина пуста. Добавьте товары перед подтверждением заказа.');
        return;
      }

      if (!this.canConfirmOrder) {
        alert('Pro potvrzení objednávky je nutné souhlasit s podmínkami a ochranou osobních údajů.');
        return;
      }

      const orderData = {
        cart_id: this.$store.state.cart.cartId,
        customer_id: this.customerId,
        customer_name: this.customerInfo.name,
        customer_email: this.customerInfo.userEmail,
        customer_phone: this.customerInfo.phone,
        delivery_method: this.deliveryMethod,
        delivery_price: this.deliveryPrice,
        payment_method: this.paymentMethod,
        payment_price: this.paymentPrice,
        total_price: this.totalPrice,
        message: this.message,
        newsletterAccepted: this.newsletterAccepted,
        items: this.cartItems.map(item => ({
          product_id: item.id,
          qty: item.qty,
          price: item.price,
        })),
      };

      console.log('Данные заказа:', orderData);

      this.sendOrder(orderData);
    },
    async sendOrder(orderData) {
      try {
        const response = await axios.post('https://shop.avanpost.online/api/orders', orderData);
        console.log('Заказ успешно создан:', response.data);
        if (response && response.data) {
          this.$store.commit('cart/clearCart');
          alert('Objednávка úspěšně potvrzena!');
          this.$router.push({ path: '/' });
        } else {
          throw new Error('Некорректный ответ сервера');
        }
      } catch (error) {
        console.error('Ошибка при создании заказа:', error.response?.data || error.message);
        alert('Произошла ошибка при создании заказа. Проверьте данные и попробуйте снова.');
      }
    },
  },
};
</script>

<style scoped>
.checkout-summary {
  max-width: 960px;
  margin: 0 auto;
}

/* Сетка для адресов */
.address-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Увеличиваем количество колонок на больших экранах */
@media (min-width: 768px) {
  .address-section {
    grid-template-columns: 1fr 1fr; /* Две колонки */
  }
}

.address-info,
.alt-address-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.address-info h4,
.alt-address-info h4 {
  margin-bottom: 15px;
}

.d-flex {
  margin-bottom: 8px;
}

@media (max-width: 576px) {
  .address-info,
  .alt-address-info {
    margin-bottom: 15px;
  }
}
</style>
