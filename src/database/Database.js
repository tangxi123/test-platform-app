import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import DatabaseModal from './DatabaseModal';

import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip, Select } from 'antd';
const { Content, Footer } = Layout;
const Search = Input.Search;
const {Option} = Select; 

class Database extends Component {
    getDBUrl = 'http://localhost:8081/dbConfig/query/?pageNum=' //获取分页dbConfig的url
    submitCreateUrl = 'http://localhost:8081/dbConfig/create';  //创建dbConfig的url
    submitUpdateUrl = 'http://localhost:8081/dbConfig/update'; //更新dbConfig的url
    querydbConfigByIdUrl = 'http://localhost:8081/dbConfig/query/' //根据id获取url信息的url
    headers = {                                     //发送请求的headers
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    columns = [{                                          //列表的各列设置
        title: '数据库配置名称',
        dataIndex: 'configName',
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
        title: '描述',
        dataIndex: 'comment',
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
    },
    {
        title:'host',
        dataIndex:'host',
    },
    {
        title:'port',
        dataIndex:'port',
    },
    {
        title:'用户名',
        dataIndex:'user',
    },
    {
        title:'驱动器',
        dataIndex:'driver',
    },
     {
        title: '创建时间',
        dataIndex: 'createAt',
    }, {
        title: '修改时间',
        dataIndex: 'updateAt',
    }, {
        title: '操作',
        dataIndex: '',
        render: (record) => (
            <span onClick={e => e.stopPropagation()}>
                <Button className="table-button" size="small" onClick={() => this.onEditButtonClick(record.id)}><span>编辑</span></Button>
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onDeleteButtonClick(record.id)}><span>删除</span></Button>
            </span>
        )
    }
    ];

    constructor(props) {
        console.log("constructor----Database");
        super(props);
        this.state = {
            result: [],
            pagination: '',
            loading: false,
            searchKey:'',
            addModalVisible:false,
            editModalVisible: false,
            dbConfigInfo:{},
        }
        const {getInstance} = this.props;
        getInstance(this); //用于获取Database实例
    

    }

    setResult = result => {
        this.setState({result,});
    }

    setPagination = pagination =>{
        this.setState({pagination});
    }

    setLoading = loading =>{
        this.setState({loading,});
    }

    setSearchKey = searchKey =>{
        this.setState({searchKey});
    }

    setAddModalVisible = addModalVisible =>{
        this.setState({addModalVisible});
    }

    setEditModalVisible = editModalVisible =>{
        this.setState({editModalVisible,});
    }

    setDbConfigInfo = dbConfigInfo =>{
        this.setState({dbConfigInfo,});
    }

    //在搜索框输入关键字进行查询
    onSearchKey = (value) => {
        const pageNum = 0;
        const {productId} = this.props; 
        this.setSearchKey(value);
        this.getDBConfigs(pageNum, productId, value);
    }

    //新增数据库配置
    addDBConfig = () =>{
        this.setAddModalVisible(true);
    }

    //点击列表上编辑按钮，获得相应id的数据
    onEditButtonClick = (id) => {
        const url = this.querydbConfigByIdUrl + id;
        const requestInfo = {
            headers: this.headers,
            method: 'GET',
            mode: 'cors',
        };
        this.setEditModalVisible(true);
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(result => changeToActualDBConfigInfo(result.data))
            .then(dbConfigInfo => this.setDbConfigInfo(dbConfigInfo))
            .catch(e => e);

        //将返回的UrlInfo的值里去掉创建时间和修改时间
        function changeToActualDBConfigInfo(result) {
            delete result.createAt;
            delete result.updateAt;
            return result;
        };

    }
    //获取列表所有url数据
    getDBConfigs = (pageNum, moduleId, searchKey) => {
        const requestInfo = {
            headers: this.headers,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.getDBUrl+ pageNum + '&pageSize=10' + '&moduleId=' + moduleId + '&searchKey=' + searchKey, requestInfo)
            .then(response => response.json())
            .then(result => { 
                const pagination = { ...this.state.pagination };
                pagination.total = result.data.total;
                pagination.current = result.data.pageNum;
                this.setResult(result.data.list);
                this.setPagination(pagination);
                this.setLoading(false);
            })
            .catch(e => e)
    }

    componentWillMount(){
        console.log("componentWillMount-----Database");
    }
    componentDidMount(){
        console.log("componentDidMount-----Database");
        const currentProductId = this.props.productId;
        const currentPageNum = 0;
        const searchKey = '';
        this.getDBConfigs(currentPageNum,currentProductId,searchKey);
    }

    componentWillReceiveProps(nextProps){     //这里没有理解到，后续需要看一下react声明周期
        //这里没有理解到，后续需要看一下react声明周期
        console.log("componentWillReceiveProps-----Database");
        const currentProductId = nextProps.productId;
        const currentPageNum = 0;
        const searchKey = '';
        this.getDBConfigs(currentPageNum, currentProductId, searchKey);
    }

    componentWillUpdate(){
        console.log("componentWillUpdate-----Database");
    }

    componentDidUpdate(){
        console.log("componentDidUpdate-----Database");
    }

    render() {
        console.log("render-----Database");
        const { result, pagination, loading,addModalVisible,editModalVisible,dbConfigInfo } = this.state;
        const {productId} = this.props;
        return (
            <Layout className="layout">
                    <Content className="table-contents">
                        <div className="module_search">
                            <div className="search_input_text">
                                <Search
                                    placeholder="请输入动作名称或描述查询"
                                    enterButton="搜索"
                                    size="large"
                                    ref = {input => this.input = input}
                                    onSearch={value => this.onSearchKey(value)}
                                />
                            </div>
                            <div className="search_input_button">
                                    <Button onClick={this.addDBConfig} type="primary" size="large">新增数据库配置</Button>
                            </div>
                        </div>
                        {result &&
                            <div className="table">
                                <Table
                                    rowKey={result => result.id}
                                    columns={this.columns}
                                    dataSource={result}
                                    pagination={pagination}
                                    loading={loading}
                                    onChange={this.handleTableChange}
                                />
                            </div>
                        }
                        <DatabaseModal
                            title = '新增数据库配置'
                            visible={addModalVisible}
                            setVisible = {this.setAddModalVisible}
                            submitUrl = {this.submitCreateUrl}
                            getDBConfigs={this.getDBConfigs}
                            productId={productId}
                            searchInput={this.input}
                        />
                        <DatabaseModal
                            title = '修改数据库配置'
                            visible={editModalVisible}
                            setVisible = {this.setEditModalVisible}
                            submitUrl = {this.submitUpdateUrl}
                            getDBConfigs={this.getDBConfigs}
                            dbConfigInfo = {dbConfigInfo}
                            productId={productId}
                            searchInput={this.input}
                        />

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                </Footer>
                </Layout>
        );
    }
}

export default withRouter(Database);