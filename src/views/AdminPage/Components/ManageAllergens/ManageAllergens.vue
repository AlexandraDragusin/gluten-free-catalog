<template>
	<v-card class="manage-card">
		<v-card-title class="title">Alergeni</v-card-title>

		<v-card-text>
			<!-- Form pentru adaugarea unui alergen -->
			<v-form
				@submit.prevent="addAllergen"
				class="add-form mb-4">
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
				<v-btn type="submit" color="secondary" class="mr-2">Adaugă</v-btn>
			</v-form>

			<!-- Dialog editare alergen -->
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

			<!-- Tabel alergeni -->
			<v-data-table
				:headers="headers"
				:items="allergens"
				class="elevation-1"
				item-value="code"
				no-data-text="Nu există alergeni."
			>
				<template v-slot:[`item.actions`]="{ item }">
					<v-icon small class="mr-2" @click="editAllergen(item)">mdi-pencil</v-icon>
					<v-icon small color="red" @click="deleteAllergen(item)">mdi-delete</v-icon>
				</template>
			</v-data-table>
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
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
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

</style>