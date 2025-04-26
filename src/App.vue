<template>
  <v-app>
	<!-- Header -->
	<Header
		:breadcrumbs="breadcrumbs"
		:isLoggedIn="isLoggedIn"
		:userRole="userRole"
		@navigate-to-admin="goToAdminPage"
		@navigate-to-categories="goToCategories"
		@navigate-to-stores="goToStoresPage"
		@navigate-to-profile="goToProfilePage"
		@navigate-to-login="goToLoginPage"
		@navigate-to-home="goToHomePage"
		@navigate-to-store-detail="goToStoreDetailPage"
		@navigate-to-product-detail="goToProductDetailPage"
	/>
	<!-- Main Content -->
	<v-main class="app-main">
		<router-view
			@logout="handleLogout"
			@register-success="handleLoginSuccess"
			@login-success="handleLoginSuccess"
			@navigate-to-verify="goToVerifyPage"
			@navigate-to-products="goToProductsPage"
			@navigate-to-product-detail="goToProductDetailPage"
			@navigate-to-stores="goToStoresPage"
			@navigate-to-store-detail="goToStoreDetailPage"
			@navigate-to-register="goToRegisterPage"
			@navigate-to-login="goToLoginPage"
			@navigate-to-home="goToHomePage"
			@navigate-to-profile-favorites="goToProfileFavoritesPage"
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