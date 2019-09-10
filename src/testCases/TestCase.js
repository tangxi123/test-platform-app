import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Tree, Row, Col, Select, Tooltip, Tag, Icon } from 'antd';
const { Content, Footer, Sider } = Layout;
const Search = Input.Search;
const { TreeNode } = Tree;
const Option = Select.Option;

class TestCase extends Component {
    getProductsUrl = end_url+'/api/modules/querySiblingSubmodules/0';
    queryAllTestCaseUrl = end_url+'/api/testcases/query/?pageNum=';
    getTreeUrl = end_url+'/api/modules/tree/';
    execTestCaseUrl = end_url+'/api/testcases/exectest/';
    batchExecuteTestCasesUrl = end_url+'/api/testcases/batchExecTestCases/';
    deleteTestCaseUrl = end_url+'/api/testcases/delete/';

    currentProductId;
    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    columns = [{
        title: '用例标题',
        dataIndex: 'testName',
        onCell: () => {
            return {
                style: {
                    maxWidth: '90%',
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
        title: '执行时间',
        dataIndex: 'startTime',
    },
    {
        title: '测试结果',
        dataIndex: 'isPassed',
        render:(text) => {
            switch(text){
                case 0:
                    return <span></span>;
                case 1:
                    return <Tag color="green">成功</Tag>;
                case 2:
                    return <Tag color="red">失败</Tag>;
                case 3:
                    return <Tag color="red">失败</Tag>;
                case 4:
                    return <Tag color="red">失败</Tag>;
            }
        }
    },
    {
        title: '操作',
        dataIndex: '',
        render: (record) => (
            <span onClick={e => e.stopPropagation()}>
                <Button className="table-button" size="small" onClick={() => this.onExcuteButtonClick(record.id)}>执行</Button>
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onResultButtonClick(record.id)}>结果</Button>
                {/* <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onEditButtonClick(record.id)}>编辑</Button> */}
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onDeleteButtonClick(record.id)}>删除</Button>
                <Divider type="vertical" />
                <Button className="table-button" size="small" onClick={() => this.onCopyButtonClick(record.id)}>复制</Button>
            </span>
        )
    }];
    constructor(props) {
        super(props);
        this.state = {
            current: 'testCases',
            result: null,
            products: [],
            treeData: null,
            selectedKeys: [], //选中的树节点
            selectedRowKeys: [], //选中的表格行
            pagination: {},
            loading: false,
            moduleId: null,
            productId: 1,
            searchKey: '',
        }
    }

    setCurrent = current => {
        this.setState({ current, });
    }

    setResult = result => {
        this.setState({ result, });
    }

    setProducts = products => {
        this.setState({ products, });
    }

    setTreeData = treeData => {
        this.setState({ treeData, });
    }

    setSelectedKeys = selectedKeys => {
        this.setState({ selectedKeys, });
    }
    
    setSelectedRowKeys = selectedRowKeys =>{
        this.setState({selectedRowKeys,});
    }

    setPagination = pagination => {
        this.setState({ pagination, });
    }

    setLoading = loading => {
        this.setState({ loading, });
    }

    setModuleId = moduleId => {
        this.setState({ moduleId, });
    }

    setProductId = productId => {
        this.setState({ productId, });
    }

    setSearchKey = searchKey => {
        this.setState({ searchKey, })
    }



    //点击header标签页
    handleClick = e => {
        this.setCurrent(e.key);
    }

    componentDidMount() {
        const currentPageNum = 0;
        const searchKey = '';
        const currentProductId = this.state.productId;
        this.fetchProducts();
        this.setState((state,props) => ({productId : state.products}));
        // console.log(this.state.products);
        this.fetchTestCases(currentPageNum, currentProductId, searchKey);
        this.fetchTree(currentProductId);
    }
    //请求所有产品
    fetchProducts = () => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.getProductsUrl, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setProducts(result.data);
                this.setModuleId((result.data)[0].id);
                // this.setProductId((result.data)[0].id);
                this.currentProductId = (result.data)[0].id;
            })
            .catch(e => e);
       
        

    }

    //请求测试用例
    fetchTestCases = (pageNum, moduleId, searchKey) => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        this.setLoading(true);
        fetch(this.queryAllTestCaseUrl + pageNum + '&pageSize=10' + '&moduleId=' + moduleId + '&searchKey=' + searchKey, requestInfo)
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

    // onEditButtonClick = id => {
    //     this.props.history.push("/editAction/" + id);
    // }

    //根据id执行测试用例
    execTestCaseById = id => {
        const { productId } = this.state;
        const currentPageNum = 0;
        const searchKey = '';
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.execTestCaseUrl+id, requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.fetchTestCases(currentPageNum, productId, searchKey))
            .catch(e => e);

    }


    //下拉框选择不同的产品
    changeProduct = value => {
        const currentPageNum = 0;
        const searchKey = '';
        this.setProductId(value);
        this.setModuleId(value);  //将moduleId设置为当前下拉框选的值
        this.setSearchKey('');    //将搜索关键字重置为：''
        this.input.input.state.value = '';   //将搜索框的值设为空，及清除搜索框内容
        this.fetchTree(value);    //重新请求树结构数据
        this.fetchTestCases(currentPageNum, value, searchKey);  //重新请求测试用例数据
    }

    //渲染树节点
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });

    //点击目录树重新加载数据
    onSelectKey = (selectedKeys) => {
        const currentPageNum = 0;
        const moduleId = selectedKeys[0];
        const searchKey = this.state.searchKey;
        this.setSelectedKeys(selectedKeys);
        this.setModuleId(moduleId);
        this.fetchTestCases(currentPageNum, moduleId, searchKey);

    }

    //列表翻页操作，翻页时重新加载数据
    handleTableChange = (pagination, ) => {
        const { searchKey, moduleId } = this.state;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        const current = pager.current;
        this.setPagination(pager);
        this.fetchTestCases(current, moduleId, searchKey);
    };

    //勾选列表框
    onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setSelectedRowKeys(selectedRowKeys);
        // this.setState({ selectedRowKeys });
      };

    //输入关键字查询数据
    onSearchKey = value => {
        const pageNum = 0;
        const moduleId = this.state.moduleId;
        this.setSearchKey(value);
        this.fetchTestCases(pageNum, moduleId, value);
    }

    //点击按钮跳转到新增测试用例界面
    linkToAddTestCase = () => {
        const { productId, moduleId } = this.state;
        this.props.history.push('/addTestcase/' + productId + '/' + moduleId);
    }

    //点击批量新增按钮，跳转到批量新增测试用例界面
    batchAddTestCasesByModules = () =>{
        const { productId, moduleId } = this.state;
        this.props.history.push('/batchAddTestcase/' + productId + '/' + moduleId);
    }

    //点击编辑按钮，跳转到编辑界面
    onEditButtonClick = (testCaseId) => {
        const { productId, moduleId } = this.state;
        this.props.history.push('/editTestcase/' + productId + '/' + moduleId + '/' + testCaseId);
    }

    //点击删除按钮，删除测试用例
    onDeleteButtonClick = (testCaseId) => {
        const currentPageNum = 0;
        const {productId} = this.state; 
        const searchKey = '';
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'DELETE',
            mode: 'cors',
        };
        fetch(this.deleteTestCaseUrl+testCaseId, requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(this.fetchTestCases(currentPageNum, productId, searchKey))
            .catch(e => e);
    }

    //点击复制按钮，跳转到复制界面
    onCopyButtonClick = (testCaseId) => {
        const { productId, moduleId } = this.state;
        this.props.history.push('/copyTestcase/' + productId + '/' + moduleId + '/' + testCaseId);
    }

    //点击执行按钮，跳转到测试用例执行过程界面
    onExcuteButtonClick = (testCaseId) => {
        // this.props.history.push('/executeTestcase/' + testCaseId);
        this.execTestCaseById(testCaseId);
        // this.connection();
    }

    //点击执行按钮，跳转到测试用例执行过程界面
    onResultButtonClick = (testCaseId) => {
        this.props.history.push('/testcaseResult/' + testCaseId);
        // this.execTestCaseById(testCaseId);
        // this.connection();
    }

    //批量执行测试用例
    batchExecuteTestCases = () => {
        const { selectedRowKeys,productId } = this.state;
        console.log(selectedRowKeys);
        const currentPageNum = 0;
        const searchKey = '';
        const requestInfo =  {
            body: JSON.stringify(selectedRowKeys), 
            headers:this.requestHeaders,
            method: 'POST', 
            mode: 'cors',
          };
        return fetch(this.batchExecuteTestCasesUrl,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() =>this.fetchTestCases(currentPageNum, productId, searchKey))
            .catch(error => console.error(error)) 
    }


    render() {
        const { result, products, productId,treeData, selectedKeys, selectedRowKeys, pagination, loading } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          };
        // let productName 
        // if(products.length > 0){
        //     products.map(item =>{
        //         if(item.id === productId){
        //             console.log(products);
        //             console.log(productId);
        //             return true;
        //         }
        //     })
        // }
        //   console.log(productId);
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <Layout>
                <div className="module segments-page" style={{ backgroundColor: '#e5e5e5' }}>
                    <div className="container" style={{ margin: '0 20px',backgroundColor:'#fff',border:'1px solid #e5e5e5',height:'1200px' }}>
                            <Content className="table-contents">
                                <div style={{padding:'20px 50px 10px 50px'}}>
                                <Layout>
                                    {treeData &&
                                        <Sider width={200} >
                                            <div className="selectedTree" style={{padding:'0 0 10px 0'}}>
                                            {   products.length > 0 &&
                                                <Select size="large" defaultValue={"ITest自动化接口测试"} onChange={this.changeProduct}>
                                                    {
                                                        products.map(item => (
                                                            <Option key={item.id}>{item.name}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            }
                                            </div>
                                            <div className="tree" style={{ background: '#fff', border: '1px solid rgb(192,192,192)', height: '700px', overflow: 'auto' }}>
                                            <Tree onSelect={this.onSelectKey} selectedKeys={selectedKeys}>{this.renderTreeNodes(treeData)}</Tree>
                                            </div>
                                            
                                        </Sider>
                                    }
                                    {/* {result && */}
                                        <div style={{padding:'0 0 0 120px'}}>
                                            <div style={{padding:'0 0 50px 0'}}>
                                                    <div className="search_input_text">
                                                        <Search
                                                            placeholder="请输入测试用例名称或描述查询"
                                                            enterButton="搜索"
                                                            size="large"
                                                            ref={input => this.input = input}
                                                            onSearch={value => this.onSearchKey(value)}
                                                        />
                                                    </div>
                                                    <div className="search_input_button">
                                                        <Button onClick={this.linkToAddTestCase} type="primary" size="large">新增测试用例</Button>
                                                    </div>
                                                    <div className="search_input_button">
                                                        <Button onClick={this.batchExecuteTestCases} type="primary" size="large">批量执行测试用例</Button>
                                                    </div>
                                                    <div className="search_input_button">
                                                        <Button onClick={this.batchAddTestCasesByModules} type="primary" size="large">批量建测试用例</Button>
                                                    </div>      
                                            </div>
                                            <div style={{border: '1px solid rgb(192,192,192)'}}>
                                            <Table style={{margin:'0 10px', width:'100%'}}
                                                rowSelection={rowSelection}
                                                rowKey={result => result.id}
                                                columns={this.columns}
                                                dataSource={result}
                                                pagination={pagination}
                                                loading={loading}
                                                onChange={this.handleTableChange}
                                                onRow={(record) => {
                                                    return {
                                                        onClick: event => { this.onEditButtonClick(record.id) }
                                                    };
                                                }
                                            }
                                            />
                                            </div>
                                        </div>
                                    {/* } */}
                                   
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

export default withRouter(TestCase);