<template>
	<v-container class="login-container">
	<v-card class="login-card">
		<!-- Form -->
		<div class="form-container">
			<!-- Title -->
			<v-card-title class="login-title">Autentificare</v-card-title>
			
			<v-card-text>
				<v-form ref="loginForm" @submit.prevent="handleLogin">
					<!-- Email input -->
					<v-text-field
						autocomplete="email"
						v-model="email"
						label="Email"
						variant="outlined"
						density="comfortable"
						prepend-inner-icon="mdi-email"
						:rules="[rules.required]"
					/>

					<!-- Password input -->
					<v-text-field
						autocomplete="current-password"
						v-model="password"
						label="Parolă"
						variant="outlined"
						density="comfortable"
						prepend-inner-icon="mdi-lock"
						:type="showPassword ? 'text' : 'password'"
						:append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
						@click:append-inner="showPassword = !showPassword"
						:rules="[rules.required]"
					/>

					<!-- Error message -->
					<p v-if="loginError" class="error-text"> {{ loginError }}</p>

					<button type="submit" @click.prevent="handleLogin" style="display: none;"></button>
				</v-form>
			</v-card-text>
		</div>

		<!--Actions -->
		<v-card-actions class="actions">
			<!-- Login button -->
			<v-btn
				block
				class="login-button"
				color="primary"
				:loading="loading"
				type="submit"
				@click.prevent="handleLogin"
			>
				Conectare
			</v-btn>

			<!-- Register Link -->
			<p class="register-link">Nu ai cont?
				<a href="#" @click.prevent="navigateToRegister">Înregistrează-te</a>
			</p>
		</v-card-actions>
	</v-card>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.login-container {
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

.login-card {
	padding: 40px;
	width: 100%;
	height: 600px;
	max-width: 480px;
	text-align: center;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
}

.login-title {
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

.login-button {
	margin-top: 16px;
	background-color: #F7B41A;
	color: #312B1D;
	font-size: 20px;
	font-weight: 500;
	text-transform: none;
}

.register-link {
	display: flex;
	justify-content: center;
}

.register-link p {
	font-size: 18px;
	color: #312B1D;
}

.register-link a {
	color: #F7B41A;
	text-decoration: none;
}

.register-link a:hover {
	text-decoration: underline;
}
</style>