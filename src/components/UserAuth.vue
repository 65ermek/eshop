<template>
  <div style="position: relative;">
    <!-- Кнопка для открытия модального окна (десктоп) -->
    <button v-if="!isAuthenticated" @click="openLoginModal" class="btn border mx-1 d-none d-md-flex align-items-center">
      Přihlásit se
    </button>

    <!-- Иконка для мобильной версии (неавторизован) -->
    <button v-if="!isAuthenticated" @click="openLoginModal" class="btn border mx-1 d-md-none align-items-center">
      <i class="fas fa-user text-primary"></i>
    </button>

    <!-- Приветствие и отображение имени после авторизации (десктоп) -->
    <div v-if="isAuthenticated" class="d-none d-md-flex align-items-center">
      <button @click="openUserMenuModal" class="btn border mx-1">{{ userName }}</button>
    </div>

    <!-- Иконка для мобильной версии (авторизован) с именем поверх -->
    <div v-if="isAuthenticated" class="d-md-none">
      <button @click="openUserMenuModal" class="btn border mx-1 position-relative">
        <i class="fas fa-user text-primary"></i>
        <!-- Отображение имени поверх иконки (мобильная версия) -->
        <span class="user-name-overlay">{{ userName }}</span>
      </button>
    </div>

    <!-- Модальное окно для входа -->
    <div v-if="isLoginModalVisible" class="login-block" ref="loginModal">
      <!-- Кнопка для закрытия модального окна (крестик) -->
      <div class="login-block-close" @click="closeLoginModal">
        <span>&times;</span>
      </div>

      <!-- Форма авторизации -->
      <div class="login-block-wrapper">
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email" class="w-full block">Přihlašovací email</label>
            <input id="email" v-model="email" autocomplete="off" name="email" type="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="password" class="w-full block">Heslo</label>
            <input id="password" v-model="password" autocomplete="on" name="password" type="password" class="form-input" required />
          </div>

          <div>
            <button type="submit" class="button w-full">Přihlásit</button>
          </div>
        </form>

        <!-- Кнопка для регистрации -->
        <div>
          <button @click="goToRegister" class="button blue w-full mt-3">Registrovat</button>
        </div>

        <!-- Ссылка на восстановление пароля -->
        <div class="text-center mt-3">
          <a href="/forgot-password" class="text-sm">Zapomněl/a jste heslo?</a>
        </div>

        <!-- Отображение сообщений об ошибках -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <!-- Модальное окно для меню пользователя -->
    <div v-if="isUserMenuModalVisible" class="login-block" ref="userMenuModal">
      <div class="login-block-close" @click="closeUserMenuModal">
        <span>&times;</span>
      </div>

      <!-- Список меню пользователя -->
      <div>
        <ul class="user-menu">
          <li>
            Přihlášen/a jako {{ userEmail }}
          </li>
          <li><a href="/profile" class="flex items-center">Profil</a></li>
          <li><a href="/profile/objednavky" class="flex items-center">Objednávky</a></li>
          <li><a href="/profile/faktury" class="flex items-center">Faktury</a></li>
          <li><a href="/profile/zakoupene-zbozi" class="flex items-center">Zakoupené zboží</a></li>
          <li><a href="/profile/firemni-uzivatele" class="flex items-center">Firemní uživatele</a></li>
          <li><a href="/profile/doporuceny-sortiment" class="flex items-center">Doporučený sortiment</a></li>
          <li><a href="/profile/oblibene" class="flex items-center">Oblíbené</a></li>
          <li><a @click="logout" class="flex items-center">Odhlásít</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex';

export default {
  name: 'UserAuth',
  data() {
    return {
      email: '',
      password: '',
      isLoginModalVisible: false,
      isUserMenuModalVisible: false,
      errorMessage: '',
      clickedInside: false, // флаг для отслеживания клика внутри окна
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'userName', 'userEmail']),
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick); // Добавляем слушатель клика
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick); // Удаляем слушатель при уничтожении компонента
  },
  methods: {
    openLoginModal() {
      this.isLoginModalVisible = true; // Открыть модальное окно для входа
      this.clickedInside = true; // Устанавливаем флаг при открытии
      setTimeout(() => {
        this.clickedInside = false; // Сбрасываем флаг после открытия
      }, 100); // задержка для предотвращения немедленного закрытия
    },
    closeLoginModal() {
      this.isLoginModalVisible = false; // Закрыть модальное окно для входа
      this.errorMessage = ''; // Сбрасываем сообщение об ошибке при закрытии окна
    },
    openUserMenuModal() {
      this.isUserMenuModalVisible = true; // Открыть модальное окно для меню пользователя
      this.clickedInside = true; // Устанавливаем флаг при открытии
      setTimeout(() => {
        this.clickedInside = false; // Сбрасываем флаг после открытия
      }, 100); // задержка для предотвращения немедленного закрытия
    },
    closeUserMenuModal() {
      this.isUserMenuModalVisible = false; // Закрыть модальное окно для меню пользователя
    },
    handleOutsideClick(event) {
      if (this.clickedInside) {
        return; // Пропускаем событие, если клик был внутри
      }

      const loginModal = this.$refs.loginModal;
      const userMenuModal = this.$refs.userMenuModal;

      if (
          this.isLoginModalVisible &&
          loginModal && !loginModal.contains(event.target)
      ) {
        this.closeLoginModal(); // Закрываем окно входа при клике вне его области
      }

      if (
          this.isUserMenuModalVisible &&
          userMenuModal && !userMenuModal.contains(event.target)
      ) {
        this.closeUserMenuModal(); // Закрываем окно меню пользователя при клике вне его области
      }
    },
    async login() {
      console.log("Форма отправлена, метод login вызван");
      try {
        const response = await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password,
        });

        // Логируем response для проверки ответа сервера
        console.log("Ответ сервера:", response);

        // Проверка состояния isAuthenticated для подтверждения входа
        console.log("Проверка isAuthenticated:", this.$store.state.auth.isAuthenticated);

        if (this.$store.state.auth.isAuthenticated) {
          this.closeLoginModal();
          this.$router.push('/');
        } else {
          console.warn("Не удалось авторизоваться. Проверьте состояние Vuex.");
        }
      } catch (error) {
        this.errorMessage = "Не удалось выполнить вход. Пожалуйста, проверьте свои данные и попробуйте снова.";
      }
    },
    logout() {
      this.closeUserMenuModal();
      this.$store.dispatch('auth/logout')
          .then(() => {
            console.log('Пользователь успешно вышел из системы, корзина очищена');
            this.$router.push('/');
          });
    },
    goToRegister() {
      window.location.href = '/registrace';
    },
  },
};
</script>


<style scoped>
/* Стили для модальных окон */
.login-block {
  background: white;
  padding: 20px;
  width: 18rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: absolute;
  top: 100%;
  right: 0;
}

@media screen and (max-width: 676px) {
  .login-block {
    right: -68px;
  }
}

/* Имя пользователя в мобильной версии */
.user-name-overlay {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 0.8rem;
  color: #007bff;
}

.login-block-wrapper {
  display: flex;
  flex-direction: column;
}

.login-block-close {
  text-align: right;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #007bff;
}

.user-menu {
  list-style: none;
  padding: 0;
}

.user-menu li {
  margin-bottom: 10px;
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
  text-align: center;
  width: 100%;
}

.button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.text-sm {
  font-size: 0.875rem;
  color: #007bff;
}

.text-sm:hover {
  text-decoration: underline;
}
</style>
