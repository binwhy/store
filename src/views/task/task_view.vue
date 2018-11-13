<template>
    <div>
        <Row>
            <search-form @on-change="handleSearch"></search-form>
            <task_view-table v-model="tableData" 
                        :columnsList="tableColumns" 
                        :isLoading="tableLoading"
                        @on-change="row_change" 
                        @on-delete="row_delete" 
                        style="margin-top: 10px"
                        >
            </task_view-table>
            <page-table :count="totalsize" @on-change="changePage" @on-page-size-change="changePageSize"></page-table>
        </Row>
    </div>
</template>

<script> 
    import searchForm from '../common/search/input-search.vue';
    import task_viewTable from '../common/table/table-list.vue';
    import task_view_th from './task_view_th.js';
    import pageTable  from '../common/pagination/page-table.vue';
    import util  from '../../libs/util.js';
    var current_username = document.cookie.split(";")[0].split("=")[1];//定义全局变量获取当前登录用户名

    export default{
        components: {
            task_viewTable,
            pageTable,
            searchForm,
        },
        data() {
            return {
                tableData: [],
                tableColumns: [],
                totalsize: 0,
                page_size: 10,
                baseuri: '/task-managements',
            };
        },
        methods: {
            //初始表单数据
            initFormData: function () {
                let params = {
                    username: current_username,
                    limit: this.page_size
                };

                this.tableColumns = task_view_th.task_view_table_list;
                this.tableLoading = true;
                //这里用的restful 原生的get 方法 直接用index方法获取的数据
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //切换页码
            changePage (current) {
                let params = {
                    username: current_username,
                    page: current,
                    limit: this.page_size
                };
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变pagesize
            changePageSize (page_size) {
                this.page_size = page_size;
                let params = {
                    username: current_username,
                    limit: this.page_size
                };
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //依据mac地址模糊查询搜索设备
            handleSearch (val) {
                let params = {
                    username: current_username,
                    mac_addr_like: val,
                    limit: this.page_size
                };
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            row_change: function (event){
                console.log("this is row_change!!");
            },
            //table数据被删除
            row_delete (del_data) {
                //设置urL
                let uri = this.baseuri +'/' + del_data.id;
                this.tableLoading = true;
                let params = {
                username: current_username,
                limit: this.page_size
                };
                //发送数据
                util.ajax.request('delete', uri, {}, {}, (res) => {this.initFormData();}, this.exception_callback);
            },
            //ajax请求返回值处理
            response_callback(res) {
                this.tableLoading = false;
                this.tableData = res.data.body;
                this.totalsize = Number(res.data.count);
                //console.log(res.data.body);
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
            
        },
        created: function (){
            //初始表单数据
            this.initFormData();
        }
    }
</script>