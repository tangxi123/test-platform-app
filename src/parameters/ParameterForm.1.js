import React, { Component } from 'react';
import {
    Form, Input, Button, Radio, InputNumber, Row, Col
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;

class ParameterForm extends Component {
    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      };

    constructor(props) {
        super(props);
    }


    // 处理单选按钮事件，当单选按钮改变时，修改选中的值
    handleRadioChange = e => {
        const { paramData,setParamData } = this.props;
        if(paramData){
            paramData.type =  e.target.value;
            setParamData(paramData)
        }
        // paramData.type =  e.target.value;
        // setParamData(paramData)
    }

    //处理表单提交事件，当url包含update时，调用putEditData方法用于编辑，否则调用postCreateData方法用于提交
    handleSubmit = e => {
        const { submitUrl,paramData } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (submitUrl.indexOf('update') != -1) {
                    const resultData = this.joinSendData(values);
                    resultData.id = paramData.id;  //将id加入到编辑数据里
                    this.putEditData(submitUrl, resultData);
                } else {
                    this.postCreateData(submitUrl, this.joinSendData(values));
                }

            }
        });
    }

    //提交时，最终将提交数据拼接为以下json格式
    // 最终拼接为
    // {
    //     "name": "删除插入的新增前置动作数据112",
    //     "descs": "在测试时插入的前置动作测试数据删除掉",
    //     "type": "SQL",
    //     "parameter": {
    //         "type": "ParameterSql",
    //         "host": "localhost",
    //         "port": "3308",
    //         "database": "tplatform_pro",
    //         "user": "root",
    //         "password": "tx123456",
    //         "sql": "DELETE FROM tplatform_pro.zsi_parameter WHERE name='删除插入的新增前置动作数据';"
    //          "param":"id",
    //     }
    // }
    joinSendData = values => {
        let paramValues = {};//子类型拼接的数据
        let resultData = {};//最终提交的数据
        let type;//子类型的类型
        if (values['radio-group'] === "SQL") {
            type = "ParameterSql"
        }
        switch(values['radio-group']){
            case 'SQL':
                    type = "ParameterSql";
                    paramValues = {
                        type: type,
                        host: values.host,
                        port: values.port,
                        database: values.database,
                        user: values.user,
                        password: values.password,
                        sql: values.sql,
                        param: values.param,
                    };
                    break;
            case 'TOKEN':
                    type = "ParameterToken";
                    paramValues = {
                        type: type,
                        url : values.url,
                        userData:values.userData,
                    };
                    break;
            case 'KEYVALUE':
                console.log(values);
                    type = 'ParameterKeyValue';
                    paramValues = {
                        type: type,
                        key: values.key,
                        value: values.value,
                    };    
        }
        // paramValues = {
        //     type: type,
        //     host: values.host,
        //     port: values.port,
        //     database: values.database,
        //     user: values.user,
        //     password: values.password,
        //     sql: values.sql,
        //     param: values.param,
        // }
        resultData = {
            name: values.name,
            descs: values.descs,
            type: values['radio-group'],
            parameter: paramValues,
        }
        return resultData;
    }

    //创建时提交paramData到后台
    postCreateData = (url, data) => {
        const requestInfo = {
            body: JSON.stringify(data), 
            headers: this.requestHeaders,
            method: 'POST', 
            mode: 'cors', 
        };
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(data => alert(data.message))
            .then(() => this.linkToParameter())
            .catch(error => console.error(error))
    }

     //编辑时提交paramData到后台
     putEditData = (url, data) => {
        const requestInfo = {
            body: JSON.stringify(data), 
            headers: this.requestHeaders,
            method: 'PUT', 
            mode: 'cors', 
        };
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(data => alert(data.message))
            .then(() => this.linkToParameter())
            .catch(error => console.error(error))
    }

    //跳转到parameters界面
    linkToParameter = () => {
        this.props.history.push('/parameters')
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { paramData,handleRadioChange} = this.props;
        let name = null;
        let descs = null;
        let type = null;
        let sqlParam = {};
        let tokenParam = {};
        let keyValueParam = {};
        if(paramData){
            name = paramData.name;
            descs = paramData.descs;
            type = paramData.type;
            switch(type){
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

        let paramTypeForm; //不同的动作类型展示不同的表单
        const formItemLayout = {
            labelCol: {
                xs: { span: 16 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 8 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        if (type == "SQL") {//当动作类型为sql类型时
            paramTypeForm = (
                <div>
                    <Form.Item label="HOST地址">
                        {getFieldDecorator('host', {
                            rules: [{ required: true, message: '请输入host地址' }],
                            initialValue: sqlParam.host,
                        })(<Input placeholder="请输入host地址" />)
                        }
                    </Form.Item>
                    <Form.Item label="端口号">
                        {getFieldDecorator('port', {
                            rules: [{ required: true, message: '请输入端口号' }],
                            initialValue: sqlParam.port,
                        })(<InputNumber placeholder="请输入端口号" />)
                        }
                    </Form.Item>
                    <Form.Item label="数据库名">
                        {getFieldDecorator('database', {
                            rules: [{ required: true, message: '请输入数据库名字' }],
                            initialValue: sqlParam.database,
                        })(<Input placeholder="请输入数据库名字" />)
                        }
                    </Form.Item>
                    <Form.Item label="数据库用户名">
                        {getFieldDecorator('user', {
                            rules: [{ required: true, message: '请输入数据库用户名' }],
                            initialValue: sqlParam.user,
                        })(<Input placeholder="请输入数据库用户名" />)
                        }
                    </Form.Item>
                    <Form.Item label="数据库密码">
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入数据库密码' }],
                            initialValue: sqlParam.password,
                        })(<Input placeholder="请输入数据库密码" />)
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
        } else if (type == "TOKEN") {//当动作类型为http请求时
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
        } else if (type == "KEYVALUE") {//当动作类型为执行测试用例时
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
                        })(<Input placeholder="请输入描述" />)
                        }
                    </Form.Item>
                    <Form.Item label="动作参数类型">
                        {getFieldDecorator('radio-group', {
                            initialValue: type,
                        })(
                            <Radio.Group onChange={handleRadioChange}>
                                <Radio value="SQL">执行SQL语句</Radio>
                                <Radio value="TOKEN">获取TOKEN</Radio>
                                <Radio value="KEYVALUE">KEY-VALUE</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    {paramTypeForm}
                    <Form.Item {...tailFormItemLayout}>
                        <Row>
                            <Col span={2}>
                                <Button type="primary" className="cancel-form-button" onClick={this.linkToParameter}>
                                    取消
                        </Button>
                            </Col>
                            <Col span={2}>
                                <Button type="primary" htmlType="submit" className="param-form-button">
                                    提交
                        </Button>
                            </Col>
                        </Row>
                    </Form.Item>


                </Form>

            </div>
        );


    }
}
const WrappedParameterForm = Form.create({ name: 'parameters' })(ParameterForm);
export default withRouter(WrappedParameterForm);