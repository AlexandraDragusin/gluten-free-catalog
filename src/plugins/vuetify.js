// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
	theme: {
		defaultTheme: 'customTheme',
		themes: {
			customTheme: {
			colors: {
				primary: '#F7B41A',
				text: '#312B1D',
			},
			},
		},
	},
	defaults: {
		global: {
			style: {
			fontFamily: 'Poppins, sans-serif',
			},
		},
	},
	icons: {
		defaultSet: "mdi",
	},
});
