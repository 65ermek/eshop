<template>

  <div class="text-center mb-4">
    <h2 class="section-title px-5"><span class="px-2">Obnova hesla</span></h2>
  </div>
  <div class="text-center">
    <div class="px-2">
      <h4 class="font-bold">Jak na to</h4>
      <ul class="mt-2 lp-help-list" style="list-style-type: none;">
        <li> Pro obnovu hesla je potřeba zadat email s kterým jste se registrovali. </li>
        <li> Na tento e-mail vám pošleme odkaz, pomocí kterého si budete moci zadat nové heslo. </li>
      </ul>
    </div>
  </div>
  <div class="forgot-password-page">
    <form @submit.prevent="sendResetLink">
      <div class="form-group">
        <label for="email">Váš e-mail</label>
        <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            required
        />
      </div>

      <button type="submit" class="button w-full">Obnovit heslo</button>

      <div v-if="message" class="message">
        {{ message }}
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      message: '',
      errorMessage: '',
    };
  },
  methods: {
    async sendResetLink() {
      try {
        const response = await axios.post('https://shop.avanpost.online/api/customers/forgot-password', {
          email: this.email,
        });

        this.message = 'Ссылка для восстановления пароля отправлена на ваш email.';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Ошибка при отправке запроса. Проверьте введенный email.';
        this.message = '';
        console.error('Ошибка при восстановлении пароля:', error);
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  width: 100%;
}

.button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 20px;
  color: green;
}

.error-message {
  margin-top: 20px;
  color: red;
}
</style>
