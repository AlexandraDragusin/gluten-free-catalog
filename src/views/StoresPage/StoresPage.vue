<template>
	<v-container class="stores-page" fluid>
		<!-- Filter button -->
		<v-row class="filter-button-row">
			<v-col cols="12" class="filter-button-wrapper">
				<div class="filter-actions">
					<v-btn
						color="grey"
						variant="outlined"
						class="filter-btn"
						@click="openFilterDialog"
					>
						<v-icon left>mdi-filter-variant</v-icon>Filtrează
					</v-btn>

					<v-btn
						v-if="filters.type || filters.city || filters.country || filters.arig_partner !== null || filters.categories.length"
						color="grey"
						variant="outlined"
						class="filter-btn"
						@click="resetFilters"
					>
						<v-icon left>mdi-close-circle</v-icon>Resetează filtrele
					</v-btn>
				</div>
			</v-col>
		</v-row>

		<!-- Stores list -->
		<v-row>
			<v-col
				v-for="store in paginatedStores"
				:key="store.id"
				cols="12"
				class="store-card-wrapper"
			>
				<div class="store-card">
					<v-row>
						<v-col cols="2">
							<v-img :src="store.logo_url" alt="store logo" class="store-logo" />
						</v-col>
						<v-col cols="10">
							<h3 class="store-name">
								{{ store.name }}
								<a
									v-if="store.website"
									:href="store.website.startsWith('http') ? store.website : 'https://' + store.website"
									target="_blank"
									rel="noopener noreferrer"
								>
									<v-icon size="18" class="open-icon">mdi-open-in-new</v-icon>
								</a>
							</h3>
							<p class="store-address">
								Adresă:
								<span v-if="store.addresses?.length === 1">
									{{ formatAddress(store.addresses[0]) }}
								</span>
								<span v-else>
									{{ extractUniqueCities(store.addresses).join(", ") || "-" }}
								</span>
							</p>
							<p class="store-description">{{ store.description }}</p>
							<p class="store-categories">
								<strong>Categorii de produse: </strong>
								<span>{{ (store.categories || []).join(", ") || "Nespecificat" }}</span>
							</p>
						</v-col>
					</v-row>
				</div>
			</v-col>
		</v-row>

		<!-- Pagination -->
		<v-row justify="center" class="pagination-row">
			<span class="pagination-label">Pagina anterioară</span>
			<v-pagination
				v-model="pagination.page"
				:length="pageCount"
				total-visible="7"
				color="orange"
			/>
			<span class="pagination-label">Pagina următoare</span>
		</v-row>

		<!-- Filter dialog -->
		<v-dialog v-model="showFilterDialog" max-width="500">
			<v-card>
				<v-card-title>Filtrare magazine</v-card-title>
				<v-card-text>
					<v-select
						v-model="filterDraft.type"
						:items="[
							{ title: 'Fizic', value: 'physical' },
							{ title: 'Online', value: 'online' },
							{ title: 'Mixt', value: 'mixed' },
							{ title: 'Restaurant', value: 'restaurant' }
						]"
						item-title="title"
						item-value="value"
						label="Tip magazin"
						variant="outlined"
						clearable
					/>

					<v-select
						v-model="filterDraft.arig_partner"
						:items="[
							{ title: 'Toate', value: null },
							{ title: 'Partener ARIG', value: true },
							{ title: 'Ne-partener', value: false }
						]"
						item-title="title"
						item-value="value"
						label="Partener ARIG"
						variant="outlined"
					/>

					<v-select v-model="filterDraft.city" :items="filterOptions.cities" label="Oraș" variant="outlined" clearable />
					<v-select v-model="filterDraft.country" :items="filterOptions.countries" label="Țară" variant="outlined" clearable />
					<v-combobox
						v-model="filterDraft.categories"
						:items="filterOptions.categories"
						label="Categorii"
						variant="outlined"
						clearable
						multiple
					/>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn text @click="showFilterDialog = false">Anuleză</v-btn>
					<v-btn color="primary" @click="applyFilters">Aplică</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script src="./script.js"></script>

<style scoped>
.filter-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-start;
}

.filter-btn {
	color: #312B1D;
	justify-content: end;
	font-weight: 500;
	box-shadow: none;
	text-transform: none;
}

.filter-button-row {
	margin-bottom: 16px;
}

.filter-button-wrapper {
	max-width: 80%;
	margin: 0 auto;
}

.stores-page {
  background-color: #fef9ed;
  padding: 120px 16px 40px;
}

.store-card-wrapper {
	display: flex;
	justify-content: center;
}

.store-card {
	width: 80%;
	height: 300px; 
	background-color: #F3E4C9;
	border-radius: 10px;
	padding: 24px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	margin-bottom: 24px;
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.store-card > .v-row {
  height: 100%;
  align-items: center;
}

.store-logo {
  object-fit: contain;
  height: 100%;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.store-name {
  font-size: 32px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.open-icon {
  margin-left: 6px;
  color: #444;
}

.store-address,
.store-description,
.store-categories {
  font-size: 16px;
  margin-top: 18px;
  width: 85%;
}

.store-description {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	max-height: 3.2em;
	line-height: 1.6em;
}

.store-address {
  font-weight: 600;
}

.pagination-row {
  margin-top: 24px;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.pagination-label {
  font-weight: 500;
  font-size: 14px;
  color: #555;
}
</style>
