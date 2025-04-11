<template>
	<v-dialog v-model="modelValue" max-width="420" transition="dialog-bottom-transition">
		<v-card class="login-dialog-card">
			<v-card-title class="headline">
				<v-icon color="orange" size="28" class="mr-2">mdi-account-lock</v-icon>
				Autentificare necesară
			</v-card-title>
			<v-card-text class="login-dialog-text">
				Pentru a folosi această funcționalitate, trebuie să fii autentificat.
			</v-card-text>
			<v-card-actions class="login-dialog-actions">
				<v-spacer />
				<v-btn text @click="$emit('update:modelValue', false)">Închide</v-btn>
				<v-btn variant="flat" @click="goToLogin">Loghează-te</v-btn>
				<v-btn variant="flat" @click="goToRegister">Înregistrează-te</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script src="./script.js"></script>

<style scoped>
.login-dialog-card {
	border-radius: 12px;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.login-dialog-text {
	font-size: 16px;
	color: #444;
	margin-top: 8px;
	margin-bottom: 16px;
}

.login-dialog-actions {
	gap: 10px;
}
</style>