import React, { Component } from 'react';
// import './style.css';
import {
    Route,
    withRouter,
    Switch,
    Link,
} from 'react-router-dom';

import { Layout, Menu, Breadcrumb, Icon, Row, Col } from 'antd';

const { Header, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AppHeader extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="navbar">
                <div className="container">
                    <div className="row">
                        <Row>
                            <Col className="col s9" span={10} offset={2}>
                                <div className="content-left">
                                    <h1>
                                        <span>ITest</span>
                                          自动化接口测试
                                    </h1>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Menu
                                    onClick={this.props.handleClick}
                                    selectedKeys={this.props.selectedKeys}
                                    mode="horizontal"
                                >
                                    <Menu.Item key="index">
                                        <Link to="/home">
                                            <Icon type="border-bottom" />
                                            <span>首页</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="module">
                                        <Link to="/module">
                                            <Icon type="border-horizontal" />
                                            <span>项目</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="testCases">
                                        <Link to="/testCases">
                                            <Icon type="border-top" />
                                            <span>测试用例</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="reports">
                                        <Link to="/reports">
                                            <Icon type="border-verticle" />
                                            <span>报告</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="baseConfig">
                                        <Link to="/baseConfig">
                                            <Icon type="border-verticle" />
                                            <span>配置</span>
                                        </Link>
                                    </Menu.Item>
                                </Menu>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppHeader;