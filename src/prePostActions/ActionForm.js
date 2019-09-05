import {end_url} from '../common/Config';
import React, { Component } from 'react';
import SqlTable from './SqlTable';
import {
    Form, Input, Button, Radio, InputNumber, Row, Col, Select
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;
const Option = Select.Option;

class ActionForm extends Component {
    getAllDBConfigByModuleIdUrl = end_url+'/api/dbConfig/query/all/moduleId/';

    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };


    constructor(props) {
        super(props);
        this.state = {
            actionType: '',
            dbConfigs: [],
        };
        const { getInstance } = this.props;
        getInstance(this);
    }

    setActionType = actionType => {
        this.setState({ actionType, });
    }

    setDbConfigs = dbConfigs => {
        this.setState({ dbConfigs, });
    }

    // 处理单选按钮事件，当单选按钮改变时，修改选中的值
    handleRadioChange = e => {
        this.setActionType(e.target.value);
    }

    getAllDBConfig = moduleId => {
        const requestInfo = {
            headers: this.reuqestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getAllDBConfigByModuleIdUrl + moduleId, requestInfo)
            .then(response => response.json())
            .then(result => this.setDbConfigs(result.data))
            .catch(e => e);
    }

    componentDidMount() {
        const { productId } = this.props;
        this.getAllDBConfig(productId);
    }

    componentWillReceiveProps(nextProps) {
        const { productId, actionData } = nextProps;
        if (actionData !== this.props.actionData) {
            this.setActionType(actionData.actionType);
        }
        if (productId !== this.props.productId) {
            this.getAllDBConfig(productId);
        }

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { actionType, dbConfigs } = this.state;
        const { actionData } = this.props;
        let name = null;
        let descs = null;
        let type = null;
        let sqlAction = {};
        let tokenAction = {};
        let keyValueAction = {};
        if (actionData) {
            name = actionData.name;
            descs = actionData.descs;
            type = actionData.actionType;
            switch (type) {
                case 'SQL':
                    sqlAction = actionData.action ? actionData.action : {};
                    break;
                case 'TOKEN':
                    tokenAction = actionData.action ? actionData.action : {};
                    break;
                case 'KEYVALUE':
                    keyValueAction = actionData.action ? actionData.action : {};
                    break;
            }
        }
        const formItemLayout = {
            labelCol: {
                sm: { span: 4, offset: 2 },
            },
            wrapperCol: {
                sm: { span: 16 },
            },
        };
        let actionTypeForm; //不同的动作类型展示不同的表单
        if (actionType == "SQL") {//当动作类型为sql类型时
            actionTypeForm = (
                <div>
                    <Form.Item label="数据库配置">
                        {
                            getFieldDecorator('dbConfigId', {
                                rules: [{ required: true, message: '请选择数据库配置' }],
                                initialValue: sqlAction.dbConfigId ? sqlAction.dbConfigId + "" : ""
                            })(<Select>
                                {
                                    dbConfigs.map(item => (
                                        <Option key={item.id}>{item.configName}</Option>
                                    ))
                                }
                            </Select>)
                        }
                    </Form.Item>
                    <Form.Item label="sql语句">
                        {getFieldDecorator('sql', {
                            rules: [{ required: false, message: '请输入sql语句' }],
                            initialValue: sqlAction.sql,
                        })(<SqlTable ref={table => this.table = table}/>)
                            // (<TextArea placeholder="请输入sql语句" />)
                        }
                    </Form.Item>

                </div>
            );
        } else if (actionType == "HTTP") {//当动作类型为http请求时
            actionTypeForm = (
                <div>
                    <Form.Item label="操作">
                        <span>暂无数据</span>
                    </Form.Item>
                </div>
            );
        } else if (actionType == "TestCase") {//当动作类型为执行测试用例时
            actionTypeForm = (
                <div>
                    <Form.Item label="操作">
                        <span>暂无数据</span>
                    </Form.Item>
                </div>
            );
        }

        return (
            <div>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className="action-form">
                    <Form.Item label="动作名">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入前后置动作名称' }],
                            initialValue: name,
                        })(<Input placeholder="请输入前后置动作名称" />)
                        }
                    </Form.Item>
                    <Form.Item label="描述">
                        {getFieldDecorator('descs', {
                            rules: [{ required: false, message: '请输入描述' }],
                            initialValue: descs,
                        })(<Input placeholder="请输入描述" />)
                        }
                    </Form.Item>
                    <Form.Item label="动作类型">
                        {getFieldDecorator('radio-group', {
                            initialValue: type,
                        })(
                            <Radio.Group onChange={this.handleRadioChange}>
                                <Radio value="SQL">执行SQL语句</Radio>
                                <Radio value="HTTP">发送Http请求</Radio>
                                <Radio value="TestCase">执行测试用例</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    {actionTypeForm}
                </Form>
            </div>
        );


    }
}
const WrappedActionForm = Form.create({
    name: 'actions',
    mapPropsToFields(props) { },
})(ActionForm);
export default withRouter(WrappedActionForm);