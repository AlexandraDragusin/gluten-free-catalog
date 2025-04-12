<template>
	<v-container fluid class="product-detail-container">
	<v-row no-gutters>
		<v-col cols="12">
		<v-card class="full-card-layout">
			<v-row>
			<!-- IMAGE -->
			<v-col cols="12" md="5" class="image-col">
				<v-img
					ref="productImage"
					:src="product.image_url || require('@/assets/no-image.png')"
					class="product-image"
					:style="imageStyle"
					alt="Imagine produs"
					@loadstart="adjustImageStyle"
				/>
			</v-col>

			<!-- DETAILS -->
			<v-col cols="12" md="7" class="info-col">
				<div class="top-actions">
				<v-btn
					icon
					@click="toggleFavorite"
					:title="isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'"
				>
					<v-icon :color="isFavorite ? 'red' : 'grey'">
					{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
					</v-icon>
				</v-btn>

				<v-btn icon @click="openListDialog" title="Adaugă în listă de cumpărături">
					<v-icon color="green">mdi-cart-plus</v-icon>
				</v-btn>
				</div>

				<h1 class="product-name">{{ product.name }}</h1>

				<section class="info-section">
				<h2 class="section-title">Detalii produs</h2>
				<p><strong>Brand:</strong> {{ product.brand || 'Necunoscut' }}</p>
				<p v-if="product.ean_code"><strong>Cod EAN:</strong> {{ product.ean_code }}</p>
				<p v-if="product.category?.name"><strong>Categorie:</strong> {{ product.category.name }}</p>
				<p v-if="product.weight && product.unit"><strong>Gramaj:</strong> {{ product.weight }} {{ product.unit }}</p>
				<p v-if="product.cross_grain_cert_code"><strong>Crossed Grain:</strong> {{ product.cross_grain_cert_code }}</p>
				<p><strong>Fabricat în România:</strong> {{ product.made_in_romania ? 'Da' : 'Nu' }}</p>
				<p><strong>Certificat ARIG:</strong> {{ product.certified_arig ? 'Da' : 'Nu' }}</p>
				<p><strong>Declarație producător fără gluten:</strong> {{ product.producer_gluten_declaration ? 'Fără gluten' : 'Nu' }}</p>
			</section>

				<section v-if="product.description" class="info-section">
				<h2 class="section-title">Descriere</h2>
				<p>{{ product.description }}</p>
				</section>

				<section class="info-section">
				<h2 class="section-title">Alergeni</h2>
				<p>{{ formatAllergens(product.allergen_tags) }}</p>
				</section>

				<section class="info-section">
				<h2 class="section-title">Disponibil în magazine</h2>
				<div v-if="product.stores && product.stores.length">
					<v-card
					v-for="store in product.stores"
					:key="store.id"
					class="store-card"
					flat
					>
					<div class="store-content">
						<v-avatar v-if="store.logo" size="36" class="mr-3">
						<v-img :src="store.logo" />
						</v-avatar>
						<div>
						<div class="store-name">{{ store.name }}</div>
						<div class="store-meta">
							Tip: {{ translateStoreType(store.type) }}
							<span v-if="store.website">• <a :href="store.website" target="_blank">Site web</a></span>
						</div>
						</div>
					</div>
					</v-card>
				</div>
				<p v-else>Nu există informații despre magazine.</p>
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
	<section class="info-section">
		<h2 class="section-title">Recenzii</h2>

		<!-- Add review -->
		<div v-if="userId && userRole !== 'admin'" class="review-form">
			<v-rating v-model="newReview.rating" color="orange" background-color="grey" dense></v-rating>
			<v-textarea
				v-model="newReview.comment"
				:counter="1000"
				maxlength="1000"
				label="Scrie o recenzie..."
				rows="3"
				variant="outlined"
			/>
			<v-btn
				class="white-button"
				:disabled="!newReview.comment || !newReview.rating"
				@click="submitReview"
			>
				Adaugă o recenzie
			</v-btn>
		</div>
		<div v-else class="text-grey">Trebuie să fii autentificat pentru a scrie o recenzie.</div>

		<!-- Existing reviews -->
		<div v-if="reviews.length" class="reviews-list mt-4">
			<v-card
				v-for="review in reviews"
				:key="review.id"
				class="mb-3 review-card"
			>
				<div class="review-top">
					<div class="review-user">
						<strong>{{ review.user_name || 'Utilizator' }}</strong>
					</div>

					<div class="review-actions">
						<v-rating
							:model-value="review.rating"
							color="yellow darken-2"
							background-color="grey lighten-1"
							readonly
							dense
							size="28"
							class="mr-2"
						/>
						<v-btn
							v-if="userId === review.user_id"
							class="white-button"
							icon
							size="small"
							:style="{ marginLeft: '20px' }"
							@click="deleteReview(review.id)"
						>
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</div>
				</div>

				<v-card-text class="review-comment">
					{{ review.comment }}
				</v-card-text>

				<v-card-subtitle class="text-caption text-grey mt-n2">
					{{ new Date(review.created_at).toLocaleString() }}
				</v-card-subtitle>
			</v-card>
		</div>
		<div v-else class="text-grey">Acest produs nu are încă recenzii.</div>
	</section>

	<!-- Snackbar -->
	<v-snackbar
		v-model="snackbar"
		:color="snackbarColor"
		timeout="3000"
		location="bottom"
	>
		{{ snackbarMessage }}
	</v-snackbar>

	</v-container>
</template>
  
<script src="./script.js"></script>

<style scoped>
.product-detail-container {
	padding-top: 140px;
	padding-bottom: 40px;
	background-color: #FEF9ED;
	min-height: 100vh;
	max-width: 90%;
}

.image-col {
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.product-image {
	width: 100%;
	height: 100%;
	border-radius: 16px;
}

.info-col {
	padding: 32px;
}

.product-name {
	font-size: 32px;
	font-weight: 700;
	margin-bottom: 24px;
	color: #312B1D;
}

.section-title {
	font-size: 20px;
	font-weight: 600;
	color: #6B4D27;
	margin: 24px 0 12px;
}

.info-section p {
	margin: 6px 0;
	font-size: 16px;
	color: #444;
}

.store-card {
	margin-bottom: 12px;
	padding: 12px;
	background-color: #f9f5eb;
	border-radius: 8px;
}

.store-content {
	display: flex;
	align-items: center;
}

.store-name {
	font-weight: 600;
	font-size: 16px;
}

.store-meta {
	font-size: 14px;
	color: #666;
}

.full-card-layout {
	display: flex;
	flex-direction: row;
	padding: 32px;
	border-radius: 16px;
	background-color: #fff;
	box-shadow: 0 4px 16px rgba(0,0,0,0.08);
	gap: 32px;
}

.top-actions {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 16px;
	gap: 12px;
}

.review-form {
	margin-bottom: 24px;
}

.review-card {
	padding: 12px;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-comment {
	font-size: 15px;
	color: #333;
}

.review-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.review-actions {
	display: flex;
	align-items: center;
}

.review-user {
	font-size: 16px;
	color: #312B1D;
}

.white-button {
	box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
	color: #444 !important;
}

.white-button:hover {
	background-color: #f0f0f0;
}

</style>
