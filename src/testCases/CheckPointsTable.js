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

class CheckPointsTable extends React.Component {
  constructor(props) {
    super(props);
    let checkPointType;
    this.state = {
      isRowOpen: false, //当前是否处于编辑状态（有且只有一行可编辑）
      locale: {
        emptyText: "暂无数据"
      },
      data: this.props.checkPoints ? this.props.checkPoints : [],
      count: this.props.checkPoints ? this.props.checkPoints.length : 0,
    };

    this.columns = [
      {
        title: "类型",
        key: "types",
        renderDom: (form, record) => {
          let showTypes = "";
          switch (record.types) {
            case "StrCheckPoint":
              showTypes = "字符串检查";
              break;
            case "NumCheckPoint":
              showTypes = "数字检查";
              break;
            case "ListCheckPoint":
              showTypes = "列表检查";
              break;
          }
          return record.type !== "view" ? (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("types", {
                rules: [
                  {
                    required: true,
                    message: "类型不能为空！"
                  }
                ],
                initialValue: record.types
              })(
                <Select style={{ width: "100%" }}>
                  <Select.Option value="StrCheckPoint">字符串检查</Select.Option>
                  <Select.Option value="NumCheckPoint">数字检查</Select.Option>
                  <Select.Option value="ListCheckPoint">列表检查</Select.Option>
                </Select>
              )}
            </FormItem>
          ) : (
              showTypes
            );
        }
      },
      {
        title: "检查类型",
        key: "checkPointType",
        renderDom: (form, record) => {
          return record.type !== "view" ? (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("checkPointType", {
                rules: [
                  {
                    required: true,
                    message: "检查类型不能为空！"
                  }
                ],
                initialValue: record.checkPointType
              })(<Input />)}
            </FormItem>
          ) : (
              record.checkPointType
            );
        }
      },
      {
        title: "检查关键字",
        key: "checkKey",
        renderDom: (form, record) => {
          return record.type !== "view" ? (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("checkKey", {
                rules: [
                  {
                    required: true,
                    message: "期望值不能为空！"
                  }
                ],
                initialValue: record.checkKey
              })(<Input />)}
            </FormItem>
          ) : (
              record.checkKey
            );
        }
      },
      {
        title: "期望值",
        key: "expected",
        renderDom: (form, record) => {
          return record.type !== "view" ? (
            <FormItem style={{ margin: 0 }}>
              {form.getFieldDecorator("expected", {
                rules: [
                  {
                    required: true,
                    message: "期望值不能为空！"
                  }
                ],
                initialValue: record.expected
              })(<Input />)}
            </FormItem>
          ) : (
              record.expected
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
    let tempData = {};
    const checkData = data && data.map(item => {
      if (item.hasOwnProperty("strCheckPointType")) {
        tempData = { id: item.key, types: item.type, checkPointType: item.strCheckPointType, checkKey: item.checkKey, expected: item.expected };
      } else if (item.hasOwnProperty("numCheckPointType")) {
        tempData = { id: item.key, types: item.type, checkPointType: item.numCheckPointType, checkKey: item.checkKey, expected: item.expected };
      } else if (item.hasOwnProperty("listCheckPointType")) {
        tempData = { id: item.key, types: item.type, checkPointType: item.listCheckPointType, checkKey: item.checkKey, expected: item.expected };
      }
      return tempData;
    });
    for (let item of checkData) {
      item["type"] = "view";
    }
    this.updateDataSource(checkData);
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
      types: "",
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
      setTimeout(res => {
        updateData.type = "view";
        data.pop();
        data.push(updateData);
        this.updateDataSource(data);
        this.setState({ count: this.state.count + 1 });
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
    this.setState({ count: this.state.count - 1 });
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
      this.setState({ count: this.state.count - 1 });
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

export default CheckPointsTable;
