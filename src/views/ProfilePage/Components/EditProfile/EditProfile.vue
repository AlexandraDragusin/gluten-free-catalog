<template>
	<v-card class="edit-profile-card">
		<v-card-title class="section-title">Editează profilul</v-card-title>

		<!-- Profile Picture -->
		<v-card-text class="profile-picture-section">
			<v-avatar size="200">
				<v-img v-if="user?.profilePicture" :src="user?.profilePicture" alt="Profile Picture"></v-img>
				<v-icon v-else class="default-avatar">mdi-account</v-icon>
			</v-avatar>

			<div class="picture-buttons">
				<v-btn class="picture-btn" variant="outlined" @click="triggerFileInput">Schimbă imaginea</v-btn>
				<v-btn class="picture-btn" variant="outlined" @click="deleteProfilePicture">Șterge imaginea</v-btn>
			</div>

			<input type="file" ref="fileInput" @change="uploadProfilePicture" hidden />
		</v-card-text>

		<!-- Profile Information -->
		<v-card-text>
			<form @submit.prevent="updateProfile">  <!-- Added form wrapper -->
				<v-list density="comfortable">
					<v-list-item>
						<v-icon class="profile-icon">mdi-account</v-icon>
						<v-text-field v-model="user.username" label="Nume utilizator" variant="outlined" hide-details="auto"
						></v-text-field>
					</v-list-item>

					<v-list-item>
						<v-icon class="profile-icon">mdi-email</v-icon>
						<v-text-field v-model="user.email" label="Email" variant="outlined" hide-details="auto"
						></v-text-field>
					</v-list-item>

					<v-list-item>
						<v-icon class="profile-icon">mdi-lock</v-icon>
						<v-text-field
							v-model="password"
							label="Schimbă parola"
							variant="outlined"
							:append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
							@click:append-inner="showPassword = !showPassword"
							:type="showPassword ? 'text' : 'password'"
							autocomplete="new-password"
							hide-details="auto"
						></v-text-field>
					</v-list-item>

					<v-btn 
						class="save-button" 
						color="primary" 
						type="submit"
					>
						Salvează modificările
					</v-btn>
				</v-list>
			</form>
		</v-card-text>
	</v-card>

	<!-- Snackbar -->
	<v-snackbar
		v-model="snackbar.show"
		:color="snackbar.color"
		timeout="3000"
		location="top"
		class="custom-snackbar"
	>
		{{ snackbar.message }}
	</v-snackbar>
</template>


<script src="./script.js"></script>

<style scoped>
.edit-profile-card {
	padding: 24px;
	border-radius: 12px;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
	width: 600px
}

.section-title {
	font-size: 20px;
	color: #312B1D;
	margin-bottom: 16px;
	text-align: center;
}

.profile-picture-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
}

.default-avatar {
	font-size: 80px;
	color: #aaa;
}

.upload-button {
	margin-top: 8px;
	font-size: 14px;
}

.profile-icon {
	margin-right: 12px;
	color: #312B1D;
}

.picture-buttons {
	display: flex;
	gap: 12px;
	margin-top: 12px;
	width: 70%;
	justify-content: center;
}

.picture-btn {
	flex: 1;
	text-transform: none;
}

.save-button {
	margin-top: 16px;
	background-color: #F7B41A;
	color: #312B1D;
	font-size: 16px;
	text-transform: none;
	width: 100%;
}

.custom-snackbar {
	justify-content: center;
	width: 100%;
	padding: 12px;
	border-radius: 8px;
	box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
</style>