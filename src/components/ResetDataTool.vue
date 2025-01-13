<template>
  <div>
    <!-- Кнопка сброса данных -->
    <button class="reset-btn" @click="showModal = true">Сбросить все данные</button>

    <!-- Модальное окно для подтверждения -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Подтвердите сброс данных</h3>
        <p>Вы уверены, что хотите сбросить все данные?</p>
        <div class="modal-buttons">
          <button @click="resetAllData" class="btn-confirm">Сбросить все данные</button>
          <button @click="showModal = false" class="btn-cancel">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false // Изначально модальное окно скрыто
    };
  },
  methods: {
    resetAllData() {
      // Очищаем localStorage
      localStorage.clear();
      // Вызываем мутацию Vuex для сброса данных
      this.$store.commit('cart/resetState');

      // Закрываем модальное окно после сброса и показываем уведомление
      console.log("Данные сброшены");
      alert("Все данные успешно сброшены!");
      this.showModal = false;
    }
  }
};
</script>


<style scoped>
/* Стили для кнопки сброса */
.reset-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.reset-btn:hover {
  background-color: #218838;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

/* Стили для кнопок подтверждения и отмены */
.btn-confirm {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm:hover {
  background-color: #c82333;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #5a6268;
}
</style>
