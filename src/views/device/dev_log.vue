

<template>
    <div>
        <search-form @on-change="handleSearch"></search-form>
        <dev-table v-model="tableData" :columnsList="tableColumns" :isLoading="tableLoading"
                    @click-filter-change="changeFilter"
                    @customized-filter-change="customizedFilterChange"></dev-table>
        <page-table :count="totalsize" @on-change="changePage" @on-page-size-change="changePageSize"></page-table>
    </div>
    
</template>

<script>
    import searchForm from '../common/search/input-search.vue';
    import devTable   from '../common/table/table-list.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import util from '../../libs/util.js';
    import devlog_th from './devlog_th.js';
    
    export default {
        //name: 'DevLog',
        components: {
            searchForm,
            devTable,
            pageTable
        },
        data () {
            return {
                totalsize: 0,
                page_size: 10,
                tableLoading: false,
                tableColumns: [],
                tableData: [],
                baseuri: '/devlogs/'
            };
        },
        methods: {
            //依据mac地址搜索设备
            handleSearch (val) {
                let params = {
                    mac_addr_like: val,
                    limit: this.page_size
                };
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //切换页面
            changePage (current) {
                let params = {
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
                    limit: this.page_size
                };
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变过滤条件
            changeFilter (column_key, checked_filter) {
                let params = {
                    model_name:[],
                    limit: this.page_size
                };
                devlog_th.filter[column_key] = checked_filter;
                //console.log("****changeFilter****devlog_th.filter**********",devlog_th.filter);
                //console.log("########params1111##########",params);
                devlog_th.filter.model_name.forEach(val => {
                   devlog_th.devmodel_name.forEach(item => {
                       if (item.value === val){
                            //console.log("#######params22222222########",params);
                            params.model_name.push(item.label);
                            //console.log("#######item.label########",item.label);
                            //console.log("#######params.model_name22222########",params.model_name);
                       }
                   });
                });
                //console.log("########params3333333##########",params);
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //客制化过滤条件变化回掉函数
            customizedFilterChange(event) {
                let params = {
                    log_level:[],
                    dev_group:[],
                    limit: this.page_size
                };
               
                if(event.logType !== undefined && event.groupType !== undefined){
                    params.log_level.push(event.logType);
                    params.dev_group.push(event.groupType);
                }else if(event.logType !== undefined && event.groupType == undefined){
                    params.log_level.push(event.logType);
                }else if(event.logType == undefined && event.groupType !== undefined){
                    params.dev_group.push(event.groupType);
                }

                // console.log('########params#######',params);
                // console.log('########event#######',event);
                // console.log('########event.logType#######',event.logType);
                // console.log('########event.groupType#######',event.groupType);
               
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
                
            },
            //ajax请求返回值处理
            response_callback(res) {
                this.tableLoading = false;
                this.tableData = res.data.body;
                //console.log('######this.tableData#######',this.tableData);
                this.totalsize = res.data.count;
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        },
        created: function() {
            this.tableColumns = devlog_th.devlog_col_th;
            //console.log('#########tableColumns#############',this.tableColumns);
            this.tableLoading = true;
            let params = {
                limit: this.page_size
            };
            util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
        }
    }
</script>