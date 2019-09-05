import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import { Layout, Button, Table, Divider, Input, Tree, Row, Col, Select, Tooltip, List, Tag, Icon, } from 'antd';
const { Content, Footer, Sider } = Layout;
const { TreeNode } = Tree;
const Search = Input.Search;

class ReportsInfo extends Component {
    getReportModulesUrl = end_url + "/api/reports/report/reportInfo/";
    getLogsResultUrl = end_url + "/api/logs/query/";

    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    columns = [{
        title: '测试用例名字',
        dataIndex: 'testCaseName',
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
        title: '是否通过',
        dataIndex: 'testResultStatus',
        render: (text) =>  {
            if(text === 0){
                return <Tag  color="red">失败</Tag>;
            }else{
                return <Tag  color="green">通过</Tag>
            }
           
        }
    },
    {
        title:'测试结果',
        dataIndex:'result',
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
    },
    {
        title: '运行时间(ms)',
        dataIndex: 'executionTime',
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
    constructor(props) {
        super(props);
        this.state = {
            moduleId: this.props.productId,
            treeData: [],
            logsResult:[],
            pagination:{},
            selectedKeys:[],
            searchKey:'',
        }
    }

    setModuleId = moduleId =>{
        this.setState({moduleId,});
    }

    setTreeData = treeData => {
        this.setState({ treeData, });
    }

    setLogsResult = logsResult => {
        this.setState({logsResult, });
    }

    setPagination = pagination => {
        this.setState({ pagination, });
    }

    setSelectedKeys = selectedKeys =>{
        this.setState({selectedKeys,});
    }

    setSearchKey = searchKey => {
        this.setState({searchKey,});
    }

    componentDidMount() {
        const currentPageNum = 0;
        const currentModuleId = this.state.moduleId;
        const reportId = this.props.reportId;
        const searchKey = '';
        this.fetchTreeData(reportId);
        this.fetchLogsResult(currentPageNum,currentModuleId,searchKey);
    }

    //获取目录树
    fetchTreeData = (reportId) => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getReportModulesUrl + reportId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setTreeData(result.data);
            })
            .catch(e => e);
    }
    //渲染树节点
    renderTreeNodes = data =>
        data.map(item => {
            item.title = 
            <div>
                <span>{item.name}</span>
                <Tag style={{ marginLeft: 5 }} color="#108ee9">{item.passedCount+item.failedCount}</Tag>
                <Tag  color="green">{item.passedCount}</Tag>
                <Tag  color="red">{item.failedCount}</Tag>
                {/* <Icon style={{ marginLeft: 10 }} type='play-circle' onClick={() => this.generateReport(item.id)} /> */}
            </div>
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.id} id={item.moduleId} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });

     //点击目录树重新加载数据
     onSelect = (selectedKeys,info) => {
        this.input.input.state.value = ''; //清空搜索框中的值
        const searchKey = ''; //将搜索值重置为空字符
        const currentPageNum = 0;
        const moduleId = info.selectedNodes[0].props.dataRef.moduleId;
        this.setSearchKey(searchKey);
        this.setSelectedKeys(selectedKeys);
        this.setModuleId(moduleId);
        this.fetchLogsResult(currentPageNum, moduleId, searchKey);

    }

    //列表翻页操作，翻页时重新加载数据
    handleTableChange = (pagination, ) => {
        const { searchKey,moduleId } = this.state;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        const current = pager.current;
        this.setPagination(pager);
        this.fetchLogsResult(current, moduleId, searchKey);
    };

     //输入关键字查询数据
    onSearchKey = value => {
        const pageNum = 0;
        const moduleId = this.state.moduleId;
        this.setSearchKey(value);
        this.fetchLogsResult(pageNum, moduleId, value);
    }

    
    //获取测试用例日志
    fetchLogsResult = (pageNum,moduleId,searchKey) => {
        const reportId = this.props.reportId;
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getLogsResultUrl+"?pageNum="+pageNum+"&pageSize=10"+"&moduleId="+moduleId+"&reportId="+reportId+"&searchKey="+searchKey, requestInfo)
            .then(response => response.json())
            .then(result => {
                const pagination = { ...this.state.pagination };
                pagination.total = result.data.total;
                pagination.current = result.data.pageNum;
                this.setPagination(pagination);
                this.setLogsResult(result.data.list)
            })
            .catch(e => e);
    }

    


    render() {
        const { treeData, logsResult, pagination, selectedKeys} = this.state;
        return (
            <Layout className="layout">
                {/* <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                /> */}
                <Layout>
                    <div >
                        {/* <div className="container" style={{ margin: '0 20px', backgroundColor: '#fff', border: '1px solid #e5e5e5', height: '1200px' }}> */}
                            <Content className="table-contents">
                                <div style={{ padding: '20px 50px 10px 50px' }}>
                                    <Layout>
                                        <Sider width={200} >
                                            <div className="selectedTree" style={{ padding: '0 0 10px 0' }}>
                                                {/* <span>产品名字</span> */}
                                                <Tree
                                                    onSelect={this.onSelect}
                                                    selectedKeys={selectedKeys}
                                                >
                                                    {this.renderTreeNodes(treeData)}
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
                                                    rowKey={logsResult => logsResult.id}
                                                    columns={this.columns}
                                                    dataSource={logsResult}
                                                    pagination={pagination}
                                                    // loading={loading}
                                                    onChange={this.handleTableChange}
                                                    expandedRowRender = {record => <p>{record.logs.map(item => <div><span>{item}</span></div>)}</p>}
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
                        {/* </div> */}
                    </div>
                </Layout>

                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout>
        );
    }
}

export default ReportsInfo;