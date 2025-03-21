<template>
	<v-card class="form-card">
		<v-card-title class="section-title">Adaugă un magazin nou</v-card-title>

		<v-card-text>
		<v-form ref="form" @submit.prevent="submitForm" validate-on="submit">
			<v-text-field
				v-model="store.name"
				label="Nume magazin"
				required
			></v-text-field>

			<v-select
				v-model="store.type"
				:items="['Fizic', 'Online', 'Mixt', 'Restaurant']"
				label="Tip magazin"
				required
			></v-select>

			<v-text-field
				v-model="store.address"
				label="Adresă"
			></v-text-field>

			<v-text-field
				v-model="store.logo_url"
				label="URL siglă"
			></v-text-field>

			<v-text-field
				v-model="store.website"
				label="Website"
			></v-text-field>

			<v-textarea
				v-model="store.description"
				label="Descriere"
			></v-textarea>

			<v-switch
				v-model="store.arig_partner"
				label="Este partener ARIG?"
			></v-switch>

			<v-text-field
				v-model="store.discount_percentage"
				label="Reducere partener (%)"
				type="number"
			></v-text-field>

			<v-btn
				type="submit"
				color="primary"
				class="submit-button"
				>
				Adaugă magazinul
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
	background-color: #F7B41A;
	color: #312B1D;
	text-transform: none;
}
</style>