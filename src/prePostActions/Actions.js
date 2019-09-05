import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ActionModal from './ActionModal';

import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip } from 'antd';
const { Content, Footer } = Layout;
const Search = Input.Search;

class Actions extends Component {

    queryActionsUrl = 'http://localhost:8081/api/actions/query/actionWrappers/?pageNum=';
    queryActionByIdUrl = 'http://localhost:8081/api/actions/query/';
    createActionUrl = 'http://localhost:8081/api/actions/create';
    updateActionUrl =  'http://localhost:8081/api/actions/update';
    deleteActionUrl = 'http://localhost:8081/api/actions/delete/';

    reuqestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    }

    columns = [{
        title: '动作名称',
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
        title: '动作描述',
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
        title: '动作类型',
        dataIndex: 'actionType',
    },
    {
        title: '创建时间',
        dataIndex: 'createAt',
    },
    {
        title: '更新时间',
        dataIndex: 'updateAt',
    },
    {
        title: '操作',
        dataIndex: '',
        render: (record) => (
            <span onClick={e => e.stopPropagation()}>
                <Button className="table-button" size="small" onClick={() => this.onEditButtonClick(record.id)}><span>编辑</span></Button>
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onDeleteButtonClick(record.id)}><span>删除</span></Button>
            </span>
        )
    }];

    constructor(props) {
        super(props);
        this.state = {
            current: 'actions',
            searchKey: '',
            loading: false,
            result: null,
            pagination: {},
            addModalVisible:false,
            editModalVisible:false,
            actionInfo:{},
        }

        const{getInstance} = this.props;
        getInstance(this);
    }

    setSearchKey = searchKey => {
        this.setState({ searchKey, });
    }

    setLoading = loading => {
        this.setState({ loading, });
    }

    setResult = result => {
        this.setState({ result, });
    }

    setPagination = pagination => {
        this.setState({ pagination, });
    }

    setAddModalVisible = addModalVisible =>{
        this.setState({addModalVisible,});
    }

    setEditModalVisible = editModalVisible =>{
        this.setState({editModalVisible,});
    }

    setActionInfo = actionInfo =>{
        this.setState({actionInfo,});
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    componentDidMount() {
        const {productId} = this.props;
        const currentPageNum = 1;
        const currentSearchKey = this.state.searchKey;
        this.fetchActions(currentPageNum, productId,currentSearchKey);
    }

    componentWillReceiveProps(nextProps){
        const {productId} = nextProps;
        const currentPageNum = 0;
        const searchKey = '';
        this.fetchActions(currentPageNum, productId, searchKey);
    }

    //根据页数获取前后置动作数据
    fetchActions = (pageNum, moduleId, searchKey) => {
        const requestInfo = {
            headers: this.reuqestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.queryActionsUrl + pageNum + '&pageSize=10'+ '&moduleId=' + moduleId + '&searchKey=' + searchKey, requestInfo)
            .then(response => response.json())
            .then(result => setDataPagination(result))
            .then(() => this.setLoading(false))
            .catch(e => e);

        //设置分页、加载、表格数据
        const setDataPagination = result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.total;
            pagination.current = result.data.pageNum;
            this.setResult(result.data.list);
            this.setLoading(false);
            this.setPagination(pagination);
        };
    }

    //翻页时重新加载数据
    handleTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        const searchKey = this.state.searchKey;
        pager.current = pagination.current;
        const currentPage = pager.current;
        this.setPagination(pager);
        this.fetchActions(currentPage, searchKey);
    };

    //输入关键字查询
    onSearchKey = value => {
        const {productId} = this.props;
        const currentPage = 1;
        const searchKey = value;
        this.setSearchKey(searchKey);
        this.fetchActions(currentPage, productId, searchKey);
    }

    //点击增加按钮
    onAddAction = () =>{
        this.setAddModalVisible(true);
    }


    //点击编辑按钮跳转到编辑页面  
    onEditButtonClick = id => {
        // this.props.history.push("/editAction/" + id);
        const url = this.queryActionByIdUrl + id;
        const requestInfo = {
            headers: this.headers,
            method: 'GET',
            mode: 'cors',
        };
        this.setEditModalVisible(true);
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(result => changeToActualActionInfo(result.data))
            .then(actionInfo => this.setActionInfo(actionInfo))
            .catch(e => e);

        //将返回的UrlInfo的值里去掉创建时间和修改时间
        function changeToActualActionInfo(result) {
            delete result.createAt;
            delete result.updateAt;
            return result;
        };
    }

    //点击删除按钮
    onDeleteButtonClick = id => {
        const requestInfo = {
            headers: this.reuqestHeaders,
            method: 'DELETE',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.deleteActionUrl + id, requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.setLoading(false))
            .then(() => this.fetchActions(1, ''))
            .catch(e => e);
    }



    render() {
        const { result, pagination, loading, addModalVisible, editModalVisible,actionInfo } = this.state;
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
                                    <Button onClick={this.onAddAction} type="primary" size="large">新增前置/后置动作</Button>
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
                            <ActionModal
                                title = "新增动作设置"
                                visible = {addModalVisible}
                                setVisible = {this.setAddModalVisible}
                                productId = {productId}
                                submitUrl = {this.createActionUrl}
                                fetchActions =  {this.fetchActions}
                                searchInput={this.input}
                            />
                            <ActionModal
                                title = "修改动作设置"
                                visible = {editModalVisible}
                                setVisible = {this.setEditModalVisible}
                                productId = {productId}
                                submitUrl = {this.updateActionUrl}
                                fetchActions =  {this.fetchActions}
                                searchInput={this.input}
                                actionInfo = {actionInfo}
                            />
                        </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        );
    }

}

export default withRouter(Actions);