<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required/>
      <input v-model="password" type="password" placeholder="Password" required/>
      <button type="submit">Login</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      await this.login({email: this.email, password: this.password});
      this.$router.push({name: 'Profile'});
    }
  }
};
</script>
