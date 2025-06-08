<template>
	<v-footer app class="footer">
		<v-container class="footer-container">
		<div class="footer-content">
			<p class="footer-text">
			Asociația Română pentru Intoleranță la Gluten - ARIG București
			</p>
			<p class="footer-text">
			Str. Vasile Lucaciu nr 72, sector 3, București
			</p>
			<p class="footer-text">
			E-mail: <a href="mailto:info@arig.ro" class="footer-link">info@arig.ro</a>
			</p>
			<p class="footer-text">
			Protecția datelor cu caracter personal
			</p>
			<p class="footer-text copyright">COPYRIGHT ©</p>
		</div>
		</v-container>
	</v-footer>
</template>

<style scoped>
.footer {
	display: flex;
	flex-direction: column;
	background-color: #F7B41A;
	color: #312B1D;
	text-align: center;
	font-size: 16px;
	font-weight: 500;
	width: 100%;
	position: relative !important;
	margin-bottom: 0;
	bottom: 0 !important;
}

.footer-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.footer-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.footer-text {
	margin: 0;
}

.footer-link {
	color: #312B1D;
	text-decoration: none;
	font-weight: 600;
}

.footer-link:hover {
	text-decoration: underline;
}

.copyright {
	margin-top: 16px;
	font-size: 14px;
}
</style>