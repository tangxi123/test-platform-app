import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import '../common/style.css';
import BatchAddTestCaseForm from './BatchAddTestCaseForm';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

class BatchAddTestCase extends Component{

    submitUrl = end_url + '/api/testcases/create';
    constructor(props){
        super(props);
        this.state = {
            current: 'testcases',
        }
    }

    handleClick = (e)=>{
        this.setState({
            current: e.key,
        });
    }

    render() {
        const {moduleId,productId} = this.props.match.params;
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <div className="module segments-page">
                    <div className="container">
                <Content style={{ border:'1px solid rgb(192,192,192)',margin:'50px 100px',padding:'20px 20px' }}>
                   <BatchAddTestCaseForm
                        submitUrl = {this.submitUrl}
                        moduleId = {moduleId}
                        productId = {productId}
                   />
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

export default BatchAddTestCase;

