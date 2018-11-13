<template>
	<Button type="text" icon="plus" @click="ButtonClick"></Button>
</template>
<script>
	export default {
        name: 'AddButton',
        methods: {
            ButtonClick (event) {
                this.$emit('click-button',this); 
            }
        }
	}
</script>