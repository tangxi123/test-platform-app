import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
// import {EditableContext} from '/EditableFormRow';

const EditableContext = React.createContext();
class EditableCell extends Component{
    constructor(props){
        super(props);
        this.state = {
            editing:false,
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
          if (editing) {
            this.input.focus();
          }
        });
      };
    
    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
          if (error && error[e.currentTarget.id]) {
            return;
          }
          this.toggleEdit();
          handleSave({ ...record, ...values });
        });
      };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
          <Form.Item style={{ margin: 0 }}>
            {form.getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title} is required.`,
                },
              ],
              initialValue: record[dataIndex],
            })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{ paddingRight: 24 }}
            onClick={this.toggleEdit}
          >
            {children}
          </div>
        );
      };
    
      render() {
        const {
          editable,
          dataIndex,
          title,
          record,
          index,
          handleSave,
          children,
          ...restProps
        } = this.props;
        return (
          <td {...restProps}>
            {editable ? (
              <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
            ) : (
              children
            )}
          </td>
        );
      }
}

export default EditableCell;
