<template>
  <div class="container-fluid slider-container" v-if="product">
    <div class="row">
      <div class="col-md-6">
        <!-- Главный карусель продукта -->
        <div id="product-carousel" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <!-- Главное изображение -->
            <div class="carousel-item active">
              <img
                  :src="`https://shop.avanpost.online/storage/${product.main_image}`"
                  class="d-block w-100"
                  alt="Main Product Image"
              />
            </div>
            <!-- Остальные изображения -->
            <div
                v-for="(image, index) in product.carousel_images"
                :key="index"
                class="carousel-item"
            >
              <img
                  :src="`https://shop.avanpost.online/storage/${image}`"
                  class="d-block w-100"
                  alt="Product Image"
              />
            </div>
          </div>
          <a class="carousel-control-prev" href="#product-carousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#product-carousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>

        <!-- Карусель миниатюр -->
        <div id="thumbnail-carousel" class="carousel slide mt-3 thumbnail-carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div class="d-flex justify-content-center">
                <!-- Главное изображение как миниатюра -->
                <img
                    :src="`https://shop.avanpost.online/storage/${product.main_image}`"
                    class="d-block mr-3 thumbnail"
                    alt="Main Thumbnail"
                    @click="setActiveSlide(0)"
                />
                <!-- Остальные изображения как миниатюры -->
                <img
                    v-for="(image, index) in product.carousel_images"
                    :key="index"
                    :src="`https://shop.avanpost.online/storage/${image}`"
                    class="d-block mr-3 thumbnail"
                    alt="Thumbnail"
                    @click="setActiveSlide(index + 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Детали продукта -->
      <div class="col-md-6">
        <h3 class="font-weight-semi-bold">{{ product.name }}</h3>
        <div class="d-flex mb-3">
          <div class="text-primary mr-2">
            <small class="fas fa-star"></small>
            <small class="fas fa-star"></small>
            <small class="fas fa-star"></small>
            <small class="fas fa-star-half-alt"></small>
            <small class="far fa-star"></small>
          </div>
          <small class="pt-1">(50 recenzí)</small>
        </div>
        <h3 class="font-weight-semi-bold mb-4">{{ formatPrice(product.new_price) }} Kč</h3>
        <p class="mb-4 product-description">
          {{ shortDescription }}
          <span v-if="!showFullDescription">...</span>
          <a v-if="!showFullDescription" href="#" @click.prevent="toggleDescription">Zobrazit více</a>
        </p>
        <p v-if="showFullDescription" class="mb-4">
          {{ product.description }}
          <a href="#" @click.prevent="toggleDescription">Skrýt</a>
        </p>
        <!-- Добавление блока для уникального кода -->
        <p class="mb-4">
          <strong>Objednací kód:</strong> {{ product.unique_code || 'N/A' }}
        </p>
        <!-- Количество товара и кнопка для добавления в корзину -->
        <div class="d-flex align-items-center mb-4 pt-2">
          <!-- Группа управления количеством товара -->
          <div class="input-group quantity mr-3" style="width: 120px;">
            <!-- Кнопка уменьшения -->
            <div class="input-group-prepend">
              <button class="btn btn-primary btn-minus btn-sm" @click="updateQuantity(-1)">
                <i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- Поле отображения количества товара -->
            <input
                type="text"
                class="form-control text-center"
                style="height: 30px;"
                :value="quantity"
                readonly
            />
            <!-- Кнопка увеличения -->
            <div class="input-group-append">
              <button class="btn btn-primary btn-plus btn-sm" @click="updateQuantity(1)">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Кнопка добавления в корзину -->
          <button
              :class="['btn', isInCart ? 'btn-success' : 'btn-primary']"
              @click="addToCart"
              :disabled="isInCart"
              style="min-width: 150px;"
          >
          {{ isInCart ? 'Přidáno do košíku' : 'Přidat do košíku' }}
          </button>
        </div>


        <!-- Социальные ссылки -->
        <div class="d-flex pt-2">
          <p class="text-dark font-weight-medium mb-0 mr-2">Sdílet na:</p>
          <div class="d-inline-flex">
            <a class="text-dark px-2" href="#">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a class="text-dark px-2" href="#">
              <i class="fab fa-twitter"></i>
            </a>
            <a class="text-dark px-2" href="#">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a class="text-dark px-2" href="#">
              <i class="fab fa-pinterest"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Вкладки с дополнительной информацией -->
    <div class="row px-xl-5 mt-5">
      <div class="col">
        <div class="nav nav-tabs justify-content-center border-secondary mb-4">
          <a class="nav-item nav-link active" data-toggle="tab" href="#tab-pane-1">Popis</a>
          <a class="nav-item nav-link" data-toggle="tab" href="#tab-pane-2">Informace</a>
          <a class="nav-item nav-link" data-toggle="tab" href="#tab-pane-3">Recenze (0)</a>
        </div>
        <div class="tab-content">
          <!-- Описание продукта -->
          <div class="tab-pane fade show active" id="tab-pane-1">
            <h4 class="mb-3">Popis produktu</h4>
            <p>{{ product.description }}</p>
          </div>
          <!-- Дополнительная информация -->
          <div class="tab-pane fade" id="tab-pane-2">
            <h4 class="mb-3">Dodatečné informace</h4>
            <ul class="list-group list-group-flush">
              <li class="list-group-item px-0">Kód produktu: {{ product.unique_code }}</li>
              <li class="list-group-item px-0">Kategorie: {{ product.category.name }}</li>
              <li class="list-group-item px-0">Skladem: {{ product.stock_quantity }}</li>
            </ul>
          </div>
          <!-- Отзывы -->
          <div class="tab-pane fade" id="tab-pane-3">
            <div class="row">
              <div class="col-md-6">
                <h4 class="mb-4">Recenze</h4>
                <p>Zatím nejsou žádné recenze.</p>
              </div>
              <div class="col-md-6">
                <h4 class="mb-4">Zanechte recenzi</h4>
                <small>Vaše e-mailová adresa nebude zveřejněna. Povinná поля обозначены *</small>
                <div class="d-flex my-3">
                  <p class="mb-0 mr-2">Vaše hodnocení * :</p>
                  <div class="text-primary">
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                  </div>
                </div>
                <form>
                  <div class="form-group">
                    <label for="message">Vaše recenze *</label>
                    <textarea id="message" cols="30" rows="5" class="form-control"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="name">Vaše jméno *</label>
                    <input type="text" class="form-control" id="name" />
                  </div>
                  <div class="form-group">
                    <label for="email">Váš e-mail *</label>
                    <input type="email" class="form-control" id="email" />
                  </div>
                  <div class="form-group mb-0">
                    <input type="submit" value="Zanechat recenzi" class="btn btn-primary px-3" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Сообщение об ошибке -->
  <div v-else>
    <p>Produkt nenalezen.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    slug: {
      type: String,
      required: true // Если slug обязателен, оставьте true
    },
    product: {
      type: Object,
      required: true // Если продукт обязателен, оставьте true
    }
  },
  data() {
    return {
      product: null,
      quantity: 1,
      errorMessage: "",
      showFullDescription: false, // Управляет отображением полного описания
    };
  },
  computed: {
    shortDescription() {
      return this.product && this.product.description
          ? this.product.description.slice(0, 100)
          : "";
    },
    // Проверяем, есть ли этот продукт в корзине
    isInCart() {
      return this.$store.getters['cart/isProductInCart'](this.product.id);
    },
  },
  async mounted() {
    await this.fetchProductBySlug();
  },
  methods: {
    async fetchProductBySlug() {
      try {
        // Используем slug для получения данных о продукте
        const response = await axios.get(
            `https://shop.avanpost.online/api/product/${this.slug}`
        );
        this.product = response.data;
      } catch (error) {
        this.errorMessage = "Produkt nenalezen";
        console.error(error);
      }
    },
    updateQuantity(amount) {
      if (this.quantity + amount >= 1) {
        this.quantity += amount;
      }
    },
    addToCart() {
      if (this.isInCart) return;

      const productToAdd = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.new_price,
        qty: this.quantity,
        main_image: this.product.main_image,
        unique_code: this.product.unique_code
      };
      this.$store.dispatch('cart/addToCart', productToAdd);
    },
    toggleDescription() {
      this.showFullDescription = !this.showFullDescription;
    },
    setActiveSlide(index) {
      const carousel = document.getElementById("product-carousel");
      $(carousel).carousel(index); // Используем jQuery для управления каруселью
    },
    // Метод для форматирования цены
    formatPrice(price) {
      return Math.round(price).toLocaleString("cs-CZ", {
        minimumFractionDigits: 0,
      });
    },
  },
};
</script>

<style scoped>
.btn {
  height: 30px; /* Задаем высоту кнопки для выравнивания */
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-success {
  background-color: #28a745; /* Цвет кнопки при добавлении */
  color: white;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
.slider-container {
  max-width: 900px;
  margin: 0 auto;
}
.input-group {
  max-width: 120px; /* Устанавливаем ширину для группы ввода */
}
.input-group-btn .btn {
  height: 30px;
}

.input-group .form-control {
  height: 30px;
}

/* Обрезка текста с троеточием */
.product-description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Стили для миниатюр */
.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  margin-right: 10px;
}
</style>
