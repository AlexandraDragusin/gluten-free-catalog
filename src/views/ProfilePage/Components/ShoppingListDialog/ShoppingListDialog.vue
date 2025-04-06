<template>
	<v-dialog v-model="modelValue" max-width="800" persistent>
		<v-card class="dialog-card">
			<v-card-title class="d-flex justify-between align-center">
				<span>Listă de cumpărături: <strong>{{ list.name }}</strong></span>
			</v-card-title>

			<v-card-text class="scrollable-content">
				<div class="d-flex align-center justify-space-between input-row mb-4">
					<!-- Adaugă produs nou -->
					<v-autocomplete
						v-model="selectedProduct"
						:items="availableProducts"
						item-title="name"
						item-value="id"
						label="Adaugă produs..."
						variant="outlined"
						clearable
						return-object
						class="autocomplete-fixed-width"
						:menu-props="{ maxWidth: '600px', minWidth: '600px' }"
						hide-details
						density="compact"
					/>
					<v-btn
						color="secondary"
						:disabled="!selectedProduct || isAdding"
						class="shrink-0 match-input-height"
						@click="addProduct"
						>
						<v-icon left>mdi-plus</v-icon> Adaugă
					</v-btn>
				</div>

				<div v-if="!isLoading">
					<div v-if="localItems.length">
						<v-table>
						<thead>
							<tr>
							<th></th>
							<th>Imagine</th>
							<th>Produs</th>
							<th>Cantitate</th>
							<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in localItems" :key="item.id" :class="{ checked: item.checked }"			>
								<td>
								<v-checkbox
								:model-value="item.checked"
								@update:modelValue="item.checked = $event"
								/>
							</td>
							<td>
								<v-img :src="item.image_url || noImage" width="50" height="50" />
							</td>
							<td>
								<strong>{{ item.name }}</strong><br />
								<small>{{ item.brand }}</small>
							</td>
							<td>
								<v-text-field
									v-model.number="item.quantity"
									type="number"
									variant="outlined"
									hide-details
									density="compact"
									min="1"
									class="quantity-input"
								/>
							</td>
							<td>
								<v-icon>mdi-delete @click="deleteItem(item.id)" </v-icon>
							</td>
							</tr>
						</tbody>
						</v-table>
					</div>
					<div v-else class="text-center my-4 text-grey">
						Lista este goală.
					</div>
				</div>

				<div v-else class="text-center my-4 text-grey">
					<v-progress-circular indeterminate color="primary"></v-progress-circular>
					<div>Se încarcă lista...</div>
				</div>
			</v-card-text>

			<v-card-actions class="sticky-footer justify-end px-4 pb-4">
				<v-btn text @click="handleCancel">Anulează</v-btn>
				<v-btn variant="flat" @click="handleSave">
					<v-icon left>mdi-content-save</v-icon> Salvează
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom">
		{{ snackbarMessage }}
	</v-snackbar>
</template>

<script src="./script.js">
</script>

<style scoped>
.autocomplete-fixed-width {
	max-width: 600px;
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;
}

.autocomplete-fixed-width .v-field__input {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.v-overlay__content {
	max-width: 600px !important;
	width: 100% !important;
	box-sizing: border-box;
}

.v-list-item-title {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 100%;
}

.shrink-0 {
  flex-shrink: 0;
}

.match-input-height {
  height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}

.v-img {
	border-radius: 8px;
}
.v-table td,
.v-table th {
	vertical-align: middle;
}

.quantity-input {
	max-width: 80px;
	margin-top: 0;
}

.checked {
	opacity: 0.5;
}

.checked td {
	text-decoration: line-through;
}

.dialog-card {
	max-height: 90vh;
	display: flex;
	flex-direction: column;
}

.scrollable-content {
	overflow-y: auto;
	max-height: 70vh;
	padding-bottom: 20px;
}

.sticky-footer {
	position: sticky;
	bottom: 0;
	background: white;
	border-top: 1px solid #eee;
	z-index: 10;
}

</style>
