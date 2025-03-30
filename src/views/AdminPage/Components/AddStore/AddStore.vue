<template>
	<v-card class="form-card">
		<v-card-title class="section-title">Adaugă un magazin nou</v-card-title>

		<v-card-text>
			<div class="edit-logo-container">
				<div class="logo-preview-box">
					<v-img
						v-if="logoPreview"
						:src="logoPreview"
						class="edit-logo-img"
						alt="Logo magazin"
					/>
					<v-icon v-else class="default-avatar">mdi-image-off</v-icon>
				</div>
				<div class="logo-buttons">
					<v-btn variant="outlined" @click="triggerLogoUpload" class="logo-btn">Încarcă logo</v-btn>
					<v-btn
						v-if="logoFile || store.logo_url"
						variant="outlined"
						@click="removeLogo"
						class="logo-btn"
					>
						Șterge logo
					</v-btn>
				</div>

				<input
					ref="logoInput"
					type="file"
					accept="image/*"
					@change="uploadLogo"
					hidden
				/>
			</div>

			<v-form ref="form" @submit.prevent="submitForm" validate-on="submit lazy">
				<v-text-field
					v-model="store.name"
					label="Nume magazin"
					variant="outlined"
					:rules="[rules.required]"
					required
				></v-text-field>

				<v-select
					v-model="store.type"
					variant="outlined"
					:items="['Fizic', 'Online', 'Mixt', 'Restaurant']"
					label="Tip magazin"
					:rules="[rules.required]"
					required
				></v-select>

				<v-card-subtitle class="mt-4">Adrese magazin (poți adăuga mai multe)</v-card-subtitle>
				<div v-for="(addr, index) in store.addresses" :key="index" class="mb-4">
					<v-text-field v-model="addr.address" label="Adresă" variant="outlined"></v-text-field>
					<v-text-field v-model="addr.city" label="Oraș" variant="outlined"></v-text-field>
					<v-text-field v-model="addr.county" label="Județ" variant="outlined"></v-text-field>
					<v-text-field v-model="addr.country" label="Țară" variant="outlined"></v-text-field>
					<v-btn color="error" text @click="removeAddress(index)" v-if="store.addresses.length > 1">
						Șterge adresa
					</v-btn>
					<v-divider class="my-2" v-if="store.addresses.length > 1"></v-divider>
				</div>

				<v-btn class="mb-4" color="secondary" @click="addAddress">
					+ Adaugă adresă
				</v-btn>

				<v-text-field
					v-model="store.logo_url"
					label="URL siglă"
					variant="outlined"
				></v-text-field>

				<v-text-field
					v-model="store.website"
					label="Website"
					variant="outlined"
				></v-text-field>

				<v-textarea
					v-model="store.description"
					label="Descriere"
					variant="outlined"
				></v-textarea>

				<v-switch
					v-model="store.arig_partner"
					label="Este partener ARIG?"
				></v-switch>

				<v-text-field
					v-model="store.discount_percentage"
					label="Reducere partener (%)"
					variant="outlined"
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
	margin-top: 16px;
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