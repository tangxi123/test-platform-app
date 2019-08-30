import React, { Component } from 'react';
import {
    Form, Input, Button, Row, Col,InputNumber
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;

class DatabaseForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { dbConfigInfo } = this.props;
        const { configName, comment, host, port, database, user, password, driver } = dbConfigInfo ? dbConfigInfo : { configName: null, comment: null, host:null, port:null, databse:null, user:null, password:null, driver:null}
        const formItemLayout = {
            labelCol: {
                sm: { span: 4, offset: 2 },
            },
            wrapperCol: {
                sm: { span: 16 },
            },
        };
        return (
            < div >
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item label='名称'>
                        {getFieldDecorator('configName', {
                            rules: [{ required: true, message: '请输入数据库配置名称' }],
                            initialValue: configName,
                        })(<Input placeholder="请输入数据库配置名称" />)
                        }
                    </Form.Item>
                    <Form.Item label='描述'>
                        {getFieldDecorator('comment', {
                            rules: [{ required: false, message: '请输入描述' }],
                            initialValue: comment,
                        })(
                            <TextArea autosize={{ minRows: 10, maxRows: 14 }} placeholder="请输入描述" />
                        )}
                    </Form.Item>
                    <Form.Item label='host地址'>
                        {getFieldDecorator('host', {
                            rules: [{ required: true, message: '请输入host地址' }],
                            initialValue: host,
                        })(<Input placeholder="请输入host地址" />)
                        }
                    </Form.Item>
                    <Form.Item label='端口号'>
                        {getFieldDecorator('port', {
                            rules: [{ required: true, message: '请输入端口号' }],
                            initialValue: port,
                        })(<InputNumber placeholder="请输入端口号" />)
                        }
                    </Form.Item>
                    <Form.Item label='数据库'>
                        {getFieldDecorator('database', {
                            rules: [{ required: true, message: '请输入端口号' }],
                            initialValue: database,
                        })(<Input placeholder="请输入端口号" />)
                        }
                    </Form.Item>
                    <Form.Item label='用户名'>
                        {getFieldDecorator('user', {
                            rules: [{ required: true, message: '请输入用户名' }],
                            initialValue: user,
                        })(<Input placeholder="请输入用户名" />)
                        }
                    </Form.Item>
                    <Form.Item label='密码'>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                            initialValue: password,
                        })(<Input.Password placeholder="请输入密码" />)
                        }
                    </Form.Item>
                    <Form.Item label='驱动器'>
                        {getFieldDecorator('driver', {
                            rules: [{ required: true, message: '请输入驱动器' }],
                            initialValue: driver,
                        })(<Input placeholder="请输入驱动器" />)
                        }
                    </Form.Item>
                </Form>
            </div >
        );
    }
}

const WrappedDatabaseForm = Form.create({
    mapPropsToFields(props) {
        const { configName, comment, host, port, database, user, password, driver } = props;
        if (configName && comment && host && port && database && user && password && driver) {
            return {
                configName: Form.createFormField(configName),
                comment:Form.createFormField(comment),
                host:Form.createFormField(host),
                port:Form.createFormField(port),
                database:Form.createFormField(database),
                user:Form.createFormField(user),
                password:Form.createFormField(password),
                driver:Form.createFormField(driver),
            }
        } else {
            return {
                configName: null, comment: null, host:null, port:null, databse:null, user:null, password:null, driver:null
            }
        }
    }
})(DatabaseForm);
export default withRouter(WrappedDatabaseForm);