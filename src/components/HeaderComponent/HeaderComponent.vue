<template>
	<!-- App Bar -->
	<v-app-bar
		app
		height="fit-content"
		:style="{
			backgroundColor: '#F7B41A',
			padding: '8px 32px'
		}"
	>
		<template v-slot:prepend>
			<div
			:style="{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '32px',
			}">
				<v-img
					src="@/assets/logo.png"
					width="auto"
					height="auto"
					contain
					:style="{
						cursor: 'pointer',
						width: '72px',
						height: '100%',
						objectFit: 'contain'
					}"
					@click="navigateToHome"
				/>
				<v-btn text class="nav-button"> Categorii de produse </v-btn>

				<v-btn text class="nav-button" @click="navigateToStores" > Magazine </v-btn>
			</div>

		</template>
		<template v-slot:append>
			<div
				:style="{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '32px',
				}"
			>
				<v-text-field
					append-inner-icon="mdi-magnify"
					clearable
					dense
					label="Caută un produs, categorie sau brand..."
					hide-details="auto"
					single-line
					variant="outlined"
					:style="{
						cursor: 'pointer',
						minWidth: '400px',
						maxWidth: '600px',
					}"
				/>
				<LoginButton
					:isLoggedIn="isLoggedIn"
					:userRole="userRole"
					:style="{ cursor: 'pointer'}"
					@login-click="handleLoginClick"
				/>
			</div>
		</template>
	</v-app-bar>

	<!-- Breadcrumbs -->
	<Breadcrumb
		:crumbs="breadcrumbs"
		class="breadcrumb-bar"
	/>
</template>

<script src="./script.js"></script>

<style scoped>
.v-toolbar {
  height: "fit-content" !important;
}

.nav-button {
	cursor: 'pointer';
	font-weight: 400;
	font-size: 24px !important;
	text-transform: none;
}

.breadcrumb-bar {
	position: sticky;
	top: 88px;
	z-index: 10;
}

</style>