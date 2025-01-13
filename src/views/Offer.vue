<template>
  <div class="container-fluid offer pt-5">
    <div class="row px-xl-5">
      <div class="col-md-6 pb-4">
        <div class="position-relative bg-secondary text-center text-md-right text-white mb-2 py-5 px-5">
          <img src="/public/img/offer-1.png" alt="Offer 1" />
          <div class="position-relative" style="z-index: 1;">
            <h5 class="text-uppercase text-primary mb-3">20% off the all order</h5>
            <h1 class="mb-4 font-weight-semi-bold">Spring Collection</h1>
            <a href="#" class="btn btn-outline-primary py-md-2 px-md-3">Shop Now</a>
          </div>
        </div>
      </div>
      <div class="col-md-6 pb-4">
        <div class="position-relative bg-secondary text-center text-md-left text-white mb-2 py-5 px-5">
          <img src="/public/img/offer-2.png" alt="Offer 2" />
          <div class="position-relative" style="z-index: 1;">
            <h5 class="text-uppercase text-primary mb-3">20% off the all order</h5>
            <h1 class="mb-4 font-weight-semi-bold">Winter Collection</h1>
            <a href="#" class="btn btn-outline-primary py-md-2 px-md-3">Shop Now</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Offer',
};
</script>

<style scoped>
.offer {
  background-color: #f8f9fa;
}



h5.text-uppercase {
  font-size: 16px;
}

h1.font-weight-semi-bold {
  font-size: 36px;
}

a.btn-outline-primary {
  border: 2px solid #007bff;
  color: #007bff;
}

a.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}
</style>
