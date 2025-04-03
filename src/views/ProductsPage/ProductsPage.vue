<template>
	<v-container class="products-page" fluid ref="productContainer">
	<!-- Filter and Sort Buttons -->
		<v-row class="filter-button-row">
			<v-col cols="12" class="filter-button-wrapper">
				<div class="filter-actions">
					<v-btn color="grey" variant="outlined" class="filter-btn" @click="toggleSortOrder">
					<v-icon left>mdi-sort-alphabetical-variant</v-icon>
					Sortare: {{ sortOrder === 'asc' ? 'A-Z' : 'Z-A' }}
					</v-btn>

					<v-btn color="grey" variant="outlined" class="filter-btn" @click="openFilterDialog">
					<v-icon left>mdi-filter-variant</v-icon>
					Filtrează
					</v-btn>

					<v-btn v-if="hasActiveFilters" color="grey" variant="outlined" class="filter-btn" @click="resetFilters">
						<v-icon left>mdi-close-circle</v-icon>
						Resetează filtrele
					</v-btn>
				</div>
			</v-col>
		</v-row>

		<!-- Product Grid -->
		<div
			v-if="paginatedProducts.length > 0"
			class="products-grid"
		>
			<div
				v-for="product in paginatedProducts"
				:key="product.id"
				class="product-card-wrapper"
				:style="{ width: cardSize + 'px' }"
			>
				<v-card class="product-card">
				<v-img :src="product.image_url || require('@/assets/no-image.png')" class="product-image" cover></v-img>
				<v-card-text class="product-info">
					<p class="product-brand">{{ product.brand || 'EAN: ' + product.ean }}</p>
					<h3 class="product-name">{{ product.name }}</h3>
					<p v-if="product.weight && product.unit" class="product-weight">
						{{ product.weight }} {{ product.unit }}
					</p>
				</v-card-text>
				</v-card>
			</div>
		</div>

		<!-- No results -->
		<v-row v-else justify="center" class="no-results-row">
			<v-col cols="12" class="text-center">
			<v-icon color="grey" size="48">mdi-cube-off</v-icon>
			<p class="no-results-msg">Nu există produse care să corespundă criteriilor de filtrare.</p>
			</v-col>
		</v-row>

		<!-- Pagination -->
		<v-row v-if="filteredProducts.length > 0" justify="center" class="pagination-row">
			<span class="pagination-label">Pagina anterioară</span>
			<v-pagination
				v-model="pagination.page"
				:length="pageCount"
				total-visible="7"
				color="orange"
			/>
			<span class="pagination-label">Pagina următoare</span>
		</v-row>

		<!-- Filter Dialog -->
		<v-dialog v-model="showFilterDialog" max-width="500">
			<v-card>
			<v-card-title>Filtrare produse</v-card-title>
			<v-card-text>
				<v-text-field v-model="filterDraft.name" label="Nume" variant="outlined" />
				<v-text-field v-model="filterDraft.brand" label="Brand" variant="outlined" />

				<v-select
					v-model="filterDraft.categories"
					:items="categories"
					item-title="name"
					item-value="name"
					label="Categorii"
					variant="outlined"
					clearable
					multiple
				/>

				<v-switch
					v-model="filterDraft.made_in_romania"
					label="Fabricat în România"
					inset
					:indeterminate="filterDraft.made_in_romania === null"
					@click="toggleSwitch('made_in_romania')"
				/>

				<v-switch
					v-model="filterDraft.certified_arig"
					label="Certificat ARIG"
					inset
					:indeterminate="filterDraft.certified_arig === null"
					@click="toggleSwitch('certified_arig')"
				/>

				<v-switch
					v-model="filterDraft.producer_gluten_declaration"
					label="Declarație producător fără gluten"
					inset
					:indeterminate="filterDraft.producer_gluten_declaration === null"
					@click="toggleSwitch('producer_gluten_declaration')"
				/>

				<v-combobox
					v-model="filterDraft.excluded_allergens"
					:items="allergens"
					item-title="name"
					item-value="code"
					label="Exclude alergeni"
					multiple
					chips
					clearable
					variant="outlined"
				/>

				<v-select
					v-model="filterDraft.stores"
					:items="storeOptions"
					item-title="name"
					item-value="id"
					label="Magazine"
					multiple
					clearable
					variant="outlined"
				/>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="showFilterDialog = false">Anulează</v-btn>
				<v-btn color="primary" @click="applyFilterDialog">Aplică</v-btn>
			</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.products-page {
	background-color: #fef9ed;
	padding-top: 120px;
	padding-bottom: 40px;
}

.filter-actions {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.filter-btn {
	color: #312B1D;
	justify-content: end;
	font-weight: 500;
	box-shadow: none;
	text-transform: none;
}

.filter-button-row {
	margin-bottom: 20px;
}

.filter-button-wrapper {
	max-width: 90%;
	margin: 0 auto;
	text-align: left;
}

.product-info {
	text-align: left;
	display: grid;
	grid-template-rows: auto auto 1fr auto;
	row-gap: 12px;
}

.product-image {
	flex: 0 0 50%;
	object-fit: contain;
	background-color: #fcf8e3;
}

.product-brand {
	font-size: 14px;
	color: #777;
	margin-bottom: 6px;
}

.product-weight {
	margin-top: auto;
	font-size: 14px;
	color: #444;
}

.products-grid {
	margin-top: 16px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 24px;
}

.product-card-wrapper {
	flex: 0 1 280px;
	max-width: 100%;
	padding: 0;
	height: 360px;
}

.product-card {
	height: 100%;
	background-color: #FDF6E3;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	justify-content: flex-start;
}

.product-name {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-top: 4px;
	margin-bottom: 6px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.no-results-row {
	min-height: 50vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-results-msg {
	color: #888;
	font-size: 20px;
	padding-bottom: 64px;
}

.pagination-row {
	margin-top: 24px;
	gap: 12px;
	justify-content: center;
	align-items: center;
}

.pagination-label {
	font-weight: 500;
	font-size: 14px;
	color: #555;
}
</style>
  