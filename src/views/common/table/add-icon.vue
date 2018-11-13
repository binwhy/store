<template>
	<Button type="text" icon="ios-cloud-download" @click="ButtonClick" style='font-size:14px;'></Button>
</template>
<script>
	export default {
        name: 'AddIcon',
        methods: {
            ButtonClick (event) {
                this.$emit('click',this); 
            }
        }
	}
</script>