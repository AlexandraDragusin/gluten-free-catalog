<template>
	<v-container fluid class="store-detail-container">
	<v-row>
		<v-col cols="12">
			<v-card class="store-card">
				<!-- Header with logo and basic info -->
				<div class="store-header">
					<div class="logo-container">
						<v-img
							:src="store.logo_url || require('@/assets/no-image.png')"
							alt="Logo magazin"
							class="store-logo"
							contain
						/>
					</div>

					<div class="store-info">
						<h1 class="store-name">{{ store.name }}
							<a
								v-if="store.website"
								:href="store.website.startsWith('http') ? store.website : 'https://' + store.website"
								target="_blank"
								rel="noopener noreferrer"
							>
								<v-icon class="website-icon">mdi-open-in-new</v-icon>
							</a>
						</h1>
						<div class="store-meta">
							<div class="store-type">
								<v-icon left small>mdi-storefront</v-icon>
								{{ translateType(store.type) }}
							</div>

							<div class="store-arig" v-if="store.arig_partner">
								<v-icon left small>mdi-certificate</v-icon>
								Partener ARIG
							</div>

							<div class="store-discount" v-if="store.discount_percentage">
								<v-icon left small>mdi-percent</v-icon>
								{{ store.discount_percentage }}% discount
							</div>
						</div>
					</div>
				</div>

				<v-divider class="my-4" />

				<!-- Description -->
				<div v-if="store.description" class="store-description">
					<h2 class="section-title">
						<!-- put space between  -->
						<v-icon left>mdi-text</v-icon>
						Despre magazin
					</h2>
					<div class="description-content">
						<p>{{ store.description }}</p>
					</div>
				</div>

				<!-- Categories -->
				<div class="store-section">
					<h2 class="section-title">
						<v-icon left>mdi-tag-multiple</v-icon>
						Categorii disponibile
					</h2>
					<div v-if="categories.length" class="categories-list">
						<v-chip v-for="category in categories" :key="category.id" class="mr-2 mb-2">
							{{ category.name }}
						</v-chip>
					</div>
					<p v-else class="text-grey">Nu sunt categorii disponibile</p>
				</div>

				<!-- Address selector -->
				<div v-if="availableAddresses.length > 0" class="store-section">
					<h2 class="section-title">
						<v-icon left>mdi-map-marker</v-icon>
						Locații
					</h2>

					<v-select
						v-if="availableAddresses.length > 1"
						v-model="selectedAddress"
						:items="availableAddresses"
						item-title="text"
						item-value="value"
						label="Selectează adresa"
						variant="outlined"
						density="comfortable"
						class="mb-4"
						hide-details
						@update:modelValue="onAddressSelected"
				/>

				<div v-if="selectedAddress" class="address-info">					
					<!-- Map -->
					<div v-show="mapReady" class="store-map">
						<l-map
							v-if="mapReady && mapCenter && mapCenter.length === 2"
							:zoom="15"
							:center="mapCenter"
						>
							<l-tile-layer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution="&copy; OpenStreetMap contributors"
							/>
							<l-marker :lat-lng="mapCenter" />
						</l-map>
					</div>
					<p class="address-text">{{ formatAddress(selectedAddress) }}</p>
				</div>
				</div>

				<!-- Products by category -->
				<div v-if="Object.keys(categoryProducts).length > 0" class="store-section">
					<h2 class="section-title">
						<v-icon left>mdi-storefront</v-icon>
						Produse disponibile
					</h2>

					<div v-for="category in categories" :key="category.id" class="category-products">
						<h3 class="category-title">{{ category.name }}</h3>
		
						<v-slide-group show-arrows class="products-slider">
							<v-slide-group-item
								v-for="product in categoryProducts[category.id]"
								:key="product.id"
								v-slot="{ isSelected }"
							>
								<v-card
									class="product-card"
									:class="{ 'selected-card': isSelected }"
									@click="$emit('navigate-to-product-detail', product.id)"
								>
									<v-img
										:src="product.image_url || require('@/assets/no-image.png')"
										height="140"
										cover
										class="product-image"
									/>
									<v-card-title class="product-name">{{ product.name }}</v-card-title>
								</v-card>
							</v-slide-group-item>
						</v-slide-group>
					</div>
				</div>
			</v-card>
		</v-col>
	</v-row>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.store-detail-container {
	padding: 140px 0 40px;
	min-height: 100vh;
	max-width: 90%;
}

.store-card {
	padding: 60px;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.store-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	margin-bottom: 24px;
}

.logo-container {
	width: 160px;
	height: 160px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.store-logo {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
}

.store-info {
	text-align: center;
}

.store-name {
	font-size: 1.8rem;
	font-weight: 600;
	color: #312B1D;
	margin-bottom: 12px;
}

.website-icon {
	font-size: 24px !important;
	line-height: 1;
}

.store-meta {
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-top: 8px;
}

.store-type, .store-arig, .store-discount {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #312B1D;
  gap: 6px;
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

.description-content {
  line-height: 1.6;
  text-align: left;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  background-color: #fef9ed !important;
  max-width: 75%;
  line-height: 1.8;
}

.store-section {
	margin-bottom: 32px;
}

.categories-list {
	display: flex;
	flex-wrap: wrap;
}

.address-info {
	padding: 16px;
	border-radius: 8px;
}

.address-text {
	font-size: 0.95rem;
	margin-bottom: 16px;
	color: #312B1D;
}

.store-map {
	height: 300px;
	border-radius: 8px;
	overflow: hidden;
	margin-top: 12px;
	border: 1px solid rgba(0, 0, 0, 0.05);
}

.category-products {
	margin-bottom: 32px;
}

.category-title {
	font-size: 1.1rem;
	font-weight: 500;
	margin-bottom: 16px;
	color: #312B1D;
}

.products-slider {
	padding: 8px 0;
}

.product-card {
	width: 180px;
	margin: 0 8px;
	border-radius: 8px;
	overflow: hidden;
	transition: transform 0.2s, box-shadow 0.2s;
	cursor: pointer;
	background-color: white;
}

.product-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
	background: #FEF9ED;
}

.product-name {
	font-size: 0.9rem;
	font-weight: 500;
	padding: 12px;
	white-space: normal;
	line-height: 1.3;
	color: #312B1D;
}

.v-chip {
	background-color: #FEF9ED !important;
	color: #312B1D !important;
	border: 1px solid rgba(0, 0, 0, 0.1);
}

.v-chip--small {
	font-size: 0.75rem;
}

@media (min-width: 768px) {
  .store-header {
    flex-direction: row;
    text-align: left;
    align-items: flex-start;
  }
  
  .store-info {
    text-align: left;
    flex: 1;
  }
  
  .store-logo {
    margin-right: 24px;
  }
}

@media (max-width: 600px) {
  .store-detail-container {
    padding: 16px;
    max-width: 100%;
  }
  
  .store-card {
    padding: 16px;
  }
  
  .product-card {
    width: 160px;
  }
}
</style>