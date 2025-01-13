<template>
  <div class="container-fluid bg-secondary text-dark mt-5 pt-5">
    <div class="row px-xl-5 pt-5">
      <!-- Логотип и контактная информация -->
      <div class="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
        <a href="/" class="text-decoration-none">
          <h1 class="mb-4 display-5 font-weight-semi-bold">
            <span class="text-primary font-weight-bold border border-white px-3 mr-1">E</span>VelkoObchodProfi
          </h1>
        </a>
        <p>Zajišťujeme vaši pohodu a komfort – nakupujte u nás.<br> Náš tým TANATAR je tu pro vás!</p>
        <p class="mb-2">
          <i class="fa fa-map-marker-alt text-primary mr-3"></i>NewIdea spol. s r.o. U Záběhlického zámku 48/13 106 00 Praha 10
        </p>
        <p class="mb-0">
          <i class="fa fa-phone-alt text-primary mr-3"></i>+420 732 199 285
        </p>
        <p class="mb-2">
          <i class="fa fa-envelope text-primary mr-3"></i>tanatar.sro@seznam.cz
        </p>
      </div>

      <!-- Полезные ссылки -->
      <div class="col-lg-8 col-md-12">
        <div class="row">
          <!-- Блок "Уžitečné odkazy" -->
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">Užitečné odkazy</h5>
            <div class="d-flex flex-column justify-content-start">
              <a href="#" class="text-dark mb-2"><i class="fa fa-angle-right mr-2"></i>Aktuality</a>
              <a href="#" class="text-dark mb-2"><i class="fa fa-angle-right mr-2"></i>Kontakty</a>
              <a href="#" class="text-dark mb-2"><i class="fa fa-angle-right mr-2"></i>Obchodní podmínky</a>
            </div>
          </div>

          <!-- Блок "Doprava a platba" -->
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">Doprava a platba</h5>
            <div class="d-flex flex-column justify-content-start">
              <a href="#" class="text-dark mb-2"><i class="fa fa-angle-right mr-2"></i>Doprava a platba</a>
              <a href="#" class="text-dark mb-2"><i class="fa fa-angle-right mr-2"></i>Ochrana osobních údajů GDPR</a>
              <a href="#" class="text-dark mb-2"><i class="fa fa-angle-right mr-2"></i>Reklamace a vrácení zboží</a>
            </div>
          </div>

          <!-- Блок подписки -->
          <div class="col-md-4 mb-5">
            <h5 class="font-weight-bold text-dark mb-4">Novinky na email</h5>
            <form action="">
              <div class="form-group">
                <input type="text" name="your-name" placeholder="Vaše Jméno" required="required" class="form-control border-0 py-4">
              </div>
              <div class="form-group">
                <input type="email" autocomplete="new-mail" name="email" placeholder="Váš e-mail" required="required" class="form-control border-0 py-4">
              </div>
              <div>
                <button type="submit" class="btn btn-primary btn-block border-0 py-3">Odebírat</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Подвал -->
    <div class="row border-top border-light mx-xl-5 py-4">
      <div class="col-md-6 px-xl-0">
        <p class="mb-md-0 text-center text-md-left text-dark">
          © <a href="https://tanatar.cz" class="text-dark font-weight-semi-bold">NewIdea spol. s r.o.</a>. Všechna práva vyhrazena.
          <a href="https://htmlcodex.com" class="text-dark font-weight-semi-bold"> Nastavení cookies</a>
        </p>
      </div>
      <div class="col-md-6 px-xl-0 text-center text-md-right">
        <img src="/public/img/payments.png" alt="Payments" class="img-fluid">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterComponent'
};
</script>

<style scoped>
.container-fluid {
  background-color: #6c757d;
}

.font-weight-semi-bold {
  font-weight: 600;
}

h1 {
  font-size: 2.5rem;
}

p {
  font-size: 1rem;
}

a {
  color: #343a40;
}

a:hover {
  color: #007bff;
}

.fa {
  margin-right: 10px;
}
</style>
