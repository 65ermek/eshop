<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb" style="height: 65px; margin-top: -1px; padding: 0 30px;">
      <!-- Динамические хлебные крошки -->
      <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
          aria-current="page"
      >
        <router-link
            v-if="index !== breadcrumbs.length - 1"
            :to="breadcrumb.link"
        >
          {{ breadcrumb.name }}
        </router-link>
        <span v-else>{{ breadcrumb.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: false, // Может не быть продукта, если не на странице продукта
    },
  },
  computed: {
    breadcrumbs() {
      const crumbs = [
        { name: 'Domů', link: '/' }, // Главная страница
      ];

      if (this.product) {
        // Если есть категория продукта, добавляем её
        if (this.product.category) {
          crumbs.push({
            name: this.product.category.name,
            link: `/category/${this.product.category.slug}`,
          });
        }

        // Добавляем текущее название продукта
        crumbs.push({
          name: this.product.name,
          link: `/product/${this.product.id}`, // или slug, если используете его
        });
      }

      return crumbs;
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  background: transparent;
  padding: 8px 0;
}

.breadcrumb-item.active {
  color: #6c757d;
  pointer-events: none;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}
</style>
