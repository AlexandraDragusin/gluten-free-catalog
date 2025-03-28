<template>
	<v-card class="user-list-card">
		<v-card-title class="section-title">Utilizatori</v-card-title>

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
					:disabled="selectedUsers.length === 0"
					@click="showConfirmDialog = true"
				>
					<v-icon left>mdi-delete</v-icon>Șterge ({{ selectedUsers.length }})
				</v-btn>
			</div>
		</div>

		<v-data-table
			:headers="headersToUse"
			:items="users"
			:loading="loading"
			loading-text="Se încarcă utilizatorii..."
			class="custom-table"
			item-value="id"
			return-object
			v-model="selectedUsers"
			:show-select="selectionMode"
			:page="pagination.page"
			:items-per-page="pagination.itemsPerPage"
			@update:page="pagination.page = $event"
			@update:items-per-page="pagination.itemsPerPage = $event"
			show-current-page
			items-per-page-text="Elemente pe pagină"
			no-data-text="Nu există utilizatori"
		>	
			<template v-slot:[`item.placeholder`]>
			</template>

			<template v-slot:bottom>
				<div class="pagination-container">
					<span class="pagination-label">Pagina anterioară</span>
					<v-pagination
						v-model="pagination.page"
						:length="Math.ceil(users.length / pagination.itemsPerPage)"
						total-visible="7"
					/>
					<span class="pagination-label">Pagina următoare</span>
				</div>
			</template>
		</v-data-table>
	</v-card>

	<!-- Delete confirmation -->
	<v-dialog v-model="showConfirmDialog" max-width="400">
		<v-card>
			<v-card-title class="text-h6">Confirmare ștergere</v-card-title>
			<v-card-text>
				Sigur vrei să ștergi <strong>{{ selectedUsers.length }}</strong> utilizator(i)?
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn text @click="showConfirmDialog = false">Anulează</v-btn>
				<v-btn color="grey" variant="tonal" @click="confirmBulkDelete">Șterge</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Snackbar -->
	<v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
		{{ snackbar.message }}
	</v-snackbar>
</template>
  
<script src="./script.js"> </script>
  
<style scoped>
.user-list-card {
	padding: 24px;
	width: 100%;
	max-width: 60%;
	height: fit-content;
	background-color: white;
	box-shadow: 0 3px 6px rgba(0,0,0,0.1);
	margin: auto;
}

.section-title {
	font-size: 20px;
	color: #312B1D;
	text-align: center;
	margin-bottom: 16px;
}

.action-buttons {
	display: flex;
	align-items: center;
	justify-content: end;
	gap: 8px;
	flex-wrap: wrap;
	margin-bottom: 16px;
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
