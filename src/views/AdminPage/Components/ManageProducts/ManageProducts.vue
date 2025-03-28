<template>
	<v-card class="manage-card">
		<!-- Titile -->
		<v-card-title class="title">Produse</v-card-title>

		<!-- Toolbar -->
		<div class="table-toolbar">
			<v-select
				v-model="pagination.itemsPerPage"
				:items="[5, 10, 25, 50]"
				class="items-per-page"
				label="Elemente pe pagină"
				density="compact"
				variant="outlined"
				hide-details
			/>

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

		<!-- Data -->
		<v-data-table
			:headers="headersToUse"
			:items="products"
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
						:length="Math.ceil(products.length / pagination.itemsPerPage)"
						total-visible="7"
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
				<v-form @submit.prevent="updateProduct">
					<v-text-field v-model="editedProduct.name" label="Nume" required variant="outlined"/>
					<v-text-field v-model="editedProduct.brand" label="Brand" variant="outlined"/>
					<v-text-field v-model="editedProduct.ean_code" label="Cod EAN" required variant="outlined"/>
					<v-select v-model="editedProduct.category" :items="categories" label="Categorie" required variant="outlined"/>
					<v-textarea v-model="editedProduct.description" label="Descriere" variant="outlined"/>
					<v-text-field v-model.number="editedProduct.weight" label="Greutate" type="number" variant="outlined"/>
					<v-text-field v-model="editedProduct.unit" label="Unitate" variant="outlined"/>
					<v-text-field v-model="editedProduct.cross_grain_cert_code" label="Certificat Crossed Grain" variant="outlined"/>
					<v-text-field v-model="editedProduct.image_url" label="Imagine URL" variant="outlined"/>

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

			<v-card-actions>
				<v-spacer />
				<v-btn text @click="cancelEdit">Anulează</v-btn>
				<v-btn color="primary" @click="updateProduct">Salvează</v-btn>
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

.items-per-page {
	max-width: 160px;
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

</style>