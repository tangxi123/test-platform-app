import React, { Component } from 'react';
import './App.css';
import AppHeader from '../common/AppHeader';
import {
    Route,
    withRouter,
    Switch,
    Link,
} from 'react-router-dom';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            current:"index",
        };

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e){
        console.log(e);
        this.setState({current:e.key});
    }


    render() {
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick = {this.handleClick}
                    selectedKeys = {[this.state.current]}
                />
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Content</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                </Footer>
            </Layout> 

        );
    }
}

export default withRouter(App);