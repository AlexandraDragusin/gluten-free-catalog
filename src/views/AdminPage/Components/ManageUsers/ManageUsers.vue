<template>
	<v-card class="user-list-card">
		<v-card-title class="section-title">Lista utilizatorilor</v-card-title>

		<v-data-table
			:headers="headers"
			:items="users"
			:loading="loading"
			loading-text="Se încarcă utilizatorii..."
			class="elevation-1 custom-table"
			item-value="id"
			density="comfortable"
		>
			<template v-slot:[`item.actions`]="{ item }">
				<div class="action-container">
					<v-icon small color="red" @click="confirmDelete(item)">mdi-delete</v-icon>
				</div>
			</template>
		</v-data-table>
	</v-card>

	<!-- Confirmare ștergere -->
	<v-dialog v-model="showConfirmDialog" max-width="400">
	<v-card>
		<v-card-title>Confirmare</v-card-title>

		<v-card-text>
			Sigur vrei să ștergi utilizatorul <strong>{{ selectedUser?.username }}</strong>?
		</v-card-text>

		<v-card-actions>
			<v-spacer />

			<v-btn text @click="showConfirmDialog = false">Anulează</v-btn>

			<v-btn color="red" @click="deleteUser">Șterge</v-btn>
		</v-card-actions>
	</v-card>
	</v-dialog>
</template>
  
  <script src="./script.js"></script>
  
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

.custom-table ::v-deep(.v-data-table__td) {
	padding: 16px !important;
	height: 60px !important;
}

.action-container {
	display: flex;
	justify-content: flex-end;
	padding-right: 10px;
}

</style>
