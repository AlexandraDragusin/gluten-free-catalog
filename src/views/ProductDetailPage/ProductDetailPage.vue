<template>
	<v-container fluid class="product-detail-container">
	<v-row no-gutters>
		<v-col cols="12">
		<v-card class="full-card-layout">
			<v-row>
			<!-- IMAGE -->
			<v-col cols="12" md="5" class="image-col">
				<div class="image-wrapper">
				<v-img
					ref="productImage"
					:src="product.image_url || require('@/assets/no-image.png')"
					class="product-image"
					:style="imageStyle"
					alt="Imagine produs"
					@loadstart="adjustImageStyle"
				/>
				</div>
			</v-col>

			<!-- DETAILS -->
			<v-col cols="12" md="7" class="info-col">
				<div class="product-header">
					<div class="product-name-with-actions">
						<h1 class="product-name">{{ product.name }}</h1>
						<div class="product-actions">
							<v-btn fab x-small @click="toggleFavorite" class="action-btn" :title="isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'">
							<v-icon :color="isFavorite ? 'red' : 'grey lighten-1'">
								{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
							</v-icon>
							</v-btn>

							<v-btn fab x-small @click="openListDialog" class="action-btn" title="Adaugă în listă de cumpărături">
							<v-icon color="green darken-1">mdi-cart-plus</v-icon>
							</v-btn>
						</div>
					</div>
				<div class="product-meta">
					<v-chip 
					v-if="product.made_in_romania" 
					color="blue lighten-5" 
					text-color="blue darken-2"
					small
					>
					<v-icon left small>mdi-flag</v-icon>
					Fabricat în România
					</v-chip>
					<v-chip 
					v-if="product.certified_arig" 
					color="green lighten-5" 
					text-color="green darken-2"
					small
					>
					<v-icon left small>mdi-certificate</v-icon>
					Certificat ARIG
					</v-chip>
				</div>
				</div>

				<v-divider class="my-4"></v-divider>

				<section class="info-section">
				<h2 class="section-title">
					<v-icon left>mdi-information</v-icon>
					Detalii produs
				</h2>
				<div class="detail-grid">
					<div class="detail-item" v-if="product.brand">
					<span class="detail-label">Brand:</span>
					<span class="detail-value">{{ product.brand }}</span>
					</div>
					<div class="detail-item" v-if="product.ean_code">
					<span class="detail-label">Cod EAN:</span>
					<span class="detail-value">{{ product.ean_code }}</span>
					</div>
					<div class="detail-item" v-if="product.category?.name">
					<span class="detail-label">Categorie:</span>
					<span class="detail-value">{{ product.category.name }}</span>
					</div>
					<div class="detail-item" v-if="product.weight && product.unit">
					<span class="detail-label">Gramaj:</span>
					<span class="detail-value">{{ product.weight }} {{ product.unit }}</span>
					</div>
					<div class="detail-item" v-if="product.cross_grain_cert_code">
					<span class="detail-label">Crossed Grain:</span>
					<span class="detail-value">{{ product.cross_grain_cert_code }}</span>
					</div>
					<div class="detail-item">
					<span class="detail-label">Declarație producător:</span>
					<span class="detail-value">{{ product.producer_gluten_declaration ? 'Fără gluten' : 'Nu' }}</span>
					</div>
				</div>
				</section>

				<section v-if="product.description" class="info-section">
				<h2 class="section-title">
					<v-icon left>mdi-text</v-icon>
					Descriere
				</h2>
				<v-card outlined class="description-card">
					{{ product.description }}
				</v-card>
				</section>

				<section class="info-section">
					<h2 class="section-title">
					<v-icon left>mdi-alert-octagon</v-icon>
					Alergeni
					</h2>
					<div class="allergens-text">
					{{ formatAllergens(product.allergen_tags) || 'Nu există alergeni cunoscuți' }}
					</div>
				</section>

				<section class="info-section">
					<h2 class="section-title">
						<v-icon left>mdi-store</v-icon>
						Disponibil în magazine
					</h2>
					
					<div v-if="product.stores && product.stores.length">
						<v-container fluid class="store-container">
							<v-row class="store-row" dense>
								<v-col
									v-for="store in product.stores"
									:key="store.id"
									cols="12"
									class="store-col"
								>
								<v-card
									class="store-card"
									flat
									outlined
									@click="$emit('navigate-to-store-detail', store.id, store.name)"
									style="cursor: pointer;"
								>
									<v-card-text class="store-card-content">
										<div class="store-header">
											<div class="store-left">
												<v-avatar v-if="store.logo" size="56" tile>
												<v-img :src="store.logo" contain />
												</v-avatar>

												<div class="store-details">
												<div class="store-name">{{ store.name }}</div>
												<div class="store-type">
													<v-icon small class="mr-1">mdi-storefront</v-icon>
													{{ translateStoreType(store.type) }}
												</div>
												</div>
											</div>
										</div>
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>
						</v-container>
					</div>
					
					<v-alert v-else type="info" outlined dense>
						Nu există informații despre magazine.
					</v-alert>
				</section>
			</v-col>
			</v-row>
		</v-card>
		</v-col>
	</v-row>

	<!-- Dialog Add to list-->
	<AddToListDialog
		v-if="userId"
		v-model="showListDialog"
		:productId="product.id"
		:productName="product.name"
	/>

	<!-- Login prompt dialog -->
	<LoginRequiredPrompt v-model="showLoginPrompt" />

	<!-- Review Section -->
	<v-card class="review-section-card">
	<v-card-title class="section-title">
		<v-icon left color="primary">mdi-star-circle</v-icon>
		Recenzii
	</v-card-title>

	<v-card-text>
		<!-- Add review -->
		<div v-if="userId && userRole !== 'admin'" class="review-form">
		<div class="rating-container">
			<v-rating 
			v-model="newReview.rating" 
			color="orange" 
			background-color="grey lighten-1" 
			size="28"
			></v-rating>
			<span class="rating-text">{{ newReview.rating ? `${newReview.rating} stele` : 'Alege rating' }}</span>
		</div>
		<v-textarea
			v-model="newReview.comment"
			:counter="1000"
			maxlength="1000"
			label="Scrie o recenzie..."
			rows="3"
			variant="outlined"
			class="mt-3"
		></v-textarea>
		<v-btn
			@click="submitReview"
			color="primary"
			:disabled="!newReview.comment || !newReview.rating"
			class="mt-2 mb-4 add-review-btn"
			depressed
			large
		>
			<v-icon left>mdi-pencil</v-icon>
			Adaugă recenzie
		</v-btn>
		</div>
		<v-alert v-else type="info" outlined dense class="mb-4 creamy-alert">
			Trebuie să fii autentificat pentru a scrie o recenzie.
		</v-alert>

		<!-- Existing reviews -->
		<div v-if="reviews.length" class="reviews-list">
		<div class="review-count mb-4">
			<strong>{{ reviews.length }} recenzii</strong>
		</div>
		<v-card
			v-for="review in reviews"
			:key="review.id"
			class="mb-4 review-card"
			outlined
		>
			<v-card-text>
			<div class="review-top">
				<div class="review-user">
				<v-avatar color="primary" size="36" class="mr-2">
					<span class="white--text">{{ review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U' }}</span>
				</v-avatar>
				<div>
					<strong>{{ review.user_name || 'Utilizator' }}</strong>
					<div class="review-date">
					{{ new Date(review.created_at).toLocaleString() }}
					</div>
				</div>
				</div>

				<div class="review-actions">
				<v-rating
					:value="review.rating"
					color="orange"
					background-color="grey lighten-1"
					readonly
					dense
					size="20"
					class="mr-2"
				/>
				<v-btn
					v-if="userId === review.user_id"
					icon
					small
					@click="deleteReview(review.id)"
					color="grey"
				>
					<v-icon small>mdi-delete</v-icon>
				</v-btn>
				</div>
			</div>

			<div class="review-comment mt-3">
				{{ review.comment }}
			</div>
			</v-card-text>
		</v-card>
		</div>
		<v-alert v-else-if="(!userId || userRole === 'admin') && !reviews.length" type="info" outlined dense class="mt-2 creamy-alert">
			Acest produs nu are încă recenzii.
		</v-alert>
	</v-card-text>
	</v-card>

	<!-- Snackbar -->
	<v-snackbar
		v-model="snackbar"
		:color="snackbarColor"
		timeout="3000"
		location="bottom"
	>
		{{ snackbarMessage }}
		<template v-slot:action="{ attrs }">
		<v-btn
			text
			v-bind="attrs"
			@click="snackbar = false"
		>
			<v-icon>mdi-close</v-icon>
		</v-btn>
		</template>
	</v-snackbar>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.product-detail-container {
	padding: 140px 0 40px;
	min-height: 100vh;
	max-width: 90%;
}

.full-card-layout {
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	margin-bottom: 40px;
}

.image-col {
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.image-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	padding: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.product-image {
	max-height: 400px;
	object-fit: contain;
	border-radius: 8px;
}

.action-btn {
	background-color: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-col {
	padding: 32px;
}

.product-header {
	margin-bottom: 16px;
}

.product-meta {
	display: flex;
	gap: 8px;
	margin-bottom: 8px;
}

.section-title {
	font-size: 20px;
	font-weight: 500;
	color: #312B1D;
	margin: 24px 0 16px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.info-section {
	margin-bottom: 24px;
}

.detail-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 16px;
	padding-top: 8px;
}

.detail-item {
	display: flex;
	flex-direction: column;
}

.detail-label {
	font-size: 14px;
	color: #7f8c8d;
	margin-bottom: 2px;
}

.detail-value {
	font-size: 15px;
	font-weight: 500;
	color: #34495e;
}

.description-card {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
	background-color: #fef9ed !important;
	line-height: 1.8;
	padding: 8px 16px;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  gap: 16px;
}

.store-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.store-details {
  display: flex;
  flex-direction: column;
}

.store-inline-btn {
  height: 32px;
  text-transform: none;
  font-weight: 500;
  white-space: nowrap;
}

.store-name {
  font-weight: 600;
  font-size: 16px;
  color: #312B1D;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.review-section-card {
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rating-container {
	display: flex;
	align-items: center;
	gap: 12px;
}

.rating-text {
	font-size: 14px;
	color: #7f8c8d;
}

.review-count {
	font-size: 16px;
	color: #312B1D;
}

.review-card {
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.review-top {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.review-user {
	display: flex;
	align-items: center;
}

.review-date {
	font-size: 12px;
	color: #7f8c8d;
}

.review-actions {
	display: flex;
	align-items: center;
}

.review-comment {
	font-size: 15px;
	color: #34495e;
	line-height: 1.5;
}

.add-review-btn {
	border-radius: 8px;
	text-transform: none;
	letter-spacing: normal;
	font-weight: 600;
	box-shadow: 0 2px 6px rgba(41, 98, 255, 0.2);
	transition: all 0.3s ease;
}

.add-review-btn:hover {
	box-shadow: 0 4px 12px rgba(41, 98, 255, 0.3);
	transform: translateY(-1px);
}

.add-review-btn:disabled {
	box-shadow: none;
	transform: none;
	background-color: #e0e0e0 !important;
	color: #9e9e9e !important;
}

.review-form {
	margin-bottom: 16px;
}

.store-content {
	display: flex;
	padding: 16px;
	height: 100%;
}

.creamy-alert {
	background-color: #fef9ed !important;
	color: #312B1D !important;
}

.product-name-with-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}

.product-actions {
	display: flex;
	gap: 8px;
}

.product-name {
	margin: 0;
	font-size: 28px;
	font-weight: 700;
	color: #312B1D;
}

.store-card {
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	background-color: #fff;
	transition: all 0.3s ease;
	height: 100%;
}

.store-card:hover {
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
	transform: translateY(-2px);
}

.store-card-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.store-type {
	font-size: 13px;
	color: #7f8c8d;
	display: flex;
	align-items: center;
}

@media (max-width: 600px) {
  .store-type {
    justify-content: center;
  }
}

@media (max-width: 960px) {
	.full-card-layout {
	flex-direction: column;
	}
	
	.image-col {
	padding: 24px;
	}
	
	.info-col {
	padding: 24px;
	}
	
	.product-name {
	font-size: 24px;
	}
}

@media (max-width: 600px) {
	.detail-grid {
	grid-template-columns: 1fr;
	}
	
	.product-detail-container {
	padding: 16px 0;
	}
}
</style>
