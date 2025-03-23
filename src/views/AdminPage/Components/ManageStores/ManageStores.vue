<template>
	<v-card class="manage-card">
		<v-card-title class="title">Magazine</v-card-title>

		<v-card-text>
			<v-data-table
				:headers="headers"
				:items="stores"
				item-value="id"
				class="elevation-1"
				no-data-text="Nu există magazine."
			>	
				<template v-slot:[`item.logo_url`]="{ item }">
					<v-img :src="item.logo_url" max-width="80" max-height="40" contain />
				</template>

				<template v-slot:[`item.actions`]="{ item }">
					<v-icon small class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
					<v-icon small class="mr-2" color="red" @click="deleteStore(item)">mdi-delete</v-icon>
				</template>
			</v-data-table>
	
			<!-- Dialog editare magazin -->
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

			<v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
				{{ snackbar.message }}
			</v-snackbar>
		</v-card-text>
	</v-card>
</template>

<script src="./script.js"></script>

<style scoped>
.manage-card {
	width: 100%;
	max-width: 1400px;
	padding: 24px;
	border-radius: 12px;
	background-color: white;
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
.title {
	font-size: 20px;
	color: #312B1D;
	text-align: center;
	margin-bottom: 16px;
}



</style>