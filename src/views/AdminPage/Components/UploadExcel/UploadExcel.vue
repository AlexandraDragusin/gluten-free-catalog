<template>
	<v-container class="upload-container">
		<v-card class="upload-card">
			<v-card-title class="upload-title">Încarcă fișierul cu date</v-card-title>

			<v-card-text>
				<v-form @submit.prevent="handleFileUpload">
					<v-file-input
						v-model="selectedFile"
						label="Selectează fișierul Excel"
						variant="outlined"
						accept=".xls,.xlsx"
						prepend-icon="mdi-file-excel"
						show-size
					/>
				</v-form>
			</v-card-text>

			<v-card-actions class="actions">
				<v-btn
					block
					class="upload-button"
					color="secondary"
					:loading="loading"
					@click="handleFileUpload"
				>
					Încarcă fișierul
				</v-btn>
			</v-card-actions>

			<!-- Snackbar -->
			<v-snackbar
				v-model="snackbar.show"
				:color="snackbar.color"
				timeout="4000"
				top
			>
				{{ snackbar.message }}
			</v-snackbar>
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
	max-width: 640px;
	max-height: 600px;
	text-align: center;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
}

.upload-title {
	font-size: 20px;
	color: #312B1D;
	text-align: center;
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
	background-color: #F7B41A;
	margin-top: 16px;
	width: 100%;
	color: #312B1D;
	text-transform: none;
}

</style>
