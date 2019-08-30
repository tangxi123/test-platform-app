import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import BaseUrlModal from './BaseUrlModal';

import {
    withRouter,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip } from 'antd';
const { Content, Footer } = Layout;
const Search = Input.Search;



class BaseUrl extends Component {


    submitCreateUrl = 'http://localhost:8081/url/create';  //创建url的url
    submitUpdateUrl = 'http://localhost:8081/url/update'; //更新url的url
    queryUrl = 'http://localhost:8081/url/query/' //根据id获取url信息的url
    queryAllUrl = 'http://localhost:8081/url/query/?pageNum=' //获取分页url的url
    querySearchKeyUrl = 'http://localhost:8081/url/query/?searchKey=' //根据关键字查询url的url
    deleteUrl = 'http://localhost:8081/url/delete/' //根据id删除url的url

    headers = {                                     //发送请求的headers
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    columns = [{                                          //列表的各列设置
        title: '基础Url',
        dataIndex: 'url',
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
        console.log("constructor----BaseUrl");
        super(props);
        this.state = {
            current: 'baseUrl',
            loading: false,
            result: null,
            pagination:{},
            searchKey:'',
            addModalVisible: false,
            editModalVisible: false,
            submitCreateUrl: this.submitCreateUrl,
            submitUpdateUrl: this.submitUpdateUrl,
            urlInfo: {},
        }

        const {getInstance} = this.props;
        getInstance(this); //用于获取baseUrl实例
       

    }

    setLoading = loading => {
        this.setState({loading,})
    }

    setResult = result =>{
        this.setState({result,});
    }

    setPagination = pagination =>{
        this.setState({pagination,});
    }

    setSearchKey = searchKey =>{
        this.setState({searchKey});
    }

    setAddModalVisible = addModalVisible => {
        this.setState({ addModalVisible, });
    }

    setEditModalVisible = editModalVisible => {
        this.setState({ editModalVisible, });
    }

    setSubmitCreateUrl = submitCreateUrl => {
        this.setState({ submitCreateUrl, });
    }

    setSubmitUpdateUrl = submitUpdateUrl => {
        this.setState({ submitUpdateUrl, });
    }

    setUrlInfo = urlInfo => {
        this.setState({ urlInfo });
    }

    addUrl = () => {
        this.setAddModalVisible(true);
    }


    //点击头部标签页按钮
    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    onRowClick = (id) => {
        console.log(id);
        // this.props.history.push("/editBaseUrl/" + id);
    }

    //点击列表上编辑按钮，获得相应id的数据
    onEditButtonClick = (id) => {
        const url = this.queryUrl + id;
        const requestInfo = {
            headers: this.headers,
            method: 'GET',
            mode: 'cors',
        };
        this.setEditModalVisible(true);
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(result => changeToActualUserInfo(result.data))
            .then(userInfo => this.setUrlInfo(userInfo))
            .catch(e => e);

        //将返回的UrlInfo的值里去掉创建时间和修改时间
        function changeToActualUserInfo(result) {
            delete result.createAt;
            delete result.updateAt;
            return result;
        };

    }

    //点击列表上删除按钮，删除对应行数据
    onDeleteButtonClick = (id) => {
        const requestInfo = {
            headers: this.headers,
            method: 'DELETE',
            mode: 'cors',
        };
        fetch(this.deleteUrl + id, requestInfo)
            .then(response => response.json())
            .then(result => this.deleteAlert(result))
            .then(result => this.fetchUrls())
            .catch(e => e);
    }

    //在搜索框输入关键字进行查询
    onSearchKey = (value) => {
        const pageNum = 0;
        const {productId} = this.props; 
        this.setSearchKey(value);
        this.fetchUrls(pageNum, productId, value);
    }

    deleteAlert = (result) => {
        const message = result.message;
        alert(message);
    }

    //获取列表所有url数据
    fetchUrls = (pageNum, moduleId, searchKey) => {
        const requestInfo = {
            headers: this.headers,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.queryAllUrl+ pageNum + '&pageSize=10' + '&moduleId=' + moduleId + '&searchKey=' + searchKey, requestInfo)
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
        console.log("componentWillMount----BaseUrl");
    }

    componentDidMount() {
        console.log("componentDidMount----BaseUrl");
        const currentProductId = this.props.productId;
        const currentPageNum = 0;
        const searchKey = '';
        this.fetchUrls(currentPageNum, currentProductId, searchKey);
    }

    componentWillReceiveProps(nextProps){     //这里没有理解到，后续需要看一下react声明周期
        console.log("componentWillReceiveProps----BaseUrl");
        const currentProductId = nextProps.productId;
        const currentPageNum = 0;
        const searchKey = '';
        this.fetchUrls(currentPageNum, currentProductId, searchKey);
    }

    componentWillUpdate(){
        console.log("componentWillUpdate----BaseUrl");
    }

    componentDidUpdate(){
        console.log("componentDidUpdate----BaseUrl");
    }

    //列表翻页操作，翻页时重新加载数据
    handleTableChange = (pagination, ) => {
        const {productId} = this.props;
        const { searchKey} = this.state;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        const current = pager.current;
        this.setPagination(pager);
        this.fetchUrls(current, productId, searchKey);
    };


    render() {
        console.log("render----BaseUrl");
        console.log(this.props);
        console.log(this.state);
        const { result,pagination,loading,addModalVisible, editModalVisible, submitCreateUrl, submitUpdateUrl, urlInfo } = this.state;
        const {productId} = this.props;
        return (
            <Layout className="layout">
                        <Content className="table-contents">
                            <div className="module_search">
                                <div className="search_input_text">
                                <Search
                                    placeholder="请输入url或者描述进行搜索"
                                    enterButton="搜索"
                                    size="large"
                                    ref = {input => this.input = input}
                                    onSearch={value => this.onSearchKey(value)}
                                />
                                </div>
                                <div className="search_input_button">
                                <Button type="primary" size="large" onClick={this.addUrl}>新增Url</Button>
                                </div>
                            </div>
                            {result &&
                                <div className="table" style={{border:'1px solid #e5e5e5'}}>
                                    <Table
                                        rowKey={result => result.id}
                                        columns={this.columns}
                                        dataSource={result}
                                        pagination={pagination}
                                        onRow={(record) => {
                                            return {
                                                onClick: event => { this.onRowClick(record.id) }
                                            };
                                        }}
                                        loading={loading}
                                        onChange={this.handleTableChange}
                                    />
                                </div>
                            }
                            <BaseUrlModal
                                title='新增基础Url'
                                visible={addModalVisible}
                                setVisible={this.setAddModalVisible}
                                submitUrl={submitCreateUrl}
                                setSubmitUrl={this.submitCreateUrl}
                                fetchUrls={this.fetchUrls}
                                productId={productId}
                                searchInput={this.input}
                            >
                            </BaseUrlModal>
                            <BaseUrlModal
                                title='编辑基础Url'
                                visible={editModalVisible}
                                setVisible={this.setEditModalVisible}
                                submitUrl={submitUpdateUrl}
                                setSubmitUrl={this.submitUpdateUrl}
                                fetchUrls={this.fetchUrls}
                                urlInfo={urlInfo}
                                productId={productId}
                                searchInput={this.input}
                            >
                            </BaseUrlModal>
                        </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>

        );
    }
}

export default withRouter(BaseUrl);