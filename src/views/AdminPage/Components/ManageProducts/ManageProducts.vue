<template>
	<v-card class="manage-card">
		<v-card-title class="title">Produse</v-card-title>

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

		<v-card-text>
			<v-data-table
				:headers="headers"
				:items="products"
				item-value="id"
				return-object
				v-model="selectedProducts"
				:show-select="selectionMode"
				class="elevation-1"
				no-data-text="Nu există produse."
			>
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
			</v-data-table>

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
	max-width: 90%;
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

.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
	margin-right: 16px;
}

</style>