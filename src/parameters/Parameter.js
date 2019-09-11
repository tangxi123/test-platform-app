import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ParameterModal from './ParameterModal';

import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip } from 'antd';
const { Content, Footer } = Layout;
const Search = Input.Search;

class Parameter extends Component {

    queryParamsUrl = end_url+'/api/parameters/query/paramWrappers/?pageNum=';
    submitCreateUrl = end_url+'/api/parameters/create';  //创建dbConfig的url
    submitUpdateUrl = end_url+'/api/parameters/update'; //更新dbConfig的url
    queryParameterByIdUrl = end_url+'/api/parameters/query/' //根据id获取url信息的url
    deleteParamUrl = end_url+'/api/parameters/delete/';

    reuqestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    }

    columns = [{
        title: '参数名称',
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
        title: '参数描述',
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
        title: '参数类型',
        dataIndex: 'type',
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
        console.log("constructor---Parameter");
        super(props);
        this.state = {
            current: 'parameters',
            searchKey: '',
            loading: false,
            result: null,
            pagination: {},
            addParameterModal: false,
            editParameterModal: false,
            parameterInfo: {},
            productId:'',
        }

        const {getInstance} = this.props;
        getInstance(this); //用于获取Database实例
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

    setAddParameterModal = addParameterModal => {
        this.setState({ addParameterModal, });
    }

    setEditParameterModal = editParameterModal => {
        this.setState({ editParameterModal, });
    }

    setParameterInfo = parameterInfo => {
        this.setState({ parameterInfo, });
    }

    setProductId = productId =>{
        this.setState({productId,});
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    componentWillMount(){
        console.log("componentWillMount---Parameter");
    }

    componentDidMount() {
        console.log("componentDidMount---Parameter");
        const { productId } = this.props;
        const currentPageNum = 0;
        const currentSearchKey = this.state.searchKey;
        this.fetchParams(currentPageNum, productId, currentSearchKey);
    }

    componentWillReceiveProps(nextProps) {     //这里没有理解到，后续需要看一下react声明周期
        console.log("componentWillReceiveProps---Parameter");
        const currentProductId = nextProps.productId;
        const currentPageNum = 0;
        const searchKey = '';
        this.fetchParams(currentPageNum, currentProductId, searchKey);
    }
    shouldComponentUpdate(){
        console.log("shouldComponentUpdate---Parameter");
        return true;
    }

    componentWillUpdate(){
        console.log("componentDidUpdate---Parameter");
    }

    componentDidUpdate(){
        console.log("componentDidUpdate---Parameter");
    }

    

    //根据页数获取参数数据
    fetchParams = (pageNum, moduleId, searchKey) => {
        console.log(moduleId);
        const requestInfo = {
            headers: this.reuqestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.queryParamsUrl + pageNum + '&pageSize=10' + '&moduleId=' + moduleId + '&searchKey=' + searchKey, requestInfo)
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
        const { productId } = this.props;
        const pager = { ...this.state.pagination };
        const searchKey = this.state.searchKey;
        pager.current = pagination.current;
        const currentPage = pager.current;
        this.setPagination(pager);
        this.fetchParams(currentPage, productId, searchKey);
    };

    //输入关键字查询
    onSearchKey = value => {
        const currentPage = 1;
        const searchKey = value;
        const { productId } = this.props;
        this.setSearchKey(searchKey);
        this.fetchParams(currentPage, productId, searchKey);
    }

    //弹出新增parameter的modal
    addParameter = () =>{
        this.setAddParameterModal(true);
    }


    //点击编辑按钮跳转到编辑页面  
    onEditButtonClick = (id) => {
        // this.setEditParameterModal(true);
        const url = this.queryParameterByIdUrl + id;
        const requestInfo = {
            headers: this.headers,
            method: 'GET',
            mode: 'cors',
        };
        this.setEditParameterModal(true);
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(result => changeToActualParameterInfo(result.data))
            .then(parameterInfo => this.setParameterInfo(parameterInfo))
            .catch(e => e);

        //将返回的UrlInfo的值里去掉创建时间和修改时间
        function changeToActualParameterInfo(result) {
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
        fetch(this.deleteParamUrl + id, requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.setLoading(false))
            .then(() => this.fetchParams(1, this.props.productId,''))
            .catch(e => e);
    }



    render() {
        console.log("render---Parameter");
        console.log(this.props);
        const { result, pagination, loading, addParameterModal, editParameterModal, parameterInfo } = this.state;
        const {productId} = this.props;
        return (
            <Layout className="layout">
                <Content className="table-contents">
                    <div className="module_search">
                        <div className="search_input_text">
                            <Search
                                placeholder="请输入参数名称或描述查询"
                                enterButton="搜索"
                                size="large"
                                ref={input => this.input = input}
                                onSearch={value => this.onSearchKey(value)}
                            />
                        </div>
                        <div className="search_input_button">
                            <Button onClick={this.addParameter} type="primary" size="large">新增参数设置</Button>
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
                    <ParameterModal
                        title='新增参数配置'
                        visible={addParameterModal}
                        setVisible={this.setAddParameterModal}
                        submitUrl={this.submitCreateUrl}
                        fetchParams={this.fetchParams}
                        productId={productId}
                        searchInput={this.input}
                    />
                    <ParameterModal
                        title='修改参数配置'
                        visible={editParameterModal}
                        setVisible={this.setEditParameterModal}
                        submitUrl={this.submitUpdateUrl}
                        fetchParams={this.fetchParams}
                        parameterInfo={parameterInfo}
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

export default withRouter(Parameter);