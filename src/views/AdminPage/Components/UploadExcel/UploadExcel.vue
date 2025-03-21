<template>
	<v-container class="upload-container">
		<v-card class="upload-card">
			<v-card-title class="upload-title">Încarcă fișierul Excel</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleFileUpload">
					<v-file-input
						v-model="selectedFile"
						label="Selectează fișierul Excel"
						variant="outlined"
						accept=".xls,.xlsx"
						prepend-icon="mdi-file-excel"
						show-size
						style="width: 100%; white-space: normal; overflow-wrap: break-word; word-wrap: break-word;"
					/>

					<p v-if="uploadError" class="error-text">Eroare la încărcare: {{ uploadError }}</p>
				</v-form>
			</v-card-text>

			<v-card-actions class="actions">
				<v-btn
					block
					class="upload-button"
					color="primary"
					:loading="loading"
					@click="handleFileUpload"
				>
					Încarcă fișierul
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.upload-container {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background-color: #FEF9ED;
}

.upload-card {
	padding: 40px;
	width: 100%;
	max-width: 500px;
	max-height: 600px;
	text-align: center;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
}

.upload-title {
	font-size: 24px;
	font-weight: 600;
	color: #312B1D;
	margin-bottom: 16px;
}

.error-text {
	color: red;
	font-size: 14px;
	margin-top: 12px;
}

.actions {
	display: flex;
	flex-direction: column;
}

.upload-button {
	margin-top: 16px;
	background-color: #F7B41A;
	color: #312B1D;
	font-size: 18px;
	font-weight: 500;
	text-transform: none;
}

</style>
