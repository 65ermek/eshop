<template>
  <div class="container-fluid">
    <div class="category-carousel">
      <div ref="carousel" class="owl-carousel owl-theme">
        <div v-for="(category, index) in categories" :key="index" class="item border">
          <a :href="`/category/${category.slug}`" class="nav-link">
            <img
                :src="`https://shop.avanpost.online/storage/${category.image}`"
                alt="Category Image"
                @load="onImageLoad"
            />
            <h5>{{ category.name }}</h5>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      imagesLoaded: 0,
    };
  },
  computed: {
    ...mapGetters('categories', ['allCategories']),
    categories() {
      return this.allCategories;
    },
  },
  async created() {
    if (!this.$store.state.categories.isLoaded) {
      await this.$store.dispatch('categories/loadCategories');
    }
  },
  methods: {
    onImageLoad() {
      this.imagesLoaded++;
      this.checkAndInitializeCarousel();
    },
    checkAndInitializeCarousel() {
      if (this.imagesLoaded === this.categories.length) {
        this.$nextTick(() => {
          if (this.$refs.carousel && typeof $.fn.owlCarousel === 'function') {
            $(this.$refs.carousel).trigger('destroy.owl.carousel'); // Очищаем карусель перед повторной инициализацией
            this.initializeCarousel();
          }
        });
      }
    },
    initializeCarousel() {
      $(this.$refs.carousel).owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        navText: [
          '<div class="btn btn-dark carousel-prev" style="position: absolute; top: 50%; left: 30px; transform: translateY(-50%); width: 45px; height: 45px; display: flex; justify-content: center; align-items: center"><i class="fas fa-chevron-left" style="font-size: 24px; color: white;"></i></div>',
          '<div class="btn btn-dark carousel-next" style="position: absolute; top: 50%; right: 30px; transform: translateY(-50%); width: 45px; height: 45px; display: flex; justify-content: center; align-items: center"><i class="fas fa-chevron-right" style="font-size: 24px; color: white;"></i></div>'
        ],
        responsive: {
          0: {items: 1},
          400: {items: 2},
          600: {items: 3},
          850: {items: 4},
          1000: {items: 5}
        },
      });
    },
  },
};
</script>
