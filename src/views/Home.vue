<template>
  <div>
    <FeaturesBlock />
    <CategoryCarousel />
    <Offer />
    <ProductCarousel />
    <SubscribeComponent />
    <DiscountCarousel />

  </div>
</template>

<script>
import FeaturesBlock from "./FeaturesBlock.vue";
import CategoryCarousel from "./CategoryCarousel.vue";
import Offer from "./Offer.vue";
import ProductCarousel from "./ProductsCarousel.vue";
import SubscribeComponent from "./SubscribeComponent.vue";
import DiscountCarousel from "./DiscountCarousel.vue";


export default {
  name: 'Domů',
  components: {
    DiscountCarousel, SubscribeComponent, ProductCarousel, Offer, CategoryCarousel, FeaturesBlock},
};
</script>

<style scoped>

</style>
