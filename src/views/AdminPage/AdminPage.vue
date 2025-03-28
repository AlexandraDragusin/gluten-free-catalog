<template>
	<v-container fluid class="admin-container">
		<!-- Sidebar -->
		<div class="sidebar">
			<v-list nav dense class="sidebar-list">
				<v-list-item @click="selectedTab = 'add-store'" :class="{ 'active-tab': selectedTab === 'add-store' }">
					<v-icon class="mr-2">mdi-store</v-icon>
					<v-list-item-title>Adaugă magazin</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'add-product'" :class="{ 'active-tab': selectedTab === 'add-product' }">
					<v-icon class="mr-2">mdi-package-variant</v-icon>
					<v-list-item-title>Adaugă produs</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'upload-excel'" :class="{ 'active-tab': selectedTab === 'upload-excel' }">
					<v-icon class="mr-2">mdi-file-excel</v-icon>
					<v-list-item-title>Importă din Excel</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'manage-users'" :class="{ 'active-tab': selectedTab === 'manage-users' }">
					<v-icon class="mr-2">mdi-account-multiple</v-icon>
					<v-list-item-title>Utilizatori</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'manage-categories'" :class="{ 'active-tab': selectedTab === 'manage-categories' }">
					<v-icon class="mr-2">mdi-tag-multiple</v-icon>
					<v-list-item-title>Categorii</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'manage-allergens'" :class="{ 'active-tab': selectedTab === 'manage-allergens' }">
					<v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
					<v-list-item-title>Alergeni</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'manage-products'" :class="{ 'active-tab': selectedTab === 'manage-products' }">
					<v-icon class="mr-2">mdi-package-variant-closed</v-icon>
					<v-list-item-title>Produse</v-list-item-title>
				</v-list-item>

				<v-list-item @click="selectedTab = 'manage-stores'" :class="{ 'active-tab': selectedTab === 'manage-stores' }">
					<v-icon class="mr-2">mdi-domain</v-icon>
					<v-list-item-title>Magazine</v-list-item-title>
				</v-list-item>
			</v-list>

			<v-btn class="logout-button" color="grey" variant="tonal" dark @click="logout">
				<v-icon left>mdi-logout</v-icon> Deconectare
			</v-btn>
		</div>

		<!-- Content -->
		<div class="content-container">
			<AddStore v-if="selectedTab === 'add-store'" />
			<AddProduct v-else-if="selectedTab === 'add-product'" />
			<UploadExcel v-else-if="selectedTab === 'upload-excel'" />
			<ManageUsers v-else-if="selectedTab === 'manage-users'" />
			<ManageCategories v-else-if="selectedTab === 'manage-categories'" />
			<ManageAllergens v-else-if="selectedTab === 'manage-allergens'" />
			<ManageProducts v-else-if="selectedTab === 'manage-products'" />
			<ManageStores v-else-if="selectedTab === 'manage-stores'" />
		</div>
	</v-container>
</template>

<script src="./script.js" />
<style scoped>
.admin-container {
	padding: 140px 0 0 0;
	display: flex;
	margin-bottom: 40px;
	background-color: #FEF9ED;
	min-height: 100vh;
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
	height: 80vh;
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
	/* height: fit-content; */
}
</style>
