import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import BaseUrlForm from './BaseUrlForm';
import { Layout, } from 'antd';
const {Content, Footer } = Layout;

class AddBaseUrl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: 'baseUrl',
        }

        this.handleClick = this.handleClick.bind(this);
        
    }

    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }


   

    render() {
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <Content style={{ border:'1px solid black',margin:'50px 100px',padding:'20px 20px' }}>
                   <BaseUrlForm/>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
            </Footer>
            </Layout>
        );
    }
}



export default AddBaseUrl;