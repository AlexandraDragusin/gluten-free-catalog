<template>
	<!-- App Bar -->
	<v-app-bar
		app
		height="fit-content"
		:style="{
			backgroundColor: '#F7B41A',
			padding: '8px 32px'
		}"
	>
		<template v-slot:prepend>
			<div
				:style="{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '32px',
				}"
			>
				<v-img
					src="@/assets/logo.png"
					width="auto"
					height="auto"
					contain
					:style="{
						cursor: 'pointer',
						width: '72px',
						height: '100%',
						objectFit: 'contain'
					}"
					@click="navigateToHome"
				/>
				<v-btn text class="nav-button" @click="navigateToCategories"> Produse</v-btn>

				<v-btn text class="nav-button" @click="navigateToStores" > Magazine </v-btn>
			</div>

		</template>
		<template v-slot:append>
			<div
			:style="{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '32px',
				position: 'relative'
			}"
			>
			<!-- Search Field -->
			<v-menu
				v-model="menuOpen"
				:close-on-content-click="true"
				offset-y
				transition="fade-transition"
				max-width="400"
				max-height="600"
				content-class="search-results-menu"
			>
				<template v-slot:activator="{ props }">
					<v-text-field
						v-if="isSearchVisible"
						v-model="searchQuery"
						append-inner-icon="mdi-magnify"
						:loading="loadingSearch"
						clearable
						dense
						label="Caută un produs, categorie sau brand..."
						hide-details="auto"
						single-line
						variant="outlined"
						v-bind="props"
						:style="{
							cursor: 'pointer',
							minWidth: '400px',
							maxWidth: '600px',
						}"
						@input="onInput"
						@focus="onFocus"
						@click:clear="onClear"
						ref="searchField"
					/>
				</template>
				<v-card v-if="searchResults.products.length || searchResults.stores.length" class="search-results-card">
					<template v-for="(products, category) in groupedProductsByCategory" :key="category">
						<div class="results-section">
						<div class="section-header">
							<v-icon color="primary">mdi-tag</v-icon>
							<span class="section-title">{{ category }}</span>
						</div>
						<v-list lines="two" density="compact">
							<v-list-item
							v-for="product in products"
							:key="product.id"
							@click="navigateToProduct(product.id)"
							class="result-item"
							>
							<template v-slot:prepend>
								<v-avatar rounded="sm" size="48" class="mr-3">
								<v-img :src="product.image_url || require('@/assets/no-image.png')" />
								</v-avatar>
							</template>
							
							<v-list-item-title class="result-title">{{ product.name }}</v-list-item-title>
							<v-list-item-subtitle>
								<span v-if="product.brand">{{ product.brand }}</span>
								<span v-if="product.weight && product.unit"> • {{ product.weight }} {{ product.unit }}</span>
							</v-list-item-subtitle>
							</v-list-item>
						</v-list>
						</div>
					</template>

					<div v-if="searchResults.stores.length" class="results-section">
						<div class="section-header">
						<v-icon color="primary">mdi-store</v-icon>
						<span class="section-title">Magazine</span>
						</div>
						<v-list lines="two" density="compact">
						<v-list-item
							v-for="store in searchResults.stores"
							:key="store.id"
							@click="navigateToStore(store.id, store.name)"
							class="result-item"
						>
							<template v-slot:prepend>
								<v-avatar rounded="sm" size="48" class="mr-3">
									<v-img :src="store.logo || require('@/assets/no-image.png')" />
								</v-avatar>
							</template>

							<v-list-item-title class="result-title">{{ store.name }}</v-list-item-title>
							<v-list-item-subtitle>
							{{ translateStoreType(store.type) }}
							<span v-if="store.website"> • {{ store.website }}</span>
							</v-list-item-subtitle>
						</v-list-item>
						</v-list>
					</div>
					
					<div v-if="searchQuery && !searchResults.products.length && !searchResults.stores.length" class="no-results">
						<v-icon color="grey">mdi-magnify-close</v-icon>
						<span>Nu s-au găsit rezultate pentru "{{ searchQuery }}"</span>
					</div>
				</v-card>
			</v-menu>

			<!-- Login Button -->
			<LoginButton
				:isLoggedIn="isLoggedIn"
				:userRole="userRole"
				:style="{ cursor: 'pointer'}"
				@login-click="handleLoginClick"
			/>
			</div>
		</template>
	</v-app-bar>

	<!-- Breadcrumbs -->
	<Breadcrumb
		:crumbs="breadcrumbs"
		class="breadcrumb-bar"
	/>
</template>

<script src="./script.js"></script>

<style scoped>
.v-toolbar {
  height: "fit-content" !important;
}

.nav-button {
	cursor: 'pointer';
	font-weight: 400;
	font-size: 24px !important;
	text-transform: none;
}

.breadcrumb-bar {
	position: sticky;
	top: 88px;
	z-index: 10;
}

.search-results-menu {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12) !important;
  border-radius: 12px !important;
  overflow: hidden;
}

.search-results-card {
  padding: 12px;
  max-height: 500px;
  overflow-y: auto;
}

.results-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 8px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
  margin-left: 8px;
  color: #2c3e50;
}

.result-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-title {
  font-weight: 500;
  font-size: 15px;
  color: #2c3e50;
}

.no-results {
  display: flex;
  align-items: center;
  padding: 16px;
  color: #7f8c8d;
  gap: 8px;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

</style>