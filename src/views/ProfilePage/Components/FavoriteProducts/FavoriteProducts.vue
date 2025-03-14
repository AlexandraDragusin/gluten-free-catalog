<template>
	<v-card class="favorite-products-card">
		<v-card-title class="section-title">Produse favorite</v-card-title>
		<v-card-text>
		<v-list v-if="favoriteProducts.length">
			<v-list-item v-for="product in favoriteProducts" :key="product.id">
			<v-img :src="product.image" class="favorite-image"></v-img>
			<v-list-item>
				<v-list-item-title>{{ product.name }}</v-list-item-title>
			</v-list-item>
			</v-list-item>
		</v-list>
		<p v-else class="no-data">Nu ai produse favorite.</p>
		</v-card-text>
	</v-card>
</template>

<script src="./script.js"></script>

<style scoped>
.section-title {
	font-size: 20px;
	color: #312B1D;
	margin-bottom: 16px;
}

.favorite-products-card {
	padding: 24px;
	border-radius: 12px;
}
.favorite-image {
	width: 50px;
	height: 50px;
	border-radius: 8px;
	margin-right: 12px;
}
.no-data {
	color: gray;
	font-style: italic;
}
</style>