<template>
	<v-card class="shopping-lists-card">
		<v-card-title class="section-title">Liste de Cumpărături</v-card-title>
		<v-card-text>
		<v-list>
			<v-list-item v-for="list in shoppingLists" :key="list.id">
			<v-list-item>
				<v-list-item-title>{{ list.name }}</v-list-item-title>
			</v-list-item>
			<v-btn color="error" variant="text" @click="deleteShoppingList(list.id)">Șterge</v-btn>
			</v-list-item>
		</v-list>

		<v-text-field v-model="newShoppingList" label="Adaugă listă nouă" variant="outlined"></v-text-field>
		<v-btn class="add-list-button" color="primary" @click="addShoppingList">Adaugă listă</v-btn>
		</v-card-text>
	</v-card>
</template>

<script src="./script.js"></script>

<style scoped>
.shopping-lists-card {
	padding: 24px;
	border-radius: 12px;
}

.add-list-button {
	margin-top: 16px;
	background-color: #F7B41A;
	color: #312B1D;
	font-size: 16px;
	text-transform: none;
	width: 100%;
}

.section-title {
	font-size: 20px;
	color: #312B1D;
	margin-bottom: 16px;
}
</style>