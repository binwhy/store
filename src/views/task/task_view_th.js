const task_status_enum = [
    {
        label: '运行',
        value: 'running'
    },
    {
        label: '调度中',
        value: 'scheduling'
    },
    {
        label: '成功',
        value: 'success'
    },
     {
        label: '失败',
        value: 'failed'
    }];

const task_type_enum = [
     {
        label: '模板下发',
        value: 'templet'
    },
    {
        label: '重启',
        value: 'reboot'
    },
    {
        label: '固件更新',
        value: 'firmware'
    },
     {
        label: '诊断',
        value: 'diagnostic'
    }];

    const group_name_enum = [
     {
        label: 'XN-1032',
        value: 'XN-1032'
    },
    {
        label: 'ZAC-1023',
        value: 'ZAC-1023'
    },
    {
        label: 'AC-1027L',
        value: 'AC-1027L'
    },
     {
        label: 'XN-1033',
        value: 'XN-1033'
    }];

const task_view_table_list = [
    {
        type: 'index',
        title: '#',
        key: 'index',
        align: 'center'
    },
    {
        title: '任务类型',
        key: 'task_type',
        editable: false,
        align: 'center',
        filters: task_type_enum,
        filterMethod: (value, row) => {
            return row.task_type.indexOf(value) > -1;
        }
    },
    {
        title: '描述',
        key: 'description',
        editable: false,
        align: 'center'
    },
    {
        title: 'MAC地址',
        key: 'device_mac',
        editable: false,
        align: 'center'
    },
    {
        title: '组名称',
        key: 'group_name',
        editable: false,
        align: 'center',
        filters: group_name_enum,
        filterMethod: (value, row) => {
            return row.group_name.indexOf(value) > -1;
        }
        //sortable: true
    },
    {
        title: '执行时间',
        key: 'execute_time',
        editable: false,
        align: 'center',
        sortable: true
    },
    {
        title: '状态',
        key: 'status',
        editable: false,
        align: 'center',
        filters: task_status_enum,
        filterMethod: (value, row) => {
            return row.status.indexOf(value) > -1;
            // if (value === 'running') {
            //     return row.status === task_status_enum[0].label;
            // } else if (value === 'schedule') {
            //     return row.status === task_status_enum[1].label;
            // } else if (value === 'success') {
            //     return row.status === task_status_enum[2].label;
            // }else if (value === 'failed') {
            //     return row.status === task_status_enum[3].label;
            // }
        }
        // ,
        // render: (h, params) => {
        //     const row = params.row;
        //     const idx = row.status;
        //     const devtypeArr = [
        //         {
        //             idx: 'running',
        //             name: '运行'
        //         },
        //         {
        //             idx: 'schedule',
        //             name: '调度中'
        //         },
        //         {
        //             idx: 'success',
        //             name: '成功'
        //         },
        //         {
        //             idx: 'failed',
        //             name: '失败'
        //         }
        //         ];
        //     return h('span', typeof(idx) === 'string' ? idx : devtypeArr[idx].name);
        // }
    },
    {
        title: '操作',
        key: 'handle',
        width: '200px',
        align: 'center',
        handle: ['edit', 'delete']
    },
    // {
    //     title: '操作',
    //     key: 'handle',
    //     renderHeader: (h, params) => {
    //         return h('div',[
    //                 h('strong', '操作'),
    //                 h('AddButton', {
    //                     on: {
    //                         'click-button': (vm) => {
    //                             vm.$parent.$parent.$parent.$emit('change_button_status','show');
    //                         }
    //                     }
    //                 })
    //             ]);
    //     },
    //     width: '200px',
    //     align: 'center',
    //     handle: ['editForm', 'delete']
    // }
    ];

var task_view_list = {};

export default task_view_list = {
    task_view_table_list: task_view_table_list,
    
};