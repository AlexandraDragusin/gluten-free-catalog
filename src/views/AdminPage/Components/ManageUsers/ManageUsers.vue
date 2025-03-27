<template>
	<v-card class="user-list-card">
		<v-card-title class="section-title">Lista utilizatorilor</v-card-title>

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

		<v-data-table
			:headers="headers"
			:items="users"
			:loading="loading"
			loading-text="Se încarcă utilizatorii..."
			class="elevation-1 custom-table"
			item-value="id"
			return-object
			v-model="selectedUsers"
			:show-select="selectionMode"
			:item-class="getRowClass"
		/>
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
	max-width: 900px;
	border-radius: 12px;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
	background: white;
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

.custom-table ::v-deep(.v-data-table__td) {
	padding: 16px !important;
	height: 60px !important;
}

.v-data-table__selected {
	background-color: #e0e0e0 !important;
}

.highlight-row {
	background-color: #e0e0e0 !important;
}

</style>
