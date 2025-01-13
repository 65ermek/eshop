<template>
  <!-- Subscribe Start -->
  <div class="container-fluid bg-secondary my-5">
    <div class="row justify-content-md-center py-5 px-xl-5">
      <div class="col-md-6 col-12 py-5">
        <div class="text-center mb-2 pb-2">
          <h2 class="section-title px-5 mb-3">
            <span class="bg-secondary px-2">Akční nabídky</span>
          </h2>
          <p>
            Přihlásit k odběru newsletteru
          </p>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <input
                type="email"
                class="form-control border-white p-4"
                v-model="email"
                placeholder="Váš e-mail"
                required
            />
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary px-4">Odebírat</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- Subscribe End -->
</template>

<script>
export default {
  name: 'SubscribeComponent',
  data() {
    return {
      email: '', // Поле для email
    };
  },
  methods: {
    handleSubmit() {
      // Логика обработки отправки формы (можно заменить на реальный API-запрос)
      if (this.email) {
        console.log('Subscribed with email:', this.email);
        alert('Thank you for subscribing!');
        this.email = ''; // Очищаем поле после отправки
      }
    },
  },
};
</script>

<style scoped>
.container-fluid.bg-secondary {
  background-color: #6c757d;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
}

.input-group .form-control {
  border: 2px solid #fff;
}

.input-group-append .btn {
  padding: 10px 20px;
  font-size: 1.2rem;
}
</style>
