import {end_url} from '../common/Config';
import React, { Component } from 'react';
import {
    Form, Input, Button, Radio, InputNumber, Row, Col, Select
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;
const Option = Select.Option;

class ParameterForm extends Component {
    getAllDBConfigByModuleIdUrl = end_url+'/api/dbConfig/query/all/moduleId/';

    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    constructor(props) {
        console.log("constructor---ParameterForm");
        super(props);
        this.state = {
            dbConfigs: [],
            paramType: '',
        }

        const { getInstance } = this.props;
        getInstance(this); //用于获取Database实例
    }

    setDbConfigs = dbConfigs => {
        this.setState({ dbConfigs, });
    }

    setParamType = paramType => {
        this.setState({ paramType, });
    }


    // 处理单选按钮事件，当单选按钮改变时，修改选中的值
    handleRadioChange = e => {
        // const { paramData, setParameterInfo } = this.props;
        // paramData.type = e.target.value;
        // setParameterInfo(paramData)
        console.log(e.target.value);
        this.setParamType(e.target.value);

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

    //进入parameterModal界面时，获取该产品下的所有数据库配置
    componentDidMount() {
        console.log("componentDidMount---ParameterForm");
        const {productId} = this.props;
        this.getAllDBConfig(productId);
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps---ParameterForm");
        const { paramData, productId } = nextProps;
        if (paramData !== this.props.paramData) {
            this.setParamType(paramData.type);
        }
        if (productId !== this.props.productId) {
            this.getAllDBConfig(productId);
        }
        
    }


    render() {
        console.log("render---ParameterForm");
        console.log(this.props);
        console.log(this.state);
        const { paramType,dbConfigs } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { paramData } = this.props;
        // console.log(paramData);
        let name = null;
        let descs = null;
        let type = null;
        let sqlParam = {};
        let tokenParam = {};
        let keyValueParam = {};
        if (paramData) {
            name = paramData.name;
            descs = paramData.descs;
            type = paramData.type;
            switch (type) {
                case 'SQL':
                    sqlParam = paramData.parameter ? paramData.parameter : {};
                    break;
                case 'TOKEN':
                    tokenParam = paramData.parameter ? paramData.parameter : {};
                    break;
                case 'KEYVALUE':
                    keyValueParam = paramData.parameter ? paramData.parameter : {};
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
        let paramTypeForm; //不同的动作类型展示不同的表单
        if (paramType == "SQL") {//当动作类型为sql类型时
            paramTypeForm = (
                <div>
                    <Form.Item label="数据库配置">
                        {getFieldDecorator('dbConfigId', {
                            rules: [{ required: true, message: '请选择数据库配置' }],
                            initialValue: sqlParam.dbConfigId? sqlParam.dbConfigId+"":"",
                        })(
                            <Select>
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
                            rules: [{ required: true, message: '请输入sql语句' }],
                            initialValue: sqlParam.sql,
                        })(<TextArea placeholder="请输入sql语句" />)
                        }
                    </Form.Item>
                    <Form.Item label="获取的字段">
                        {getFieldDecorator('param', {
                            rules: [{ required: true, message: '请输入需要获取的字段' }],
                            initialValue: sqlParam.param,
                        })(<Input placeholder="请请输入需要获取的字段" />)
                        }
                    </Form.Item>

                </div>
            );
        } else if (paramType == "TOKEN") {//当动作类型为http请求时
            paramTypeForm = (
                <div>
                    <Form.Item label="url">
                        {getFieldDecorator('url', {
                            rules: [{ required: true, message: '请输入获取token的url地址' }],
                            initialValue: tokenParam.url,
                        })(<Input placeholder="请输入获取token的url地址" />)
                        }
                    </Form.Item>
                    <Form.Item label="userData">
                        {getFieldDecorator('userData', {
                            rules: [{ required: true, message: '请输入用户数据' }],
                            initialValue: tokenParam.userData,
                        })(<TextArea placeholder="请输入用户数据" />)
                        }
                    </Form.Item>
                </div>
            );
        } else if (paramType == "KEYVALUE") {//当动作类型为执行测试用例时
            paramTypeForm = (
                <div>
                    <Form.Item label="key">
                        {getFieldDecorator('key', {
                            rules: [{ required: true, message: '请输入key' }],
                            initialValue: keyValueParam.key,
                        })(<Input placeholder="请输入key" />)
                        }
                    </Form.Item>
                    <Form.Item label="value">
                        {getFieldDecorator('value', {
                            rules: [{ required: true, message: '请输入value' }],
                            initialValue: keyValueParam.value,
                        })(<TextArea placeholder="请输入value" />)
                        }
                    </Form.Item>
                </div>
            );
        }

        return (
            <div>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className="param-form">
                    <Form.Item label="参数名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入参数名称' }],
                            initialValue: name,
                        })(<Input placeholder="请输入参数名称" />)
                        }
                    </Form.Item>
                    <Form.Item label="描述">
                        {getFieldDecorator('descs', {
                            rules: [{ required: false, message: '请输入描述' }],
                            initialValue: descs,
                        })(<TextArea placeholder="请输入描述" />)
                        }
                    </Form.Item>
                    <Form.Item label="参数类型">
                        {getFieldDecorator('radioGroup', {
                            initialValue: type,
                        })(
                            <Radio.Group onChange={this.handleRadioChange}>
                                <Radio value="SQL">执行SQL语句</Radio>
                                <Radio value="TOKEN">获取TOKEN</Radio>
                                <Radio value="KEYVALUE">KEY-VALUE</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    {paramTypeForm}
                </Form>

            </div>
        );


    }
}
const WrappedParameterForm = Form.create({
    name: 'paramterForm',
    // mapPropsToFields(props) {

    // }
    // return {
    //     name: Form.createFormField({value:props.name}),
    //     descs: Form.createFormField({value:props.descs}),
    //     radioGroup: Form.createFormField({value:props.radioGroup}),
    //     moduelId: Form.createFormField({value:props.moduleId}),
    //     sql: Form.createFormField({value:props.sql}),
    //     param: Form.createFormField({value:props.param}),
    // }
    // }
    mapPropsToFields(props) {
        const { name, descs, radioGroup, moduleId, sql, param } = props;
        if (name && descs && radioGroup && moduleId && sql && param) {
            return {
                name: Form.createFormField(name),
                descs: Form.createFormField(descs),
                radioGroup: Form.createFormField(radioGroup),
                moduelId: Form.createFormField(moduleId),
                sql: Form.createFormField(sql),
                param: Form.createFormField(param),
            }
        } else {
            return {
                name: null, descs: null, radioGroup: null, moduleId: null, sql: null, param: null
            }
        }
    }


    // if (name && descs && radioGroup) {
    //     switch (radioGroup) {
    //         case 'SQL':
    //             const {moduleId, sql, param} = props;
    //             if (moduleId && sql && param) {
    //                 return {
    //                     name: Form.createFormField(name),
    //                     descs: Form.createFormField(descs),
    //                     radioGroup: Form.createFormField(radioGroup),
    //                     moduelId: Form.createFormField(moduleId),
    //                     sql: Form.createFormField(sql),
    //                     param: Form.createFormField(param),
    //                 }
    //             } else {
    //                 return {
    //                     name: null, descs: null, radioGroup: null, moduleId: null, sql: null, param: null
    //                 }
    //             }
    //             break;
    //         case 'TOKEN':
    //             const {url, userData} = props;
    //             if(url && userData){
    //                 return{
    //                     name:Form.createFormField(name),
    //                     descs:Form.createFormField(descs),
    //                     radioGroup:Form.createFormField(radioGroup),
    //                     url:Form.createFormField(url),
    //                     userData:Form.createFormField(userData),            
    //                 }
    //             }else{
    //                 return {
    //                     name: null, descs: null, radioGroup: null, url:null, userData:null
    //                 }
    //             }
    //             break;

    //     }
    // }
    // }
})(ParameterForm);
export default withRouter(WrappedParameterForm);