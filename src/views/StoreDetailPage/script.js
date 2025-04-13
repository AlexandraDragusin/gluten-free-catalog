import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
	name: "StoreDetailPage",
	data() {
		return {
			store: {},
			categories: [],
			imageStyle: {},
			mapCenter: null,
			mapReady: false,
			availableAddresses: [],
			selectedAddress: null,
			categoryProducts: {}
		};
	},
	components: { LMap, LTileLayer, LMarker },
	watch: {
		selectedAddress(newVal) {
			const addressObj = newVal?.value || newVal;

			if (addressObj && addressObj.address && addressObj.city && addressObj.country) {
				const formatted = this.formatAddress(addressObj);
				this.geocodeAddress(formatted);
			} else {
				this.mapCenter = null;
				this.mapReady = false;
			}
		}
	},
	async created() {
		const storeId = this.$route.params.id;

		try {
			// Get all stores and find this one
			const storesRes = await fetch("http://localhost:5000/api/stores");
			const stores = await storesRes.json();
			const targetStore = stores.find(s => s.id == storeId);

			if (!targetStore) {
				console.error("Magazinul nu a fost găsit.");
				return;
			}

			this.store = targetStore;

			// Get categories for this store
			const storeCategoriesRes = await fetch(`http://localhost:5000/api/store_categories/${storeId}`);
			const storeCategories = await storeCategoriesRes.json();
			const categoryIds = storeCategories.map(c => c.category_id);

			const allCategoriesRes = await fetch("http://localhost:5000/api/categories");
			const allCategories = await allCategoriesRes.json();

			this.categories = allCategories.filter(cat => categoryIds.includes(cat.id));

			const allProductsRes = await fetch("http://localhost:5000/api/products");
			const allProducts = await allProductsRes.json();

			this.categoryProducts = {};
			for (const category of this.categories) {
				const productsForThisStoreAndCategory = allProducts.filter(p =>
					p.store_id === this.store.id && p.category_id === category.id
				);

				this.categoryProducts[category.id] = productsForThisStoreAndCategory;
			}

			this.availableAddresses = (targetStore.addresses || [])
				.filter(addr => addr && addr.address && addr.city && addr.country)
				.map(addr => ({
					text: this.formatAddress(addr),
					value: addr
				}));

			if (this.availableAddresses.length === 1) {
				this.selectedAddress = this.availableAddresses[0].value;
				await this.geocodeAddress(this.formatAddress(this.selectedAddress));
			}
		} catch (err) {
			console.error("Eroare la încărcarea detaliilor magazinului:", err);
		}
	},
	methods: {
		formatAddress(addr) {
			const addressObj = addr?.value || addr;
			if (!addressObj) return '';

			const cleanAddress = addressObj.address.replace(/(?:nr|nr\.|numar|număr)\s*/i, 'nr ');

			const parts = [
				cleanAddress,
				addressObj.city,
				addressObj.county,
				addressObj.country
			].filter(Boolean);
			
			return parts.join(', ');
		},
		translateType(type) {
			const types = {
				physical: "Fizic",
				online: "Online",
				mixed: "Mixt",
				restaurant: "Restaurant"
			};
			return types[type] || type;
		},
		async geocodeAddress(address) {
			try {
				await new Promise(resolve => setTimeout(resolve, 1000));
				const safeAddress = address.includes('România') ? address : `${address}, România`;
				const encoded = encodeURIComponent(safeAddress);
				const apiKey = 'b25ca16362a542298c945d9b83d28731';

				const url = `https://api.opencagedata.com/geocode/v1/json?q=${encoded}&key=${apiKey}&language=ro&countrycode=ro&limit=1`;

				const res = await fetch(url);
				const data = await res.json();
		
				if (data.results && data.results.length > 0) {
					this.mapCenter = [
						parseFloat(data.results[0].geometry.lat),
						parseFloat(data.results[0].geometry.lng)
					];
					this.mapReady = true;
					return true;
				}

				const withoutNumber = address.replace(/nr\s*\w+,?\s*/i, '').trim();
				if (withoutNumber && withoutNumber !== address) {
					return await this.geocodeAddress(withoutNumber);
				}
		
				const justCity = address.split(',').slice(1).join(',').trim();
				if (justCity && justCity !== address && justCity.length < address.length) {
					return await this.geocodeAddress(justCity);
				}
		
				this.mapCenter = null;
				this.mapReady = false;
				return false;
			} catch (err) {
				console.error("Eroare la geocodare:", err);
				this.mapReady = false;
			}
		},
		async onAddressSelected(addressObj) {
			if (addressObj) {
				const formatted = this.formatAddress(addressObj.value || addressObj);
				this.selectedAddress = addressObj.value || addressObj;

				if (formatted) {
					await this.geocodeAddress(formatted);
				} else {
					console.warn("Adresa nu a putut fi formatată corect");
				}
			} else {
				this.mapReady = false;
				this.mapCenter = null;
				this.selectedAddress = null;
			}
		}
	}
};