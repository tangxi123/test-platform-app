import {end_url} from '../common/Config';
import React, { Component } from 'react';
import {
    Link,
} from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Layout } from 'antd';
const { Content, Footer } = Layout;
let stompClient = null;

class TestcaseResult extends Component {
    getTestCaseResultUrl = end_url + '/api/logs/log/';
    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    constructor(props) {
        super(props);
        this.state = {
            current: 'testcases',
            testCaseResult:[],
            logItems: [],
        };
    }

    setLogItems = logItems => {
        this.setState({ logItems, });
    }

    setTestCaseResult = testCaseResult => {
        this.setState({testCaseResult,});
    }

    componentDidMount() {
        const { testCaseId } = this.props.match.params;
        this.getTestCaseResultById(testCaseId);
        // this.execTestCase(this.execTestCaseUrl);
    }

    getTestCaseResultById = id => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        const requestUrl = this.getTestCaseResultUrl + id;
        fetch(requestUrl, requestInfo)
            .then(response => response.json())
            .then(result => this.setTestCaseResult(result.data))
            .catch(e => e);
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    



    render() {
        const { testCaseResult } = this.state;
        //   console.log("展示的日志为：");
        //   console.log(logItems);
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <div className="module segments-page">
                    <div className="container">
                        <Content style={{ border: '1px solid black', margin: '50px 100px', padding: '20px 20px' }}>
                            {
                                testCaseResult && (
                                    testCaseResult.map(item =>
                                            <Link to={ '/testCaseLogInfo/' + item.id}> <div key={item.id}><span>{item.name}</span></div></Link>

                                    )
                                )
                            }

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

export default TestcaseResult;