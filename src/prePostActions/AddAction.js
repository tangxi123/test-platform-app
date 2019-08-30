import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ActionForm from './ActionForm';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

class AddAction extends Component {

    submitUrl = 'http://localhost:8081/actions/create';
    constructor(props) {
        super(props);
        this.state = {
            current: 'actions',
        }
    }

    handleClick = (e) => {
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
                <div className="module segments-page">
                    <div className="container">
                        <Content style={{ border: '1px solid rgb(192,192,192)', margin: '50px 100px', padding: '20px 20px' }}>
                            <ActionForm
                                submitUrl={this.submitUrl}
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

export default AddAction;