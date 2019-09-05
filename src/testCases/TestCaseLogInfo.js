import {end_url} from '../common/Config';
import React, { Component } from 'react';
import {
    Link,
} from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import { Layout } from 'antd';
const { Content, Footer } = Layout;
let stompClient = null;

class TestcaseLogInfo extends Component {
    getTestCaseLogInfoUrl = end_url + '/api/logs/log/info/';
    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    constructor(props) {
        super(props);
        this.state = {
            current: 'testcases',
            logItems: [],
        };
    }

    setLogItems = logItems => {
        this.setState({ logItems, });
    }


    componentDidMount() {
        const { logId } = this.props.match.params;
        this. getTestCaseLogInfoById(logId);
        // this.execTestCase(this.execTestCaseUrl);
    }

    getTestCaseLogInfoById = id => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        const requestUrl = this.getTestCaseLogInfoUrl + id;
        fetch(requestUrl, requestInfo)
            .then(response => response.json())
            .then(result => this.setLogItems(result.data))
            .catch(e => e);
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    



    render() {
        const { logItems } = this.state;
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
                                            <div><span>{item}</span></div>

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

export default TestcaseLogInfo;