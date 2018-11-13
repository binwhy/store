<template>
    <div class="layout-content-main">
        <search-form @on-change="handleSearch"></search-form>
        <dev-table v-model="tableData" :columnsList="tableColumns" :isLoading="tableLoading"
                   :optionsList="selectList"
                   @click-filter-change="changeFilter" @click-sort-change="changeSort"
                   @on-change="row_change" @on-delete="row_delete"></dev-table>
        <page-table :count="totalsize" @on-change="changePage" @on-page-size-change="changePageSize"></page-table>
        <dev-status></dev-status>
    </div>
</template>
<script>
    import searchForm from '../common/search/input-search.vue';
    import devTable   from '../common/table/table-list.vue';
    import pageTable  from '../common/pagination/page-table.vue';
    import devStatus  from '../common/tag/tag-devstatus.vue';
    import util       from '../../libs/util.js';
    import devlist_th from './devlist_th.js';

    export default {
        components: {
            searchForm,
            devTable,
            pageTable,
            devStatus
        },
        data () {
            return {
                tableData: [],
                totalsize: 0,
                page_size: 10,
                tableColumns: [],
                tableLoading: false,
                //baseuri: '/devlists/',
                baseuri: '/device-managements',
                selectList: {
                    group_name: [
                        {
                            value: 'group1',
                            label: 'group1',
                            selectable: true
                        },
                        {
                            value: 'group2',
                            label: 'group2'
                        },
                        {
                            value: 'group3',
                            label: 'group3'
                        },
                        {
                            value: 'group4',
                            label: 'group4'
                        }
                    ],
                    user_name: [
                        {
                            value: 'user1',
                            label: 'user1'
                        },
                        {
                            value: 'user2',
                            label: 'user2',
                            selectable: true
                        },
                        {
                            value: 'user3',
                            label: 'user3'
                        }
                    ]
                }
            }
        },
        methods: {
            //ajax获取数据
            getDevListData (params) {
                util.ajax.get('/devlist', {
                    params: params
                }).then((response) => {
                    this.tableLoading = false;
                    this.tableData = response.data.body;
                    this.totalsize = response.data.count;
                }).catch(function (error){
                    console.debug(error);
                });
            },
            //切换页码
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
            //依据mac地址模糊查询搜索设备
            handleSearch (val) {
                let uri = this.baseuri +'/search';
                let params = {
                    mac_addr_like: val,
                    limit: this.page_size
                };
                util.ajax.request('get', uri, params, {}, this.response_callback, this.exception_callback);
                //let uri = this.baseuri +'/' + val;
                //util.ajax.request('get', uri, {}, {}, this.response_callback, this.exception_callback);
                // let params = {
                //     mac_addr_like: val,
                //     limit: this.page_size
                // };
                // this.tableLoading = true;
                // util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变过滤条件
            changeFilter (column_key, checked_filter) {
                let params = {
                    device_status:[],
                    model_type: [],
                    limit: this.page_size
                };
                devlist_th.filter[column_key] = checked_filter;
                devlist_th.filter.device_status.forEach(val => {
                   devlist_th.devstat_enum.forEach(item => {
                       if (item.value === val)
                            params.device_status.push(item.value);
                   });
                });
                devlist_th.filter.model_type.forEach(val => {
                    devlist_th.devtype_enum.forEach(item => {
                        if (item.value === val)
                            params.model_type.push(item.label);
                    });
                });
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //改变排序
            changeSort (column_key, sort_order) {
                let params = {
                    limit: this.page_size,
                    sort: column_key,
                    order: sort_order
                };
                this.tableLoading = true;
                util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
            },
            //table内容更新
            row_change (row_data, index) {
                let uri = this.baseuri +'/' + row_data[index].mac_addr;
                this.tableLoading = true;
                let params = {
                    limit: this.page_size
                };
                //将表单数据变成json格式,否则后端处理不了
                let formData = JSON.parse(JSON.stringify(row_data[index]));
                console.log(formData);
                util.ajax.request('patch', uri, {}, formData, (res) => {this.tableLoading = false;}, this.exception_callback);
                //util.ajax.request('patch', uri, params, row_data[index], (res) => {this.tableLoading = false;}, this.exception_callback);
            },
            //table数据被删除
            row_delete (del_data) {
                //console.log(del_data);
                let uri = this.baseuri +'/'+ del_data.mac_addr;
                this.tableLoading = true;
                let params = {
                    limit: this.page_size
                };
                util.ajax.request('delete', uri, {}, {}, (res) => {this.tableLoading = false}, this.exception_callback);
                //util.ajax.request('delete', uri, params, {}, (res) => {this.tableLoading = false}, this.exception_callback);
            },
            //ajax请求返回值处理
            response_callback(res) {
                this.tableLoading = false;
                this.tableData = res.data.body;
                this.totalsize = res.data.count;
                console.log(res.data.body);
                console.log(res.data.relation);
                console.log(res.data.relation.management);
                console.log(res.data.relation.user_name.LiuAD.length);
                console.log(res.data.relation.group_name.dawsen);

               let ele = document.documentElement.style;
               console.log(ele);
            },
            //ajax请求错误异常处理
            exception_callback(err) {
                console.log(err);
            }
        },
        created: function() {
            let params = {
                limit: this.page_size
            };
            this.tableColumns = devlist_th.devlist_col_th;
            this.tableLoading = true;
            util.ajax.request('get', this.baseuri, params, {}, this.response_callback, this.exception_callback);
        }
    }
</script>