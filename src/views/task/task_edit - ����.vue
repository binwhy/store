<template>
    <div>
        <div v-if="select_taskType != ''">
            <Row >
                <task_edit-table v-model="tableData" 
                            :columnsList="tableColumns" 
                            :isLoading="tableLoading"
                            @on-change="select_all" 
                            @select-one="select_one"
                            :optionsList="selectList" 
                            style="margin-top: 10px"
                            >
                </task_edit-table>
                <page-table :count="totalsize" @on-change="changePage" @on-page-size-change="changePageSize"></page-table>
            </Row>
             <br>
            <HR></HR>
            <br>
        </div>

        <Row>
            <Col span="8" offset="7">
                <task_edit-form
                        ref="formRef"
                        v-model="modelFormData"
                        :formItems="newModelForm"
                        :formDataVaildate="formDataVaildate"
                        @on-click-submit="formSubmit"
                        @select-changed="selectChanged"
                        >
                </task_edit-form>
            </Col>
        </Row> 
        
    </div>
</template>
<script>
    import task_editForm from '../common/form/best-form.vue';
    import task_editTable from '../common/table/table-list.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import task_editModel_th from './task_edit_th.js';
    import util  from '../../libs/util.js';

    var current_username = document.cookie.split(";")[0].split("=")[1];//定义全局变量获取当前登录用户名

    export default {
        components: {
            task_editForm,
            task_editTable,
            pageTable

        },
        data () {
            return {
                newModelForm: [],
                modelFormData: {},
                formDataVaildate:{
                    description:[
                        { required: true, message: 'Please enter basic platform name!', trigger: 'change' }
                    ],
                    task_type: [
                        { required: true, message: 'Please enter basic platform name!', trigger: 'blur' }
                    ],
                    // execute_time: [
                    //     { required: true, message: 'Please enter brand name!', trigger: 'blur' }
                    // ],
                },
                tableData: [],
                tableColumns: [],
                totalsize: 0,
                page_size: 10,
                select_taskType:'',
                tableLoading:false,
                table_rowdata:[],

                baseuri: '/task-managements',
                selectList: {
                    templet_name: [
                        {
                            value: 'default1',
                            label: 'default1',
                            selectable: true
                        },
                        {
                            value: 'default2',
                            label: 'default2'
                        },
                        {
                            value: 'default3',
                            label: 'default3'
                        },
                        {
                            value: 'default4',
                            label: 'default4'
                        }
                    ]
                }
            }
        },
        methods: {
            selectChanged: function(event){
                if(event === "now")
                {
                    task_editModel_th.task_editModel[3].type = "none";
                }else if(event === "schedule-on"){
                    task_editModel_th.task_editModel[3].type = "DatePicker";
                }else{
                        this.select_taskType = event;
                        // if(this.select_taskType){
                        //     task_editModel_th.task_editModel[1]['disabled'] = true;
                        // }else{
                        //     task_editModel_th.task_editModel[1]['disabled'] = false;
                        // }
                        this.change_table_list(this.select_taskType);

                        console.log(this.select_taskType);
                        console.log("change the taskType!!!!\n");
                }  
            },
            //选择table表中的某一行或者多行
            select_one:function(selection){
                //选中了才能赋值
                if(selection){
                   this.table_rowdata = selection; 
                }
                
                console.log(this.table_rowdata);
            },
            //根据任务选项加载不同的表单内容
            change_table_list: function(task_type){
                if(task_type === "reboot" || task_type === "diagnostic"){
                    console.log("############ diagnostic ############\n");
                    this.tableColumns = task_editModel_th.reboot_tableColumns;
                }else if(task_type === "templet"){
                    console.log("############ templet ############\n");
                    this.get_tabledata(task_type);
                    this.tableColumns = task_editModel_th.templet_tableColumns;
                }else if(task_type === "firmware"){
                    console.log("############ firmware ############\n");
                    this.get_tabledata(task_type);
                    this.tableColumns = task_editModel_th.firmware_tableColumns;
                }
                // //根据不同任务类型去读取不同任务内容
                // let params = {
                //     username: current_username,
                //     limit: this.page_size,
                //     task_type:task_type
                // };
                // //设置urL
                // let uri = this.baseuri +'/' + 'task_edit_view';
                // this.tableLoading = true;
                // util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
            },
            get_tabledata:function(task_type){
                 //根据不同任务类型去读取不同任务内容
                let params = {
                    username: current_username,
                    limit: this.page_size,
                    task_type:task_type
                };
                //设置urL
                let uri = this.baseuri +'/' + 'task_edit_view';
                this.tableLoading = true;
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
            },
            //切换页码
            changePage (current) {
                let params = {
                    username: current_username,
                    page: current,
                    limit: this.page_size
                };
                this.tableLoading = true;
                //util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变pagesize
            changePageSize (page_size) {
                this.page_size = page_size;
                let params = {
                    username: current_username,
                    limit: this.page_size
                };
                this.tableLoading = true;
                //util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            select_all: function()
            {
                console.log("hello world!!\n");
            },
            //表单提交
            formSubmit: function (vaild, formDataObject) {
                if (vaild){
                    console.log(this.table_rowdata[0]);
                    if(this.table_rowdata.length != 0)
                    {
                        //数组里面有多个设备应该多少提交？还是后台做处理
                       // let formData = new FormData();
                        formDataObject.execute_time = this.date_change(formDataObject.execute_time);
                        // for(var i=0;i<this.table_rowdata.length;i++){
                        //     this.$set(formDataObject, 'group_name', this.table_rowdata[i]["group_name"]);
                        //     this.$set(formDataObject, 'reviewer', this.table_rowdata[i]["user_name"]);
                        //     this.$set(formDataObject, 'username', current_username);
                        //     this.$set(formDataObject, 'device_mac', '30:49:11:11:11:11');
                        //     this.$set(formDataObject, 'status', 'success');

                        // }
                        this.$set(formDataObject,'select_table_rowdata',this.table_rowdata);
                        // Object.keys(formDataObject).forEach((key) => {
                        //     formData.append(key, formDataObject[key]);
                        // });


                        let formData = JSON.parse(JSON.stringify(formDataObject));
                        // let params = {
                        //     username: current_username,
                        //     select_table_rowdata:this.table_rowdata
                        // };
                        util.ajax.request('post',  this.baseuri, {}, formData, this.response_callback, this.exception_callback);
                        console.log(formDataObject);
                        this.$Message.success('Success !');
                    }else{
                        this.$Message.error('请选择要下发任务的设备 ！！!');
                    }
                    
                }else{
                    this.$Message.error('Failed !');
                }
            },
            //ajax请求返回值处理
            response_callback(res) {
                this.tableLoading = false;
                this.tableData = res.data.body;
                this.totalsize = res.data.count;
                console.log("this is response_callback");
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            },
            //将UTC时间 转换成 2018-03-16 00:00:00 格式
            date_change(i_date) {
                var date = new Date(i_date);
                var Y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var H = date.getHours();
                var i = date.getMinutes();
                var s = date.getSeconds();
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (i < 10) {
                    i = '0' + i;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                var t = Y+'-'+m+'-'+d+' '+H+':'+i+':'+s;
                return t;
            }
        },
        created: function (){
            this.newModelForm = task_editModel_th.task_editModel;
            //this.tableColumns = task_editModel_th.task_edit_tableColumns;
        }
        // ,
        // watch: {
        //     value (task_type) {
        //         this.tableColumns = task_editModel_th.firmware_tableColumns;
        //     }
        // }
    }
</script>
<!-- <template>
    <Cascader :data="data" v-model="value1" trigger="hover"></Cascader>
</template>
<script>
    export default {
        data () {
            return {
                value1: [],
                data: []
            }
        },
        methods: {

        },
        created: function (){
            var task_list = [
                        {
                            value: 'gugong',
                            label: '重启任务'
                        },
                        {
                            value: 'tiantan',
                            label: '模板下发'
                        },
                        {
                            value: 'wangfujing',
                            label: '固件更新'
                        },
                        {
                            value: 'wangfujing',
                            label: '诊断任务'
                        }
                    ];

            var group_list =['AC-1027L','ZAC-1023-5-13','XN-1033'];
           
            var model_name_list = new Array(group_list.length);
                for (var i = 0; i < group_list.length; i++) {
                    model_name_list[i] = {};
                    model_name_list[i].label = group_list[i];
                    model_name_list[i].value = group_list[i];
                    model_name_list[i].children = task_list;
                }
                this.data=model_name_list;
            // this.data = [{
            //         value: 'AC-1027L',
            //         label: 'AC-1027L',
            //         children: [
            //             {
            //                 value: 'gugong',
            //                 label: '重启任务'
            //             },
            //             {
            //                 value: 'tiantan',
            //                 label: '模板下发'
            //             },
            //             {
            //                 value: 'wangfujing',
            //                 label: '固件更新'
            //             },
            //             {
            //                 value: 'wangfujing',
            //                 label: '诊断任务'
            //             }
            //         ]
            //     }, {
            //         value: 'XN-1033',
            //         label: 'XN-1033',
            //         children: [
            //             {
            //                 value: 'gugong',
            //                 label: '重启任务'
            //             },
            //             {
            //                 value: 'tiantan',
            //                 label: '模板下发'
            //             },
            //             {
            //                 value: 'wangfujing',
            //                 label: '固件更新'
            //             },
            //             {
            //                 value: 'wangfujing',
            //                 label: '诊断任务'
            //             }
            //         ],
            //     }];
                console.log(this.data.length);
        }
    }
</script> -->
<!-- <template>
    <div>
        <Row>
            <Col span="8" offset="7">
                <task_edit-form
                        ref="formRef"
                        v-model="modelFormData"
                        :formItems="newModelForm"
                        :formDataVaildate="formDataVaildate"
                        @on-click-submit="formSubmit"
                        >
                </task_edit-form>
            </Col>
        </Row> 
    </div>
</template>
<script>
    import task_editForm from '../common/form/best-form.vue';
    import task_editTable from '../common/table/table-list.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import task_editModel_th from './task_edit_th.js';
    import util  from '../../libs/util.js';

    export default {
        components: {
            task_editForm,
            task_editTable,
            pageTable

        },
        data () {
            return {
                newModelForm: [],
                modelFormData: {},
                formDataVaildate:{
                    description:[
                        { required: true, message: 'Please enter basic platform name!', trigger: 'change' }
                    ],
                    task_type: [
                        { required: true, message: 'Please enter basic platform name!', trigger: 'blur' }
                    ],
                    // execute_time: [
                    //     { required: true, message: 'Please enter brand name!', trigger: 'blur' }
                    // ],
                },
                baseuri: '/task-managements',
            }
        },
        methods: {
            //表单提交
            formSubmit: function (vaild, formDataObject) {
                if (vaild){  
                    //  console.log("hello 1111\n");
                    let register_url = "https://manager.lqgapp.com/LQG/userInfo/h5InvestBackRegister";

                    // //this.$set(formDataObject,'select_table_rowdata','sss');

                    // this.$set(formDataObject,'invitedUId','U_20180405092155054544006');
                    // this.$set(formDataObject,'login_password','qw123654');
                    // this.$set(formDataObject,'login_phone','18656215326');
                    // //手机验证码
                    // this.$set(formDataObject,'message_Code','1232');
                    // //图形验证码
                    // this.$set(formDataObject,'regWay','d4551a8de24a9a296bb2243c9ca8a77e');
                     let params = {
                            callback:'jQuery1113078735997167628_1523240444535'
                        };
                        //console.log("hello 222\n");
                    // var d;
                    formDataObject.invitedUId = 'U_20180405092155054544006';
                    formDataObject.login_password = 'qw123654';
                    formDataObject.login_phone = '18656215325';
                    //formDataObject.message_Code = '1232';
                    formDataObject.regWay = 'd4551a8de24a9a296bb2243c9ca8a77e';
                    for(var i = 999;i < 1111;i++){
                        // if (i < 10) {
                        //     d= '000' + i;
                        // }
                        // if (9 < i < 100) {
                        //     d = '00' + i;
                        // }
                        // if (99 < i < 1000) {
                        //     d = '0' + i;
                        // }
                        formDataObject.message_Code = i;
                        //console.log(i);
                        // formDataObject.message_Code = i;
                        let formData = JSON.parse(JSON.stringify(formDataObject));
                        // console.log(i);
                        //console.log(formDataObject);
                        util.ajax.request('post', register_url, params, formData, this.response_callback, this.exception_callback);
                    }
                    


                    
                    //let formData = JSON.parse(JSON.stringify(formDataObject));
                    //util.ajax.request('post',  this.baseuri, {}, formData, this.response_callback, this.exception_callback);
                    //console.log(formDataObject);
                    this.$Message.success('Success !');    
                }else{
                    this.$Message.error('Failed !');
                }
            },
            //ajax请求返回值处理
            response_callback(res) {
                console.log("this is response_callback");
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        },
        created: function (){
            this.newModelForm = task_editModel_th.testModel;
        }
    }
</script>
 -->

<template>
    <div>
        <div>
            <Tabs type="card" @on-click="tab_task_handle" :animated="false">
                <TabPane v-for="tab in tabs" :label="tab.label" :key="tab.key"> 
                        <task_edit-table v-model="tableData" 
                                    :columnsList="tableColumns" 
                                    :isLoading="tableLoading"
                                    @on-change="select_all" 
                                    @select-one="select_one"
                                    :optionsList="selectList" 
                                    style="margin-top: 10px">
                        </task_edit-table>   
                </TabPane>
            </Tabs>
            <Row>
                <page-table 
                    :count="totalsize" 
                    @on-change="changePage" 
                    @on-page-size-change="changePageSize">
                </page-table>
            </Row>
        </div>
        <Row>
            <Col span="8" offset="7">
                <task_edit-form
                        ref="formRef"
                        v-model="modelFormData"
                        :formItems="newModelForm"
                        :formDataVaildate="formDataVaildate"
                        @on-click-submit="formSubmit"
                        @select-changed="selectChanged"
                        >
                </task_edit-form>
            </Col>
        </Row> 
    </div>
</template>
<script>
    import task_editForm from '../common/form/best-form.vue';
    import task_editTable from '../common/table/table-list.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import task_editModel_th from './task_edit_th.js';
    import util  from '../../libs/util.js';

    var current_username = document.cookie.split(";")[0].split("=")[1];//定义全局变量获取当前登录用户名
    export default {
        components: {
            task_editForm,
            task_editTable,
            pageTable

        },
        data () {
            return {
                newModelForm: [],
                modelFormData: {},
                formDataVaildate:{
                    description:[
                        { required: true, message: 'Please enter basic platform name!', trigger: 'change' }
                    ],
                    task_type: [
                        { required: true, message: 'Please enter basic platform name!', trigger: 'blur' }
                    ],
                    // execute_time: [
                    //     { required: true, message: 'Please enter brand name!', trigger: 'blur' }
                    // ],
                },
                tableData: [],
                tableColumns: [],
                totalsize: 0,
                page_size: 10,
                select_taskType:'',
                tableLoading:false,
                table_rowdata:[],
                tabs:[],
                baseuri: '/task-managements',
                selectList: {
                    templet_name: [
                        {
                            value: 'default1',
                            label: 'default1',
                            selectable: true
                        },
                        {
                            value: 'default2',
                            label: 'default2'
                        },
                        {
                            value: 'default3',
                            label: 'default3'
                        },
                        {
                            value: 'default4',
                            label: 'default4'
                        }
                    ]
                }
            }
        },
        methods: {
            selectChanged: function(event){
                if(event === "now")
                {
                    task_editModel_th.task_editModel[3].type = "none";
                }else if(event === "schedule-on"){
                    task_editModel_th.task_editModel[3].type = "DatePicker";
                }else{
                        //this.select_taskType = event;
                        // if(this.select_taskType){
                        //     task_editModel_th.task_editModel[1]['disabled'] = true;
                        // }else{
                        //     task_editModel_th.task_editModel[1]['disabled'] = false;
                        // }
                        //this.change_table_list(this.select_taskType);

                        //console.log(this.select_taskType);
                        //console.log("change the taskType!!!!\n");
                }  
            },
            //切换任务类型标签
            tab_task_handle (event) {
                console.log('########tab task event############',event);
                if(event === 0){
                    this.tableData = this.get_tabledata();    
                    this.tableColumns = task_editModel_th.templet_tableColumns;
                }else if(event === 1){
                      this.tableData = this.get_tabledata();
                    this.tableColumns = task_editModel_th.firmware_tableColumns;
                }else if(event === 2 || event === 3){
                    this.tableData = this.get_tabledata();
                    this.tableColumns = task_editModel_th.reboot_tableColumns;
                }
            },
            get_tabledata:function(){
                 //根据不同任务类型去读取不同任务内容
                let params = {
                    username: current_username,
                    limit: this.page_size,
                    //task_type:task_type
                };
                //设置urL
                let uri = this.baseuri +'/' + 'task_edit_view';
                this.tableLoading =false;
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
            },
            //ajax请求返回值处理
            response_callback(res) {
                this.tableLoading = false;
                this.tableData = res.data.body;
                this.totalsize = res.data.count;
                console.log("this is response_callback");
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        },
        created: function (){
            this.newModelForm = task_editModel_th.task_editModel;
            this.tableData = this.get_tabledata();
            this.tableColumns = task_editModel_th.templet_tableColumns;
            this.tabs = task_editModel_th.tabs_handle('AC');
            //this.tableColumns = task_editModel_th.task_edit_tableColumns;
            },
        watch: {
            tableColumns (data) {

                console.log("##this is watch###\n");
            }
        }
    }
</script>