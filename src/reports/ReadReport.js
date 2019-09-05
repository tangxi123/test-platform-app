import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ReportTestCaseInfo from './ReportTestCaseInfo';
import ReportsInfo from './ReportsInfo';
import { Layout, Button, Table, Divider, Input, Tree, Row, Col, Select, Tooltip, List, Icon, Tag,Card } from 'antd';
import './Report.css';
const { Header, Content, Footer, Sider } = Layout;

class ReadReport extends Component {
    getReportUrl = end_url+'/api/reports/report/';
    getReportInfoUrl = end_url+'/api/reports/report/reportInfo/';
    getReportTestCaseUrl = end_url+'/api/reports/report/reportInfo/testCases/';

    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    columns = [{
        title: '模块名字',
        dataIndex: 'name',
        width:'800px',
        onCell: () => {
            return {
                style: {
                    maxWidth: 400,
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
        dataIndex: 'passedCount',
        onCell:() =>{
            return {
                style:{
                    backgroundColor:'#b7eb8f',
                }
            }
        }
    },
    {
        title: '失败',
        dataIndex: 'failedCount',
        onCell:() =>{
            return {
                style:{
                    backgroundColor:'#ffa39e',
                }
            }
        }
    },
    {
        title: '运行时间（ms）',
        dataIndex: 'runtime',
        onCell:() =>{
            return {
                style:{
                    backgroundColor:'#87e8de',
                }
            }
        }
    },
    ];

    moduleListColumns = [{
        title: '名字',
        dataIndex: 'moduleName',
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
    }
    ];


    constructor(props) {
        super(props);
        this.state = {
            current: 'reports',
            showTableOrTestCase: 'table',
            report: {},
            reportInfo: [],
            recodrInfo: {},
            reportTestCaseInfo: [],
        }
    }

    setCurrent = current => {
        this.setState({ current, });
    }

    setShowTableOrTestCase = showTableOrTestCase => {
        this.setState({ showTableOrTestCase, });
    }

    setReport = report => {
        this.setState({ report, });
    }

    setReportInfo = reportInfo => {
        this.setState({ reportInfo, });
    }

    setRecordInfo = recordInfo => {
        this.setState({ recordInfo, });
    }

    setReportTestCaseInfo = reportTestCaseInfo => {
        this.setState({ reportTestCaseInfo, });
    }

    componentDidMount() {
        console.log(this.props);
        const { reportId } = this.props.match.params;
        this.fetchReport(reportId);
        this.fetchReportInfo(reportId);
    }

    //根据id获取report数据
    fetchReport = reportId => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getReportUrl + reportId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setReport(result.data);
            })
            .catch(e => e);

    }

    //根据reportId查询下面每个suite的reportInfo数据
    fetchReportInfo = reportId => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getReportInfoUrl + reportId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setReportInfo(result.data);
            })
            .catch(e => e);

    }

    changeReportInfo = reportInfo =>{
        let newReportInfo = reportInfo;
        if(reportInfo.children.length === 0){
            if(reportInfo.execTestCaseLog.length === 0){
                reportInfo = reportInfo;
                reportInfo.newChildren = [];
            }else{
                // let testCasesInfo = [];
                let newChildren = "";
                for(let i = 0; i<reportInfo.execTestCaseLog.length; i++){
                    // newChildren = newChildren+"haha";
                    newChildren.push({hello:"haha"});
                }
                for(let i = 0; i<reportInfo.execTestCaseLog.length; i++){
                    // newChildren.put({
                    //     id:reportInfo.execTestCaseLog[i].id+'case',
                    //     testCaseId:reportInfo.execTestCaseLog[i].testCaseId,
                    //     name:reportInfo.execTestCaseLog[i].name,
                    //     passedCount:reportInfo.execTestCaseLog[i].passedTcCount,
                    //     failedCount:reportInfo.execTestCaseLog[i].failedTcCount,
                    //     testResultStatus:reportInfo.execTestCaseLog[i].testResultStatus
                    // });
                    // newChildren.put({hello:"hello"});
                    // reportInfo.children.put({hello:"hello"})
                    reportInfo.hello = 'descs';
                    // reportInfo.newChildren = [{hello:i}];
                    reportInfo.newChildren = newChildren;
                }
                // reportInfo.newChildren = newChildren;
                          
            }
            // reportInfo.name='hello';
            // console.log(reportInfo.children);
            return reportInfo;     
        }else{
            for(let i = 0; i < reportInfo.children.length; i++){
                if(reportInfo.children[i].execTestCaseLog.length === 0){
                    reportInfo.children[i] = reportInfo.children[i];
                    reportInfo.children[i].newChildren = [];
                }else{
                    // reportInfo.children.put({hello:"hello"})
                    let newChildChildren = [];
                    for(let j = 0; j<reportInfo.children[i].execTestCaseLog.length; j++){
                        newChildChildren.push({hello:"haha"});
                        // newChildChildren = newChildChildren+"haha";
                    }
                    reportInfo.children[i].hello = 'descs';
                    reportInfo.children[i].newChildren =  newChildChildren;
                    // let newChildren = [];
                    // newChildren.put({
                    //     id:reportInfo.children[i].execTestCaseLog.id+'case',
                    //     testCaseId:reportInfo.children[i].execTestCaseLog.testCaseId,
                    //     name:reportInfo.children[i].execTestCaseLog.name,
                    //     passedCount:reportInfo.children[i].execTestCaseLog.passedTcCount,
                    //     failedCount:reportInfo.children[i].execTestCaseLog.failedTcCount,
                    //     testResultStatus:reportInfo.children[i].execTestCaseLog.testResultStatus
                    // });
                    // newChildren.put({hello:"hello"});
                    // reportInfo.children[i].newChildren = newChildren;


                }
                console.log(reportInfo.children[i]);
               
                this.changeReportInfo(reportInfo.children[i]);
            }
        }
       

        
    }

    //根据reportInfoId获取对应模块下的测试用例结果
    fetchReportTestCaseInfo = reportInfoId => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        }
        fetch(this.getReportTestCaseUrl + reportInfoId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setReportTestCaseInfo(result.data);
            })
            .catch(e => e);

    }

    //点击表格中的每行，展示每个模块的测试报告
    onTableRowClick = record => {
        // const moduleId = record.id;
        //请求获取每个模块对应的测试用例数据
        // console.log(record);
        this.setRecordInfo(record);
        this.fetchReportTestCaseInfo(record.id);
        this.setShowTableOrTestCase('testCase');

    }

    render() {
        const { report, reportInfo, recordInfo, reportTestCaseInfo, showTableOrTestCase } = this.state;
        // console.log(reportInfo);
        
        // console.log(reportInfo);
        // console.log(reportTestCaseInfo);
        const reportName = report ? report.reportName : '';
        const passedTcCount = report ? report.passedTcCount : '';
        const failedTcCount = report ? report.failedTcCount : '';
        const skippedTcCount = report ? report.skippedTcCount : '';
        const allTcCount = passedTcCount + failedTcCount + skippedTcCount;
        const passedRate = (passedTcCount / allTcCount) * 100;
        let ReportDisplayForm;
        if (showTableOrTestCase === 'table') {
            ReportDisplayForm = (
                reportInfo &&
                <div id="report-table">
                    <Table
                        rowKey={reportInfo => reportInfo.id}
                        columns={this.columns}
                        dataSource={reportInfo}
                        onRow={(record) => {
                            return {
                                onClick: event => { this.onTableRowClick(record) }
                            };
                        }
                        }
                    />
                </div>
            );
        } else if (showTableOrTestCase === 'testCase') {
            ReportDisplayForm = (
                <div>
                    <ReportTestCaseInfo
                        recordInfo={recordInfo}
                        reportTestCaseInfo={reportTestCaseInfo}
                    />

                </div>
            );
        }
        return (
            <Layout className="layout">
                {/* <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                /> */}
                <div className="report-segments-page">
                    <div className="report-name" style={{ padding: '3% 0 3% 2%', border: '1px solid rgb(192,192,192)' }}>
                        {reportName &&
                        <h1>
                                {reportName}测试报告
                        </h1>
                        }
                        <p>
                            <span><Tag color="#108ee9">测试用例总数:{allTcCount}</Tag></span>
                            <span><Tag color="green">通过:{passedTcCount}</Tag></span>
                            <span><Tag color="red">失败:{failedTcCount}</Tag></span>
                        </p>
                        <p>
                            <span><Tag color="purple">通过率:{passedRate}%</Tag></span>
                        </p>

                    </div>
                    <div className="container">
                        <Layout className="report">
                            {/* <div style={{ borderRight: '5px solid rgb(192,192,192)', width: '350px' }}> */}
                                {/* <Sider className="modules" width={330} style={{ padding: '5px 10px' }}>
                                    {reportInfo &&
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={reportInfo}
                                            header="模块"
                                            renderItem={item => (
                                                <List.Item
                                                    key={item.id}
                                                    onClick={() => this.onTableRowClick(item)}
                                                    actions={[
                                                        ((item.testResultStatus === 1) && <Tag color="green">通过</Tag>)
                                                        ||
                                                        ((item.testResultStatus === 2) && <Tag color="red">失败</Tag>)
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        title={item.moduleName}
                                                    />
                                                </List.Item>
                                            )}
                                        >
                                        </List>
                                    }
                                </Sider> */}
                            {/* </div> */}
                            <Content style={{ padding: '5px 30px' }}>
                                {/* {ReportDisplayForm} */}
                                <ReportsInfo 
                                    reportId = {this.props.match.params.reportId} 
                                    productId = {this.props.match.params.productId}
                                    />
                            </Content>
                        </Layout>
                    </div>
                </div>
            </Layout >
        );
    }
}

export default ReadReport;