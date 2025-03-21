<template>
	<div
		:style="{
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			gap: '8px',
			alignItems: 'center'
		}"
	>
		<v-icon @click="handleClick"> mdi-account </v-icon>

		<v-btn
			class="login-button"
			color="primary"
			:style="{
				cursor: 'pointer'
			}"
			@click="handleClick"
		>
			{{ isLoggedIn ? (userRole === 'admin' ? "Administrator" : "Profilul meu") : "Conectare" }}
	</v-btn>
	</div>
	
</template>

<script src="./script.js"></script>

<style scoped>
.login-button {
	font-weight: 400;
	font-size: 24px !important;
	text-transform: none;
}
</style>