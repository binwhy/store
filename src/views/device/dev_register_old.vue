<template>
<div class="layout-content-main">
    <Form ref="formRegister" :rules="ruleRegister" :model="formRegister" :label-width="80" style="width:30%">
          <FormItem prop="mac_addr" label="MAC地址:">
              <Input v-model="formRegister.mac_addr" placeholder="Please enter Mac addr..."></Input>
           </FormItem>
           <FormItem>
             <Upload :before-upload="handleUpload" action="//jsonplaceholder.typicode.com/posts/" :format="['xml']" :multiple="false" :data="formRegister" v-model="formRegister.file">
                <Button type="ghost" icon="ios-cloud-upload-outline">Upload MacList</Button>
             </Upload>
           </FormItem>
            <FormItem label="组管理员:" prop="user_name">
                <Select v-model="formRegister.user_name" placeholder="Please select user...">
                    <Option value="a">Allen</Option>
                    <Option value="b">Bron</Option>
                    <Option value="c">Cousin</Option>
                </Select>
            </FormItem>
            <FormItem label="服务期限:" prop="datetime" v-model="formRegister.datetime">
                <Row>
                    <Col span="11">
                        <DatePicker type="datetime" placeholder="Select start time" v-model="formRegister.datetime[0]"></DatePicker>
                    </Col>
                    <Col span="2">-</Col>
                    <Col span="11">
                        <DatePicker type="datetime" placeholder="Select end time" v-model="formRegister.datetime[1]"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="备注1:" prop="info1">
                <Input v-model="formRegister.info1" placeholder="Enter device information1..."></Input>
            </FormItem>
            <FormItem label="备注2:" prop="info2">
                <Input v-model="formRegister.info2" placeholder="Enter device information2..."></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formRegister')">Submit</Button>
                <Button type="ghost" @click="handleReset('formRegister')" style="margin-left: 8px">Reset</Button>
            </FormItem>
    </Form>
 </div>
</template>
<script>
    import util  from '../../libs/util.js';
    import valid from '../../libs/validate.js';

    export default {
        data () {
            const validateDatetime = (rule, value, callback) => {
                if (value[0] === '' && value[1] === '') {
                    callback(new Error('Please select start time and end time'));
                }else if(value[0] === '' && value[1] !== ''){
                    callback(new Error('Please select start time'));
                }else if(value[1] === '' && value[0] !== ''){
                    callback(new Error('Please select end time'));
                }else if( value[0] !== '' && value[1] !== ''){
                    if(value[0] > value[1]){
                        callback(new Error('The end time is before the start time!'));
                    }else if(value[0] < value[1]){
                        callback();
                    }else{
                        callback(new Error('The start time is equal end time,please select end time again!'));
                    }
                }else{
                    callback();
                }
            };
            return {
                formRegister: {
                    mac_addr: '',
                    file:null,
                    user_name: '',
                    datetime:[],
                    info1: '',
                    info2: ''
                },
                ruleRegister: {
                    mac_addr: [
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
                    ]
                },
                baseuri: '/devlists/'
            };
        },
        methods: {
            handleUpload (file) {
                this.formRegister.file = file;
                return false;
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
//                    let formData = JSON.parse(JSON.stringify(this.formRegister));
                    let formData = this.formRegister;
//                    let formData = new FormData();
//                    formData.append('file', this.formRegister.file);
//                    formData.append('mac_addr', this.formRegister.mac_addr);
//                    let formData = this.formRegister;
//                    if(this.formRegister.file){
//                     console.log(this.formRegister.file);
//                   }
                    console.log(this.formRegister.file);
                    console.log(formData);
                    this.emitForm(formData);
                    if (valid) {
                        this.emitForm(formData);
                        //this.$Message.success('Success!');
                    } else {
                        //this.$Message.error('Fail!');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            emitForm(registerData) {
                //upload ();
                console.log(registerData);
                util.test.post('posts', registerData);
                //util.ajax.request('post', '//jsonplaceholder.typicode.com/posts/', {}, registerData, this.response_callback, this.exception_callback);
            },
             //ajax请求返回值处理
            response_callback(res) {

            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        }
    }
</script>
