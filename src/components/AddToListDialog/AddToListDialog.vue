<template>
	<v-dialog v-model="modelValue" max-width="460" persistent>
		<v-card class="dialog-card">
			<v-card-title class="dialog-title">
				Adaugă<br />
				<span class="product-name">{{ productName }}</span><br />
				într-o listă de cumpărături
			</v-card-title>

			<v-card-text class="dialog-content">
				<v-select
				v-model="selected"
				:items="shoppingLists"
				item-title="name"
				item-value="id"
				label="Selectează lista"
				variant="outlined"
				density="comfortable"
				/>
			</v-card-text>

			<v-card-actions class="dialog-actions">
				<v-spacer />
				<v-btn variant="text" @click="cancel">Anulează</v-btn>
				<v-btn color="primary" variant="flat" :disabled="!selected" @click="confirm">
				Adaugă
				</v-btn>
			</v-card-actions>
		</v-card>

		<v-snackbar
			v-model="snackbar"
			:timeout="3000"
			:color="snackbarColor"
			location="bottom"
			>
			{{ snackbarText }}
		</v-snackbar>
	</v-dialog>
</template>

<script src="./script.js"/>
<style scoped>
.dialog-card {
	padding: 16px 8px;
}

.dialog-title {
	font-size: 20px;
	line-height: 1.4;
	color: #312b1d;
	padding-bottom: 8px;
}

.product-name {
	color: #f7b41a;
	font-weight: 700;
	display: inline-block;
	margin: 4px 0;
}

.dialog-content {
	padding-top: 0;
	padding-bottom: 8px;
}

.dialog-actions {
	padding-bottom: 8px;
}
</style>