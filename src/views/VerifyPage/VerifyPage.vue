<template>
	<v-container class="verify-container">
		<v-card class="verify-card">
			<v-card-title class="verify-title">Verifică-ți emailul</v-card-title>

			<v-card-text>
				<p class="instruction">Am trimis un cod de verificare la <b>{{ email }}</b>. Introdu-l mai jos pentru a activa contul.</p>

				<v-form @submit.prevent="verifyCode">
					<v-text-field
						autocomplete="one-time-code"
						variant="outlined"
						v-model="code"
						label="Cod de verificare"
						maxlength="6"
						counter
						required
					/>

					<v-btn
						block
						color="primary"
						:loading="loading"
						@click="verifyCode"
					>
						Verifică
					</v-btn>

					<v-btn
						block
						variant="text"
						class="mt-2"
						@click="resendCode"
						:loading="resending"
					>
						Trimite din nou codul
					</v-btn>

					<v-snackbar
						v-model="showErrorSnackbar"
						color="error"
						timeout="4000"
						rounded
					>
						{{ error }}
					</v-snackbar>

					<v-snackbar
						v-model="showSuccessSnackbar"
						color="success"
						timeout="3000"
						rounded
					>
						Cod corect. Vei fi redirecționat...
					</v-snackbar>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>
  
<script src="./script.js"></script>

<style scoped>
.verify-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #FEF9ED;
}

.verify-card {
	padding: 32px;
	max-width: 500px;
	width: 100%;
	text-align: center;
	border-radius: 12px;
}

.verify-title {
	font-size: 26px;
	font-weight: 600;
	margin-bottom: 16px;
}

.instruction {
	font-size: 16px;
	margin-bottom: 24px;
}
</style>
  