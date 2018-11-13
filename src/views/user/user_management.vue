<style type="text/css">
    #user_table{
        text-align: center;
    }
    .form{
        width:600px!important;
        position: absolute;
        left: 50%;
        margin-left: -300px;
    }
    .form_user{
        width:500px !important;
    }
    .input{
        width:360px !important;
    }
    .form_user label{
        width:100px !important;
        text-align: left !important;
    }
    .look_power .ivu-checkbox-group label:nth-child(4){
        margin-left: 100px;
    }
    .look_power .ivu-checkbox-group label:nth-child(7){
        margin-left: 100px;
    }
    .look_power .ivu-checkbox-group label:nth-child(10){
        margin-left: 100px;
    }
    .cation_power .ivu-checkbox-group label:nth-child(4){
        margin-left: 100px;
    }
    .textarea textarea{
        resize: none;
        width:360px;
        margin-left: 100px;margin-top:-30px;
    }
    .ivu-icon-ios-cloud-download{
        margin-top: 6px;
        margin-right: 6px;
    }
    .user_common li{
        width: 100px;
        display: inline-block;
    }
</style>

<template> 
    <div>
        <!-- 搜索框-->
        <Input v-model="value" placeholder="输入用户名" style="width:300px;margin-bottom:20px;" icon="ios-search" />
        <!--表格区域-->
        <Table border :columns="columns" :data="data" id='user_table' ref='table'></Table>
        <!--表单区域-->
        <Form ref='user_form' :model='formItem'style='margin-top:60px;' class='form' v-if="type">
            <FormItem label='用户名' prop='username' class='form_user'>
                <Input v-model='formItem.username' placeholder='请输入用户名' required class='input'></Input>
            </FormItem>
            <FormItem v-model='formItem.password' label='密码' prop='password' class='form_user'>
                 <Input v-model='formItem.password' placeholder='请输入用户名' type='password' class='input'></Input>
            </FormItem>
            <FormItem label='确认密码' prop='re_password' type='password' class='form_user'>
               <Input v-model='formItem.re_password' placeholder='请输入用户名' type='password' class='input'></Input>
            </FormItem>
            <FormItem label='用户级别' prop='user_levels' class='form_user'>
                <Select v-model='userlevel' style='width:144px;' @on-change='get_userlevel'>
                   <Option v-for='item in user_level' :value='item.id'>{{item.typename}}</Option>
                </Select>
                <label v-show='management_user'>组管理员：</label>
                <Select v-model='usermanagement' style='width:150px;' v-show='management_user'>
                   <Option v-for='management in user_manangement' :value='management.uid'>{{management.managementname}}</Option>
                </Select>
            </FormItem>
            <FormItem label='真实姓名' prop='re_name' class='form_user'>
                <Input v-model='formItem.re_name' placeholder='请输入姓名' class='input'></Input>
            </FormItem>

            <FormItem label='固定电话' prop='landline' class='form_user'>
                <Input v-model='formItem.landline' placeholder='请输入固定电话' class='input'></Input>
            </FormItem>
            <FormItem label='手机号码' prop='phone' class='form_user'>
                <Input v-model='formItem.phone' placeholder='请输入手机号码' class='input'></Input>
            </FormItem>
            <FormItem label='住址' prop='address' class='form_user'>
                <Input v-model='formItem.address' placeholder='请输入住址' class='input'></Input>
            </FormItem>
            <FormItem label='电子邮箱' prop='Email' class='form_user'>
                <Input v-model='formItem.Email' placeholder='请输入电子邮箱' class='input'></Input>
            </FormItem>
            <FormItem label="查看权限" class='form_user look_power' prop='look_power' v-show='mgt'>
                <CheckboxGroup v-model="formItem.checkbox">
                    <Checkbox label="主页">主页</Checkbox>
                    <Checkbox label="警告列表">警告列表</Checkbox>
                    <Checkbox label="设备定位">设备定位</Checkbox>
                    <Checkbox label="设备日志">设备日志</Checkbox>
                    <Checkbox label="通用设备管理">通用设备管理</Checkbox>
                    <Checkbox label="统计">统计</Checkbox>
                    <Checkbox label="设备报表">设备报表</Checkbox>
                    <Checkbox label="网络报表">网络报表</Checkbox>
                    <Checkbox label="系统日志">系统日志</Checkbox>
                    <Checkbox label="LTE-Fi Flow">LTE-Fi Flow</Checkbox>
                    <Checkbox label="LTE-Fi定位" >LTE-Fi定位</Checkbox>
                    <Checkbox label="LTE-Fi轨迹">LTE-Fi轨迹</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="操作权限" class='form_user cation_power' prop='look_power' v-show='mgt'>
                <CheckboxGroup v-model="formItem.checkbox2">
                    <Checkbox label="设备管理">设备管理</Checkbox>
                    <Checkbox label="任务">任务</Checkbox>
                    <Checkbox label="固件">固件</Checkbox>
                    <Checkbox label="任务-配置文件">任务-配置文件</Checkbox>
                    <Checkbox label="带宽控制">带宽控制</Checkbox>
                    <Checkbox label="配置文件">配置文件</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="查看权限"  v-show='common'>
                <ul class="user_common">
                    <li style="margin-left:40px;">主页</li>
                    <li>警告列表</li>
                    <li>设备定位</li>
                    <li style="margin-left:100px;">设备日志</li>
                    <li>通用设备管理</li>
                    <li>统计</li>
                    <li style="margin-left:100px;">设备报表</li>
                    <li>网络报表</li>
                    <li>系统日志</li>
                    <li style="margin-left:100px;">LTE-Fi Flow</li>
                    <li>LTE-Fi定位</li>
                    <li>LTE-Fi轨迹</li>
                </ul>
            </FormItem>
            <FormItem label="操作权限" v-show='common'>
                <ul class="user_common">
                    <li style="margin-left:40px;">LTE-Fi 配置</li>
                    <li>LTE-Fi 用户设置</li>
                    <li>诊断报告上传</li>
                </ul>
            </FormItem>
            <FormItem label='备注' prop='remarks' class='form_user'>
                <Input v-model="formItem.remarks" type="textarea" placeholder="请输入用户备注信息" class='textarea'></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" style='margin-left:130px;margin-right:100px' @click='SubmitInfor'>确定</Button>
                <Button style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    //import util  from '../../libs/util.js';
    import Cookies from 'js-cookie';
   // var current_username = document.cookie.split(";")[0].split("=")[1];//定义全局变量获取当前登录用户名

    export default {
        data () {
            return {
                baseuri:'/user-managements',
                value: '',
                type:false,
                formItem:{
                    'username':"zhangsan",
                    'password':"123456",
                    're_password':"123456",
                    'user_manangement':{},
                    're_name':"zhangsan",
                    'landline':"0552-2878826",
                    'phone':"13183127591",
                    'address':"江苏省南京市玄武大道622",
                    'Email':"12345678@qq.com",
                    'checkbox':[],
                    'checkbox2':[],
                    'remarks':"zhangsan23232",
                },
                management_user:true,
                mgt:false,
                common:true,
                userlevel:'',
                usermanagement:'',
                user_level:[
                            {
                            'typename':'组查看者',
                            'id':1, 
                            },
                            {
                            'typename':'组管理员',
                            'id':2, 
                            }
                    ],
                user_manangement:[
                            {
                            'managementname':'一级用户',
                            'uid':1, 
                            },
                            {
                            'managementname':'二级用户',
                            'uid':2, 
                            }
                ],
                columns: [
                    {
                        title: '顺序',
                        key: 'index',
                        align: 'center',
                        width: 100, 
                    },
                    {
                        title: '用户名',
                         align: 'center',
                        key: 'UserName'
                    },
                    {
                        title: '权限',
                        align: 'center',
                        key: 'Power'
                    },
                    {
                        title: '组管理员',
                        align: 'center',
                        key: 'management'
                    },
                    {
                        title: '电子邮箱',
                        align: 'center',
                        key: 'Email'
                    },
                    {   
                        title: "操作",
                        key: 'action',
                        width: 200,
                        align: 'center',
                        renderHeader:(h, params) => {
                            return  h('div',[
                                    h('AddIcon', {
                                        on: {
                                                'click': (vm) => {
                                                    this.$refs.table.exportCsv({
                                                        filename: 'The original data'
                                                    });
                                                }
                                            }
                                    }), 
                                    h('strong', '操作'),
                                    h('AddButton', {
                                        on: {
                                                'click-button': (vm) => {
                                                    if(this.type){
                                                        this.type=false;
                                                    }else{
                                                        this.type=true;
                                                    }
                                                }
                                            }
                                    }),  
                            ]);
                        },
                        render: (h, params) =>{   
                            return h('div', [
                                        h('Button', {
                                            props: {
                                                type: 'primary',
                                                size: 'small'
                                            },
                                            style: {
                                                marginRight: '5px',
                                                height:'30px',
                                                width:'60px'
                                            },
                                            on: {
                                                click: () => {
                                                    this.show(params.index)
                                                }
                                            }
                                        }, '编辑'),//编辑按钮
                                        h('Poptip',{
                                        props: {
                                            confirm: true,
                                            title: '您确定要删除这条数据吗?',
                                            transfer: true
                                        },
                                        on: {
                                            'on-ok': () => {
                                                let delTableData = vm.thisTableData.splice(index, 1);
                                            }
                                        }
                                        }, [
                                            h('Button', {
                                                style: {
                                                    margin: '0 5px'
                                                },
                                                props: {
                                                    type: 'error',
                                                }
                                            }, '删除')//删除按钮
                                        ])
                                    ]);
                        },
                    }      
                ],
                data: [
                    {   
                        index:1,
                        UserName: 'John Brown',
                        Power: 18,
                        management: 'yaolianmin',
                        Email:'123456@qq.com',
                        aa:121
                    },
                    {   
                        index:2,
                        UserName: 'John Brown',
                        Power: 18,
                        management: 'yaolianmin',
                        Email:'123456@qq.com',
                        aa:121
                    },
                    {   
                        index:3,
                        UserName: 'John Brown',
                        Power: 18,
                        management: 'yaolianmin',
                        Email:'123456@qq.com',
                    },
                    {   
                        index:4,
                        UserName: 'John Brown',
                        Power: 18,
                        management: 'yaolianmin',
                        Email:'123456@qq.com',
                    },
                ]
            }
        },
        methods:{
            init(){
                console.log('2323232');
            },
            get_userlevel(event){
               if(event == 2){
                this.management_user=false; //组管理员下拉框消失
                this.mgt=true; //组管理员的多选框出现
                this.common=false; //普通用的权限消失
                this.formItem.checkbox=['主页','警告列表','设备定位','设备日志','通用设备管理','统计','设备报表','网络报表','系统日志','LTE-Fi Flow','LTE-Fi定位','LTE-Fi轨迹'];
                this.formItem.checkbox2=['设备管理','任务','固件','任务-配置文件','带宽控制','配置文件'];
               }else{
                this.management_user=true;
                this.mgt=false;
                this.common=true;
                this.formItem.checkbox=[];
                this.formItem.checkbox2=[];
               }
            },
            SubmitInfor(){
                console.log(this.formItem.checkbox[0]);
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
                
            },
            //ajax请求返回值处理
            response_callback(res) {
                console.log(res.data);
                console.log(Cookies.get('user'));

            },
        },
        created () {
            var infor = {'flag':'get user infor'};
            util.ajax.request('get',this.baseuri,infor,{}, this.response_callback, this.exception_callback);

        }
    }
</script>
