<template>
  <div class="container register-page py-4">
    <div class="text-center mb-4">
      <h2 class="section-title px-5"><span class="px-2">Registrace</span></h2>
    </div>

    <div v-if="!isAuthenticated" class="row">
      <!-- Форма регистрации -->
      <div class="col-12 form-group">
        <label for="name">Jméno a příjmení</label>
        <input type="text" id="name" v-model="name" :class="inputClass('name')" class="form-control" placeholder="Zadejte jméno a příjmení" required />
      </div>
      <div class="col-12 form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" :class="inputClass('email')" class="form-control" placeholder="Zadejte email" required />
      </div>
      <div class="col-12 form-group">
        <label for="password">Heslo</label>
        <input type="password" id="password" v-model="password" :class="inputClass('password')" class="form-control" placeholder="Zadejte heslo" required />
      </div>
      <div class="col-12 form-group">
        <label for="password_confirmation">Potvrzení hesla</label>
        <input type="password" id="password_confirmation" v-model="password_confirmation" :class="inputClass('password_confirmation')" class="form-control" placeholder="Potvrďte heslo" required />
      </div>
      <div v-if="notificationMessage" class="alert alert-danger">{{ notificationMessage }}</div>
      <div class="text-center mt-4">
        <button class="btn btn-primary btn-block" @click="submitForm">Registrace</button>
      </div>
    </div>

    <!-- Сообщение об успешной авторизации -->
    <div v-else class="text-center mt-4">
      <p>Добро пожаловать, {{ userName }}!</p>
      <p>Вы успешно зарегистрировались и авторизовались.</p>
      <router-link to="/">Перейти на главную страницу</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      validationErrors: {},
      notificationMessage: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'userName', 'userEmail']),
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue) {
        console.log('Пользователь теперь авторизован');
      }
    },
  },
  methods: {
    inputClass(field) {
      return this.validationErrors[field] ? 'is-invalid' : this[field] ? 'filled-warning' : '';
    },
    async submitForm() {
      try {
        // Очищаем сообщения об ошибках перед отправкой
        this.validationErrors = {};
        this.notificationMessage = '';

        const payload = {
          name: this.name,
          email: this.email,
          password: this.password,
        };

        const response = await axios.post('https://shop.avanpost.online/api/register', payload, {
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Успешная регистрация:', response.data);

        // Автоматический вход после регистрации
        await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password,
        });

        console.log('Пользователь авторизован автоматически.');
        // Переход на главную страницу после успешной регистрации и авторизации
        this.$router.push('/');
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        this.notificationMessage = 'Uživatel s tímto emailem již existuje';
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  width: 300px;
}
.is-invalid {
  border-color: #ff0000;
}
.filled-warning {
  border-color: #07ff41;
}
</style>
