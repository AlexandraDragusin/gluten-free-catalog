<template>
	<v-card class="form-card">
		<v-card-title class="section-title">Adaugă un produs nou</v-card-title>

		<v-card-text>
			<!-- Logo -->
			<div class="edit-logo-container">
				<div class="logo-preview-box">
					<v-img
						v-if="logoPreview || product.image_url"
						:src="logoPreview || product.image_url"
						alt="Imagine produs"
						class="edit-logo-img"
					/>
					<v-icon v-else class="default-avatar">mdi-image-off</v-icon>
				</div>

				<div class="logo-buttons">
					<v-btn variant="outlined" class="logo-btn" @click="triggerImageUpload">Încarcă</v-btn>
					<v-btn
						v-if="logoPreview || product.image_url"
						variant="outlined"
						@click="removeImage"
						class="logo-btn"
					>
						Șterge
					</v-btn>
				</div>

				<input type="file" ref="imageInput" accept="image/*" @change="handleImageFile" hidden />
			</div>

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
				<v-switch v-model="product.producer_gluten_declaration" label="Declarație producător: Fără gluten"></v-switch>

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
					variant="outlined"
				></v-text-field>

				<v-text-field
					v-model="product.ean_code"
					label="Cod EAN"
					required
					variant="outlined"
				></v-text-field>

				<v-textarea v-model="product.description" label="Descriere" variant="outlined"></v-textarea>
				<v-text-field v-model="product.cross_grain_cert_code" label="Cod certificat Cross Grain" variant="outlined"></v-text-field>

				<v-select
					v-model="product.store_id"
					:items="stores"
					item-title="name"
					item-value="id"
					label="Magazin"
					:rules="[rules.requiredSelect]"
					variant="outlined"
					required
				></v-select>

				<v-select
					v-model="product.category_id"
					:items="categories"
					item-title="name"
					item-value="id"
					label="Categorie"
					:rules="[rules.requiredSelect]"
					variant="outlined"
					required
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

		<v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
			{{ snackbar.message }}
		</v-snackbar>
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
	margin-top: 14px;
	width: 100%;
	color: #312B1D;
	font-size: 16px;
	text-transform: none;
}

.edit-logo-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 20px;
}

.logo-preview-box {
	width: 160px;
	height: 160px;
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

.logo-buttons {
	display: flex;
	gap: 8px;
}

.logo-btn {
	text-transform: none;
	font-size: 14px;
	width: 150px;
}

.default-avatar {
	font-size: 80px;
	color: #aaa;
}
</style>
  