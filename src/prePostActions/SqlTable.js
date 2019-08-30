import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    Table,
    Checkbox,
    Input,
    Divider,
    Select,
    Button,
    notification,
    Form
} from "antd";


const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { renderDom, record, ...restProps } = this.props;

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        <EditableContext.Consumer>
          {form => {
            this.form = form;
            return renderDom(form, record);
          }}
        </EditableContext.Consumer>
      </td>
    );
  }
}

class SqlTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRowOpen: false, //当前是否处于编辑状态（有且只有一行可编辑）
      locale: {
        emptyText: "暂无数据"
      },
      data: this.props.value ? this.props.value : [],
      count: this.props.value ? this.props.value.length : 0,
    };

    this.columns = [
      {
        title: "sql语句",
        key: "sql",
        renderDom: (form, record) => {
          return record.type !== "view" ? (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("sql", {
                rules: [
                  {
                    required: true,
                    message: "sql语句不能为空！"
                  }
                ],
                initialValue: record.sql
              })(<Input />)}
            </FormItem>
          ) : (
            record.sql
          );
        }
      },
     
      {
        title: "操作",
        renderDom: (form, record) => (
          <span>
            {record.type === "new" && (
              <span>
                <a
                  href="javascript:;"
                  onClick={e => this.addSubmit(form, record)}
                >
                  完成
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={e => this.removeAdd(record)}>
                  取消
                </a>
              </span>
            )}
            {record.type === "edit" && (
              <span>
                <a
                  href="javascript:;"
                  onClick={e => this.editSubmit(form, record)}
                >
                  完成
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={e => this.giveUpUpdata(record)}>
                  取消
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={e => this.delete(record)}>
                  删除
                </a>
              </span>
            )}
            {record.type === "view" && (
              <span>
                <a href="javascript:;" onClick={e => this.edit(record)}>
                  编辑
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={e => this.delete(record)}>
                  删除
                </a>
              </span>
            )}
          </span>
        ),
        width: 150
      }
    ];
  }
  componentDidMount() {
    this.initRowType(this.state.data);
    
    
  }
  initRowType(data) {
    for (let item of data) {
      item["type"] = "view";
    }
    this.updateDataSource(data);
  }
  updateDataSource(newData, isAddDisabled) {
    let isRowOpen =
      typeof isAddDisabled == "boolean"
        ? isAddDisabled
        : newData.some(item => item.type === "new" || item.type === "edit");
    this.setState({
      isRowOpen,
      data: newData
    });
  }
  addRow = () => {
    let { data } = this.state;
    let newRecord = {
      sql: "",
      type: "new",
      id: ""
    };

    data.push(newRecord);
    this.updateDataSource(data);
  };
  addSubmit(form, record) {
    let { data } = this.state;

    form.validateFields((error, values) => {
      
      if (error) {
        return;
      }
      let updateData = { ...record, ...values };
      updateData.id = this.state.count + 1;
      console.log("updateData");
      console.log(updateData);
      setTimeout(res => {
        updateData.type = "view";
        data.pop();
        data.push(updateData);
        this.updateDataSource(data);
        this.setState({count:this.state.count+1});
        notification["success"]({ message: "添加成功！" });
        // console.log("data");
        // console.log(this.state.data);
      }, 500);
    });
    
  }
  editSubmit(form, record) {
    let { data } = this.state;

    form.validateFields((error, values) => {
        // console.log("values");
        // console.log(values);
      if (error) {
        return;
      }
      let updateData = { ...record, ...values };
    //   console.log("updateData");
    //   console.log(updateData);
      // console.log(updateData);
      setTimeout(res => {
        //将updateData更新到dataSource
        let newData = data.map(item => {
          if (item.id === updateData.id) {
            item = Object.assign({}, updateData);
            item.type = "view";
          }
          return item;
        });
        this.updateDataSource(newData);
        notification["success"]({ message: "修改成功！" });
        // console.log("newData");
        // console.log(newData);
        // console.log("data");
        // console.log(this.state.data);
    });
    });
    
  }
  removeAdd(record) {
    let { data } = this.state;
    data.pop();
    this.updateDataSource(data);
    this.setState({count:this.state.count-1});
  }
  giveUpUpdata(record) {
    let { data } = this.state;
    let editRow = data.find(item => item.id === record.id);
    editRow.type = "view";
    this.updateDataSource(data);
  }
  delete(record) {
    let { data } = this.state;
    // console.log(record);
    setTimeout(res => {
      let index = data.findIndex(item => item.id === record.id);
      data.splice(index, 1);
      this.updateDataSource(data);
      this.setState({count:this.state.count-1});
      notification["success"]({ message: "删除成功！" });
    });
  }
  edit(record) {
    let { data } = this.state;
    let newData = data.filter(item => {
      if (item.id === record.id) {
        item.type = "edit";
        return item;
      } else if (item.type !== "new") {
        item.type = "view";
        return item;
      }
    });
    this.updateDataSource(newData, true);
  }
  render() {
    const { data, locale, isRowOpen } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      return {
        ...col,
        onCell: record => ({
          ...col,
          record
        })
      };
    });

    return (
      <div >
        <div >
          <Button
            style={{ marginBottom: "10px" }}
            disabled={isRowOpen}
            onClick={this.addRow}
          >
            + 添加
          </Button>
          <Table
            components={components}
            locale={locale}
            bordered
            rowKey={record => record.id}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="editable-row"
          />
        </div>
      </div>
    );
  }
}

export default SqlTable;
