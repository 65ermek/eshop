<template>
  <div>
    <!-- Поле для поиска улиц -->
    <input
        type="text"
        v-model="streetInput"
        ref="searchInput"
        class="form-control"
        placeholder="Введите вашу улицу и номер дома"
        @input="onStreetOrHouseInput"
        @keydown.up.prevent="moveUp"
        @keydown.down.prevent="moveDown"
        @keydown.enter.prevent="selectActiveItem"
        autocomplete="off"
    />

    <!-- Список предложений улиц -->
    <ul v-if="streetSuggestions.length && !isSelectingPlace" class="suggestions-list">
      <li
          v-for="(suggestion, index) in streetSuggestions"
          :key="index"
          :ref="'street-suggestion-' + index"
          @click="selectAddress(suggestion)"
          :class="{ 'active-suggestion': index === activeSuggestionIndex }"
      >
        {{ suggestion }}
      </li>
    </ul>

    <!-- Список предложений домов -->
    <div class="form-group" v-if="places.length && isSelectingPlace">
      <ul class="suggestions-list">
        <li
            v-for="(place, index) in places"
            :key="index"
            :ref="'place-suggestion-' + index"
            @click="selectPlace(place)"
            :class="{ 'active-suggestion': index === activePlaceIndex }"
        >
          {{ place.fullAddress }} (Индекс: {{ place.placeZip }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String, // Свойство для двухстороннего биндинга (v-model)
  },
  data() {
    return {
      streetInput: this.value || "", // Двусторонняя привязка через v-model
      allStreets: [],
      streetSuggestions: [],
      places: [],
      selectedStreet: null,
      activeSuggestionIndex: -1,
      activePlaceIndex: -1,
      isSelectingPlace: false,
      isFetching: false, // Флаг для предотвращения зацикливания
    };
  },
  watch: {
    // Обновляем поле ввода при изменении внешнего значения
    value(newVal) {
      this.streetInput = newVal;
    }
  },
  methods: {
    transliterate(text) {
      if (!text || typeof text !== 'string') return '';
      const transliterationMap = {
        'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n',
        'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
        'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I', 'Ň': 'N',
        'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U', 'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
      };
      return text.replace(/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/g, match => transliterationMap[match] || match);
    },

    async onStreetOrHouseInput() {
      const input = this.streetInput.trim();
      if (!this.selectedStreet) {
        this.filterStreetSuggestions(input);
        this.isSelectingPlace = false;
      } else {
        const parts = input.split(" ");
        const houseInput = parts[parts.length - 1];
        if (houseInput.length > 0) {
          this.fetchPlacesForHouse(this.selectedStreet, houseInput);
          this.isSelectingPlace = true;
        }
      }
    },

    filterStreetSuggestions(streetInput) {
      const transliteratedInput = this.transliterate(streetInput.toLowerCase());
      console.log("Ввод для фильтрации:", transliteratedInput);

      if (this.allStreets && Array.isArray(this.allStreets) && this.allStreets.length > 0) {
        this.streetSuggestions = this.allStreets.filter(street => {
          if (!street || typeof street !== 'string') return false;
          const normalizedStreet = this.transliterate(street.toLowerCase());
          console.log(`Сравнение улицы: ${normalizedStreet} с вводом: ${transliteratedInput}`);

          return normalizedStreet.includes(transliteratedInput) || street.toLowerCase().includes(streetInput.toLowerCase());
        });
        console.log("Найденные предложения улиц:", this.streetSuggestions);
        this.activeSuggestionIndex = -1;
      } else {
        this.streetSuggestions = [];
      }
    },

    selectAddress(suggestion) {
      this.streetInput = suggestion;
      this.selectedStreet = suggestion;
      this.streetSuggestions = [];
      this.isSelectingPlace = true;
      this.fetchPlacesForHouse(suggestion, "");
    },

    async selectPlace(place) {
      const houseNumber = place.co ? `${place.cp}/${place.co}` : place.cp;
      const fullAddress = `${this.selectedStreet} ${houseNumber}`;
      console.log('Выбран дом при нажатии Enter:', fullAddress);

      this.streetInput = fullAddress;
      this.$emit('input', this.streetInput);

      try {
        await this.fetchAddressDetails(this.selectedStreet, place.cp, place.placeZip, place.municipalityName);
      } catch (error) {
        console.error("Ошибка при запросе города и района:", error);
      }

      this.places = [];
      this.isSelectingPlace = false;

      // Ставим фокус обратно на поле ввода
      this.$refs.searchInput.focus();
    },

    moveUp() {
      if (this.isSelectingPlace && this.activePlaceIndex > 0) {
        this.activePlaceIndex--;
        this.scrollToActivePlace();
      } else if (!this.isSelectingPlace && this.activeSuggestionIndex > 0) {
        this.activeSuggestionIndex--;
        this.scrollToActiveSuggestion();
      }
    },

    moveDown() {
      if (this.isSelectingPlace && this.activePlaceIndex < this.places.length - 1) {
        this.activePlaceIndex++;
        this.scrollToActivePlace();
      } else if (!this.isSelectingPlace && this.activeSuggestionIndex < this.streetSuggestions.length - 1) {
        this.activeSuggestionIndex++;
        this.scrollToActiveSuggestion();
      }
    },

    scrollToActiveSuggestion() {
      const activeElement = this.$refs[`street-suggestion-${this.activeSuggestionIndex}`];
      if (activeElement && activeElement instanceof HTMLElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (Array.isArray(activeElement)) {
        activeElement[0]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    },

    scrollToActivePlace() {
      const activeElement = this.$refs[`place-suggestion-${this.activePlaceIndex}`];
      if (activeElement && activeElement instanceof HTMLElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (Array.isArray(activeElement)) {
        activeElement[0]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    },

    selectActiveItem() {
      if (this.isSelectingPlace) {
        console.log('Нажата клавиша Enter для выбора дома');
        this.selectActivePlace();
      } else {
        this.selectActiveSuggestion();
      }
    },

    selectActiveSuggestion() {
      if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.streetSuggestions.length) {
        this.selectAddress(this.streetSuggestions[this.activeSuggestionIndex]);
      }
    },

    selectActivePlace() {
      if (this.activePlaceIndex >= 0 && this.activePlaceIndex < this.places.length) {
        this.selectPlace(this.places[this.activePlaceIndex]);
      }
    },

    async fetchStreets(municipalityId = null) {
      if (!municipalityId) {
        console.error("municipalityId не передан, невозможно выполнить запрос.");
        return;
      }

      try {
        const apiKey = 'e7ca44b16ff553b5b8bd4a632969b31d41240681e5df0ab14e68e1855be45cae';
        const url = `https://ruian.fnx.io/api/v1/ruian/build/streets?apiKey=${apiKey}&municipalityId=${municipalityId}`;

        console.log("Сформированный запрос для улиц:", url);

        const response = await fetch(url);
        const data = await response.json();
        console.log("Полный ответ от API для улиц:", data);

        if (data && data.data) {
          this.allStreets = data.data.map(street => street.streetName);
          console.log("Загруженные улицы:", this.allStreets);
        } else {
          console.error("Ошибка в данных API:", data.message);
        }
      } catch (error) {
        console.error("Ошибка при запросе к API:", error);
      }
    },

    async fetchPlacesForHouse(streetName, houseNumber) {
      try {
        const apiKey = 'e7ca44b16ff553b5b8bd4a632969b31d41240681e5df0ab14e68e1855be45cae';

        const response = await fetch(
            `https://ruian.fnx.io/api/v1/ruian/build/places?apiKey=${apiKey}&streetName=${encodeURIComponent(streetName)}`
        );

        const data = await response.json();
        if (data && data.data) {
          this.places = data.data.map(place => ({
            ...place,
            fullAddress: `${streetName} ${place.placeCp}/${place.placeCo}`
          }));
          this.activePlaceIndex = -1;
        } else {
          console.error("Ошибка в данных API:", data.message);
        }
      } catch (error) {
        console.error("Ошибка при запросе домов:", error);
      }
    },

    async fetchAddressDetails(street, cp, zip, municipalityName) {
      if (this.isFetching) return;

      try {
        this.isFetching = true;
        const apiKey = 'e7ca44b16ff553b5b8bd4a632969b31d41240681e5df0ab14e68e1855be45cae';

        const url = `https://ruian.fnx.io/api/v1/ruian/validate?apiKey=${apiKey}&municipalityName=${municipalityName}&zip=${zip}&cp=${cp}&street=${encodeURIComponent(street)}`;

        console.log("Сформированный запрос:", url);

        const response = await fetch(url);
        const data = await response.json();
        console.log("Ответ от API для validate:", data);

        if (data.status === "POSSIBLE" && data.place) {
          const place = data.place;
          const houseNumber = place.co ? `${place.cp}/${place.co}` : place.cp;
          const fullAddress = `${place.streetName} ${houseNumber}`;

          this.$emit('selected-address', {
            street: place.streetName,
            houseNumber: houseNumber,
            postalCode: place.zip,
            city: place.municipalityName,
            partCity: place.municipalityPartName || "",
            fullAddress: fullAddress
          });

          console.log("Полный адрес:", fullAddress);
        } else {
          console.error("Ошибка в данных API или адрес не найден:", data.message);
        }

      } catch (error) {
        console.error("Ошибка при запросе данных для validate:", error);
      } finally {
        this.isFetching = false;
      }
    }
  },

  mounted() {
    this.fetchStreets();
  }
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
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.active-suggestion {
  background-color: #f0f0f0;
}
</style>
