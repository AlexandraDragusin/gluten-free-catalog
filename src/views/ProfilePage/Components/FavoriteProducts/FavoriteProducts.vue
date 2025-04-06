<template>
	<!-- Favorite Products Page -->
	<div class="favorite-products-page">
		<v-row v-if="favoriteProducts.length > 0" class="products-grid">
			<v-col
				v-for="product in favoriteProducts"
				:key="product.id"
				cols="12"
				sm="6"
				md="4"
				lg="3"
			>
			<v-card class="product-card">
				<div class="product-image-wrapper">
					<v-img
						:src="product.image_url || noImage"
						class="product-image"
						cover
					/>

					<!-- Actions -->
					<div class="action-buttons">
						<v-btn icon @click="removeFromFavorites(product.id)">
							<v-icon color="red">mdi-heart</v-icon>
						</v-btn>

						<v-btn icon @click="openListDialog(product.id)">
							<v-icon color="green">mdi-cart-plus</v-icon>
						</v-btn>
					</div>
				</div>

				<v-card-text class="product-info">
					<p class="product-brand">{{ product.brand }}</p>
					<h3 class="product-name">{{ product.name }}</h3>
				</v-card-text>
			</v-card>
			</v-col>
		</v-row>

		<div v-else class="no-favorites">
			<v-icon color="grey" size="48">mdi-heart-broken</v-icon>
			<p>Nu ai produse favorite.</p>
		</div>
	</div>

	<!--Shopping list Dialog -->
	<v-dialog v-model="showListDialog" max-width="400">
			<v-card>
				<v-card-title>
					Adaugă <strong>{{ getProductName(productToAdd) }}</strong> într-o listă de cumpărături
				</v-card-title>
				<v-card-text v-if="shoppingLists.length">
					<v-select
						v-model="selectedListId"
						:items="shoppingLists"
						item-title="name"
						item-value="id"
						label="Liste disponibile"
						variant="outlined"
					/>
				</v-card-text>
				<v-card-text v-else>
					Nu ai nicio listă de cumpărături. Creează una mai întâi.
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn text @click="showListDialog = false">Anulează</v-btn>
					<v-btn :disabled="!selectedListId" @click="confirmAddToList">Adaugă</v-btn>
				</v-card-actions>
			</v-card>
	</v-dialog>

	<!-- Snackbar -->
	<v-snackbar
		v-model="snackbar"
		:color="snackbarColor"
		timeout="3000"
		location="bottom"
	>
		{{ snackbarMessage }}
	</v-snackbar>
</template>

<script src="./script.js"></script>
  
<style scoped>
.favorite-products-page {
	margin-bottom: 50px;
}

.products-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 24px;
}

.v-col {
	padding: 0 !important;
}

.product-card {
	background-color: #fdf6e3;
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 100%;
	box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	transition: transform 0.2s ease;
}

.product-image {
	height: 180px;
	background-color: #fcf8e3;
	object-fit: contain;
}

.product-image-wrapper {
	position: relative;
}

.action-buttons {
	position: absolute;
	top: 10px;
	right: 10px;
	display: flex;
	flex-direction: row;
	gap: 8px;
	z-index: 2;
}

.action-buttons .v-btn {
	background-color: white;
	border-radius: 50%;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
	transform: translateY(-2px);
}

.product-info {
	padding: 12px;
}

.product-brand {
	font-size: 14px;
	color: #777;
	margin-bottom: 4px;
}

.product-name {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.no-favorites {
	text-align: center;
	margin-top: 64px;
	color: #777;
}

.favorite-icon,
.cart-icon {
	position: absolute;
	top: 8px;
	z-index: 2;
	background-color: white;
	border-radius: 50%;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.favorite-icon {
	right: 8px;
}

.cart-icon {
	right: 44px;
}
</style>