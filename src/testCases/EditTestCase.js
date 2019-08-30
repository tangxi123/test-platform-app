import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import TestCaseForm from './TestCaseForm';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

class EditTestCase extends Component {
    submitUrl = 'http://localhost:8081/testcases/update';
    getTestCaseByIdUrl = 'http://localhost:8081/testcases/';
    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    constructor(props) {
        super(props);
        this.state = {
            current: 'testcases',
            testCase: null,
        }
    }

    setTestCase = testCase => {
        this.setState({ testCase, });
    }

    componentDidMount() {
        const { testCaseId } = this.props.match.params;
        console.log(`testCaseId is:${testCaseId}`);
        this.getTestCaseById(testCaseId);
    }

    getTestCaseById = testCaseId => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getTestCaseByIdUrl + testCaseId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setTestCase(result.data);
                // console.log(`testCase为:${JSON.stringify(result.data)}`);
            })
            .catch(e => e);
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        const { moduleId, productId } = this.props.match.params;
        const { testCase } = this.state;
        // console.log(`testCase为:${JSON.stringify(testCase)}`);
        // console.log(`moduleId is ${moduleId}, productId is ${productId}, testCaseId is ${testCaseId}`);
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <div className="module segments-page">
                    <div className="container">
                        { testCase &&
                        <Content style={{ border: '1px solid rgb(192,192,192)', margin: '50px 100px', padding: '20px 20px' }}>
                            <TestCaseForm
                                submitUrl={this.submitUrl}
                                moduleId={moduleId}
                                productId={productId}
                                testCase={testCase}
                            />
                        </Content>
                        }
                    </div>
                </div>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
            </Footer>
            </Layout>
        );
    }
}

export default EditTestCase;