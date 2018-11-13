<template>
	<div class="center">
		<FilterForm v-model="select_val" :optionsList="optionList">
		</FilterForm>
	</div>
    
</template>
<script>
    export default {
    	 data () {
            return {
                select_val: String,
                optionList: [
                    {
                        title: '话题',
                        children: [
                            {
                                title: 'iView',
                                count: 10000,

                            },
                            {
                                title: 'iView UI',
                                count: 10600,

                            }
                        ]
                    },
                    {
                        title: '问题',
                        children: [
                            {
                                title: 'iView UI 有多好',
                                count: 60100,

                            },
                            {
                                title: 'iView 是啥',
                                count: 30010,

                            }
                        ]
                    },
                    {
                        title: '文章',
                        children: [
                            {
                                title: 'iView 是一个设计语言',
                                count: 100000,

                            }
                        ]
                    }
                ]
            }
        }
        
    }
</script>

<style>
	.center{
		margin: 200px;
	}
</style>