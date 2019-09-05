import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ModuleModal from './ModuleModal';

import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip,Icon } from 'antd';
const { Content, Footer } = Layout;
const Search = Input.Search;

class Module extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'module',
            result: null,
            addModuleModalVisible: false,
            updateModuleModalVisible: false,
            submitCreateUrl: '',
            submitUpdateUrl: '',
            name: '',
            descs: '',
            moduleId: null,
        }
    }

    columns = [{
        title: '项目名称',
        dataIndex: 'name',
        onCell: () => {
            return {
                style: {
                    maxWidth: 150,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer'
                }
            }
        },
        render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    }, {
        title: '项目描述',
        dataIndex: 'descs',
        onCell: () => {
            return {
                style: {
                    maxWidth: 150,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer'
                }
            }
        },
        render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    }, {
        title: '创建日期',
        dataIndex: 'createAt',
    }, {
        title: '更新日期',
        dataIndex: 'updateAt',
    }, {
        title: '操作',
        dataIndex: '',
        render: (record) => (
            <span onClick={e => e.stopPropagation()}>
                <Button className="table-button" size="small" onClick={() => this.onEditButtonClick(record.id)}><span>编辑</span></Button>
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onDeleteButtonClick(record.id)}><span>删除</span></Button>
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onAddModuleClick(record.id)}><span>维护</span></Button>
            </span>
        )
    }];

    setAddModuleModalVisible = (addModuleModalVisible) => {
        this.setState({ addModuleModalVisible, });
    }

    setUpdateModuleModalVisible = (updateModuleModalVisible) => {
        this.setState({ updateModuleModalVisible, });
    }

    setSubmitCreateUrl = (submitCreateUrl) => {
        this.setState({ submitCreateUrl, });
    }

    setSubmitUpdateUrl = (submitUpdateUrl) => {
        this.setState({ submitUpdateUrl, });
    }

    setName = name => {
        this.setState({ name, });
    }

    setDescs = descs => {
        this.setState({ descs, });
    }

    setModuleId = moduleId => {
        this.setState({ moduleId });
    }


    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }


    fetchModules = () => {
        fetch('http://localhost:8081/api/modules/querySiblingSubmodules/0', {
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        })
            .then(response => response.json())
            .then(result => { this.setState({ result: result.data }) })
            .catch(e => e);


    }

    //点击编辑按钮，弹出项目编辑框
    onEditButtonClick = (id) => {
        this.setUpdateModuleModalVisible(true);
        this.setSubmitUpdateUrl('http://localhost:8081/api/modules/update');
        this.setModuleId(id);
        fetch('http://localhost:8081/modules/query/' + id, {
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        })
            .then(response => response.json())
            .then(result => { this.setName(result.data.name); this.setDescs(result.data.descs); })
            .catch(e => e)
    }

    //点击维护按钮，跳转到项目维护界面
    onAddModuleClick = id =>{
        this.props.history.push('/moduleMaintain/'+id);
    }


    onSearchKey = (value) => {
        console.log('http://localhost:8081/api/modules/querySiblingSubmodules/?id=0' + '&' + 'searchKey=' + value);
        fetch('http://localhost:8081/api/modules/querySiblingSubmodules/?id=0' + '&' + 'searchKey=' + value, {
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        })
            .then(response => response.json())
            .then(result => { console.log(result.data); this.setState({ result: result.data }) })
            .catch(e => e);
    }

    //点击新增项目按钮，弹出项目输入框
    addModule = () => {
        this.setAddModuleModalVisible(true);
        this.setSubmitCreateUrl('http://localhost:8081/api/modules/create');

    }



    componentDidMount() {
        this.fetchModules();

    }

    render() {
        const { result, addModuleModalVisible, updateModuleModalVisible, submitCreateUrl, submitUpdateUrl, name, descs, moduleId } = this.state;
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
               <div className="module segments-page" style={{ backgroundColor: '#e5e5e5' }}>
                    <div className="container" style={{ margin: '0 20px',backgroundColor:'#fff',border:'1px solid #e5e5e5',height:'1200px' }}>
                        <Content className="table-contents">
                            <div className="module_search" style={{padding:'20px 100px 10px 100px'}}>
                                <div className="search_input_text">
                                    <Search 
                                        placeholder="请输入项目名称或描述查询"
                                        enterButton="搜索"
                                        size="large"
                                        onSearch={value => this.onSearchKey(value)}
                                    />
                                </div>
                                <div className="search_input_button">
                                    <Button type="primary" size="large" onClick={this.addModule}>新增项目</Button>
                                </div>
                            </div>
                            <div style={{padding:'50px 100px 0px 100px'}}>
                            {result &&
                                <div className="table">
                                    <Table
                                        rowKey={result => result.id}
                                        columns={this.columns}
                                        dataSource={result}
                                    />

                                </div>
                            }
                            <ModuleModal
                                submitUrl={submitCreateUrl}
                                title='新增模块'
                                visible={addModuleModalVisible}
                                setModuleModalVisible={this.setAddModuleModalVisible}
                                setSubmitUrl={this.setSubmitCreateUrl}
                                fetchModules={this.fetchModules}
                            />
                            <ModuleModal
                                submitUrl={submitUpdateUrl}
                                title='修改模块'
                                visible={updateModuleModalVisible}
                                setModuleModalVisible={this.setUpdateModuleModalVisible}
                                setSubmitUrl={this.setSubmitUpdateUrl}
                                fetchModules={this.fetchModules}
                                name={name}
                                descs={descs}
                                moduleId={moduleId}
                                setName={this.setName}
                                setDescs={this.setDescs}
                                setModuleId={this.setModuleId}
                            />
                            </div>
                        </Content>
                    </div>
                </div>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>

        );
    }
}

export default withRouter(Module);