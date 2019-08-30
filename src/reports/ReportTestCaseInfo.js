import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import { Layout, Button, Table, Divider, Input, Tree, Row, Col, Select, Tooltip, List, Tag } from 'antd';
const { Content, Footer, Sider } = Layout;

class ReportTestCaseInfo extends Component {
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
    },
    {
        title: '运行时间（ms）',
        dataIndex: 'runtime',
    },
    ];

    constructor(props) {
        super(props);
        this.state = {
            current: 'reports',
            passOrFailOrSkip: '',
            failedReportTestCaseInfo: [],
        }
    }

    setCurrent = current => {
        this.setState({ current, });
    }

    setPassOrFailOrSkip = passOrFailOrSkip => {
        this.setState({ passOrFailOrSkip, });
    }

    setFailedReportTestCaseInfo = failedReportTestCaseInfo => {
        this.setState({ failedReportTestCaseInfo, });
    }

    // componentDidMount = () =>{
    //     const {reportTestCaseInfo} = this.props;
    //     console.log("从父组件得到");
    //     console.log(this.props);
    //     const failedReportTestCaseInfo = reportTestCaseInfo.filter(item => item.testResultStatus == 2);
    //     console.log("获取");
    //     console.log(failedReportTestCaseInfo);
    //     this.setFailedReportTestCaseInfo(failedReportTestCaseInfo);
    // }

    render() {
        const { recordInfo, reportTestCaseInfo } = this.props;
        console.log(reportTestCaseInfo);
        // let failedReportTestCaseInfo = [];
        const failedReportTestCaseInfo = reportTestCaseInfo.filter(item => item.testResultStatus === 2);
        console.log('haha');
        const skippedReportTestCaseInfo = reportTestCaseInfo.filter(item => item.testResultStatus === 3);
        const passedReportTestCaseInfo = reportTestCaseInfo.filter(item => item.testResultStatus === 1);
        return (
            <div>
                <div>
                    <h3>{recordInfo.moduleName}</h3>
                    <span><Tag color="green">通过:{recordInfo.passedTcCount}</Tag></span>
                    <span><Tag color="red">失败:{recordInfo.failedTcCount}</Tag></span>
                    <span><Tag color="orange">跳过:{recordInfo.skippedTcCount}</Tag></span>
                    <span><Tag color="cyan">运行时间:{recordInfo.runtime}(ms)</Tag></span>
                </div>
                <div className="testCases" style={{padding:'20px 0 0 0'}}>
                    <div className="testCases-failed">
                    <p style={{backgroundColor:'#ffa39e',fontWeight:'bold',color:'black',fontSize:'15px'}}>
                       失败的测试用例
                    </p>
                    {
                        failedReportTestCaseInfo &&
                        <Table
                            rowKey={failedReportTestCaseInfo => failedReportTestCaseInfo.id}
                            columns={this.columns}
                            dataSource={failedReportTestCaseInfo}
                            expandedRowRender={record => {
                                return (
                                    <div>
                                        <p>{record.logs}</p>
                                        <p>{record.exceptions}</p>
                                    </div>
                                );

                            }
                            }
                        // onRow={(record) => {
                        //     return {
                        //         onClick: event => { this.onTableRowClick(record) }
                        //     };
                        // }
                        // }
                        >
                        </Table>
                        
                    }
                    </div> 
                    <div className="testCases-passed">
                    <p style={{backgroundColor:'#b7eb8f',fontWeight:'bold',color:'black',fontSize:'15px'}}>通过的测试用例</p>
                    {passedReportTestCaseInfo &&
                        <Table
                            rowKey={reportInfo => reportInfo.id}
                            columns={this.columns}
                            dataSource={passedReportTestCaseInfo}
                            expandedRowRender={record => {
                                return (
                                    <div>
                                        <p>{record.logs}</p>
                                        <p>{record.exceptions}</p>
                                    </div>
                                );

                            }
                            }
                        >
                        </Table>
                    }
                    </div>
                    <div className="testCases-skipped">
                    <p style={{backgroundColor:'#ffd591',fontWeight:'bold',color:'black',fontSize:'15px'}}>跳过的测试用例</p>
                    {skippedReportTestCaseInfo &&
                        <Table
                            rowKey={reportInfo => reportInfo.id}
                            columns={this.columns}
                            dataSource={skippedReportTestCaseInfo}
                            expandedRowRender={record => {
                                return (
                                    <div>
                                        <p>{record.logs}</p>
                                        <p>{record.exceptions}</p>
                                    </div>
                                );

                            }
                            }
                        >

                        </Table>
                    }
                    </div>
                    
                </div>
            </div>

        );
    }
}

export default ReportTestCaseInfo;