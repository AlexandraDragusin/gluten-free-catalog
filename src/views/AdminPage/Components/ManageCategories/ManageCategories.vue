<template>
	<v-card class="manage-card">
	<v-card-title class="title">Categorii</v-card-title>

	<v-card-text>
		<!-- Actions -->
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

		<!-- Data -->
		<v-data-table
			:headers="headers"
			:items="categories"
			class="elevation-1"
			item-value="name"
			return-object
			v-model="selectedCategories"
			:show-select="selectionMode"
			no-data-text="Nu există categorii."
		>
		<template v-slot:[`item.actions`]="{ item }">
			<v-icon small class="mr-2" @click="editCategory(item)">mdi-pencil</v-icon>
		</template>
		</v-data-table>

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
	</v-card-text>
	</v-card>
</template>
  

<script src="./script.js"></script>

<style scoped>
.manage-card {
	width: 100%;
	max-width: 800px;
	padding: 24px;
	border-radius: 12px;
	background-color: white;
	box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
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

.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
}

</style>
  