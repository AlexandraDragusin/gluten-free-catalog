<template>
	<transition name="breadcrumb-fade">
		<v-container v-if="crumbs.length" class="breadcrumb-bar" fluid>
			<div class="breadcrumb-wrapper">
				<span
					v-for="(crumb, index) in crumbs"
					:key="index"
					class="breadcrumb-item"
				>
					<span
						v-if="crumb.route"
						class="breadcrumb-link"
						@click="$router.push(crumb.route)"
					>
						{{ crumb.label }}
					</span>
					<span v-else>{{ crumb.label }}</span>

					<span v-if="index < crumbs.length - 1" class="breadcrumb-separator"> ● </span>
				</span>
			</div>
		</v-container>
	</transition>
</template>

<script src ="./script.js"></script>

<style scoped>
.breadcrumb-bar {
	background-color: #312B1D;
	color: #fef9ed !important;
	padding: 12px 32px;
	font-size: 16px;
	font-weight: 500;
}

.breadcrumb-wrapper {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	color: #fef9ed !important;
	cursor: default;
}

.breadcrumb-item {
	display: flex;
	align-items: center;
	color: #fef9ed !important;
	gap: 6px;
}

.breadcrumb-link {
	cursor: pointer;
	text-decoration: underline;
	color: #fef9ed !important;
}

.breadcrumb-separator {
	margin: 0 6px;
	color: #fef9ed !important;
}

.breadcrumb-fade-enter-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}
.breadcrumb-fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}
.breadcrumb-fade-enter-from,
.breadcrumb-fade-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
.breadcrumb-fade-enter-to,
.breadcrumb-fade-leave-from {
	opacity: 1;
	transform: translateY(0);
}

</style>
