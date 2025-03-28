<template>
	<v-card class="manage-card">
		<!-- Titile -->
		<v-card-title class="title">Categorii</v-card-title>

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
				<v-btn color="secondary" @click="showAddDialog = true">
					<v-icon left>mdi-plus</v-icon>Adaugă
				</v-btn>
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
					:disabled="selectedCategories.length === 0"
					@click="showConfirmDialog = true"
				>
					<v-icon left>mdi-delete</v-icon>Șterge ({{ selectedCategories.length }})
				</v-btn>
			</div>
		</div>

		<!-- Data -->
		<v-data-table
			:headers="headersToUse"
			:items="categories"
			class="custom-table"
			item-value="name"
			return-object
			v-model="selectedCategories"
			:show-select="selectionMode"
			:page="pagination.page"
			:items-per-page="pagination.itemsPerPage"
			@update:page="pagination.page = $event"
			@update:items-per-page="pagination.itemsPerPage = $event"
			show-current-page
			items-per-page-text="Elemente pe pagină"
			no-data-text="Nu există categorii."
		>	
			<template v-slot:[`item.placeholder`]>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-icon small class="mr-2" @click="editCategory(item)">mdi-pencil</v-icon>
			</template>

			<template v-slot:bottom>
				<div class="pagination-container">
					<span class="pagination-label">Pagina anterioară</span>
					<v-pagination
						v-model="pagination.page"
						:length="Math.ceil(categories.length / pagination.itemsPerPage)"
						total-visible="7"
					/>
					<span class="pagination-label">Pagina următoare</span>
				</div>
			</template>
		</v-data-table>
	</v-card>

	<!-- Edit category dialog -->
	<v-dialog v-model="editDialog" max-width="500">
		<v-card v-if="editedCategory">
			<v-card-title>Editare categorie: {{ originalName }}</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="updateCategory">
					<v-text-field
						v-model="editedCategory.name"
						label="Nume categorie"
						variant="outlined"
						required
					/>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="cancelEdit">Anulează</v-btn>
				<v-btn color="primary" @click="updateCategory">Salvează</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Add new category dialog -->
	<v-dialog v-model="showAddDialog" max-width="500">
		<v-card>
			<v-card-title>Adaugă categorie nouă</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="submitAddCategory">
					<v-text-field
						v-model="newCategory"
						label="Categorie nouă"
						variant="outlined"
						required
					/>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="showAddDialog = false">Anulează</v-btn>
				<v-btn color="primary" @click="submitAddCategory">Adaugă</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Confirm delete dialog -->
	<v-dialog v-model="showConfirmDialog" max-width="400">
		<v-card>
			<v-card-title class="text-h6">Confirmare ștergere</v-card-title>
			<v-card-text>
				Sigur vrei să ștergi <strong>{{ selectedCategories.length }}</strong> categorie(i)?
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="showConfirmDialog = false">Anulează</v-btn>
				<v-btn color="grey" variant="tonal" @click="confirmBulkDelete">Șterge</v-btn>
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
	max-width: 60%;
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

.add-form {
	display: flex;
	align-items: flex-end;
	gap: 20px;
}

.add-form .v-btn {
	height: 56px;
	margin-bottom: 20px;
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

.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
}

</style>
  