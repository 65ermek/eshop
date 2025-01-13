<template>
  <div class="reset-password-page">
    <h2>Сброс пароля</h2>
    <form @submit.prevent="resetPassword">
      <div class="form-group">
        <label for="password">Новый пароль</label>
        <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Введите новый пароль"
            required
        />
      </div>

      <div class="form-group">
        <label for="password_confirmation">Подтвердите пароль</label>
        <input
            id="password_confirmation"
            v-model="password_confirmation"
            type="password"
            class="form-input"
            placeholder="Подтвердите новый пароль"
            required
        />
      </div>

      <button type="submit" class="button w-full">Сбросить пароль</button>

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
      token: '', // Получите токен из URL
      password: '',
      password_confirmation: '',
      message: '',
      errorMessage: '',
    };
  },
  mounted() {
    // Получение токена из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.password_confirmation) {
        this.errorMessage = 'Пароли не совпадают.';
        return;
      }

      try {
        const response = await axios.post('https://shop.avanpost.online/api/customers/reset-password', {
          token: this.token,
          password: this.password,
        });

        this.message = 'Пароль успешно сброшен. Вы можете войти с новым паролем.';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Ошибка при сбросе пароля. Попробуйте еще раз.';
        this.message = '';
        console.error('Ошибка при сбросе пароля:', error);
      }
    },
  },
};
</script>

<style scoped>
.reset-password-page {
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
