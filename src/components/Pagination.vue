<template>
  <div class="d-flex justify-content-center mt-4">
    <nav>
      <ul class="pagination">
        <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            @click="selectPage(page)"
            :class="{ active: currentPage === page }"
        >
          <a class="page-link">{{ page }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: Number,
    currentPage: Number
  },
  methods: {
    selectPage(page) {
      this.$emit('changePage', page);
    }
  }
};
</script>

<style scoped>
.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}
</style>
