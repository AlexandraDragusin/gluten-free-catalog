<template>
	<v-card class="manage-card">
	<v-card-title class="title">Categorii</v-card-title>

	<v-card-text>
		<v-form @submit.prevent="addCategory" class="add-form mb-4">
			<v-text-field
				v-model="newCategory"
				label="Categorie nouă"
				variant="outlined"
				required
			/>
			<v-btn type="submit" color="secondary" class="mr-2">Adaugă</v-btn>
		</v-form>

		<v-data-table
			:headers="headers"
			:items="categories"
			class="elevation-1"
			item-value="name"
			no-data-text="Nu există categorii."
		>
		<template v-slot:[`item.actions`]="{ item }">
			<v-icon small class="mr-2" @click="editCategory(item)">mdi-pencil</v-icon>
			<v-icon small color="red" @click="deleteCategory(item)">mdi-delete</v-icon>
		</template>
		</v-data-table>

		<!-- Formular pentru editare -->
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

		<!-- Snackbar notificări -->
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

</style>
  