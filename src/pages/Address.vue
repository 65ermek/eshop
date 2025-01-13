<template>
  <div class="container address-page py-4">
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
          <div class="option-name">{{ paymentMethod }} ({{ formatPrice(paymentPrice) }} Kč)</div>
        </div>
        <a href="#" @click.prevent="changePayment">Změnit platbu</a>
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="notificationMessage" class="alert alert-danger">
      {{ notificationMessage }}
    </div>

    <!-- Поле для поиска по IČО -->
    <div class="row">
      <div class="col-12 form-group">
        <label for="ico" class="text-primary cursor-pointer">
          <i class="fa fa-search mr-2"></i> Nákup na firmu? Vyhledejte podle IČО
        </label>
        <div class="input-group">
          <input
              type="text"
              id="ico"
              v-model="companyIco"
              :class="{ 'is-invalid': icoError, 'highlighted': companyIco, 'filled-warning': companyIco }"
              class="form-control"
              placeholder="IČО"
              @keyup.enter="searchByIco"
          />
          <div class="input-group-append">
            <button @click="searchByIco" class="btn btn-primary">Vyhledat</button>
          </div>
          <div v-if="icoError" class="invalid-feedback d-block">
            Toto není validní IČО
          </div>
        </div>
      </div>
    </div>

    <!-- Форма с данными профиля и кнопкой отправки -->
    <form @submit.prevent="onSubmit">
      <!-- Поля для Fakturační údaje -->
      <div class="row">
        <div class="col-12 col-md-6 form-group">
          <label for="billingName">Jméno a příjmení</label>
          <input
              type="text"
              id="billingName"
              v-model="Name"
              :class="{ 'is-invalid': validationErrors.Name, 'filled-warning': Name }"
              class="form-control"
              placeholder="Zadejte jméno"
          />
          <div v-if="validationErrors.Name" class="invalid-feedback">Pole je povinné</div>
        </div>

        <div class="col-12 col-md-6 form-group">
          <label for="billingCompany">Firma</label>
          <input
              type="text"
              id="billingCompany"
              v-model="companyName"
              :class="{ 'filled-warning': companyName }"
              class="form-control"
              placeholder="Zadejte název firmy"
          />
        </div>
        <!-- Ulice -->
        <div class="col-12 form-group">
          <label for="billingStreet">Ulice</label>
          <input
              type="text"
              id="billingStreet"
              v-model="street"
              :class="{ 'is-invalid': validationErrors.street, 'filled-warning': street }"
              class="form-control"
              placeholder="Zadejte ulici"
          />
          <div v-if="validationErrors.street" class="invalid-feedback">Pole je povinné</div>
        </div>
        <!-- Město -->
        <div class="col-12 col-md-6 form-group">
          <label for="billingCity">Město</label>
          <input
              type="text"
              id="billingCity"
              v-model="city"
              :class="{ 'is-invalid': validationErrors.city, 'filled-warning': city }"
              class="form-control"
              placeholder="Zadejte město"
          />
          <div v-if="validationErrors.city" class="invalid-feedback">Pole je povinné</div>
        </div>
        <!-- PSČ -->
        <div class="col-12 col-md-6 form-group">
          <label for="billingPostalCode">PSČ</label>
          <input
              type="text"
              id="billingPostalCode"
              v-model="postalCode"
              :class="{ 'is-invalid': validationErrors.postalCode, 'filled-warning': postalCode }"
              class="form-control"
              placeholder="Zadejte PSČ"
          />
          <div v-if="validationErrors.postalCode" class="invalid-feedback">Pole je povinné</div>
        </div>
        <!-- Telefon -->
        <div class="col-12 col-md-6 form-group">
          <label for="billingPhone">Telefon</label>
          <input
              type="text"
              id="billingPhone"
              v-model="phone"
              :class="{ 'is-invalid': validationErrors.phone, 'filled-warning': phone }"
              class="form-control"
              placeholder="Zadejte telefon"
          />
          <div v-if="validationErrors.phone" class="invalid-feedback">Pole je povinné</div>
        </div>
        <!-- E-mail -->
        <div class="col-12 col-md-6 form-group">
          <label for="billingEmail">E-mail</label>
          <input
              type="email"
              id="billingEmail"
              v-model="email"
              :class="{ 'is-invalid': validationErrors.email, 'filled-warning': email }"
              class="form-control"
              placeholder="Zadejte e-mail"
          />
          <div v-if="validationErrors.email" class="invalid-feedback">Pole je povinné</div>
        </div>
      </div>

      <!-- Поля для доставки -->
      <div class="text-center mt-3">
        <a href="#" @click.prevent="toggleAlternativeAddress" class="text-primary cursor-pointer">
          Dodací adresa je jiná
        </a>
      </div>

      <div v-if="showAlternativeAddress" class="row mt-4">
        <div class="col-12 col-md-6 form-group">
          <label for="deliveryName">Jméno a příjmení</label>
          <input
              type="text"
              id="deliveryName"
              v-model="altFirstName"
              :class="{ 'filled-warning': altFirstName }"
              class="form-control"
              placeholder="Zadejte jméno a příjmení"
          />
        </div>

        <div class="col-12 col-md-6 form-group">
          <label for="deliveryCompany">Firma</label>
          <input
              type="text"
              id="deliveryCompany"
              v-model="altCompanyName"
              :class="{ 'filled-warning': altCompanyName }"
              class="form-control"
              placeholder="Zadejte název firmy"
          />
        </div>

        <div class="col-12 form-group">
          <label for="deliveryStreet">Ulice</label>
          <input
              type="text"
              id="deliveryStreet"
              v-model="altStreet"
              :class="{ 'filled-warning': altStreet }"
              class="form-control"
              placeholder="Zadejte ulici"
          />
        </div>

        <div class="col-12 col-md-6 form-group">
          <label for="deliveryCity">Město</label>
          <input
              type="text"
              id="deliveryCity"
              v-model="altCity"
              :class="{ 'filled-warning': altCity }"
              class="form-control"
              placeholder="Zadejte město"
          />
        </div>

        <div class="col-12 col-md-6 form-group">
          <label for="deliveryPostalCode">PSČ</label>
          <input
              type="text"
              id="deliveryPostalCode"
              v-model="altPostalCode"
              :class="{ 'filled-warning': altPostalCode }"
              class="form-control"
              placeholder="Zadejte PSČ"
          />
        </div>

        <div class="col-12 form-group">
          <label for="deliveryPhone">Kontaktní telefon pro dopravce</label>
          <input
              type="text"
              id="deliveryPhone"
              v-model="altPhone"
              :class="{ 'filled-warning': altPhone }"
              class="form-control"
              placeholder="Zadejte kontaktní telefon"
          />
        </div>
      </div>

      <!-- Кнопка для сохранения изменений -->
      <div class="text-center mt-4">
        <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading" @click.prevent="finishCart">
          <span v-if="isLoading" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          <span v-if="!isLoading">Pokračovat</span>
          <span v-else>Loading...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      companyIco: '',
      companyName: '',
      companyDic: '',
      Name: '',
      street: '',
      city: '',
      postalCode: '',
      phone: '',
      email: '',
      isLoading: false,
      icoError: false,
      notificationMessage: '',
      validationErrors: {
        Name: false,
        street: false,
        city: false,
        postalCode: false,
        phone: false,
        email: false,
      },
      altCompanyName: '',
      altFirstName: '',
      altStreet: '',
      altCity: '',
      altPostalCode: '',
      altPhone: '',
      showAlternativeAddress: false,
    };
  },
  computed: {
    ...mapGetters('auth', {
      authName: 'userName',
      authEmail: 'userEmail',
      authPhone: 'userPhone',
      authCompanyName: 'companyName',
      authStreet: 'userStreet',
      authCity: 'userCity',
      authPostalCode: 'userPostalCode',
      deliveryName: 'deliveryName',
      deliveryStreet: 'deliveryStreet',
      deliveryCity: 'deliveryCity',
      deliveryPostalCode: 'deliveryPostalCode',
      deliveryPhone: 'deliveryPhone',
      isAuthenticated: 'isAuthenticated',
    }),
    ...mapGetters('cart', ['deliveryMethod', 'deliveryPrice', 'paymentMethod', 'paymentPrice']),
    canProceed() {
      const mainFieldsFilled = this.Name && this.street && this.city && this.postalCode && this.phone && this.email;
      const altFieldsFilled = this.showAlternativeAddress
          ? this.altStreet && this.altCity && this.altPostalCode && this.altPhone
          : true;
      return mainFieldsFilled && altFieldsFilled;
    },
  },
  created() {
    if (this.isAuthenticated) {
      this.loadUserDataFromAuth();
    }
  },
  methods: {
    onSubmit() {
      const customerInfo = {
        token: this.$store.state.auth.token || '', // Сохраняем текущий токен
        customer_id: this.$store.state.auth.customerId || null, // Если пользователь аутентифицирован
        name: this.Name,
        userEmail: this.email,
        phone: this.phone,
        company_name: this.companyName,
        street: this.street,
        city: this.city,
        postal_code: this.postalCode,
        delivery_name: this.altFirstName || '',
        delivery_street: this.altStreet || '',
        delivery_city: this.altCity || '',
        delivery_postal_code: this.altPostalCode || '',
        delivery_contact_phone: this.altPhone || '',
      };

      // Вызываем мутацию для обновления данных
      this.$store.commit('auth/setAuth', customerInfo);

      console.log('Данные сохранены в auth:', customerInfo);

      // Сохраняем в Vuex данные для корзины
      this.$store.dispatch('cart/saveCustomerInfo', customerInfo);

      // Переход к странице Checkout
      this.$router.push({ name: 'Checkout' });
    },
    async saveAbandonedCartToServer() {
      try {
        const cartData = {
          // Сформируйте данные для отправки
          customer_id: this.isAuthenticated ? this.$store.getters['auth/customerId'] : null,
          session_id: this.isAuthenticated ? null : this.$store.getters['cart/sessionId'],
          customer_name: this.Name || null,
          total_price: this.$store.getters['cart/totalPrice'],
          items: this.$store.getters['cart/cartItems'].map(item => ({
            product_id: item.id,
            quantity: item.qty,
            price: item.price,
            total_price: item.price * item.qty,
          })),
        };

        console.log("Данные для отправки:", cartData);

        const response = await this.$axios.post('https://shop.avanpost.online/api/cart/save', cartData);
        console.log("Ответ сервера:", response.data);

        return response.data;
      } catch (error) {
        console.error("Ошибка при сохранении корзины на сервере:", error.response?.data || error.message);
        throw error;
      }
    },
    toggleAlternativeAddress() {
      this.showAlternativeAddress = !this.showAlternativeAddress; // Переключение состояния
      this.$store.commit('auth/setShowAltAddress', this.showAlternativeAddress);
    },
    changeDelivery() {
      this.$router.push({name: 'Delivery'});
    },
    changePayment() {
      this.$router.push({name: 'Payment'});
    },
    formatPrice(price) {
      return Math.round(price).toLocaleString('cs-CZ');
    },
    loadUserDataFromAuth() {
      this.Name = this.authName || '';
      this.email = this.authEmail || '';
      this.phone = this.authPhone || '';
      this.companyName = this.authCompanyName || '';
      this.street = this.authStreet || '';
      this.city = this.authCity || '';
      this.postalCode = this.authPostalCode || '';
      this.altFirstName = this.deliveryName || '';
      this.altStreet = this.deliveryStreet || '';
      this.altCity = this.deliveryCity || '';
      this.altPostalCode = this.deliveryPostalCode || '';
      this.altPhone = this.deliveryPhone || '';

      // Логируем данные для отладки
      console.log('Данные после вызова loadUserDataFromAuth:', {
        Name: this.Name,
        email: this.email,
        phone: this.phone,
        companyName: this.companyName,
        street: this.street,
        city: this.city,
        postalCode: this.postalCode,
        altFirstName: this.altFirstName,
        altStreet: this.altStreet,
        altCity: this.altCity,
        altPostalCode: this.altPostalCode,
        altPhone: this.altPhone,
      });
    },
    async searchByIco() {
      try {
        const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${this.companyIco}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          this.icoError = true;
          return;
        }

        const data = await response.json();

        if (!data || !data.sidlo || !data.sidlo.textovaAdresa) {
          this.icoError = true;
          return;
        }

        this.companyName = data.obchodniJmeno || '';
        this.dic = data.dic || '';
        const addressParts = data.sidlo.textovaAdresa.split(',');

        if (addressParts.length >= 3) {
          this.street = addressParts[0]?.trim() || '';
          const postalCityPart = addressParts[2]?.trim() || '';
          const postalCodeMatch = postalCityPart.match(/\b\d{5}\b/);

          if (postalCodeMatch) {
            this.postalCode = postalCodeMatch[0];
            this.city = postalCityPart.replace(postalCodeMatch[0], '').trim();
          } else {
            this.postalCode = '';
            this.city = addressParts[2]?.trim() || '';
          }
        } else {
          this.street = data.sidlo.nazevUlice || '';
          this.postalCode = data.sidlo.psc || '';
          this.city = data.sidlo.nazevObce || '';
        }

        this.icoError = false;
      } catch (error) {
        console.error('Ошибка при запросе к ARES:', error);
        this.icoError = true;
      }
    },
    async finishCart() {
      const isValid = this.validateFields();
      if (!isValid) {
        this.notificationMessage = "Vyplňte správně všechny požadované údaje ";
        return;
      }

      // Сохраняем данные в auth перед отправкой
      this.onSubmit();

      this.isLoading = true;
      try {
        // Отправляем данные на сервер
        await this.$store.dispatch('cart/saveFinishCartToDatabase', {
          session_id: this.$store.state.cart.sessionId,
          customer_name: this.Name,
          email: this.email,
          phone: this.phone, // Передаём телефон, введённый пользователем
        });

        console.log('Корзина успешно завершена и данные сохранены.');
        this.$router.push({ name: 'Checkout' });
      } catch (error) {
        console.error('Ошибка при завершении корзины:', error);
        this.notificationMessage = error.response?.data?.message || 'Ошибка при отправке данных';
      } finally {
        this.isLoading = false;
      }
    },
    validateFields() {
      this.validationErrors.Name = !this.Name;
      this.validationErrors.street = !this.street;
      this.validationErrors.city = !this.city;
      this.validationErrors.postalCode = !this.postalCode;
      this.validationErrors.phone = !this.phone;
      this.validationErrors.email = !this.email;
      return Object.values(this.validationErrors).every((error) => !error);
    },
  },
};
</script>

<style scoped>
.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  background: #fff;
  z-index: 1000;
  width: 100%;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

.address-page {
  padding-top: 40px;
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
}

.delivery-info,
.payment-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}

.option-name {
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.cursor-pointer {
  cursor: pointer;
}

.filled-warning {
  border-color: #07ff41;
}

@media (max-width: 576px) {
  .form-group {
    margin-bottom: 10px;
  }

  .delivery-info,
  .payment-info {
    padding: 10px;
  }

  h4 {
    font-size: 1.2rem;
  }

  .option-name {
    font-size: 1rem;
  }

  .btn {
    font-size: 1rem;
  }
}
</style>
