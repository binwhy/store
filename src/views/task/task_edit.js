const templet_table_columns = [
    {
        type: 'index',
        title: '#',
        key: 'index',
        width: 60,
        align: 'center'
    },
    {
        title: '设备类型',
        key: 'model_type',
        editable: false,
        align: 'center'
    },
    {
        title: '操作模式',
        key: 'opemode',
        editable: false,
        align: 'center'
    },
    {
        title: '设备型号',
        key: 'model_name',
        editable: false,
        align: 'center'
    },
    {
        title: 'MAC地址',
        key: 'mac_addr',
        editable: false,
        align: 'center'
    },
    {
        title: '设备描述',
        key: 'dev_info1',
        editable: false,
        align: 'center'
    },
   {
        title: '任务状态',
        key: 'status',
        editable: false,
        align: 'center',
        render: (h, params) => {
            const row = params.row;
            const color = row.status === "running" ? 'green' : row.status === 2 ? 'yellow' : 'blue';
            const text = row.status === "running" ? '有任务' : row.status === 2 ? 'Alert' : '无任务';
            return h('Tag', {
                props: {
                    type: 'dot',
                    color: color
                },
            }, text);
        }
    },
    {
        title: '模板名称',
        key: 'last_templet_name',
        editable: true,
        renderHeader: (h, params) => {
            return h('div',[
                    h('strong', '模板名称'),
                    h('EditButton', {
                        on: {
                            'click-button': (vm) => {
                                vm.$parent.$parent.$parent.$emit('change_button_status','show');
                            }
                        }
                    })
                ]);
        },
        width: '200px',
        align: 'center',
        selectable:true
    },
    {
        type: 'selection',
        width: 60,
        align: 'center'
    }
    ];

const task_editModel_one = [
    {
        type: 'Select',
        key: 'task_type', //数据库字段名称
        options: [
        {
            value: 'reboot',
            label:'重启'
        },
        {
            value: 'firmware',
            label:'固件更新'
        },
        {
            value: 'templet',
            label:'模板下发'
        },
        {
            value: 'diagnostic',
            label:'诊断'
        }],
        value: '',     //选中值
        label: '任务类型',
        disabled:false
    },
    {
        type: 'Input',
        key: 'description',
        value: '',
        label: '任务描述'
    },
    {
        type: 'Select',
        key: 'execute_action', //数据库字段名称 执行时间
        options: [{
            value: 'now',
            label:'立即执行'
        },
        {
            value: 'schedule-on',
            label:'预约'
        }],
        value: '',     //选中值
        label: '调度方式'
    },
    {
        type: '',
        key: 'execute_time',
        subtype:'datetime',
        value: '',
        label: '预约执行时间'
    }];

const task_editModel_templet = [
     {
        type: 'Select',
        key: 'task_type', //数据库字段名称
        options: [
        {
            value: 'reboot',
            label:'重启'
        },
        {
            value: 'firmware',
            label:'固件更新'
        },
        {
            value: 'templet',
            label:'模板下发'
        },
        {
            value: 'diagnostic',
            label:'诊断'
        }],
        value: '',     //选中值
        label: '任务类型',
        disabled:false
    },
    {
        type: 'Input',
        key: 'description',
        value: '',
        label: '任务描述'
    },
     {
        type: 'Select',
        key: 'templet_name',
        options: [{
            value: 'default1',
            label:'default1'
        },
        {
            value: 'default2',
            label:'default2'
        }],
        value: 'default',
        label: '模板名称'
    },
    {
        type: 'Select',
        key: 'execute_action', //数据库字段名称 执行时间
        options: [{
            value: 'now',
            label:'立即执行'
        },
        {
            value: 'schedule-on',
            label:'预约'
        }],
        value: '',     //选中值
        label: '调度方式'
    },
    {
        type: '',
        key: 'execute_time',
        subtype:'datetime',
        value: '',
        label: '预约执行时间'
    }];

const task_editModel_fw = [
     {
        type: 'Select',
        key: 'task_type', //数据库字段名称
        options: [
        {
            value: 'reboot',
            label:'重启'
        },
        {
            value: 'firmware',
            label:'固件更新'
        },
        {
            value: 'templet',
            label:'模板下发'
        },
        {
            value: 'diagnostic',
            label:'诊断'
        }],
        value: '',     //选中值
        label: '任务类型',
        disabled:false
    },
    {
        type: 'Input',
        key: 'description',
        value: '',
        label: '任务描述'
    },
    {
        type: 'Input',
        key: 'fw_path',
        value: '',
        label: '固件下载路径'
    },
    {
        type: 'Select',
        key: 'execute_action', //数据库字段名称 执行时间
        options: [{
            value: 'now',
            label:'立即执行'
        },
        {
            value: 'schedule-on',
            label:'预约'
        }],
        value: '',     //选中值
        label: '调度方式'
    },
    {
        type: '',
        key: 'execute_time',
        subtype:'datetime',
        value: '',
        label: '预约执行时间'
    }];

var task_edit_list = {};

export default task_edit_list ={
    templet_tableColumns:templet_table_columns,
    task_editModel_one:task_editModel_one,
    task_editModel_fw:task_editModel_fw,
    task_editModel_templet:task_editModel_templet
};