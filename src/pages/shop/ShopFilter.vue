<template>
  <div class="col-lg-3 col-md-12">
    <!-- Price Filter using noUiSlider -->
    <div class="border-bottom mb-4 pb-4">
      <h5 class="font-weight-semi-bold mb-5">Filter by price</h5>
      <div class="slider-box" style="margin-left: 20px;margin-right: 20px;">
        <div ref="priceRangeSlider" class="slider"></div>
        <div class="output-price mt-3" style="display: flex; align-items: center">
          <label class="font-weight-semi-bold" style="margin: 10px">Price:</label>
          <input
              type="text"
              v-model="priceRangeDisplay"
              readonly
              style="border: none; outline: none"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

export default {
  props: {
    priceRange: Object, // Ожидается объект {min, max}
  },
  data() {
    return {
      priceRangeValues: [this.priceRange.min, this.priceRange.max], // Начальные значения шкалы
      priceRangeDisplay: `${this.priceRange.min} Kč - ${this.priceRange.max} Kč`, // Отображаемый диапазон
    };
  },
  mounted() {
    this.initializeSlider();
  },
  methods: {
    initializeSlider() {
      // Инициализируем noUiSlider для диапазона цен
      noUiSlider.create(this.$refs.priceRangeSlider, {
        start: [this.priceRange.min, this.priceRange.max],
        connect: true,
        range: {
          min: this.priceRange.min,
          max: this.priceRange.max,
        },
        tooltips: [true, true], // Показываем всплывающие подсказки
        format: {
          to: value => Math.round(value),
          from: value => Number(value),
        },
      });

      // Обработка изменения диапазона цен
      this.$refs.priceRangeSlider.noUiSlider.on('update', (values) => {
        this.priceRangeValues = values.map(value => parseFloat(value));
        this.priceRangeDisplay = `${this.priceRangeValues[0]} Kč - ${this.priceRangeValues[1]} Kč`;

        // Применяем фильтры в режиме реального времени
        this.applyPriceFilter();
      });
    },
    applyPriceFilter() {
      // Вызываем событие для передачи родительскому компоненту диапазона цен
      this.$emit('filterPrice', { min: this.priceRangeValues[0], max: this.priceRangeValues[1] });
    },
  },
};
</script>

<style scoped>
/* Стили для noUiSlider */

/* Линия шкалы */
.slider .noUi-target {
  background: #e0e0e0 !important; /* Серый цвет для линии */
  height: 6px !important; /* Высота линии */
  border-radius: 3px !important; /* Закругленные края */
}

/* Соединительная часть (залитая часть шкалы между ползунками) */
.slider .noUi-connect {
  background: #007bff !important; /* Синий цвет для соединительной линии */
  height: 6px !important; /* Совпадающая высота с общей линией */
}

/* Ползунки */
.slider .noUi-handle {
  height: 20px !important;
  width: 20px !important;
  border-radius: 50% !important; /* Делаем ползунки круглыми */
  background-color: #007bff !important; /* Синий цвет ползунков */
  border: 2px solid #ffffff !important; /* Белая граница вокруг ползунков */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important; /* Легкая тень для 3D-эффекта */
}

/* Ползунки при фокусе */
.slider .noUi-handle:focus {
  outline: none !important; /* Убираем стандартную обводку */
  box-shadow: 0 0 15px rgba(0, 123, 255, 0.5) !important; /* Синяя тень при фокусе */
}
</style>
