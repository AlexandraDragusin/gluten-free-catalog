<template>
	<v-container fluid class="profile-container">
		<!-- Sidebar -->
		<div class="sidebar">
			<v-list nav dense class="sidebar-list">
				<v-list-item @click="selectedTab = 'edit-profile'" :class="{ 'active-tab': selectedTab === 'edit-profile' }">
					<v-icon class="mr-2">mdi-account</v-icon>
					<v-list-item-title>Editează profilul</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'favorite-products'" :class="{ 'active-tab': selectedTab === 'favorite-products' }">
					<v-icon class="mr-2">mdi-heart</v-icon>
					<v-list-item-title>Produsele mele favorite</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'shopping-lists'" :class="{ 'active-tab': selectedTab === 'shopping-lists' }">
					<v-icon class="mr-2">mdi-cart</v-icon>
					<v-list-item-title>Liste de cumpărături</v-list-item-title>
				</v-list-item>
			</v-list>

			<v-btn class="logout-button" color="red" dark @click="logout">
				<v-icon left>mdi-logout</v-icon> Deconectare
			</v-btn>
		</div>

		<!-- Content -->
		<div class="content-container">
			<div v-if="!user">
				<p class="loading-text">Se încarcă profilul...</p>
			</div>
			<EditProfile v-else-if="selectedTab === 'edit-profile'" :user="user" @profile-updated="fetchUserProfile" />
			<FavoriteProducts v-else-if="selectedTab === 'favorite-products'" />
			<ShoppingLists v-else-if="selectedTab === 'shopping-lists'" />
		</div>
	</v-container>
</template>

<script src="./script.js"/>

<style scoped>
.profile-container {
	padding: 140px 0 0 0;
	display: flex;
	min-height: 100vh;
	background-color: #FEF9ED;
}

.sidebar {
	background: white;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	padding: 20px;
	width: 240px;
	justify-content: center;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
	margin-left: 40px;
	margin-bottom: 50px;
	height: 70vh;
}

.sidebar-list {
	padding: 0;
}

.v-list-item {
	cursor: pointer;
	padding: 10px;
	display: flex;
	align-items: center;
	font-size: 16px;
	transition: 0.3s;
}

.v-list-item:hover,
.active-tab {
	background: #f0f0f0;
	border-radius: 8px;
}

.logout-button {
	margin-top: auto;
}

.content-container {
	display: flex;
	justify-content: center;
	width: 100%;
	height: fit-content;
}

.content-card {
	background: white;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
	text-align: center;
}

.loading-text {
	text-align: center;
	font-size: 18px;
	color: #555;
}
</style>
