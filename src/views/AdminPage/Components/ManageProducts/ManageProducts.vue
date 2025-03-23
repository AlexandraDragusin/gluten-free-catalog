<template>
	<v-card class="manage-card">
		<v-card-title class="title">Produse</v-card-title>

		<v-card-text>
			<v-data-table
				:headers="headers"
				:items="products"
				item-value="id"
				class="elevation-1"
				no-data-text="Nu există produse."
			>
				<template v-slot:[`item.actions`]="{ item }">
					<v-icon small class="mr-2" @click="editProduct(item)">mdi-pencil</v-icon>
					<v-icon small color="red" @click="deleteProduct(item)">mdi-delete</v-icon>
				</template>
			</v-data-table>

			<!-- Dialog editare produs -->
			<v-dialog v-model="editDialog" max-width="800px">
				<v-card v-if="editedProduct">
					<v-card-title>Editare produs: {{ editedProduct.name }}</v-card-title>

					<v-card-text>
						<v-form @submit.prevent="updateProduct">
							<v-text-field v-model="editedProduct.name" label="Nume" required />
							<v-text-field v-model="editedProduct.brand" label="Brand" />
							<v-text-field v-model="editedProduct.ean_code" label="Cod EAN" required />
							<v-text-field v-model="editedProduct.category" label="Categorie" required />
							<v-textarea v-model="editedProduct.description" label="Descriere" />
							<v-text-field v-model.number="editedProduct.weight" label="Greutate" type="number" />
							<v-text-field v-model="editedProduct.unit" label="Unitate" />
							<v-text-field v-model="editedProduct.cross_grain_cert_code" label="Certificat Crossed Grain" />
							<v-text-field v-model="editedProduct.image_url" label="Imagine URL" />
							<v-text-field v-model="editedProduct.allergen_tags" label="Alergeni (virgulă separați)" />
							<v-switch v-model="editedProduct.made_in_romania" label="Produs în România" />
							<v-switch v-model="editedProduct.certified_arig" label="Etichetat Gluten Free" />
						</v-form>
					</v-card-text>

					<v-card-actions>
						<v-spacer />
						<v-btn text @click="cancelEdit">Anulează</v-btn>
						<v-btn color="primary" @click="updateProduct">Salvează</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

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
	max-width: 1500px;
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
</style>