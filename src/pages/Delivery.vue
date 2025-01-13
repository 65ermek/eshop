<template>
  <div class="container delivery-page py-4">
    <h3 class="text-center mb-4">Vyberte způsob doručení</h3>

    <div class="row mt-4">
      <!-- Vyzvednout osobně -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="font-weight-semi-bold">Vyzvednout osobně</h5>
          </div>
          <div class="card-body">
            <div class="custom-control custom-radio delivery-option mb-3">
              <input type="radio" id="pickup" value="0" v-model="selectedDelivery" @change="setDeliveryMethod('Centrální sklad', 0)" class="custom-control-input">
              <div @click="selectRadio('pickup')" class="custom-control-label">
                <div class="d-flex justify-content-between align-items-center" style="width: 100%;">
                  <div class="d-flex align-items-center" style="flex-grow: 1;">
                    <img src="/img/logo-id-web.ico" class="mr-2" alt="logo-id-web" style="width: 30px;">
                    <div class="option-name">Centrální sklad</div>
                  </div>
                  <div class="font-price option-price">zdarma</div>
                </div>
              </div>
            </div>

            <div class="custom-control custom-radio delivery-option">
              <input type="radio" id="our_transport" value="100" v-model="selectedDelivery" @change="setDeliveryMethod('Nase doprava', 100)" class="custom-control-input">
              <div @click="selectRadio('our_transport')" class="custom-control-label">
                <div class="d-flex justify-content-between align-items-center" style="width: 100%;">
                  <div class="d-flex align-items-center" style="flex-grow: 1;">
                    <img src="/img/logo-id-web.ico" class="mr-2" alt="logo-id-web" style="width: 30px;">
                    <div class="option-name">Nase doprava</div>
                  </div>
                  <div class="font-price option-price">100 Kč</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Dovézt na adresu -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="font-weight-semi-bold">Dovézt na adresu</h5>
          </div>
          <div class="card-body">
            <div class="custom-control custom-radio delivery-option mb-3">
              <input type="radio" id="ppl" value="150" v-model="selectedDelivery" @change="setDeliveryMethod('PPL', 150)" class="custom-control-input">
              <div @click="selectRadio('ppl')" class="custom-control-label">
                <div class="d-flex justify-content-between align-items-center" style="width: 100%;">
                  <div class="d-flex align-items-center" style="flex-grow: 1;">
                    <img src="/img/ppl.jpg" class="mr-2" style="width: 30px;">
                    <div class="option-name">PPL</div>
                  </div>
                  <div class="font-price option-price">150 Kč</div>
                </div>
              </div>
            </div>

            <div class="custom-control custom-radio delivery-option">
              <input type="radio" id="zasilkovna" value="120" v-model="selectedDelivery" @change="setDeliveryMethod('Zasilkovna', 120)" class="custom-control-input">
              <div @click="selectRadio('zasilkovna')" class="custom-control-label">
                <div class="d-flex justify-content-between align-items-center" style="width: 100%;">
                  <div class="d-flex align-items-center" style="flex-grow: 1;">
                    <img src="/img/zasilkovna.png" class="mr-2" style="width: 30px;">
                    <div class="option-name">Zasilkovna</div>
                  </div>
                  <div class="font-price option-price">120 Kč</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка отображается только при выбранном способе доставки -->
    <div class="text-center mt-4" v-if="selectedDelivery !== null">
      <button class="btn btn-primary" @click="proceedToPayment">Pokračovat k platbě</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDelivery: null, // Выбранный метод доставки
    };
  },
  methods: {
    selectRadio(radioId) {
      // Программно активируем radio input по его id
      document.getElementById(radioId).click();
    },
    // Сохраняем метод доставки в Vuex
    setDeliveryMethod(methodName, price) {
      this.$store.commit('cart/setDeliveryMethod', { method: methodName, price: price });
    },
    proceedToPayment() {
      if (this.selectedDelivery !== null) {
        // Переход на страницу оплаты
        this.$router.push({ name: 'Payment' });
      } else {
        alert('Vyberte způsob doručení');
      }
    }
  }
};
</script>

<style scoped>
.delivery-page {
  padding-top: 40px;
}

.font-price {
  font-weight: bold;
  color: red;
}

.delivery-option img {
  width: 30px;
}

.option-name {
  flex-grow: 1; /* Название занимает все доступное пространство */
}

.custom-control.custom-radio.delivery-option {
  width: 100%; /* Ширина контейнера */
}

.option-price {
  margin-left: auto; /* Цена справа */
  text-align: right;
  white-space: nowrap; /* Цена всегда на одной строке */
}
</style>
