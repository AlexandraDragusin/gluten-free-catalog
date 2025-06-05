<template>
	<div class="shopping-lists-page">
	<!-- Toolbar -->
	<v-row class="toolbar" justify="space-between">
		<v-col cols="12" sm="4">
			<v-text-field v-model="searchQuery" variant="outlined" density="compact" label="Caută listă..." hide-details clearable class="input-field"/>
		</v-col>
		<v-col cols="12" sm="4">
			<v-select
				v-model="sortOption"
				:items="sortOptions"
				item-title="text"
				item-value="value"
				label="Sortează după"
				variant="outlined"
				density="compact"
				class="input-field"
				hide-details
			/>
		</v-col>
		<v-col cols="12" sm="4" class="d-flex justify-end align-center">
			<v-btn color="secondary" variant="flat" class="add-button" @click="showAddListDialog = true">
				<v-icon left>mdi-plus</v-icon> Listă nouă
			</v-btn>
		</v-col>
	</v-row>

	<!-- List of shopping lists -->
	<v-row>
		<v-col
		v-for="list in filteredAndSortedLists"
		:key="list.id"
		cols="12"
		sm="6"
		md="4"
		>
		<v-card class="shopping-list-card" @click="openListDialog(list)">
			<v-card-title>{{ list.name }}</v-card-title>
			<v-card-subtitle>Creată la: {{ formatDate(list.created_at) }}</v-card-subtitle>
			<v-card-actions>
			<v-spacer />
			<v-btn icon @click.stop.prevent="deleteList(list.id)">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
			<v-btn icon @click.stop.prevent="exportToPDF(list.id)">
				<v-icon>mdi-file-pdf-box</v-icon>
			</v-btn>
			</v-card-actions>
		</v-card>
		</v-col>
	</v-row>

	<!-- Dialog pentru adăugare listă -->
	<v-dialog v-model="showAddListDialog" max-width="400">
		<v-card>
		<v-card-title>Adaugă o nouă listă</v-card-title>
		<v-card-text>
			<v-text-field v-model="newListName" variant="outlined" label="Nume listă" />
		</v-card-text>
		<v-card-actions>
			<v-spacer />
			<v-btn text @click="showAddListDialog = false">Anulează</v-btn>
			<v-btn @click="createList">Salvează</v-btn>
		</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- Dialog cu detalii despre listă (vine în pasul 2) -->
	<ShoppingListDialog
		v-if="selectedList"
		:list="selectedList"
		v-model="showListDialog"
		@updated="fetchLists"
	/>
	</div>

	<!-- PDF Template -->
	<div id="pdf-template"
		v-show="showPdf"
		style="position: absolute; top: 0; left: -9999px; width: 600px; padding: 20px; font-family: Arial; background: white; z-index: -1;">
		<h2 style="text-align: center; margin-bottom: 5px;">Listă de cumpărături: <span id="pdf-title"></span></h2>
		<p style="text-align: center; margin-top: 0;">Creată lan data de: <span id="pdf-date"></span></p>
		<hr />
		<div id="pdf-items" style="margin-top: 20px;"></div>
	</div>
</template>

<script src="./script.js"></script>

<style scoped>
.shopping-lists-page {
	width: 80%;
	margin-bottom: 60px;
}

.toolbar {
	margin-bottom: 20px;
}

.shopping-list-card {
	background-color: #fff;
	transition: 0.3s ease;
	cursor: pointer;
}

.shopping-list-card:hover {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-field {
	width: 100%;
}

.add-button {
	min-width: 180px;
}
</style>
