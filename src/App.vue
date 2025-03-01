<template>
  <v-app>
	<Header
		:isLoggedIn="isLoggedIn"
		@navigate-to-stores="goToStoresPage"
		@navigate-to-profile="goToProfilePage"
		@navigate-to-login="goToLoginPage"
		@navigate-to-home="goToHomePage"
	/>
	<v-main>
		<router-view/> <!-- This will render different pages dynamically -->
	</v-main>
  </v-app>
</template>

<script src="./App.js"></script>