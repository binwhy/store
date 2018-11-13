<template>
    <div>
        <Row>
            <Col span="8" offset="0">
                <model-form
                        ref="formRef"
                        v-model="modelFormData"
                        :formItems="newModelForm"
                        :formDataVaildate="formDataVaildate"
                        @on-click-submit="formSubmit">
                </model-form>
            </Col>
        </Row>
    </div>
</template>
<script>
    import modelTable from '../common/table/table-list.vue';
    import searchForm from '../common/search/input-search.vue';
    import selectForm from '../common/form/select-form.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import modelForm from '../common/form/best-form.vue';
    import newModelForm from './register_newdev.js';
    import util  from '../../libs/util.js';
    import valid from '../../libs/validate.js';

     export default{
        components: {
            modelTable,
            modelForm
        },
        data() {
            return {
                newModelForm: newModelForm,
                modelFormData: {},
                show: false,
                formDataVaildate:{ mac_addr: [
                        { required: true, validator: valid.validateMac, trigger: 'blur' }
                    ],
                    user_name:[
                        { required: true, message: 'Please select the manager', trigger: 'change' }
                    ],
                    info1: [
                        { required: true, message: 'Please enter a personal info1', trigger: 'blur' }
                    ],
                    info2: [
                        { required: true, message: 'Please enter a personal info2', trigger: 'blur' }
                    ],
                    datetime: [
                        { required: true, validator: validateDatetime, trigger: 'change' },
                    ]},
            };
        },
        methods: {
            //初始表单数据
            initFormData: function () {
                newModelForm.forEach((item, index) => {
                    this.$set(this.modelFormData, item.key, newModelForm[index].value);
                });
            },
            //初始表单校验规则
            initFormDataVaildate: function () {
                newModelForm.forEach((item) => {
                    this.modelFormData[item.key] = '';
                });
            },
            //表单提交
            formSubmit: function (vaild, formDataObject) {
//                util.ajax.request('post', this.baseuri, {}, this.formDataObject, (res) => {
//                    this.$Message.success('Are you ok!');
//                });
                let formData = new FormData();
                Object.keys(formDataObject).forEach((key) => {
                    formData.append(key, formDataObject[key]);
                });

                util.test.post('posts', formData);
                if (vaild)
                    this.$Message.success('Success !');
                else
                    this.$Message.error('Failed !');
            },
            //筛选条件发生变化
            selectChanged: function (event) {
                this.selected_model = event;
            }
        },
        created: function (){
            this.newModelForm = newModelForm;
            this.initFormData();
            //this.initFormDataVaildate();
        }
    }   
</script>