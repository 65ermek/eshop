<template>
  <div class="container py-4">
    <!-- Navigace profilu -->
    <ProfileNav />
    <!-- Upozornění pro uživatele -->
    <div v-if="notificationMessage" class="alert alert-warning">
      {{ notificationMessage }}
    </div>
    <!-- Struktura pro dva bloky -->
    <div class="row">
      <!-- Levý sloupec: Osobní údaje a Fakturační údaje -->
      <div class="col-md-6">
        <!-- Osobní údaje -->
        <div class="personal-info-block">
          <h3>Osobní údaje</h3>

          <!-- E-mail -->
          <div class="form-group">
            <label for="email">Přihlašovací e-mail</label>
            <input type="email" id="email" v-model="profile.email" class="form-control" readonly />
          </div>

          <!-- Telefon -->
          <div class="form-group">
            <label for="phone">Telefon</label>
            <input
                type="text"
                id="phone"
                v-model="profile.phone"
                class="form-control"
                :class="{ 'filled-warning': profile.phone }"
            />
          </div>

          <!-- Кнопка изменения пароля -->
          <button @click="showPasswordModal = true" class="btn btn-warning mb-4" data-toggle="modal" data-target="#passwordModal">Změnit heslo</button>

          <!-- Модальное окно для изменения пароля -->
          <div v-if="showPasswordModal" class="modal fade" id="passwordModal" tabindex="-1" role="dialog" aria-labelledby="passwordModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="passwordModalLabel">Změnit heslo</h5>
                  <button type="button" class="close" @click="closePasswordModal" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label for="currentPassword">Původní heslo</label>
                    <input type="password" v-model="passwords.currentPassword" id="currentPassword" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="newPassword">Nové heslo</label>
                    <input type="password" v-model="passwords.newPassword" id="newPassword" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="confirmPassword">Opakovat heslo</label>
                    <input type="password" v-model="passwords.confirmPassword" id="confirmPassword" class="form-control" />

                    <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
                    <div v-if="successMessage" class="alert alert-success mt-2">{{ successMessage }}</div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closePasswordModal">Zavřít</button>
                  <button type="button" class="btn btn-primary" @click="changePassword">Uložit změny</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fakturační údaje -->
        <div class="billing-info-block mt-4">
          <h3>Fakturační údaje</h3>
          <!-- Поле для ввода IČО и кнопка для поиска через ARES -->
          <div class="form-group">
            <label for="ico" class="text-primary cursor-pointer">
              <i class="fa fa-search mr-2"></i> Nákup na firmu? Vyhledejte podle IČО
            </label>
            <div class="input-group">
              <input
                  type="text"
                  v-model="billingData.ico"
                  id="ico"
                  class="form-control"
                  placeholder="IČО"
                  :class="{ 'filled-warning': billingData.ico }"
              />
              <div class="input-group-append">
                <button class="btn btn-primary" @click="validateIcoAndSearch">Vyhledat</button>
              </div>
            </div>
            <div v-if="icoError" class="text-danger">IČО musí obsahovat přesně 8 číslic.</div>
          </div>

          <!-- DIČ -->
          <div class="form-group">
            <label for="dic">DIČ</label>
            <input
                type="text"
                id="dic"
                v-model="billingData.dic"
                class="form-control"
                placeholder="DIČ"
                :class="{ 'filled-warning': billingData.dic }"
            />
          </div>
          <!-- Jméno a příjmení -->
          <div class="form-group">
            <label for="name">Jméno a příjmení</label>
            <input
                type="text"
                id="name"
                v-model="profile.name"
                class="form-control"
                :class="{ 'filled-warning': profile.name }"
            />
          </div>

          <!-- Název firmy -->
          <div class="form-group">
            <label for="companyName">Název firmy</label>
            <input
                type="text"
                id="companyName"
                v-model="billingData.companyName"
                class="form-control"
                placeholder="Zadejte název firmy"
                :class="{ 'filled-warning': billingData.companyName }"
            />
          </div>

          <!-- Ulice -->
          <div class="form-group">
            <label for="street">Ulice</label>
            <input
                type="text"
                id="street"
                v-model="billingData.street"
                class="form-control"
                placeholder="Zadejte ulici"
                :class="{ 'filled-warning': billingData.street }"
            />
          </div>

          <!-- PSČ -->
          <div class="form-group">
            <label for="postalCode">PSČ</label>
            <input
                type="text"
                id="postalCode"
                v-model="billingData.postalCode"
                class="form-control"
                placeholder="Zadejte poštovní směrovací číslo"
                :class="{ 'filled-warning': billingData.postalCode }"
            />
          </div>

          <!-- Město -->
          <div class="form-group">
            <label for="city">Město</label>
            <input
                type="text"
                id="city"
                v-model="billingData.city"
                class="form-control"
                placeholder="Zadejte město"
                :class="{ 'filled-warning': billingData.city }"
            />
          </div>
          <button @click="updateCustomerAndCompanyData" class="btn btn-primary">Uložit</button>
        </div>
      </div>

      <!-- Pravý sloupec: Dodací údaje -->
      <div class="col-md-6 mt-4 mt-md-0">
        <h3>Dodací údaje</h3>

        <!-- Jméno a příjmení -->
        <div class="form-group">
          <label for="deliveryName">Jméno a příjmení</label>
          <input
              type="text"
              id="deliveryName"
              v-model="deliveryData.name"
              class="form-control"
              placeholder="Zadejte jméno a příjmení"
              :class="{ 'filled-warning': deliveryData.name }"
          />
        </div>

        <!-- Ulice -->
        <div class="form-group">
          <label for="deliveryStreet">Ulice</label>
          <input
              type="text"
              id="deliveryStreet"
              v-model="deliveryData.street"
              class="form-control"
              placeholder="Zadejte ulici"
              :class="{ 'filled-warning': deliveryData.street }"
          />
        </div>

        <!-- PSČ -->
        <div class="form-group">
          <label for="deliveryPostalCode">PSČ</label>
          <input
              type="text"
              id="deliveryPostalCode"
              v-model="deliveryData.postalCode"
              class="form-control"
              placeholder="Zadejte poštovní směrovací číslo"
              :class="{ 'filled-warning': deliveryData.postalCode }"
          />
        </div>

        <!-- Město -->
        <div class="form-group">
          <label for="deliveryCity">Město</label>
          <input
              type="text"
              id="deliveryCity"
              v-model="deliveryData.city"
              class="form-control"
              placeholder="Zadejte město"
              :class="{ 'filled-warning': deliveryData.city }"
          />
        </div>

        <!-- Kontaktní telefon pro doručení -->
        <div class="form-group">
          <label for="deliveryPhone">Kontaktní telefon pro doručení</label>
          <input
              type="text"
              id="deliveryPhone"
              v-model="deliveryData.contact_phone"
          class="form-control"
          placeholder="Zadejte kontaktní telefon"
          :class="{ 'filled-warning': deliveryData.contact_phone }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileNav from './ProfileNav.vue'; // Importování komponenty navigace
import axios from 'axios'; // Používáme axios pro práci s API

export default {
  components: {
    ProfileNav,
  },
  data() {
    return {
      profile: {
        email: '',
        phone: '',
        name: '',
      },
      billingData: {
        ico: '',
        dic: '',
        companyName: '',
        street: '', // Ulice
        postalCode: '', // PSČ
        city: '', // Město
      },
      deliveryData: { // Dodací údaje
        name: '',
        street: '',
        postalCode: '',
        city: '',
        contact_phone: '',
      },
      icoError: false, // Флаг ошибки при запросе IČO
      notificationMessage: '', // Zpráva pro uživatele
      showPasswordModal: false,
      passwords: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      errorMessage: '',
      successMessage: ''
    };
  },
  mounted() {
    this.loadProfile();
    this.setProfileData();
    this.loadAddresses();
    this.loadCompanyData();
    this.loadAltAddresses();
    this.updateCustomerAndCompanyData();
  },
  methods: {
    validateIcoAndSearch() {
      // Проверка на то, что IČO содержит ровно 8 цифр
      const ico = this.billingData.ico.trim();
      const isValidIco = /^\d{8}$/.test(ico); // Регулярное выражение для проверки, что это 8 цифр

      if (!isValidIco) {
        this.icoError = true; // Показываем сообщение об ошибке
        return;
      }

      this.icoError = false; // Сбрасываем ошибку, если все хорошо

      // Выполняем поиск по IČO только если валидация прошла успешно
      this.searchByIco();
    },
    async loadProfile() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`https://shop.avanpost.online/api/customers/profile`, {
          params: { api_token: token }
        });

        // Логируем ответ от сервера
        console.log('Ответ от сервера профиля:', response.data);

        // Обрабатываем полученные данные профиля
        this.profile.email = response.data.email || 'Email не указан';
        this.profile.name = response.data.name || 'Имя не указано';
        this.profile.phone = response.data.phone || 'Vyplňte prosím pole pro kontakt';

        // Проверяем наличие адресов
        if (response.data.addresses && response.data.addresses.length > 0) {
          this.billingData.street = response.data.addresses[0].address_line_1 || ''; // Обратите внимание на название поля
          this.billingData.city = response.data.addresses[0].city || '';
          this.billingData.postalCode = response.data.addresses[0].postal_code || ''; // Обратите внимание на название поля
        } else {
          console.log('Адреса отсутствуют.');
        }

        // Обрабатываем данные компании
        if (response.data.company) {
          this.billingData.companyName = response.data.company.company_name || '';
          this.billingData.ico = response.data.company.ico_number || '';
          this.billingData.dic = response.data.company.dic_number || '';
        } else {
          console.log('Данные компании отсутствуют.');
        }

        // Проверяем наличие альтернативных адресов
        if (response.data.altAddresses && response.data.altAddresses.length > 0) {
          const altAddress = response.data.altAddresses[0];
          this.deliveryData.name = altAddress.name || '';
          this.deliveryData.street = altAddress.street || '';
          this.deliveryData.city = altAddress.city || '';
          this.deliveryData.postalCode = altAddress.postal_code || '';
          this.deliveryData.contact_phone = altAddress.contact_phone || '';
        } else {
          console.log('Альтернативные адреса отсутствуют.');
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        this.notificationMessage = 'Ошибка при загрузке профиля.';
      }
    },
    async updateCustomerAndCompanyData() {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Используемый токен:', token);

        // Проверка наличия необходимых данных
        if (!this.profile.name) {
          this.notificationMessage = 'Prosím, vyplňte své jméno.';
          return;
        }

        if (!this.profile.email) {
          this.notificationMessage = 'Prosím, vyplňte svůj e-mail.';
          return;
        }

        if (!this.billingData.companyName || !this.billingData.ico) {
          this.notificationMessage = 'Prosím, vyplňte název firmy a IČO.';
          return;
        }

        if (typeof this.billingData.ico !== 'string' || this.billingData.ico.trim().length !== 8) {
          this.notificationMessage = 'IČO musí obsahovat přesně 8 znaků.';
          return;
        }
        // Формируем данные для отправки
        const payload = {
          // Личные данные клиента
          email: this.profile.email,
          name: this.profile.name,
          phone: this.profile.phone,

          // Данные компании
          company_name: this.billingData.companyName,
          ico_number: this.billingData.ico,
          dic_number: this.billingData.dic,

          // Адрес компании
          street: this.billingData.street,
          city: this.billingData.city,
          postal_code: this.billingData.postalCode,
          company_address: `${this.billingData.street}, ${this.billingData.postalCode}, ${this.billingData.city}`,
          // Данные доставки
          delivery_name: this.deliveryData.name,
          delivery_street: this.deliveryData.street,
          delivery_city: this.deliveryData.city,
          delivery_postal_code: this.deliveryData.postalCode,
          delivery_contact_phone: this.deliveryData.contact_phone,
        };

        // Логируем данные перед отправкой
        console.log("Отправляем данные:", payload);

        // Если токен отсутствует
        if (!token) {
          console.error('Токен авторизации не найден');
          this.notificationMessage = 'Chyba autorizace. Prosím, přihlaste se znovu.';
          return;
        }

        // Отправляем запрос на сервер
        const response = await axios.put('https://shop.avanpost.online/api/customers/update', payload, {
          params: { api_token: token }, // Передаем токен через параметры
        });

        // Обработка успешного ответа сервера
        this.notificationMessage = 'Údaje byly úspěšně aktualizovány!';
        console.log('Ответ сервера:', response.data);

      } catch (error) {
        console.error('Ошибка при обновлении данных:', error.response ? error.response.data : error.message);

        // Обработка ошибок
        this.notificationMessage = 'Při aktualizaci údajů došlo k chybě. Zkuste to prosím znovu.';
      }
    },
    // Метод для поиска компании по IČO и заполнения полей
    async searchByIco() {
      try {
        const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${this.billingData.ico}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Устанавливаем название компании
          this.billingData.companyName = data.obchodniJmeno || '';
          // Устанавливаем DIČ, если оно присутствует
          this.billingData.dic = data.dic || '';


          // Разбираем `sidlo.textovaAdresa`, если доступно
          const addressParts = data.sidlo?.textovaAdresa?.split(',') || [];

          // Присваиваем данные по частям
          this.billingData.street = addressParts[0]?.trim() || '';  // Улица и номер дома

          // Обработка третьей части для разделения индекса и города
          const postalCityPart = addressParts[2]?.trim() || '';
          const postalCodeMatch = postalCityPart.match(/\b\d{5}\b/); // Ищем 5-значный индекс

          if (postalCodeMatch) {
            this.billingData.postalCode = postalCodeMatch[0]; // Присваиваем индекс
            this.billingData.city = postalCityPart.replace(postalCodeMatch[0], '').trim(); // Остальное — город
          } else {
            this.billingData.postalCode = '';
            this.billingData.city = addressParts[3]?.trim() || ''; // Назначаем из четвертой части, если индекс не найден
          }

          // Убираем ошибку, если запрос прошел успешно
          this.icoError = false;
        } else {
          this.icoError = true; // Устанавливаем ошибку при неудачном запросе
        }
      } catch (error) {
        console.error('Ошибка при запросе к ARES:', error);
        this.icoError = true; // Устанавливаем ошибку при исключении
      }
    },
    closePasswordModal() {
      this.showPasswordModal = false;
      this.passwords = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      // Убираем modal-backdrop, если он остался
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }

      // Убираем классы, если они остались
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
    },
    async changePassword() {
      const token = localStorage.getItem('authToken'); // Получаем токен из localStorage

      if (!token) {
        this.errorMessage = "Токен не найден. Пожалуйста, войдите в систему.";
        return;
      }

      const payload = {
        password: this.passwords.newPassword, // Отправляем только новый пароль
      };

      try {
        console.log("Токен перед отправкой запроса:", token);  // Логируем токен
        const response = await axios.post('https://shop.avanpost.online/api/customers/reset-password', payload, {
          params: { api_token: token },
        });

        // Обработка успешного изменения пароля
        this.successMessage = "Пароль успешно изменен!";
        this.errorMessage = ""; // Сбрасываем сообщение об ошибке
        console.log("Пароль успешно изменен:", response.data);

        // Закрываем модальное окно после успешного изменения пароля
        this.closePasswordModal();

      } catch (error) {
        // Обработка ошибок и отображение сообщения об ошибке
        this.successMessage = ""; // Сбрасываем сообщение об успешном изменении
        this.errorMessage = error.response?.data?.error || "Ошибка при смене пароля.";
        console.error("Ошибка при смене пароля:", error.response?.data);
      }
    },
    // Metoda pro nastavení údajů o profilu
    setProfileData() {
      const profileEmail = localStorage.getItem('userEmail');
      const profileName = localStorage.getItem('userName');
      const profilePhone = localStorage.getItem('userPhone');

      if (profileEmail || profileName || profilePhone) {
        this.profile.email = profileEmail || '';
        this.profile.name = profileName || '';
        this.profile.phone = profilePhone || '';
      } else {
        this.notificationMessage = 'Vaše osobní údaje nebyly nalezeny. Prosím, aktualizujte je.';
      }
    },

    // Metoda pro načtení adres z localStorage
    loadAddresses() {
      const savedAddresses = JSON.parse(localStorage.getItem('userAddresses'));

      if (!savedAddresses || savedAddresses.length === 0) {
        this.notificationMessage = 'Adresy nebyly nalezeny. Prosím, vyplňte dodací údaje.';

        // Zkusíme načíst adresу z údajů o firmě
        const savedCompany = JSON.parse(localStorage.getItem('userCompany'));
        if (savedCompany && savedCompany.company_address) {
          const addressParts = this.parseCompanyAddress(savedCompany.company_address);
          this.billingData.street = addressParts.street || '';
          this.billingData.city = addressParts.city || '';
          this.billingData.postalCode = addressParts.postalCode || '';
        }
      } else {
        const primaryAddress = savedAddresses[0];
        this.billingData.street = primaryAddress.address_line_1 || '';
        this.billingData.city = primaryAddress.city || '';
        this.billingData.postalCode = primaryAddress.postal_code || '';
      }
    },

    // Metoda pro parsování адресы z company_address
    parseCompanyAddress(companyAddress) {
      const regex = /(.+),\s*(.+)\s*(\d{5})/;
      const matches = companyAddress.match(regex);

      if (matches) {
        return {
          street: matches[1],
          city: matches[2],
          postalCode: matches[3],
        };
      }
      return { street: '', city: '', postalCode: '' };
    },

    // Metoda pro načtení dat o firmě z localStorage
    loadCompanyData() {
      const savedCompany = JSON.parse(localStorage.getItem('userCompany'));

      if (savedCompany) {
        this.billingData.companyName = savedCompany.company_name || '';
        this.billingData.ico = savedCompany.ico_number || '';
        this.billingData.dic = savedCompany.dic_number || '';
      } else {
        this.notificationMessage = 'Údaje o firmě nebyly nalezeny. Prosím, doplňte je.';
      }
    },

    // Metoda pro načtení dodacích adres z localStorage
    loadAltAddresses() {
      const savedAltAddresses = JSON.parse(localStorage.getItem('userAltAddresses'));

      if (!savedAltAddresses || savedAltAddresses.length === 0) {
        this.notificationMessage = 'Dodací údaje nebyly nalezeny. Prosím, doplňte dodací údaje.';
      } else {
        const primaryAltAddress = savedAltAddresses[0];
        this.deliveryData.street = primaryAltAddress.street || '';
        this.deliveryData.city = primaryAltAddress.city || '';
        this.deliveryData.postalCode = primaryAltAddress.postal_code || '';
        this.deliveryData.name = primaryAltAddress.name || '';
        this.deliveryData.contact_phone = primaryAltAddress.contact_phone || '';
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.filled-warning {
  color: #212529; /* Barva textu pro kontrast */
  border-color: #07ff41; /* Okraje jako u btn-warning */
}

.alert-warning {
  margin-bottom: 15px;
}

/* Responsivní design pro mobilní zařízení */
@media (max-width: 768px) {
  .row {
    display: flex;
    flex-direction: column;
  }
}
</style>
