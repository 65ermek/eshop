<template>
  <div>
    <!-- Список предложений улиц -->
    <ul v-if="filteredSuggestions.length && !addressSelected" class="suggestions-list">
      <li
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          :class="{ 'active-suggestion': index === activeSuggestionIndex }"
          @click="selectAddress(suggestion)"
      >
        {{ suggestion.streetName || 'Без названия' }} (Дом: {{ suggestion.cp || 'Не указано' }})
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    streetInput: String,
  },
  data() {
    return {
      suggestions: [],
      activeSuggestionIndex: -1,
      municipalityId: '554782', // Пример муниципалитета, например, для Праги
      addressSelected: false, // Флаг, который покажет, что адрес выбран
    };
  },
  watch: {
    streetInput(newValue) {
      if (!this.addressSelected) {
        // Автоматический запуск поиска при изменении ввода
        this.searchStreet(newValue);
      } else {
        // Сбросить флаг после изменения инпута, когда адрес был выбран
        this.addressSelected = false;
      }
    }
  },
  computed: {
    filteredSuggestions() {
      return this.suggestions.filter(
          (suggestion) =>
              suggestion.streetName &&
              suggestion.streetName.toLowerCase().includes(this.streetInput.toLowerCase())
      );
    }
  },
  methods: {
    async searchStreet() {
      try {
        if (this.streetInput.length < 3) {
          this.suggestions = [];
          return;
        }

        console.log('Поиск улиц по запросу:', this.streetInput);

        const response = await axios.get('https://ruian.fnx.io/api/v1/ruian/build/streets', {
          params: {
            apiKey: 'e7ca44b16ff553b5b8bd4a632969b31d41240681e5df0ab14e68e1855be45cae',
            streetName: this.streetInput,
            municipalityId: this.municipalityId,
          },
        });

        if (response.data && response.data.data) {
          this.suggestions = response.data.data;
          console.log('Получены улицы:', this.suggestions);
        }
      } catch (error) {
        console.error('Ошибка при поиске улиц:', error);
      }
    },

    moveDown() {
      if (this.activeSuggestionIndex < this.filteredSuggestions.length - 1) {
        this.activeSuggestionIndex++;
        console.log('Текущий индекс подсказки:', this.activeSuggestionIndex);
      }
    },

    moveUp() {
      if (this.activeSuggestionIndex > 0) {
        this.activeSuggestionIndex--;
        console.log('Текущий индекс подсказки:', this.activeSuggestionIndex);
      }
    },

    selectActiveSuggestion() {
      if (this.activeSuggestionIndex !== -1) {
        this.selectAddress(this.filteredSuggestions[this.activeSuggestionIndex]);
      }
    },

    selectAddress(address) {
      const selectedStreet = address.streetName || 'Не указано';
      const selectedPostalCode = address.placeZip || 'Не указано';
      const selectedHouseNumber = address.cp || 'Не указано';
      const selectedCity = address.municipalityName || 'Не указано';
      const selectedPartCity = address.municipalityPartName || 'Не указано';

      this.$emit('selected-address', {
        streetName: selectedStreet,
        postalCode: selectedPostalCode,
        houseNumber: selectedHouseNumber,
        city: selectedCity,
        partCity: selectedPartCity,
      });

      // После выбора адреса очищаем список предложений и устанавливаем флаг
      this.suggestions = [];
      this.activeSuggestionIndex = -1;
      this.addressSelected = true; // Устанавливаем флаг, что адрес был выбран
    }
  }
};
</script>

<style>
.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
  border: 1px solid #ddd;
  margin-bottom: 2px;
}

.suggestions-list li:hover,
.active-suggestion {
  background-color: #f0f0f0;
}
</style>
