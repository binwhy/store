<template>
    <div>
        <div>
            <Row>
            <search-form @on-change="handleSearch"></search-form>
            <task_edit-table v-model="tableData" 
                        :columnsList="tableColumns" 
                        :isLoading="tableLoading"
                        @on-change="select_all" 
                        @select-one="select_one"
                        :optionsList="selectList"
                        @change_button_status="change_editbutton_status" 
                        style="margin-top: 10px">
            </task_edit-table> 
                <page-table 
                    :count="totalsize" 
                    @on-change="changePage" 
                    @on-page-size-change="changePageSize">
                </page-table>
            </Row>
        </div>
        <Row v-if="edit_task_button != 'none'">
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
    import searchForm from '../common/search/input-search.vue';
    import task_editForm from '../common/form/best-form.vue';
    import task_editTable from '../common/table/table-list.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import task_editModel_th from './task_edit.js';
    import util  from '../../libs/util.js';

    var current_username = document.cookie.split(";")[0].split("=")[1];//定义全局变量获取当前登录用户名
    export default {
        components: {
            searchForm,
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
                        { required: true, message: 'Please enter task description!', trigger: 'change' }
                    ],
                    task_type: [
                        { required: true, message: 'Please enter task type name!', trigger: 'change' }
                    ],
                    fw_path: [
                        { required: true, message: 'Please enter ftp server!', trigger: 'change' }
                    ],
                    templet_name: [
                        { required: true, message: 'Please enter ftp server!', trigger: 'change' }
                    ]
                },
                tableData: [],
                tableColumns: [],
                totalsize: 0,
                page_size: 10,
                select_taskType:'',
                tableLoading:false,
                table_rowdata:[],
                edit_task_button:"none",
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
            //切换页码
            changePage (current) {
                let uri = this.baseuri +'/' + 'task_edit_view';
                let params = {
                    username: current_username,
                    page: current,
                    limit: this.page_size
                };
                this.tableLoading = true;
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变pagesize
            changePageSize (page_size) {
                let uri = this.baseuri +'/' + 'task_edit_view';
                this.page_size = page_size;
                let params = {
                    username: current_username,
                    limit: this.page_size
                };
                this.tableLoading = true;
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
            },
            //依据mac地址模糊查询搜索设备
            handleSearch:function (val) {
                let uri = this.baseuri +'/' + 'task_edit_view';
                let params = {
                    username: current_username,
                    mac_addr_like: val,
                    limit: this.page_size
                };
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
            },
            select_all: function(){
                console.log("this select all");
            },
            select_one: function (selection){
                 //选中了才能赋值
                if(selection){
                   this.table_rowdata = selection; 
                }
                //console.log(this.table_rowdata);
            },
            //控制显示任务编辑表单
            change_editbutton_status: function (event) {
                if(this.edit_task_button =="none"){
                        this.edit_task_button = "show";
                }else{
                        this.edit_task_button = "none";
                }
            },
            selectChanged: function(event){
                if(event === "now")
                {
                    if(this.select_taskType === "templet"){
                        task_editModel_th.task_editModel_templet[4].type = "none";
                    }else if(this.select_taskType === "firmware"){
                        task_editModel_th.task_editModel_fw[4].type = "none";
                    }else{
                        task_editModel_th.task_editModel_one[3].type = "none";
                    }
                }else if(event === "schedule-on"){
                    if(this.select_taskType === "templet"){
                        task_editModel_th.task_editModel_templet[4].type = "DatePicker";
                    }else if(this.select_taskType === "firmware"){
                        task_editModel_th.task_editModel_fw[4].type = "DatePicker";
                    }else{
                       task_editModel_th.task_editModel_one[3].type = "DatePicker";
                    }
                }else if(event === "templet"){
                    this.newModelForm = task_editModel_th.task_editModel_templet;
                    this.select_taskType = event;
                    //这里可以在一开始加载页面时，获取某类设备的已有模板
                    task_editModel_th.task_editModel_templet[2].options = this.selectList.templet_name;   
                }else if(event === "firmware"){
                    //task_editModel_th.task_editModel_fw[2].value = this.table_rowdata[0]["fw_path"];
                    this.newModelForm = task_editModel_th.task_editModel_fw;
                    this.select_taskType = event;
                    
                    //console.log(this.table_rowdata[0]["fw_path"]);
                }else if(event === "reboot" || event === "diagnostic"){
                    this.newModelForm = task_editModel_th.task_editModel_one;
                    this.select_taskType = event;
                }
            },
            //切换任务类型标签
            tab_task_handle (event) {
                console.log('########tab task event############',event);
                if(event === 0){
                    this.tableData = this.get_tabledata();    
                    //this.tableColumns = task_editModel_th.templet_tableColumns;
                }else if(event === 1){
                    this.tableData = this.get_tabledata();
                    //this.tableColumns = task_editModel_th.firmware_tableColumns;
                }else if(event === 2 || event === 3){
                    this.tableData = this.get_tabledata();
                    //this.tableColumns = task_editModel_th.reboot_tableColumns;
                }
            },
            get_tabledata:function(){
                 //根据不同任务类型去读取不同任务内容
                let params = {
                    username: current_username,
                    limit: this.page_size,
                    //task_type:task_type
                };
                //console.log("11111111111111111111"+document.cookie.split(";")[0].split("=")[2]);
                //设置urL
                let uri = this.baseuri +'/' + 'task_edit_view';
                this.tableLoading =false;
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
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
                        //     this.$set(formDataObject, 'device_mac', this.table_rowdata[i]["mac_addr"]);
                        //     this.$set(formDataObject, 'status', 'success');
                        //     console.log(formDataObject);
                        //     let formData = JSON.parse(JSON.stringify(formDataObject));
                        //     util.ajax.request('post',  this.baseuri, {}, formData, this.response_callback, this.exception_callback);
                        // }

                        this.$set(formDataObject,'select_table_rowdata',this.table_rowdata);
                        //从模板任务和固件更新任务切换时，要清除之前的formDataObject中的模板名和固件更新的ftp server地址
                        if(formDataObject.task_type === "reboot" ||formDataObject.task_type === "diagnostic"){
                            delete formDataObject.templet_name;
                            delete formDataObject.fw_path;
                        }
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
            },
            //ajax请求返回值处理
            response_callback(res) {
                this.tableLoading = false;
                this.tableData = res.data.body;
                this.totalsize = Number(res.data.count);
                console.log(res.data.body);
                console.log("this is response_callback");
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        },
        created: function (){
                this.newModelForm = task_editModel_th.task_editModel_one;
                this.tableData = this.get_tabledata();
                this.tableColumns = task_editModel_th.templet_tableColumns;
        },
        watch: {
            tableColumns (data) {

                console.log("##this is watch###\n");
            }
        }
    }
</script>