<template>
  <nav class="profile-nav">
    <ul class="profile-nav-list">
      <!-- Základní informace ведет на /profile -->
      <li :class="{ active: isActive('/profile') }">
        <router-link to="/profile" class="flex items-center">Základní informace</router-link>
      </li>

      <!-- Обjednávky -->
      <li :class="{ active: isActive('/profile/objednavky') }">
        <router-link to="/profile/objednavky" class="flex items-center">Objednávky</router-link>
      </li>

      <!-- Faktury -->
      <li :class="{ active: isActive('/profile/faktury') }">
        <router-link to="/profile/faktury" class="flex items-center">Faktury</router-link>
      </li>

      <!-- Zakoupené zboží -->
      <li :class="{ active: isActive('/profile/zakoupene-zbozi') }">
        <router-link to="/profile/zakoupene-zbozi" class="flex items-center">Zakoupené zboží</router-link>
      </li>

      <!-- Doporučený sortiment -->
      <li :class="{ active: isActive('/profile/doporuceny-sortiment') }">
        <router-link to="/profile/doporuceny-sortiment" class="flex items-center">Doporučený sortiment</router-link>
      </li>

      <!-- Oblíbené -->
      <li :class="{ active: isActive('/profile/oblibene') }">
        <router-link to="/profile/oblibene" class="flex items-center">Oblíbené</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    // Проверяем активный маршрут
    isActive(route) {
      return this.$route.path === route;
    }
  }
};
</script>

<style scoped>
/* Стили навигации */
.profile-nav {
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.profile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.profile-nav-list li {
  padding: 10px 20px;
  max-width: 150px; /* Устанавливаем максимальную ширину элемента */
  white-space: nowrap; /* Запрещаем перенос текста */
  overflow: hidden; /* Обрезаем текст, который не помещается */
  text-overflow: ellipsis; /* Добавляем троеточие в конце длинного текста */
}

.profile-nav-list li.active a {
  color: #007bff;
  font-weight: bold;
}

.profile-nav-list li a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
}

.profile-nav-list li a:hover {
  color: #007bff;
}
</style>
