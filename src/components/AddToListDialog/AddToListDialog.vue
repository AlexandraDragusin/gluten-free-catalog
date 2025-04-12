<template>
	<v-dialog
		:model-value="modelValue"
		@update:modelValue="$emit('update:modelValue', $event)"
		max-width="460"
	>
		<v-card class="dialog-card">
			<v-card-title class="dialog-title d-flex justify-space-between align-start">
				<div class="dialog-title-text">
					<div>Adaugă</div>
					<div class="product-name" :title="productName">{{ productName }}</div>
					<div>într-o listă de cumpărături</div>
				</div>
				<v-btn icon size="x-small" variant="plain" @click="cancel">
					<v-icon size="24">mdi-close</v-icon>
				</v-btn>
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
				<v-btn variant="flat" :disabled="!selected" @click="confirm">
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

.dialog-title-text {
	display: flex;
	flex-direction: column;
}

.product-name {
	font-weight: 700;
	display: inline-block;
	margin: 4px 0;
	max-width: 300px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.dialog-content {
	padding-top: 0;
	padding-bottom: 8px;
}

.dialog-actions {
	padding-bottom: 8px;
}

.close-btn-wrapper {
	position: absolute;
	top: 8px;
	right: 8px;
	z-index: 2;
}

.close-btn {
	background-color: white;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

</style>