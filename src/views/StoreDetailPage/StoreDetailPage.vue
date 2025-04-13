<template>
	<v-container fluid class="store-detail-container">
	<v-row>
		<v-col cols="12">
			<v-card class="full-card-layout">
				<!-- Logo -->
				<div class="logo-top-right">
					<v-img
						:src="store.logo_url || require('@/assets/no-image.png')"
						alt="Logo magazin"
						class="store-image"
						:style="imageStyle"
					/>
				</div>

				<!-- Store info -->
				<v-col cols="12" md="8" class="info-col">
					<h1 class="store-name">{{ store.name }}</h1>

					<p><strong>Tip magazin: </strong> {{ translateType(store.type) }}</p>
					<p><strong>Partener ARIG: </strong> {{ store.arig_partner ? 'Da' : 'Nu' }}</p>
					<p><strong>Discount oferit de magazin: </strong> {{ store.discount_percentage || 0 }}%</p>
					<p v-if="store.website">
						<strong>Website: </strong>
						<a
							v-if="store.website"
							:href="store.website.startsWith('http') ? store.website : 'https://' + store.website"
							target="_blank"
							rel="noopener noreferrer"
						>{{ store.website }}</a>
						<span v-else>-</span>
					</p>

					<div v-if="store.description">
						<h3 class="section-title">Descriere</h3>
						<p>{{ store.description }}</p>
					</div>

					<div>
						<h3 class="section-title">Categorii de produse</h3>
						<p v-if="categories.length">{{ categories.map(c => c.name).join(', ') }}</p>
						<p v-else class="text-grey">Nu sunt categorii disponibile</p>
					</div>

					<div v-if="availableAddresses.length === 1 && selectedAddress" class="mt-6">
						<h3 class="section-title">Adresă magazin</h3>
						<p>{{ formatAddress(selectedAddress) }}</p>
					</div>
				</v-col>
			
				<v-row v-if="availableAddresses.length > 1" class="mt-4">
					<v-col cols="12" md="8">
						<v-select
							v-model="selectedAddress"
							:items="availableAddresses"
							item-title="text"
							item-value="value"
							label="Selectează adresa"
							variant="outlined"
							clearable
							return-object
							hide-details
							density="compact"
							@update:modelValue="onAddressSelected"
						/>
					</v-col>
				</v-row>

				<!-- Map-->
				<v-row v-show="mapReady" class="mt-6">
					<v-col cols="12">
						<h3 class="section-title1" style="display: flex; justify-content: center; width: 100%;" >Locația magazinului pe hartă</h3>
						<l-map
							v-if="mapReady && mapCenter && mapCenter.length === 2"
							:zoom="15"
							:center="mapCenter"
							style="height: 300px; border-radius: 12px; overflow: hidden;"
							>
							<l-tile-layer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution="&copy; OpenStreetMap contributors"
							/>
							<l-marker v-if="mapCenter" :lat-lng="mapCenter" />
						</l-map>
					</v-col>
				</v-row>

				<!-- Categories -->
				<h3 class="section-title1 mt-10" style="display: flex; justify-content: center; width: 100%;">Descoperă categoriile magazinului</h3>
				<div v-for="category in categories" :key="category.id">
					<h4 class="mb-2">{{ category.name }}</h4>

					<v-slide-group
						show-arrows
						class="product-carousel"
					>
						<v-slide-group-item
							v-for="product in categoryProducts[category.id]"
							:key="product.id"
						>
							<v-card class="product-card" elevation="2" @click="$emit('navigate-to-product-detail', product.id)"							>
							<v-img
								:src="product.image_url || require('@/assets/no-image.png')"
								alt="Imagine produs"
								class="product-image"
								height="120"
								contain
							/>
							<v-card-title class="text-truncate">{{ product.name }}</v-card-title>
							</v-card>
						</v-slide-group-item>
					</v-slide-group>
				</div>
			</v-card>
		</v-col>
	</v-row>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.store-detail-container {
	padding-top: 120px;
	background-color: #FEF9ED;
	min-height: 100vh;
	max-width: 90%;
}

.full-card-layout {
	position: relative;
	padding: 32px;
	border-radius: 16px;
	background-color: white;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	min-height: 300px;
}

.logo-top-right {
	position: absolute;
	top: 32px;
	right: 32px;
	width: 300px;
	max-height: 300px;
}

.store-image {
	max-width: 100%;
	max-height: 300px;
	object-fit: contain;
	border-radius: 16px;
	box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.info-col {
	padding: 24px;
}

.store-name {
	font-size: 32px;
	font-weight: bold;
	margin-bottom: 16px;
	color: #312B1D;
}

.section-title{
	margin-top: 24px;
	margin-bottom: 8px;
	font-weight: 600;
	font-size: 18px;
}

.section-title1{
	margin-top: 24px;
	margin-bottom: 8px;
	font-weight: 600;
	font-size: 22px;
}

.product-carousel {
	padding-bottom: 32px;
	margin-bottom: 32px;
	overflow-x: auto;
}

.product-card {
	width: 240px;
	margin: 0 8px;
	box-shadow: none !important;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	cursor: pointer;
	border-radius: 12px;

}

.product-card:hover {
	transform: scale(1.05);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.product-image {
	object-fit: contain;
	border-radius: 8px;
	flex-shrink: 0;
}

</style>