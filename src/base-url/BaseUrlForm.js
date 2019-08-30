import React, { Component } from 'react';
import {
  Form, Input, Button, Row, Col
} from 'antd';

import {
  withRouter
} from 'react-router'
const { TextArea } = Input;

class BaseUrlForm extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { urlInfo } = this.props;
    const {url,descs} = urlInfo ? urlInfo : {url:null, descs:null}
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
        <Form.Item label='Url'>
          {getFieldDecorator('url', {
            rules: [{ required: true, message: '请输入Url' }],
            initialValue: url,
          })(<Input placeholder="请输入Url" />)
          }
        </Form.Item>
        <Form.Item label='Url描述'>
          {getFieldDecorator('descs', {
            rules: [{ required: false, message: '请输入Url描述' }],
            initialValue: descs,
          })(
            <TextArea autosize={{ minRows: 10, maxRows: 14 }} placeholder="请输入Url描述" />
          )}
        </Form.Item>
      </Form>
      </div >
        
    );
}
}

const WrappedBaseUrlForm = Form.create({
  mapPropsToFields(props) {
    const { url, descs } = props;
    if (url && descs) {
      return {
        url: Form.createFormField(url),
        descs: Form.createFormField(descs),
      }
    } else {
      return {
        url: null,
        descs: null,
      }
    }
  }
})(BaseUrlForm);
export default withRouter(WrappedBaseUrlForm);