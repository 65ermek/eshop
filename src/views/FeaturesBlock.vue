<template>
  <div class="container-fluid pt-5">
    <div class="row px-xl-5 pb-3">
      <div class="col-lg-3 col-md-6 col-sm-12 pb-1" v-for="(feature, index) in features" :key="index">
        <div class="d-flex align-items-center border mb-4" style="padding: 30px;">
          <h1 :class="feature.iconClass + ' text-primary icon'"></h1>
          <h5 class="font-weight-semi-bold text ml-3">{{ feature.text }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeaturesBlock",
  data() {
    return {
      features: [
        { iconClass: 'fa fa-check', text: 'Kvalitní produkt' },
        { iconClass: 'fa fa-shipping-fast', text: 'Doprava zdarma od 3.000 Kč' },
        { iconClass: 'fas fa-user', text: 'Osobní přístup' },
        { iconClass: 'fa fa-phone-volume', text: 'Odborné poradenství' }
      ]
    };
  }
};
</script>

<style scoped>
.icon {
  font-size: 2rem;
}
</style>
