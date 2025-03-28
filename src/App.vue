<template>
  <v-app>
	<!-- Header -->
	<Header
		:isLoggedIn="isLoggedIn"
		:userRole="userRole"
		@navigate-to-admin="goToAdminPage"
		@navigate-to-stores="goToStoresPage"
		@navigate-to-profile="goToProfilePage"
		@navigate-to-login="goToLoginPage"
		@navigate-to-home="goToHomePage"
	/>
	<!-- Main Content -->
	<v-main class="app-main">
		<router-view
			@logout="handleLogout"
			@register-success="handleLoginSuccess"
			@login-success="handleLoginSuccess"
			@navigate-to-stores="goToStoresPage"
			@navigate-to-register="goToRegisterPage"
			@navigate-to-login="goToLoginPage"
			@navigate-to-home="goToHomePage"
		/>
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