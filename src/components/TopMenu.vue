<template>
  <div class="row bg-secondary py-2 px-xl-5">
    <!-- Левый блок с FAQ, Help и Support -->
    <div class="col-lg-4 d-none d-lg-block">
      <div class="d-inline-flex align-items-center">
        <a class="text-dark" href="">FAQs</a>
        <span class="text-muted px-2">|</span>
        <a class="text-dark" href="">Help</a>
        <span class="text-muted px-2">|</span>
        <a class="text-dark" href="">Support</a>
      </div>
    </div>
    <!-- Социальные ссылки -->
    <div class="col-lg-4 text-center text-lg-right">
      <div class="d-inline-flex align-items-center">
        <a class="text-dark px-2" href=""><i class="fab fa-facebook-f"></i></a>
        <a class="text-dark px-2" href=""><i class="fab fa-twitter"></i></a>
        <a class="text-dark px-2" href=""><i class="fab fa-linkedin-in"></i></a>
        <a class="text-dark px-2" href=""><i class="fab fa-instagram"></i></a>
        <a class="text-dark pl-2" href=""><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
import ResetDataTool from './ResetDataTool.vue';

export default {
  name: 'TopMenu',
  props: {
    showResetButton: {
      type: Boolean,
      default: true // Кнопка показывается по умолчанию
    }
  },
  components: {
    ResetDataTool
  }
};
</script>

<style scoped>

</style>
