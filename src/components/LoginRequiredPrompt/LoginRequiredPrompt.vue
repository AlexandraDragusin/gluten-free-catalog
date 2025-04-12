<template>
	<v-dialog
		:model-value="modelValue"
		@update:modelValue="$emit('update:modelValue', $event)"
		max-width="420"
		transition="dialog-bottom-transition"
	>
		<v-card class="login-dialog-card">
			<v-card-title class="headline d-flex justify-space-between align-center">
				<div class="d-flex align-center">
					<v-icon color="orange" size="28" class="mr-2">mdi-account-lock</v-icon>
					Autentificare necesară
				</div>
				<v-btn icon size="x-small" variant="plain" @click="$emit('update:modelValue', false)">
					<v-icon size="24">mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text class="login-dialog-text">
				Pentru a folosi această funcționalitate, trebuie să fii autentificat.
			</v-card-text>
			<v-card-actions class="login-dialog-actions justify-space-between">
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
	padding: 0px 24px !important;
	gap: 10px;
}
</style>