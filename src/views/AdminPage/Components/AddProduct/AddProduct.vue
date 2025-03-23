<template>
	<v-card class="form-card">
	<v-card-title class="section-title">Adaugă un produs nou</v-card-title>

	<v-card-text>
		<v-form ref="form" @submit.prevent="submitForm" validate-on="submit">
			<v-text-field
				v-model="product.name"
				label="Denumire produs"
				:rules="[rules.required]"
				variant="outlined"
				required
			></v-text-field>

			<v-text-field v-model="product.brand" label="Brand" variant="outlined"></v-text-field>

			<v-switch v-model="product.made_in_romania" label="Fabricat în România"></v-switch>
			<v-switch v-model="product.certified_arig" label="Certificat ARIG"></v-switch>

			<v-text-field
				v-model="product.weight"
				label="Greutate"
				type="number"
				:rules="[rules.isNumber]"
				variant="outlined"
			></v-text-field>

			<v-text-field
				v-model="product.unit"
				label="Unitate"
				:rules="[rules.required]"
				required
				variant="outlined"
			></v-text-field>

			<v-text-field
				v-model="product.ean_code"
				label="Cod EAN"
				required
				variant="outlined"
			></v-text-field>

			<v-text-field v-model="product.image_url" label="URL imagine" variant="outlined"></v-text-field>

			<v-textarea v-model="product.description" label="Descriere" variant="outlined"></v-textarea>
			<v-text-field v-model="product.cross_grain_cert_code" label="Cod certificat Cross Grain (opțional)" variant="outlined"></v-text-field>

			<v-select
				v-model="product.store_id"
				:items="stores"
				item-title="name"
				item-value="id"
				label="Selectează magazinul"
				variant="outlined"
			></v-select>

			<v-select
				v-model="product.category"
				:items="categories"
				item-title="category"
				item-value="category"
				label="Selectează categoria"
				variant="outlined"
			></v-select>

			<v-combobox
				v-model="product.allergen_tags"
				:items="allergens"
				label="Etichete alergeni"
				variant="outlined"
				multiple
				chips
			></v-combobox>

			<v-btn
				type="submit"
				color="primary"
				class="submit-button"
				:loading="isSubmitting"
				:disabled="isSubmitting"
				>
				Adaugă produsul
			</v-btn>
		</v-form>
	</v-card-text>
	</v-card>
</template>

<script src="./script.js"></script>

<style scoped>
.form-card {
	padding: 24px;
	width: 700px;
	border-radius: 12px;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
	background: white;
}

.section-title {
	font-size: 20px;
	color: #312B1D;
	text-align: center;
	margin-bottom: 16px;
}

.submit-button {
	margin-top: 16px;
	width: 100%;
	color: #312B1D;
	text-transform: none;
}
</style>
  