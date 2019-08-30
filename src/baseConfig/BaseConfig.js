import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import BaseUrl from '../base-url/BaseUrl';
import Database from '../database/Database';
import Parameter from '../parameters/Parameter';
import Actions from '../prePostActions/Actions'

import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip, Icon, Menu, Breadcrumb, Select } from 'antd';
const { Content, Footer, Sider } = Layout;
const Search = Input.Search;
const SubMenu = Menu.SubMenu;
const { Option } = Select;

class BaseConfig extends Component {
    getProductsUrl = 'http://localhost:8081/modules/querySiblingSubmodules/0';
    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    constructor(props) {
        console.log("constructor----BaseConfig");
        super(props);
        this.state = {
            current: 'baseConfig',
            currentConfig: 'baseUrl',
            products:[],
            productId:null,
            loading:false,
        }
    }

    setCurrent = current => {
        this.setState({ current, });
    }

    setCurrentConfig = currentConfig => {
        this.setState({ currentConfig, });
    }

    setProducts = products =>{
        this.setState({products,});
    }

    setProductId = productId =>{
        this.setState({productId,});
    }

    setLoading = loading =>{
        this.setState({loading,});
    }

    componentWillMount(){
        console.log("componentWillMount-----BaseConfig");
    }
    componentDidMount() { 
        console.log("componentDidMount-----BaseConfig");
        this.fetchProducts();
        // this.fetchUrls();
    }

    componentWillUpdate(){
        console.log("componentWillUpdate-----BaseConfig");
    }

    componentDidUpdate(){
        console.log("componentDidUpdate-----BaseConfig");
    }

    //请求所有产品
    fetchProducts = () => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        // this.setLoading(true);
        fetch(this.getProductsUrl, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setProducts(result.data);
                this.setProductId(result.data[0].id);
            })
            .catch(e => e);

    }

    handleClick = e => {
        this.setCurrent(e.key);
    }

    handleSideClick = e => {
        this.setCurrentConfig(e.key);
    }

      //下拉框选择不同的产品
      changeProduct = value => {
        this.setProductId(value);
        this.component.input.input.state.value = '';
    }

    getComponentInstance = component =>{
        this.component = component;
    }

    render() {
        console.log("render-----BaseConfig");
        console.log(this.state);
        const { currentConfig,  products, productId} = this.state;
        const firstProduct = products[0] ? products[0].name : '';
        let displayConfig = '';
        switch(currentConfig){
            case 'baseUrl':
                    displayConfig = (<BaseUrl getInstance={this.getComponentInstance} productId = {productId}/>);
                break;
            case 'dbConfig':
                    displayConfig = (<Database getInstance={this.getComponentInstance} productId = {productId}/>);
                break;
            case 'parameter':
                    displayConfig = (<Parameter getInstance={this.getComponentInstance} productId = {productId}/>);
                break;
            case 'action':
                    displayConfig = (<Actions getInstance={this.getComponentInstance} productId = {productId}/>);
                break;
        }
        return (
            <Layout className="layout" >
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />

                <div className="module segments-page" style={{ backgroundColor: '#e5e5e5' }}>
                    <div className="container" style={{ margin: '0 20px',backgroundColor:'#fff',border:'1px solid #e5e5e5',height:'1200px' }}>
                        <div style={{backgroundColor:'#eef4fe',border:'1px solid #e5e5e5'}}> 
                          { firstProduct &&
                            <Select
                                showSearch
                                style={{ width: 200, padding: '10px 0 10px 20px'}}
                                defaultValue = {firstProduct}
                                onChange={this.changeProduct}
                            >
                                
                                {
                                    products &&
                                        products.map(item =>
                                            <Option key={item.id}>{item.name}</Option>
                                            )
                                }
                            </Select>
                            }
                        </div>
                        <Row>
                            <Col span={4}>
                                <Layout>
                                    <Sider width={200} style={{ padding: '10px 0 0 20px', }} >
                                        <Menu style = {{border:'1px solid #e5e5e5'}}
                                            defaultSelectedKeys={['baseUrl']}
                                            selectedKeys={[currentConfig]}
                                            onClick={this.handleSideClick}
                                            mode="inline"
                                        >
                                            <Menu.Item key="baseUrl">
                                                <Icon type="pie-chart" />
                                                <span>测试环境配置</span>
                                            </Menu.Item>
                                            <Menu.Item key="dbConfig">
                                                <Icon type="desktop" />
                                                <span>数据库配置</span>
                                            </Menu.Item>
                                            <Menu.Item key="parameter">
                                                <Icon type="inbox" />
                                                <span>参数化配置</span>
                                            </Menu.Item>
                                            <Menu.Item key="action">
                                                <Icon type="inbox" />
                                                <span>前后置动作配置</span>
                                            </Menu.Item>
                                        </Menu>
                                    </Sider>
                                </Layout>

                            </Col>
                            <Col span={20}>

                                <Layout>
                                    <Content style={{ padding: '10px 10px',borderBottom:'1px solid #e5e5e5'}}>
                                        {productId && displayConfig}
                                    </Content>
                                </Layout>

                            </Col>
                        </Row>
                    </div>

                </div>
            </Layout>
        );
    }
}

export default withRouter(BaseConfig);