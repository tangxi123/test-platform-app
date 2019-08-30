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

const Option = Select.Option;
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

class BatchAddTestCaseTable extends React.Component {
    constructor(props) {
        super(props);
        let checkPointType;
        this.state = {
            isRowOpen: false, //当前是否处于编辑状态（有且只有一行可编辑）
            locale: {
                emptyText: "暂无数据"
            },
            productsChildren : this.props.products.map(item => {return (<Option value={item.id}>{item.name}</Option>)}),
            modulesChildren : this.props.modules.map(item => {return (<Option value={item.id}>{item.name}</Option>)}),
            testEnvsChildren : this.props.testEnvs.map(item => {return (<Option value={item.id}>{item.descs}</Option>)}),
            data: [],
            count: 0,
        };
        this.columns = [
            {
                title: "所属产品",
                key: "suite",
                renderDom: (form, record) => {
                   
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("suite", {
                                rules: [
                                    {
                                        required: true,
                                        message: "所属产品不能为空！"
                                    }
                                ],
                                initialValue: record.suite
                            })(
                                <Select style={{ width: 200 }}>
                                    {this.state.productsChildren}
                                </Select>
                            )}
                        </FormItem>
                    ) : (
                            this.props.products.filter(item => {return item.id === record.suite})[0].name
                        );
                }
            },
            {
                title: "所属模块",
                key: "moduleId",
                renderDom: (form, record) => {
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("moduleId", {
                                rules: [
                                    {
                                        required: true,
                                        message: "所属模块不能为空！"
                                    }
                                ],
                                initialValue: record.moduleId
                            })(
                                <Select style={{ width: 300 }}>
                                    {this.state.modulesChildren}
                                </Select>
                            )}
                        </FormItem>
                    ) : (
                            this.props.modules.filter(item => {return item.id === record.moduleId})[0].name
                        );
                }
            },
            {
                title: "测试环境",
                key: "baseUrlId",
                renderDom: (form, record) => {
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("baseUrlId", {
                                rules: [
                                    {
                                        required: true,
                                        message: "测试环境不能为空！"
                                    }
                                ],
                                initialValue: record.baseUrlId
                            })(
                                <Select style={{ width: 200 }}>
                                     {this.state.testEnvsChildren}
                                </Select>
                            )}
                        </FormItem>
                    ) : (
                            this.props.testEnvs.filter(item => {return item.id === record.baseUrlId})[0].descs
                        );
                }
            },
            {
                title: "请求方式",
                key: "method",
                renderDom: (form, record) => {
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("method", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请求方式不能为空！"
                                    }
                                ],
                                initialValue: record.method,
                            })(
                                <Select style={{ width: "100%" }}>
                                    <Select.Option value="POST">POST</Select.Option>
                                    <Select.Option value="GET">GET</Select.Option>
                                    <Select.Option value="PUT">PUT</Select.Option>
                                    <Select.Option value="DELETE">DELETE</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                    ) : (record.method);
                }
            },
            {
                title: "请求url",
                key: "url",
                renderDom: (form, record) => {
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("url", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请求Url不能为空！"
                                    }
                                ],
                                initialValue: record.url
                            })(<Input />)}
                        </FormItem>
                    ) : (
                            record.url
                        );
                }
            },
            {
                title: "请求头部信息",
                key: "headers",
                renderDom: (form, record) => {
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("headers", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请求头部信息不能为空！"
                                    }
                                ],
                                initialValue: record.headers
                            })(<Input />)}
                        </FormItem>
                    ) : (
                            record.headers
                        );
                }
            },
            {
                title: "测试用例名字",
                key: "testName",
                renderDom: (form, record) => {
                    return record.type !== "view" ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator("testName", {
                                rules: [
                                    {
                                        required: true,
                                        message: "测试用例名字不能为空！"
                                    }
                                ],
                                initialValue: record.testName
                            })(<Input />)}
                        </FormItem>
                    ) : (
                            record.testName
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

export default BatchAddTestCaseTable;
