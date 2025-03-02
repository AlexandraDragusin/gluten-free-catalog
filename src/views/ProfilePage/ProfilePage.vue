<template>
	<v-container class="profile-container">
		<v-card class="profile-card">
			<v-card-title class="profile-title">Profilul Meu</v-card-title>

			<v-card-text v-if="user">
				<v-list density="comfortable">
					<!-- Username -->
					<v-list-item>
						<v-icon class="profile-icon">mdi-account</v-icon>
						<span class="profile-text">{{ user.username }}</span>
					</v-list-item>

					<!-- Email -->
					<v-list-item>
						<v-icon class="profile-icon">mdi-email</v-icon>
						<span class="profile-text">{{ user.email }}</span>
					</v-list-item>

					<!-- Role -->
					<v-list-item>
						<v-icon class="profile-icon">mdi-shield-account</v-icon>
						<span class="profile-text">{{ user.role }}</span>
					</v-list-item>
				</v-list>
			</v-card-text>

			<v-card-text v-else>
				<p class="error-text">Eroare la încărcarea profilului.</p>
			</v-card-text>

			<v-card-actions>
				<v-btn block class="logout-button" color="red" @click="logout">
					Deconectare
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.profile-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #FEF9ED;
}

.profile-card {
	padding: 32px;
	width: 100%;
	max-width: 480px;
	text-align: center;
	border-radius: 12px;
}

.profile-title {
	font-size: 24px;
	font-weight: 600;
	color: #312B1D;
	margin-bottom: 16px;
}

.profile-icon {
	margin-right: 12px;
	color: #312B1D;
}

.profile-text {
	font-size: 18px;
	color: #312B1D;
	font-weight: 500;
}

.error-text {
	color: red;
	font-size: 16px;
	margin-bottom: 12px;
}

.logout-button {
	margin-top: 16px;
	color: white;
	font-size: 18px;
	font-weight: 500;
	text-transform: none;
}
</style>