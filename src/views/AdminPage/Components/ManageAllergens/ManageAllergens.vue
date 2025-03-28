<template>
	<v-card class="manage-card">
		<v-card-title class="title">Alergeni</v-card-title>
	
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
					:disabled="selectedAllergens.length === 0"
					@click="showConfirmDialog = true"
				>
					<v-icon left>mdi-delete</v-icon>Șterge ({{ selectedAllergens.length }})
				</v-btn>
			</div>
		</div>

		<!-- Allergens table -->
		<v-data-table
			:headers="headersToUse"
			:items="allergens"
			class="custom-table"
			item-value="code"
			return-object
			v-model="selectedAllergens"
			:show-select="selectionMode"
			:page="pagination.page"
			:items-per-page="pagination.itemsPerPage"
			@update:page="pagination.page = $event"
			@update:items-per-page="pagination.itemsPerPage = $event"
			show-current-page
			items-per-page-text="Elemente pe pagină"
			no-data-text="Nu există alergeni."
		>	
			<template v-slot:[`item.placeholder`]>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-icon small class="mr-2" @click="editAllergen(item)">mdi-pencil</v-icon>
			</template>

			<template v-slot:bottom>
				<div class="pagination-container">
					<span class="pagination-label">Pagina anterioară</span>
					<v-pagination
						v-model="pagination.page"
						:length="Math.ceil(allergens.length / pagination.itemsPerPage)"
						total-visible="7"
					/>
					<span class="pagination-label">Pagina următoare</span>
				</div>
			</template>
		</v-data-table>
	</v-card>

	<!-- Edit allergen dialog -->
	<v-dialog v-model="editDialog" max-width="500">
		<v-card v-if="editedAllergen">
			<v-card-title>Editare alergen: {{ editedAllergen?.code }}</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="updateAllergen">
					<v-text-field
						v-model="editedAllergen.code"
						label="Cod alergen (unic)"
						variant="outlined"
						required
					/>
					<v-text-field
						v-model="editedAllergen.name"
						label="Nume alergen"
						variant="outlined"
						required
					/>
				</v-form>
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn text @click="cancelEdit">Anulează</v-btn>
				<v-btn color="primary" @click="updateAllergen">Salvează</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Add allergen dialog -->
	<v-dialog v-model="showAddDialog" max-width="500">
		<v-card>
			<v-card-title>Adaugă alergen nou</v-card-title>
			<v-card-text>
				<v-form @submit.prevent="addAllergen">
					<v-text-field
						v-model="newAllergen.code"
						label="Cod alergen (unic)"
						variant="outlined"
						required
					/>
					<v-text-field
						v-model="newAllergen.name"
						label="Nume alergen"
						variant="outlined"
						required
					/>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="showAddDialog = false">Anulează</v-btn>
				<v-btn color="primary" @click="addAllergen">Adaugă</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Confirm dialog -->
	<v-dialog v-model="showConfirmDialog" max-width="400">
		<v-card>
			<v-card-title class="text-h6">Confirmare ștergere</v-card-title>
			<v-card-text>
				Sigur vrei să ștergi <strong>{{ selectedAllergens.length }}</strong> alergen(i)?
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
	flex-wrap: wrap;
}

.add-form .v-btn {
	height: 56px;
	margin-bottom: 20px;
}

.edit-label {
	margin-bottom: 8px;
	font-weight: 500;
	font-size: 16px;
	color: #444;
	width: 100%;
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