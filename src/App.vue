<template>
  <v-app>
	<!-- Header -->
	<Header
		:isLoggedIn="isLoggedIn"
		@navigate-to-stores="goToStoresPage"
		@navigate-to-profile="goToProfilePage"
		@navigate-to-login="goToLoginPage"
		@navigate-to-home="goToHomePage"
	/>
	<!-- Main Content -->
	<v-main class="app-main">
		<router-view/> <!-- This will render different pages dynamically -->
	</v-main>

	<!-- Footer -->
	<Footer />
  </v-app>
</template>

<script src="./App.js"></script>

<style scoped>
.app-main {
  padding-bottom: 0;
  margin-bottom: 0;
  background-color: #FEF9ED;
}
</style>