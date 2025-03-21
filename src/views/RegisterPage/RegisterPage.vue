<template>
	<v-container class="register-container">
		<v-card class="register-card">
			<!-- Form -->
			<div class="form-container">
				<!-- Title -->
				<v-card-title class="register-title">Înregistrare</v-card-title>

				<v-card-text>
					<v-form ref="registerForm" @submit.prevent="handleRegister">
						<!-- Username input -->
						<v-text-field
							v-model="username"
							label="Nume utilizator"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="mdi-account"
							:rules="[rules.required]"
						/>

						<!-- Email input -->
						<v-text-field
							v-model="email"
							label="Email"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="mdi-email"
							:rules="[rules.required, rules.email]"
						/>

						<!-- Password input -->
						<v-text-field
							v-model="password"
							label="Parolă"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="mdi-lock"
							:type="showPassword ? 'text' : 'password'"
							:append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
							@click:append-inner="showPassword = !showPassword"
							:rules="[rules.required, rules.minLength]"
						/>

						<!-- Confirm Password input -->
						<v-text-field
							v-model="confirmPassword"
							label="Confirmă parola"
							variant="outlined"
							density="comfortable"
							prepend-inner-icon="mdi-lock"
							:type="showConfirmPassword ? 'text' : 'password'"
							:append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
							@click:append-inner="showConfirmPassword = !showConfirmPassword"
							:rules="[rules.required, rules.matchPassword]"
						/>

						<!-- Error message -->
						<p v-if="registerError" class="error-text">Eroare la înregistrare! Verifică datele introduse.</p>
					</v-form>
				</v-card-text>
			</div>

			<!-- Actions -->
			<v-card-actions class="actions">
				<!-- Register button -->
				<v-btn
					block
					class="register-button"
					color="primary"
					:loading="loading"
					type="submit"
					@click.prevent="handleRegister"
				>
					Înregistrează-te
				</v-btn>

				<!-- Login Link -->
				<p class="login-link">
					Ai deja un cont?
					<a href="#" @click.prevent="navigateToLogin">Autentificare</a>
				</p>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.register-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #FEF9ED;
}

.form-container {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 40px;
}

.register-card {
	padding: 40px;
	width: 100%;
	height: 600px;
	max-width: 480px;
	text-align: center;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
}

.register-title {
	font-size: 28px;
	font-weight: 600;
	color: #312B1D;
}

.error-text {
	color: red;
	font-size: 14px;
	margin-bottom: 12px;
}

.actions {
	display: flex;
	flex-direction: column;
}

.register-button {
	margin-top: 16px;
	background-color: #F7B41A;
	color: #312B1D;
	font-size: 20px;
	font-weight: 500;
	text-transform: none;
}

.login-link {
	display: flex;
	justify-content: center;
}

.login-link p {
	font-size: 18px;
	color: #312B1D;
}

.login-link a {
	color: #F7B41A;
	text-decoration: none;
}

.login-link a:hover {
	text-decoration: underline;
}
</style>