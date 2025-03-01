<template>
	<v-container fluid class="home-container">
		<!-- App description and image -->
		<div class="hero-section">	
			<div class="hero-text">
				<div>
					<h1 class="title">
						Catalog de<br /> produse
						<span class="highlight">fără gluten</span>
					</h1>
					<p class="subtitle">
						Toate produsele fără gluten disponibile pe piața din România și toate magazinele care
						comercializează produse fără gluten.
					</p>
				</div>
				<v-btn class="favorites-btn">	
					<div
						:style="{
							display: 'flex',
							alignItems: 'center',
							gap: '16px',
						}"
					>
						<v-icon left color="#F7B41A">mdi-heart</v-icon>
						Produsele mele favorite
					</div>
				</v-btn>
			</div>

			<div class="hero-image">
				<v-img class="gluten-free-img" src="@/assets/gluten-free-image.png"></v-img>
			</div>
		</div>

		<!-- Shopping options -->
		<div class="shopping-section">
			<h2 class="section-title">Unde dorești să faci cumpărăturile?</h2>
			<v-row
				class="shopping-options"
				justify="center"
				no-gutters
			>
				<v-col cols="12" sm="4" :style="{ padding: '24px'}">
					<v-btn class="shop-button" block>ONLINE</v-btn>
				</v-col>
				<v-col cols="12" sm="4" :style="{ padding: '24px' }">
					<v-btn class="shop-button" block>FIZIC</v-btn>
				</v-col>
				<v-col cols="12" sm="4" :style="{ padding: '24px' }">
					<v-btn class="shop-button" block>MIXT</v-btn>
				</v-col>
			</v-row>
		</div>

		<!-- Categories -->
		<div class="categories-section">
			<h2 class="section-title"> Categorii principale de produse</h2>
			<v-row class="categories-grid" justify="center" no-gutters >
				<v-col
					v-for="(category, index) in categories"
					:key="index" cols="6" sm="4" md="3" :style="{ padding: '24px' }" 
				>
					<v-card class="categories-card">
						<v-img :src="category.image" contain height="200px" width="auto" ></v-img>
						<p class="categories-title">{{ category.name }}</p>
					</v-card>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
/* Main Container */
.home-container {
	padding: 88px 0 0 0;
	background-color: #FEF9ED;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}

/* Hero Section */
.hero-section {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: top;
	flex-wrap: wrap;
	padding: 80px 32px 0 32px;
	gap: 160px;
}

.hero-text {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding-left: 80px;
	padding-bottom: 80px;
	justify-content: space-between;
	align-items: flex-start;
}

.hero-image {
	padding: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.gluten-free-img {
	width: 480px;
	height: 480px;
	border-radius: 50%;
	object-fit: cover;
	box-shadow: 0px 30px 40px rgba(0, 0, 0, 0.15);
}

/* Titles */
.title {
	font-size: 64px;
	font-weight: 700;
	margin-bottom: 20px;
}

.highlight {
	color: #F7B41A !important;
}

.subtitle {
	font-size: 24px;
	max-width: 640px;
}

/* Favorite Button */
.favorites-btn {
	font-size: 24px;
	font-weight: 500;
	padding: 12px 24px;
	border-radius: 8px;
	background-color: #FDF6E3;
	max-width: 640px;
	text-transform: none;
	height: fit-content;
	box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.15);
}

/* Shopping Section */
.shopping-section {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
}

.section-title {
	font-size: 28px;
	font-weight: 600;
	margin-top: 24px;
	margin-bottom: 24px;
}

.shopping-options {
	margin-bottom: 48px;
	width: 100%;
	padding: 0 112px;
}

.shop-button {
  background-color: #FDF6E3;
  font-size: 24px;
  font-weight: 500;
  padding: 24px;
  width: 100%;
  height: 80px;
  border-radius: 12px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.15);

}

/* Categories */
.categories-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 0 112px;
}

.categories-grid {
  padding-bottom: 80px;
}

.categories-card {
	text-align: center;
	cursor: pointer;
	padding: 24px;
	border-radius: 12px;
	background-color: #FDF6E3;
	box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.15);
}

.categories-title {
	font-size: 24px;
	font-weight: 500;
	margin-top: 12px;
}

</style>
