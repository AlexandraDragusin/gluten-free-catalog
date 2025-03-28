<template>
	<v-card class="manage-card">
		<!-- Title -->
		<v-card-title class="title">Magazine</v-card-title>

		<!-- Toolbar -->
		<div class="table-toolbar">
			<v-select
				v-model="pagination.itemsPerPage"
				:items="[5, 10, 25, 50]"
				class="items-per-page"
				label="Elemente pe pagină"
				density="compact"
				variant="outlined"
				hide-details
			/>

			<div class="action-buttons" v-if="!selectionMode">
				<v-btn @click="selectionMode = true">
					<v-icon left>mdi-check</v-icon>Selectează
				</v-btn>
			</div>

			<div class="action-buttons" v-else>
				<v-btn @click="cancelSelection">
					<v-icon left>mdi-close</v-icon>Anulează
				</v-btn>
				<v-btn
					color="grey"
					variant="tonal"
					:disabled="selectedStores.length === 0"
					@click="showConfirmDialog = true"
				>
					<v-icon left>mdi-delete</v-icon>Șterge ({{ selectedStores.length }})
				</v-btn>
			</div>
		</div>

		<!-- Data -->
		<v-data-table
			:headers="headersToUse"
			:items="stores"
			item-value="id"
			class="custom-table"
			return-object
			v-model="selectedStores"
			:show-select="selectionMode"
			:page="pagination.page"
			:items-per-page="pagination.itemsPerPage"
			@update:page="pagination.page = $event"
			@update:items-per-page="pagination.itemsPerPage = $event"
			show-current-page
			items-per-page-text="Elemente pe pagină"
			no-data-text="Nu există magazine."
		>	
			<template v-slot:[`item.placeholder`]>
			</template>

			<template v-slot:[`item.logo_url`]="{ item }">
				<v-img :src="item.logo_url" max-width="80" max-height="40" contain />
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-icon small class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
			</template>

			<template v-slot:[`item.arig_partner`]="{ item }">
				{{ item.arig_partner ? 'da' : 'nu' }}
			</template>

			<template v-slot:bottom>
				<div class="pagination-container">
					<span class="pagination-label">Pagina anterioară</span>
					<v-pagination
						v-model="pagination.page"
						:length="Math.ceil(stores.length / pagination.itemsPerPage)"
						total-visible="7"
					/>
					<span class="pagination-label">Pagina următoare</span>
				</div>
			</template>
		</v-data-table>

		<!-- Edit store dialog -->
		<v-dialog v-model="editDialog" max-width="600px">
			<v-card v-if="editedStore">
				<v-card-title>Editare magazin: {{ editedStore.name }}</v-card-title>
				<v-card-text>
					<v-form ref="storeForm" @submit.prevent="updateStore">
						<v-text-field v-model="editedStore.name" label="Nume" required variant="outlined" />
						<v-select
							v-model="editedStore.type"
							label="Tip"
							:items="['physical', 'online', 'mixed', 'restaurant']"
							required
							variant="outlined"
						/>
						<v-text-field v-model="editedStore.website" label="Website" variant="outlined"/>
						<v-text-field
							v-model="editedStore.logo_url"
							label="Logo URL"
							variant="outlined"
						/>
						<v-switch
							v-model="editedStore.arig_partner"
							label="Partener ARIG"
							variant="outlined"
						/>
						<v-text-field
							v-model.number="editedStore.discount_percentage"
							label="Discount (%)"
							type="number"
							variant="outlined"
						/>
						<v-textarea v-model="editedStore.description" label="Descriere" variant="outlined"/>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn text @click="cancelEdit">Anulează</v-btn>
					<v-btn color="primary" @click="updateStore">Salvează</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Confirm delete dialog -->
		<v-dialog v-model="showConfirmDialog" max-width="400">
			<v-card>
				<v-card-title class="text-h6">Confirmare ștergere</v-card-title>
				<v-card-text>
					Sigur vrei să ștergi <strong>{{ selectedStores.length }}</strong> magazin(e)?
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn text @click="showConfirmDialog = false">Anulează</v-btn>
					<v-btn color="grey" variant="tonal" @click="confirmBulkDeleteStores">Șterge</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Snackbar -->
		<v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
			{{ snackbar.message }}
		</v-snackbar>
	</v-card>
</template>

<script src="./script.js"></script>

<style scoped>
.manage-card {
	padding: 24px;
	width: 100%;
	max-width: 90%;
	height: fit-content;
	background-color: white;
	box-shadow: 0 3px 6px rgba(0,0,0,0.1);
	margin: auto;
}

.title {
	font-size: 20px;
	color: #312B1D;
	text-align: center;
	margin-bottom: 16px;
}

.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
	margin-right: 16px;
}

.table-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	flex-wrap: wrap;
	gap: 12px;
}

.items-per-page {
	max-width: 160px;
}

.custom-table {
	overflow: hidden;
	border: 1px solid #e0e0e0;
	box-shadow: none !important;
}

.custom-table :deep(.v-data-table__td) {
	height: 80px !important;
}

.custom-table :deep(.v-data-table__th) {
  font-weight: 600;
}

.pagination-container {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	gap: 12px;
	margin-bottom: 16px;
}

.pagination-label {
	font-size: 14px;
	font-weight: 500;
	color: #333;
}

</style>