<template>
	<div class="confirm-dialog" v-if="show">
		<div class="confirm-dialog-overlay" @click="onCancel"></div>
		<div class="confirm-dialog-content card">
			<div class="card-header" v-if="title">
				<h5 class="mb-0">{{ title }}</h5>
			</div>
			<div class="card-body">
				<p>{{ message }}</p>
			</div>
			<div class="card-footer text-right">
				<button class="btn btn-secondary mr-2" @click="onCancel">{{ cancelText }}</button>
				<button class="btn btn-primary" @click="onConfirm">{{ confirmText }}</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ConfirmDialog',
	props: {
		show: {
			type: Boolean,
			required: true
		},
		title: {
			type: String,
			default: 'Confirm'
		},
		message: {
			type: String,
			required: true
		},
		confirmText: {
			type: String,
			default: 'Confirm'
		},
		cancelText: {
			type: String,
			default: 'Cancel'
		}
	},
	methods: {
		onConfirm() {
			this.$emit('confirm')
		},
		onCancel() {
			this.$emit('cancel')
		}
	}
}
</script>

<style scoped>
.confirm-dialog {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.confirm-dialog-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.confirm-dialog-content {
	width: 400px;
	max-width: 90%;
	z-index: 1;
}
</style>
