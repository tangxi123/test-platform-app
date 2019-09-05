import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Layout } from 'antd';
const { Content, Footer } = Layout;
let stompClient = null;

class ExecuteTestcase extends Component {
    execTestCaseUrl = end_url + '/api/testcases/exectest/';
    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    constructor(props) {
        super(props);
        this.state = {
            current: 'testcases',
            logItems: [],
            testResult: {},
        };
    }

    setLogItems = logItems => {
        this.setState({ logItems, });
    }

    setTestResult = testResult => {
        this.setState({ testResult, });
    }

    componentDidMount() {
        // this.connection();
        this.execTestCase(this.execTestCaseUrl);
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    execTestCase = (url) => {
        console.log('开始执行测试用例');
        const { testCaseId } = this.props.match.params;
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        const requestUrl = url + testCaseId;
        console.log(requestUrl);
        fetch(requestUrl, requestInfo)
            .then(response => response.json())
            .then(result => this.setTestResult(result.data))
            .catch(e => e);
    }


    connection = () => {
        const messages = [];
        const { logItems } = this.state;
        const setItems = this.setLogItems;
        var socket = new SockJS('http://localhost:8081/gs-guide-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => connectCallBack(frame));

        function connectCallBack(frame) {

            stompClient.subscribe('/topic/greetings', function (response) {
                showGreeting(JSON.parse(response.body));
            });
        }

        function showGreeting(message) {
            messages.push(message);
            setItems(messages);
            if (message.body === '【测试执行完成】') {
                stompClient.disconnect(() => {
                    console.log("连接关闭，不再接收任何日志消息");
                });
            }
        }

    }

    render() {
        const { logItems } = this.state;
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
                                logItems && (
                                    logItems.map(item =>
                                        <div>
                                            <span>{item.timestamp}</span><span>{item.body}</span>
                                        </div>

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

export default ExecuteTestcase;