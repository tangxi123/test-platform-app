import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Tree, Row, Col, Select, Tooltip, List, Icon } from 'antd';
const { Content, Footer, Sider } = Layout;
const Search = Input.Search;
const { TreeNode } = Tree;
const Option = Select.Option;

class Reports extends Component {
    getProductsUrl = 'http://localhost:8081/modules/querySiblingSubmodules/0';
    queryAllReportsUrl = 'http://localhost:8081/reports/query/?pageNum=';
    getTreeUrl = 'http://localhost:8081/modules/tree/';
    execTestCaseByModuleIdUrl = 'http://localhost:8081/testcases/exectestByModuleId/';

    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    columns = [{
        title: '报告名字',
        dataIndex: 'reportName',
        onCell: () => {
            return {
                style: {
                    maxWidth: 200,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer'
                }
            }
        },
        render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    }, {
        title: '通过',
        dataIndex: 'passedTcCount',
    },
    {
        title: '失败',
        dataIndex: 'failedTcCount',
    },
    {
        title: '生成报告时间',
        dataIndex: 'reportTime',
    },
    {
        title: '操作',
        dataIndex: '',
        render: (record) => (
            <span onClick={e => e.stopPropagation()}>
                <Button className="table-button" size="small" onClick={() => this.onReadReportButtonClick(record.id)}>查看</Button>
            </span>
        )
    }];

    productColumns = [{
        title: '产品名字',
        dataIndex: 'name',
        onCell: () => {
            return {
                style: {
                    maxWidth: 200,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer'
                }
            }
        },
        render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    }, {
        title: '操作',
        dataIndex: '',
        render: (record) => (
            <span onClick={e => e.stopPropagation()}>
                <Button size="small" onClick={() => this.generateReport(record.id)}>生成报告</Button>
            </span>
        )
    }];

    constructor(props) {
        super(props);
        this.state = {
            current: 'reports',
            loading: false,
            products: [],
            treeData: null,
            result: null,
            pagination: {},
            moduleId: null,
            productId: 61,
            searchKey: '',
            selectedKeys: ['61'],
        };
    }

    setCurrent = current => {
        this.setState({ current, });
    }

    setLoading = loading => {
        this.setState({ loading, });
    }

    setProducts = products => {
        this.setState({ products, });
    }

    setTreeData = treeData => {
        this.setState({ treeData, });
    }

    setResult = result => {
        this.setState({ result, });
    }

    setPagination = pagination => {
        this.setState({ pagination, });
    }

    setModuleId = moduleId => {
        this.setState({ moduleId, });
    }

    setProductId = productId => {
        this.setState({ productId, });
    }

    setSearchKey = searchKey => {
        this.setState({ searchKey });
    }

    setSelectedKeys = selectedKeys => {
        this.setState({ selectedKeys, });
    }

    componentDidMount() {
        const currentPageNum = 0;
        const currentProductId = this.state.productId;
        const searchKey = '';
        this.fetchProducts();
        this.fetchReports(currentPageNum, currentProductId, searchKey);
        this.fetchTree(currentProductId);
    }

    //请求所有产品
    fetchProducts = () => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getProductsUrl, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setProducts(result.data);
                this.setModuleId((result.data)[0].id);
                this.setProductId((result.data)[0].id);
            })
            .catch(e => e);
    }

    //请求所有报告
    fetchReports = (pageNum, moduleId, searchKey) => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.queryAllReportsUrl + pageNum + '&pageSize=10' + '&moduleId=' + moduleId + '&searchKey=' + searchKey, requestInfo)
            .then(response => response.json())
            .then(result => {
                const pagination = { ...this.state.pagination };
                pagination.total = result.data.total;
                pagination.current = result.data.pageNum;
                this.setResult(result.data.list);
                this.setPagination(pagination);
                this.setModuleId(moduleId);
                this.setLoading(false);
            })
            .catch(e => e);
    }

    //请求目录树
    fetchTree = (moduleId) => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.getTreeUrl + moduleId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setTreeData(result.data);
                this.setLoading(false);
            })
            .catch(e => e);
    }

    //下拉框选择不同的产品
    changeProduct = value => {
        const currentPageNum = 0;
        const searchKey = '';
        this.setProductId(value);
        this.setModuleId(value);  //将moduleId设置为当前下拉框选的值
        this.setSearchKey('');    //将搜索关键字重置为：''
        // this.input.input.state.value = '';   //将搜索框的值设为空，及清除搜索框内容
        this.fetchTree(value);    //重新请求树结构数据
        this.fetchReports(currentPageNum, value, searchKey);  //重新请求测试用例数据
    }

    //渲染树节点
    renderTreeNodes = data =>
        data.map(item => {
            {
                item.title = (
                    <div>
                        <span>{item.name}</span>
                        <Icon style={{ marginLeft: 10 }} type='play-circle' onClick={() => this.generateReport(item.id)} />
                    </div>
                );
                return (
                    <TreeNode title={item.title} key={item.id} dataRef={item}></TreeNode>
                );
            }
        });

    //点击目录树重新加载数据
    onSelect = (selectedKeys) => {
        const currentPageNum = 0;
        const moduleId = selectedKeys[0];
        const searchKey = this.state.searchKey;
        this.setSelectedKeys(selectedKeys);
        this.setModuleId(moduleId);
        this.fetchReports(currentPageNum, moduleId, searchKey);

    }


    //列表翻页操作，翻页时重新加载数据
    handleTableChange = (pagination, ) => {
        const { searchKey, moduleId } = this.state;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        const current = pager.current;
        this.setPagination(pager);
        this.fetchReports(current, moduleId, searchKey);
    };

    //输入关键字查询数据
    onSearchKey = value => {
        const pageNum = 0;
        const moduleId = this.state.moduleId;
        this.setSearchKey(value);
        this.fetchReports(pageNum, moduleId, value);
    }


    handleClick = e => {
        this.setCurrent(e.key);
    }

    //展示报告列表
    showReportList = recordId => {
        // console.log(recordId);
        const pageNum = 0;
        const searchKey = '';
        this.setProductId(recordId);
        this.fetchReports(pageNum, recordId, searchKey);
    }

    //查看报告
    onReadReportButtonClick = reportId => {
        const {productId} = this.state;
        this.props.history.push('/readReport/' + reportId+'/'+productId);
    }

    //生成报告
    generateReport = (moduleId) => {
        console.log(moduleId);
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.execTestCaseByModuleIdUrl + moduleId, requestInfo)
            .then(response => response.json())
            .then(result => {
                alert(result.data);
            })
            .then(this.setLoading(false))
            .catch(e => e);
    }

    render() {
        const { products, treeData, selectedKeys, productId, result, pagination, loading } = this.state;
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <Layout>
                    <div className="module segments-page" style={{ backgroundColor: '#e5e5e5' }}>
                        <div className="container" style={{ margin: '0 20px', backgroundColor: '#fff', border: '1px solid #e5e5e5', height: '1200px' }}>
                            <Content className="table-contents">
                                <div style={{ padding: '20px 50px 10px 50px' }}>
                                    <Layout>
                                        <Sider width={200} >
                                            <div className="selectedTree" style={{ padding: '0 0 10px 0' }}>
                                                <span>产品名字</span>
                                                <Tree
                                                    onSelect={this.onSelect}
                                                    selectedKeys={selectedKeys}
                                                >
                                                    {this.renderTreeNodes(products)}
                                                </Tree>
                                            </div>

                                        </Sider>
                                        <div style={{ padding: '0 0 0 120px' }}>
                                            <div style={{ padding: '0 0 50px 0' }}>
                                                <div className="search_input_text">
                                                    <Search
                                                        placeholder="请输入报告名称查询"
                                                        enterButton="搜索"
                                                        size="large"
                                                        ref={input => this.input = input}
                                                        onSearch={value => this.onSearchKey(value)}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ border: '1px solid rgb(192,192,192)' }}>
                                                <Table style={{ margin: '0 10px', width: '1000px' }}
                                                    rowKey={result => result.id}
                                                    columns={this.columns}
                                                    dataSource={result}
                                                    pagination={pagination}
                                                    loading={loading}
                                                    onChange={this.handleTableChange}
                                                // onRow={(record) => {
                                                //     return {
                                                //         onClick: event => { this.onRowClick(record.id) }
                                                //     };
                                                // }
                                                // }
                                                />
                                            </div>
                                        </div>
                                    </Layout>
                                </div>
                            </Content>
                        </div>
                    </div>
                </Layout>

                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        );
    }
}

export default withRouter(Reports);