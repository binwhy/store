<style>
    @import "./style/config.css";
</style>

<template>
    <div>
        <div v-if="selected_model === ''">
            <Row>
                <Col span="12" offset="6">
                    <select-form :tips="'请选择或输入机种名称'"
                                 :optionList="optionList"
                                 @select-changed="selectChanged"
                                 :selectOption="selected_model"
                    ></select-form>
                </Col>
            </Row>
        </div>
        <div v-else>
            <Row>
                <Col span="12" offset="6">
                    <select-form :tips="'请选择或输入机种名称'"
                                 :optionList="optionList"
                                 @select-changed="selectChanged"
                                 :selectOption="selected_model"
                    ></select-form>
                </Col>
            </Row>
            <Tabs type="card" v-model="selectdevice" @on-click="tab_device_handle">
                <TabPane v-for="tab in tabs" :label="tab.label" :key="tab.key" :name="tab.name">
                    <model-table
                            ref="mychild"
                            v-model="tableData"
                            :columnsList="tableColumns"
                            :isLoading="tableLoading"
                            :size="size"
                            @on-change="handle_edit_templet"
                            @on-delete="handle_delete_template"
                            @change-button-status="add_template"
                    ></model-table>
                </TabPane>
            </Tabs>
            <Row>
                <page-table
                        :count="totalsize"
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                ></page-table>
           </Row>
           <div v-if="edit_wireless === 'edit'">
                <Tabs type="card" v-model="selectcard" @on-click="tab_card_handle">
                    <TabPane v-for="tab in cardnum" :label="tab.label" :key="tab.key">
                        <Collapse accordion v-model="templet_collapse">
                            <Panel name=1>
                                Wireless Setting
                                <p slot="content" style='height:auto;'>
                                    <model-form
                                            ref="formRef"
                                            v-model="templetFormData_wireless"
                                            :formItems="templetForm_wireless"
                                            :formDataVaildate="formDataVaildate"
                                            :inputStatus="tnameStatus"
                                            @on-click-submit="formSubmit">
                                    </model-form>
                                </p>
                            </Panel>
                            <Panel v-if="vap_profiles === 'edit'" name=2>
                                VAP Profiles
                                <div slot="content">
                                    <model-table
                                            v-model="vaptableData"
                                            :columnsList="vaptableColumns"
                                            :isLoading="tableLoading"
                                            :size="size"
                                            @on-change="handle_edit_vap"
                                    ></model-table>
                                    <div v-if="edit_vap === 'edit'">
                                        <p style='height:auto;'>
                                            <model-form
                                                    ref="formRef"
                                                    v-model="templetFormData_vap"
                                                    :formItems="templetForm_vap"
                                                    :formDataVaildate="formDataVaildate"
                                                    @on-click-submit="vapformSubmit">
                                            </model-form>
                                        </p>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import selectForm from '../common/form/select-form.vue';
    import modelTable from '../common/table/table-list.vue';
    import pageTable from '../common/pagination/page-table.vue';
    import modelForm from '../common/form/best-form.vue';
    import util from '../../libs/util.js';
    import parser from '../../libs/parser.js';
    import cfg_edit_th from './cfg_edit_th.js';
    import cfg_handle from './cfg_edit_handle.js';

    const optionList = [
        {
            label: 'ZN-7100-2DHO',
            value: 'ZN-7100-2DHO'
        },
        {
            label: 'ZAC-715',
            value: 'ZAC-715'
        }
    ];

    const cardnum2 = [
        {
            label: 'Card 1',
            key: 0
        },
        {
            label: 'Card 2',
            key: 1
        }
    ];

    const cardnum1 = [
        {
            label: 'Card 1',
            key: 0
        }
    ];

    export default {
        components: {
            pageTable,
            selectForm,
            modelTable,
            modelForm
        },
        data () {
            
            return {
                templet_collapse: '1',
                size: 'small',
                totalsize: 0,
                page_size: 10,
                optionList:optionList,
                tabs: [],
                cardnum:'',
                selectdevice: '',
                selectcard: 0,
                selected_model: '',
                edit_wireless: '',
                vap_profiles: '',
                edit_vap: '',
                tableData: [],
                vaptableData: [],
                tableLoading: false,
                tableColumns: [],
                vaptableColumns: [],
                vap_array: [],
                templetForm_wireless: [],
                templetFormData_wireless: {},
                templetForm_vap: [],
                templetFormData_vap: {},
                edit_templet_data: {},
                edit_vapnum: 0,
                template_status: '',
                tnameStatus: true,
                templetData_json: {},
                formDataVaildate:{
                    ProfileName:[
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                    template_name:[
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ]
                },
                baseuri: '/templates'
            };
        },
        methods: {
            //初始表单数据
            initFormData: function (event,cdnum,vapnum) {
                //向wireless配置赋值
                this.templetForm_wireless.forEach((item, index) => {
                    //console.log('######wireless item #######',item);
                    if (typeof(item.key) !== 'undefined' && cfg_handle.isEmptyObject(event)){
                        //当新增模板时,event為空，模板值来自于 模板的js描述文件
                        delete this.templetFormData_wireless[item.key];
                        this.$set(this.templetFormData_wireless, item.key, item.value[0]);
                    }
                    if (typeof(item.key) !== 'undefined' && !cfg_handle.isEmptyObject(event)){
                        //当编辑模板时
                        for(var key in event){
                            if(item.key === key){
                                var dataIntArr = cfg_handle.templateData_handle(event[key]);
                                delete this.templetFormData_wireless[item.key];
                                if(key !== 'template_name'){
                                    //console.log('###### item.key ########',item.key);
                                    //console.log('###### dataIntArr[cdnum] #######',dataIntArr[cdnum]);
                                    this.$set(this.templetFormData_wireless, item.key, dataIntArr[cdnum]);
                                }
                                else if(key === 'template_name'){
                                    this.$set(this.templetFormData_wireless, item.key, dataIntArr[0]);
                                }
                            }
                        }
                    }
                    
                });
                //向vap配置赋值
                if(typeof(vapnum) !== 'undefined'){
                    this.templetForm_vap.forEach((item, index) => {
                        //console.log('######vap item #######',item);
                        if (typeof(item.key) !== 'undefined' && cfg_handle.isEmptyObject(event)){
                            //当新增模板时,event為空，模板值来自于 模板的js描述文件
                            delete this.templetFormData_vap[item.key];
                            /*
                            WepKeyVal 模板js描述文件中的key
                            key1 key2 key3 key4 表示WEP加密方式中的四个值
                            choice 表示当前选择的是哪个key值
                            key1 key2 key3 key4 choice 通过“-”相连，形成字符串数据。
                            */
                            if(item.key == "WepKeyVal"){
                                var key_data = item.value[vapnum].split("-");
                                this.$set(this.templetFormData_vap, 'key1', key_data[0]);
                                this.$set(this.templetFormData_vap, 'key2', key_data[1]);
                                this.$set(this.templetFormData_vap, 'key3', key_data[2]);
                                this.$set(this.templetFormData_vap, 'key4', key_data[3]);
                                if(key_data[4] == "1")
                                    this.$set(this.templetFormData_vap, 'choice', 'key1');
                                else if(key_data[4] == "2")
                                    this.$set(this.templetFormData_vap, 'choice', 'key2');
                                else if(key_data[4] == "3")
                                    this.$set(this.templetFormData_vap, 'choice', 'key3');
                                else if(key_data[4] == "4")
                                    this.$set(this.templetFormData_vap, 'choice', 'key4');
                            }
                            /*
                            Authentication 表示 网络认证方式&加密方式
                            数据格式为 “0-0” 第一个0表示网络认证方式的value ,第二个0表示加密方式的value,中间用“-”隔开 
                            */
                            else if(item.key == "Authentication"){
                                var key_data = item.value[vapnum].split("-");
                                var key_dataArr = [];
                                key_data.forEach(function(data4,index4,arr4){
                                        key_dataArr.push(+data4);//需要转换为整形数组
                                });
                                //console.log('######key_dataArr#######',key_dataArr);
                                this.$set(this.templetFormData_vap, 'Authentication', key_dataArr);
                            }
                            else
                                this.$set(this.templetFormData_vap, item.key, item.value[vapnum]);
                        }
                        if (typeof(item.key) !== 'undefined' && !cfg_handle.isEmptyObject(event)){
                            //当编辑模板时
                            for(var key in event){
                                if(item.key === key){
                                    var dataIntArr = cfg_handle.templateData_handle(event[key]);
                                    delete this.templetFormData_vap[item.key];
                                    //console.log('######item.key#######',item.key);
                                    //console.log('#######dataIntArr######',dataIntArr);
                                    //console.log('#######dataIntArr[vapnum]######',dataIntArr[vapnum]);
                                    if(item.key == "WepKeyVal"){
                                        var key_data = dataIntArr[vapnum].split("-");
                                        this.$set(this.templetFormData_vap, 'key1', key_data[0]);
                                        this.$set(this.templetFormData_vap, 'key2', key_data[1]);
                                        this.$set(this.templetFormData_vap, 'key3', key_data[2]);
                                        this.$set(this.templetFormData_vap, 'key4', key_data[3]);
                                        if(key_data[4] == "1")
                                            this.$set(this.templetFormData_vap, 'choice', 'key1');
                                        else if(key_data[4] == "2")
                                            this.$set(this.templetFormData_vap, 'choice', 'key2');
                                        else if(key_data[4] == "3")
                                            this.$set(this.templetFormData_vap, 'choice', 'key3');
                                        else if(key_data[4] == "4")
                                            this.$set(this.templetFormData_vap, 'choice', 'key4');
                                    }
                                    else if(item.key == "Authentication"){
                                        var key_data = dataIntArr[vapnum].split("-");
                                        var key_dataArr = [];
                                        key_data.forEach(function(data4,index4,arr4){
                                                key_dataArr.push(+data4);//需要转换为整形数组
                                        });
                                        //console.log('######key_dataArr#######',key_dataArr);
                                        this.$set(this.templetFormData_vap, 'Authentication', key_dataArr);
                                    }
                                    else
                                        this.$set(this.templetFormData_vap, item.key, dataIntArr[vapnum]);
                                }
                            }
                        }
                    });
                }
                
            },
            //提交wireless setting 表单
            formSubmit: function (vaild, formDataObject) {
                var uri = this.template_status ==="edit" ?  (this.baseuri + '/edit_template') : (this.baseuri + '/add_template');
                //console.log('#### vaild ####',vaild);
                //console.log('#### formDataObject ####',formDataObject);
                var card_num = this.templetData_json.productInfo.card_num;
                var vap_num = this.templetData_json.productInfo.vap_num;
                let formData = new FormData();
                if(this.template_status === 'edit'){
                    if (vaild){
                        formData = cfg_handle.wireless_Submit(this,formDataObject,card_num);
                        util.ajax.request('post', uri, {}, formData, this.edit_response_callback, this.exception_callback);
                    }
                }else if(this.template_status === 'add'){
                    if (vaild){
                        formData = cfg_handle.wireless_Submit(this,formDataObject,card_num);
                        /*
                        *双卡设备，卡1和卡2都有VAP
                        */
                        if(card_num == "2" && vap_num[0] != "0" && vap_num[1] != "0"){
                            //先编辑保存卡1的基本模板时，卡1的vap和卡2的整个模板都采用默认值
                            if(this.selectcard === 0){
                                this.show_vap(0);
                                formData = cfg_handle.vap_formData(this,formData);
                                this.show_wireless(1);
                                formData = cfg_handle.wireless_formData(this,formData,1);
                                this.show_vap(1);
                                formData = cfg_handle.vap_formData(this,formData,1);
                            }
                            //先编辑保存卡2的基本模板时，卡2的vap和卡1的整个模板都采用默认值
                            else if(this.selectcard === 1){
                                this.show_vap(1);
                                formData = cfg_handle.vap_formData(this,formData);
                                this.show_wireless(0);
                                formData = cfg_handle.wireless_formData(this,formData,0);
                                this.show_vap(0);
                                formData = cfg_handle.vap_formData(this,formData,0);
                            }
                        }
                        

                        util.ajax.request('post', uri, {}, formData, this.edit_response_callback, this.exception_callback);
                    }
                }
                
            },
            //提交VAP表单
            vapformSubmit: function (vaild, formDataObject) {
                if(this.template_status === 'edit'){
                    var uri = this.baseuri + '/edit_vaptemplate';
                    //console.log('####formDataObject###',formDataObject);
                    if(vaild){
                        let formData = cfg_handle.vap_Submit(this,formDataObject);

                        util.ajax.request('post', uri, {}, formData, this.edit_response_callback, this.exception_callback);
                    }
                }
                if(this.template_status === 'add'){
                    cfg_handle.instance(this,'warning');//弹框提示
                    this.selectChanged(this.selected_model);
                }

            },
            //切换设备类型标签
            tab_device_handle (event) {
                console.log('########tab device event############',event);

                this.selected_model = event;
                var uri = this.baseuri + '/get_tap_templatedata';
                let params = {
                    model_name: this.selected_model
                };
                util.ajax.request('get',  uri, params, {}, this.response_template, this.exception_callback);
            },
            //切换card类型标签
            tab_card_handle (event) {
                //console.log('#### this.selectcard ####',this.selectcard);
                this.edit_vap = '';
                this.show_wireless(event);
                this.show_vap(event);
                
                if(this.template_status == 'add'){
                    cfg_handle.defalut_vap(this,event);
                    this.initFormData('',event);
                }
                else if(this.template_status == 'edit'){
                    cfg_handle.get_vapdata(this,this.edit_templet_data);
                    this.initFormData(this.edit_templet_data,event);
                }
            },
            //切换页面
            changePage (current) {
                let params = {
                    page: current,
                    model_name: this.selected_model,
                    limit: this.page_size
                };
                //console.log('####### changePage #######',params);
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变pagesize
            changePageSize (page_size) {
                this.page_size = page_size;
                let params = {
                    model_name: this.selected_model,
                    limit: this.page_size
                };
                //console.log('####### changePageSize #######',params);
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //筛选条件发生变化
            selectChanged: function (event) {
                //console.log('### this.templetForm_wireless 111 ###',this.templetForm_wireless);
                
                if(this.templetForm_wireless !== "undefined"){
                    //console.log('### this.templetForm_wireless 222 ###',this.templetForm_wireless);
                    this.templetForm_wireless.forEach((item, index) => {
                        if (typeof(item.key) !== 'undefined'){
                            delete this.templetFormData_wireless[item.key];
                        }
                    });
                }
                /*
                this.templetForm_vap.forEach((item, index) => {
                    if (typeof(item.key) !== 'undefined'){
                        delete this.templetFormData_vap[item.key];
                    }
                });
                */
                this.selected_model = event;
                var uri = this.baseuri + '/get_templatedata';
                let params = {
                    model_name: this.selected_model
                };
                //cfg_handle.test(this);
                util.ajax.request('get',  uri, params, {}, this.response_template, this.exception_callback);
            },
            //删除模板
            handle_delete_template(event){
                //console.log('######delete##########',event.id);
                let uri = this.baseuri +'/' + event.id;
                let params = {
                    model_name: this.selected_model
                };
                //发送数据
                util.ajax.request('delete', uri, {}, params, this.edit_response_callback, this.exception_callback);
            },
            //新增模板
            add_template (msg) {
                this.$refs.mychild[0].parentHandle();//调用子组件table-list中的clearCurrentRow方法，清除高亮项

                this.template_status = 'add';//当前为新增状态
                this.edit_wireless = 'edit';
                var card_num = this.templetData_json.productInfo.card_num;
                if(card_num == 2){
                    this.cardnum = cardnum2;
                }else if(card_num == 1){
                    this.cardnum = cardnum1;
                }
                var vap = this.templetData_json.viewDesc[1].L.L.span;
                if(vap.length == 0){
                    this.vap_profiles = '';
                }else
                    this.vap_profiles = 'edit';

                this.tnameStatus = false;
                this.edit_vap = '';//每次编辑都隐藏vap
                if( this.templet_collapse.length == 0)//若折叠面板没有初始值，那么默认显示面板1
                    this.templet_collapse = '1';

                this.show_wireless(this.selectcard);
                this.show_vap(this.selectcard);
                cfg_handle.defalut_vap(this,this.selectcard);
                this.initFormData('',this.selectcard);
            },
            //编辑模板
            handle_edit_templet (row_data, index) {
                //console.log('########row_data#########',row_data[index]);
                this.template_status = 'edit';//当前为编辑状态
                this.edit_wireless = 'edit';
                var card_num = this.templetData_json.productInfo.card_num;
                /*
                模板描述文件中 card_num = 2,表示双卡设备;card_num = 1,表示单卡设备
                */
                if(card_num == 2){
                    this.cardnum = cardnum2;
                }else if(card_num == 1){
                    this.cardnum = cardnum1;
                }
                /*
                模板描述文件中 viewDesc 中，如果参数项为空，则表示该设备没有VAP
                */
                var vap = this.templetData_json.viewDesc[1].L.L.span;
                if(vap.length == 0){
                    this.vap_profiles = '';
                }else
                    this.vap_profiles = 'edit';

                this.tnameStatus = true;
                this.edit_vap = '';//每次编辑都隐藏vap
                if( this.templet_collapse.length == 0)//若折叠面板没有初始值，那么默认显示面板1
                    this.templet_collapse = '1';

                this.edit_templet_data = row_data[index];
                this.show_wireless(this.selectcard);
                //console.log('####### 1 #######');
                this.show_vap(this.selectcard);
                //console.log('####### 2 #######');
                cfg_handle.get_vapdata(this,row_data[index]);
                //console.log('####### 3 #######');

                this.initFormData(row_data[index],this.selectcard);
            },
            //编辑vap
            handle_edit_vap (row_data,index) {
                var vap_num = this.templetData_json.productInfo.vap_num;
                var cd_index_vapnum = index+vap_num[0];
                if(this.template_status === 'edit'){
                    if(this.selectcard === 0){
                        this.edit_vapnum = index;
                        this.initFormData(this.edit_templet_data,this.selectcard,index);
                        //row_data中只包含三个值，而显示的vap模板是所有的值，所以传this.edit_templet_data
                    }
                    else if(this.selectcard === 1){
                        this.edit_vapnum = cd_index_vapnum;
                        this.initFormData(this.edit_templet_data,this.selectcard,cd_index_vapnum);
                    }
                }
                if(this.template_status === 'add'){
                    if(this.selectcard === 0){
                        this.edit_vapnum = index;
                        this.initFormData('',this.selectcard,index);
                    }else if(this.selectcard === 1){
                        this.edit_vapnum = index;
                        this.initFormData('',this.selectcard,index);
                    }
                }
                
                this.edit_vap = 'edit';
            },
            //绘制wireless
            show_wireless (event) {
                var templetView = {};
                var template_viewDesc_Arr = [];
                this.$set(templetView, 'productInfo',this.templetData_json.productInfo);//向templetView对象，赋键值
                template_viewDesc_Arr.push(this.templetData_json.viewDesc[0]);//只要templetData中 viewDesc的 wireless部分
                this.$set(templetView, 'viewDesc',template_viewDesc_Arr);
                //console.log('##### show_wireless #####',event);
                if(event === 0){
                    this.templetForm_wireless = parser.Json(templetView).card0;
                }else if(event === 1){
                    this.templetForm_wireless = parser.Json(templetView).card1;
                }
            },
            //绘制vap
            show_vap (event){
                var templetView = {};
                var template_viewDesc_Arr = [];
                this.$set(templetView, 'productInfo',this.templetData_json.productInfo);
                template_viewDesc_Arr.push(this.templetData_json.viewDesc[1]);//只要templetData中 viewDesc的 vap部分
                this.$set(templetView, 'viewDesc',template_viewDesc_Arr);
                //console.log('##########parser.Json(templetView)#########',parser.Json(templetView));
                if(event === 0){
                    this.templetForm_vap = parser.Json(templetView).card0;
                }else if(event === 1){
                    this.templetForm_vap = parser.Json(templetView).card1;
                }
            },
            //刪除 or 编辑后重新加載
            edit_response_callback(res) {
                this.selectChanged(this.selected_model);
            },
            //获取模板描述文件的json返回值处理
            response_template(res) {
                this.templetData_json = res.data;
                var dev_type = this.templetData_json.productInfo.dev_type;
                this.tabs = cfg_handle.tabs_handle(dev_type);
                this.edit_wireless = '';
                //this.selectdevice = 'FAP';//每次筛选条件发生变化时，都默认显示第一组
                this.selectcard = 0;//每次筛选条件发生变化时，都默认显示card1
                this.templet_collapse = '1';//每次筛选条件发生变化时,都默认显示第一面板
                let params = {
                    model_name: this.selected_model,
                    limit: this.page_size
                };
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);

            },
            //ajax请求返回值处理
            response_callback(res) {
                //console.log('###########res.data########',res);
                this.tableLoading = false;
                
                this.tableData = res.data.body;
                //console.log('#### res.data.count ###',res.data.count);
                this.totalsize = res.data.count;
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        },
        created: function (){
            //console.log('##### 11 ##########');
            this.tableColumns = cfg_edit_th.cfg_edit_col_th;
            //console.log('##### 22 ##########');
            this.vaptableColumns = cfg_edit_th.cfg_vap_edit_col_th;
            //console.log('##### 33 ##########');
            this.tableLoading = true;
            
        }
    };
</script>