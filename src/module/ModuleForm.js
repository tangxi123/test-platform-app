import React, { Component } from 'react';
import {
    Form, Input, Button,Row,Col
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;

class ModuleForm extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { name,descs} = this.props;
        const formItemLayout = {
          labelCol:{
              sm:{span:4,offset:2},
          },
          wrapperCol:{
              sm:{span:16},
          },
      };
      return (
        <div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
        <Form.Item label='项目名称'>
          {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入项目名称' }],
                    initialValue:name,
                    })(<Input placeholder="请输入项目名称"/>)
          }
        </Form.Item>
        <Form.Item label='项目描述'>
          {getFieldDecorator('descs',{
            rules:[{required:false,message:'请输入项目描述'}],
            initialValue:descs,
          })(
            <TextArea autosize={{ minRows: 10, maxRows: 14 }} placeholder="请输入项目描述"  />
          )}
        </Form.Item>
      </Form>
        </div>
    );
    }
}

const WrappedModuleForm = Form.create({
  mapPropsToFields(props){
    const {name,descs} = props;
    if(name && descs){
      return {
          name:Form.createFormField(name),
          descs:Form.createFormField(descs),
      }
    }else{
      return {
        name:null,
        descs:null,
      }
    }
  }
})(ModuleForm);
export default withRouter(WrappedModuleForm);