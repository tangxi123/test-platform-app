import React, { Component } from 'react';
import {
    Form, Input, Button, Row, Col, Icon, Divider
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;

class ModuleInputForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { moduleInfo } = this.props;
        const {name,descs} = moduleInfo ? moduleInfo : {name:null, descs:null}
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
                    <Form.Item label='模块名字'>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入模块名字' }],
                            initialValue: name,
                        })(<Input placeholder="请输入模块名字" />)
                        }
                    </Form.Item>
                    <Form.Item label='模块描述'>
                        {getFieldDecorator('descs', {
                            initialValue: descs,
                        })(
                            <TextArea autosize={{ minRows: 10, maxRows: 14 }} placeholder="请输入模块描述" />
                        )}
                    </Form.Item>
                </Form>
            </div >

        );
    }
}

const WrappedModuleInputForm = Form.create({
    mapPropsToFields(props) {
      const { name, descs } = props;
      if (name && descs) {
        return {
          url: Form.createFormField(name),
          descs: Form.createFormField(descs),
        }
      } else {
        return {
          name: null,
          descs: null,
        }
      }
    }
  })(ModuleInputForm);
  export default withRouter(WrappedModuleInputForm);