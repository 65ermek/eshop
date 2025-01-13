<template>
  <div class="container payment-page py-4">
    <!-- Блок с выбранным способом доставки -->
    <div class="delivery-info text-center mb-4">
      <h4 class="d-flex align-items-center">
        <i class="fa fa-truck mr-2 text-primary"></i> Zvolený způsob doručení
      </h4>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img :src="getDeliveryImage()" class="mr-2" alt="Delivery Logo" style="width: 30px;">
          <i class="fa fa-check mr-2 text-success"></i>
          <div class="option-name">{{ deliveryMethod }} ({{ formatPrice(deliveryPrice) }} Kč)</div>
        </div>
        <a href="#" @click.prevent="changeDelivery">Změnit doručení</a>
      </div>
    </div>

    <!-- Заголовок выбора способа оплаты -->
    <h3 class="text-center mb-4">Vyberte způsob platby</h3>

    <div class="row mt-4 position-relative">
      <!-- Опции оплаты -->
      <div class="col-md-6 mx-auto">
        <div class="card">
          <div class="card-header">
            <h5 class="font-weight-semi-bold">Online platba</h5>
          </div>
          <div class="card-body">

            <div class="custom-control custom-radio payment-option mb-3" style="position: relative;">
              <input type="radio" id="kartou" value="kartou" v-model="localSelectedPayment" @change="setPayment('kartou', 0)" class="custom-control-input">
              <label for="kartou" class="custom-control-label" style="width: 100%;">
                <div class="d-flex align-items-center">
                  <i class="fa fa-credit-card mr-2"></i>
                  <div class="option-name">Kartou ihned</div>
                </div>
                <!-- Абсолютно спозиционированный элемент -->
                <div class="font-price option-price" style="position: absolute; right: 10px; top: 0;">zdarma</div>
              </label>
            </div>

            <div class="custom-control custom-radio payment-option mb-3" style="position: relative;">
              <input type="radio" id="bank" value="bank" v-model="localSelectedPayment" @change="setPayment('bank', 0)" class="custom-control-input">
              <label for="bank" class="custom-control-label" style="width: 100%;">
                <div class="d-flex align-items-center">
                  <i class="fa fa-university mr-2"></i>
                  <div class="option-name">Bankovním převodem platba předem</div>
                </div>
                <!-- Абсолютно спозиционированный элемент -->
                <div class="font-price option-price" style="position: absolute; right: 10px; top: 0;">zdarma</div>
              </label>
            </div>

            <div class="custom-control custom-radio payment-option mb-3" style="position: relative;">
              <input type="radio" id="cash" value="cash" v-model="localSelectedPayment" @change="setPayment('cash', 0)" class="custom-control-input">
              <label for="cash" class="custom-control-label" style="width: 100%;">
                <div class="d-flex align-items-center">
                  <i class="fa fa-coins mr-2"></i>
                  <div class="option-name">Hotově na místě</div>
                </div>
                <!-- Абсолютно спозиционированный элемент -->
                <div class="font-price option-price" style="position: absolute; right: 10px; top: 0;">zdarma</div>
              </label>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- Кнопка для продолжения -->
    <div class="text-center mt-4">
      <button class="btn btn-primary" v-if="localSelectedPayment" @click="proceedToNextStep">Pokračovat</button>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      localSelectedPayment: null, // Локальный выбор способа оплаты
    };
  },
  computed: {
    ...mapGetters('cart', ['deliveryMethod', 'deliveryPrice']),
  },
  methods: {
    confirmPayment() {
      // Сохраняем выбранный метод оплаты в Vuex
      this.$store.commit('cart/setPaymentMethod', {
        method: this.localSelectedPayment,
        price: 0, // Платеж по умолчанию бесплатен
      });
    },
    proceedToNextStep() {
      // Переход на следующий шаг
      this.$router.push({ name: 'Address' });
    },
    setPayment(paymentMethod) {
      this.localSelectedPayment = paymentMethod;
      this.$store.commit('cart/setPaymentMethod', paymentMethod);
      console.log("Установлен метод оплаты:", paymentMethod);
    },
    changeDelivery() {
      // Переход на страницу выбора доставки
      this.$router.push({ name: 'Delivery' });
    },
    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ');
    },
    getDeliveryImage() {
      // Метод возвращает URL логотипа в зависимости от метода доставки
      const deliveryImages = {
        'PPL': '/img/ppl.jpg',
        'Zasilkovna': '/img/zasilkovna.png',
        'Nase doprava': '/img/logo-id-web.ico',
        'Centrální sklad': '/img/logo-id-web.ico'
      };
      return deliveryImages[this.deliveryMethod] || '/img/default-delivery.png'; // Логотип по умолчанию
    }
  },
};
</script>

<style scoped>
.payment-page {
  padding-top: 40px;
}

.option-price {
  font-weight: bold;
  color: red;
}

.payment-option img {
  width: 30px;
}

.delivery-info {
  width: 36rem;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin: 0 auto; /* Центрируем блок */
}

.custom-control-input:checked ~ .custom-control-label {
  color: #007bff;
}

.payment-option {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.payment-option:hover {
  background-color: #f9f9f9;
}

.payment-option .option-name {
  font-weight: bold;
}
</style>

