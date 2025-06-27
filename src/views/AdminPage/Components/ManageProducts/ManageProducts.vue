<template>
	<v-card class="manage-card">
		<!-- Titile -->
		<v-card-title class="title">Produse</v-card-title>

		<!-- Toolbar -->
		<div class="table-toolbar">
			<!-- Filter section actions-->
			<div class="toolbar-group">
				<v-btn
					:disabled="selectionMode"
					variant="tonal"
					@click="openFilterDialog"
					prepend-icon="mdi-filter-variant"
				>
					Filtrează
				</v-btn>

				<v-btn
					v-if="hasActiveFilters"
					:disabled="selectionMode"
					variant="tonal"
					prepend-icon="mdi-close-circle"
					@click="resetFilters"
				>
					Resetează filtrele
				</v-btn>
			</div>

			<div class="toolbar-group action-buttons">
				<div class="action-buttons" v-if="!selectionMode">
					<v-btn @click="selectionMode = true">
						<v-icon left>mdi-check</v-icon>Selectează
					</v-btn>
				</div>

				<div class="action-buttons" v-else>
					<v-btn @click="cancelSelection">
						<v-icon left>mdi-close</v-icon>Anulează
					</v-btn>
					<v-btn
						color="grey"
						variant="tonal"
						:disabled="selectedProducts.length === 0"
						@click="showConfirmDialog = true"
					>
						<v-icon left>mdi-delete</v-icon>Șterge ({{ selectedProducts.length }})
					</v-btn>
				</div>
			</div>
		</div>

		<!-- Data -->
		<v-data-table
			:headers="headersToUse"
			:items="filteredProducts"
			class="custom-table"
			item-value="id"
			return-object
			v-model="selectedProducts"
			:show-select="selectionMode"
			:page="pagination.page"
			:items-per-page="pagination.itemsPerPage"
			@update:page="pagination.page = $event"
			@update:items-per-page="pagination.itemsPerPage = $event"
			show-current-page
			items-per-page-text="Elemente pe pagină"
			no-data-text="Nu există produse."
		>	
			<template v-slot:[`item.placeholder`]>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-icon small class="mr-2" @click="editProduct(item)">mdi-pencil</v-icon>
			</template>

			<template v-slot:[`item.image_url`]="{ item }">
				<v-img :src="item.image_url" max-width="80" max-height="40" contain />
			</template>

			<template v-slot:[`item.weight`]="{ item }">
				{{ formatWeight(item.weight) }}
			</template>

			<template v-slot:[`item.ean_code`]="{ item }">
				{{ item.ean_code }}
			</template>

			<template v-slot:[`item.producer_gluten_declaration`]="{ item }">
				{{ item.producer_gluten_declaration ? 'da' : 'nu' }}
			</template>

			<template v-slot:[`item.made_in_romania`]="{ item }">
				{{ item.made_in_romania ? 'da' : 'nu' }}
			</template>

			<template v-slot:[`item.certified_arig`]="{ item }">
				{{ item.certified_arig ? 'da' : 'nu' }}
			</template>

			<template v-slot:bottom>
				<div class="pagination-container">
					<span class="pagination-label">Pagina anterioară</span>
					<v-pagination
						v-model="pagination.page"
						:length="Math.ceil(filteredProducts.length / pagination.itemsPerPage)"
						total-visible="7"
						@update:modelValue="scrollToTop"
					/>
					<span class="pagination-label">Pagina următoare</span>
				</div>
			</template>
		</v-data-table>
	</v-card>

	<!-- Edit dialog -->
	<v-dialog v-model="editDialog" max-width="800px">
		<v-card v-if="editedProduct">
			<v-card-title>Editare produs: {{ editedProduct.name }}</v-card-title>

			<v-card-text>
				<!-- Upload and preview product image -->
				<div class="edit-logo-container">
					<div class="logo-preview-box">
						<v-img
							v-if="productImagePreview || editedProduct.image_url"
							:src="productImagePreview || editedProduct.image_url"
							alt="Imagine produs"
							ref="editImage"
							class="edit-logo-img"
							cover
						/>
						<v-icon v-else class="default-avatar">mdi-image-off</v-icon>
					</div>

					<div class="logo-buttons">
						<v-btn variant="outlined" class="logo-btn" @click="triggerImageUpload">Încarcă</v-btn>
						<v-btn
							v-if="productImagePreview || editedProduct.image_url"
							variant="outlined"
							@click="removeImage"
							class="logo-btn"
						>
							Șterge
						</v-btn>
					</div>

					<input type="file" ref="imageInput" accept="image/*" @change="handleImageFile" hidden />
				</div>

				<!-- Edit product form -->
				<v-form @submit.prevent="updateProduct">
					<v-text-field v-model="editedProduct.name" label="Nume" required variant="outlined"/>
					<v-select v-model="editedProduct.store_id" :items="storeOptions" item-title="name" item-value="id" label="Magazin" required variant="outlined"/>
					<v-text-field v-model="editedProduct.brand" label="Brand" variant="outlined"/>
					<v-text-field v-model="editedProduct.ean_code" label="Cod EAN" required variant="outlined"/>
					<v-select v-model="editedProduct.category_id" :items="categories" item-title="name" item-value="id" label="Categorie" required variant="outlined"/>
					<v-textarea v-model="editedProduct.description" label="Descriere" variant="outlined"/>
					<v-text-field v-model.number="editedProduct.weight" label="Greutate" type="number" variant="outlined"/>
					<v-text-field v-model="editedProduct.unit" label="Unitate" variant="outlined"/>
					<v-text-field v-model="editedProduct.cross_grain_cert_code" label="Certificat Crossed Grain" variant="outlined"/>

					<v-combobox
						v-model="editedProduct.allergen_tags"
						:items="allergens"
						item-title="name"
						item-value="code"
						label="Etichete alergeni"
						variant="outlined"
						multiple
						chips
					/>

					<v-switch v-model="editedProduct.made_in_romania" label="Produs în România" variant="outlined"/>
					<v-switch v-model="editedProduct.certified_arig" label="Etichetat Gluten Free" variant="outlined"/>
					<v-switch v-model="editedProduct.producer_gluten_declaration" label="Declarație producător (fără gluten)" variant="outlined"/>
				</v-form>
			</v-card-text>

			<v-card-actions class="sticky-actions">
				<v-btn text variant="outlined"  @click="cancelEdit">Anulează</v-btn>
				<v-btn variant="outlined" @click="updateProduct">Salvează</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Confirm dialog -->
	<v-dialog v-model="showConfirmDialog" max-width="400">
		<v-card>
			<v-card-title class="text-h6">Confirmare ștergere</v-card-title>
			<v-card-text>
				Sigur vrei să ștergi <strong>{{ selectedProducts.length }}</strong> produs(e)?
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="showConfirmDialog = false">Anulează</v-btn>
				<v-btn color="grey" variant="tonal" @click="confirmBulkDeleteProducts">Șterge</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Filter dialog -->
	<v-dialog v-model="showFilterDialog" max-width="600">
		<v-card>
			<v-card-title>Filtre produse</v-card-title>
			<v-card-text>
			<v-text-field
				v-model="filterDraft.name"
				label="Caută numele produsului"
				variant="outlined"
			/>

			<v-text-field
				v-model="filterDraft.brand"
				label="Caută numele brandului"
				variant="outlined"
			/>

			<v-select
				v-model="filterDraft.categories"
				:items="categories"
				item-title="name"
				item-value="id"
				label="Categorii"
				variant="outlined"
				multiple
				clearable
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
			<v-card-actions class="sticky-actions">
				<v-spacer />
				<v-btn text @click="showFilterDialog = false">Anulează</v-btn>
				<v-btn color="primary" @click="applyFilterDialog">Aplică</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Snackbar -->
	<v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
		{{ snackbar.message }}
	</v-snackbar>
</template>

<script src="./script.js"></script>

<style scoped>
.manage-card {
	padding: 24px;
	width: 100%;
	max-width: 90%;
	height: fit-content;
	background-color: white;
	box-shadow: 0 3px 6px rgba(0,0,0,0.1);
	margin: auto;
}
.title {
	font-size: 20px;
	color: #312B1D;
	text-align: center;
	margin-bottom: 16px;
}

.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
	margin-right: 16px;
}

.table-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	flex-wrap: wrap;
	gap: 12px;
}

.toolbar-group {
	display: flex;
	align-items: center;
	gap: 8px;
}

.custom-table {
	overflow: hidden;
	border: 1px solid #e0e0e0;
	box-shadow: none !important;
}

.custom-table :deep(.v-data-table__td) {
	height: 80px !important;
}

.custom-table :deep(.v-data-table__th) {
  font-weight: 600;
}

.pagination-container {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	gap: 12px;
	margin-bottom: 16px;
}

.pagination-label {
	font-size: 14px;
	font-weight: 500;
	color: #333;
}

.sticky-actions {
	position: sticky;
	bottom: 0;
	background-color: white;
	border-top: 1px solid #eee;
	padding: 12px 16px;
	z-index: 10;
}

.edit-logo-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 16px;
}

.logo-preview-box {
	width: 120px;
	height: 120px;
	border: 2px solid #ddd;
	border-radius: 8px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f9f9f9;
}

.logo-preview-box .v-img {
	object-fit: contain;
	max-width: 100%;
	max-height: 100%;
}

.default-avatar {
	font-size: 48px;
	color: #aaa;
}

.logo-buttons {
	display: flex;
	gap: 8px;
}

.logo-btn {
	text-transform: none;
	font-size: 13px;
}

</style>