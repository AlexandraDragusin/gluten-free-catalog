export default {
	name: "BreadcrumbComponent",
	props: {
		crumbs: {
			type: Array,
			required: true,
			default: () => []
		},
	},
};