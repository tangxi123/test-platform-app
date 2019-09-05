import {end_url} from '../common/Config';
import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ModuleInputForm from './ModuleMaintainForm';
import {
    withRouter,
    Link,
} from 'react-router-dom';

import { Layout, Button, Table, Divider, Input, Row, Col, Tooltip, Icon, Tree, Modal } from 'antd';
import Sider from 'antd/lib/layout/Sider';
const { Content, Footer } = Layout;
const { TreeNode } = Tree;
const Search = Input.Search;

class ModuleMaintain extends Component {
    getProductUrl = end_url + "/api/modules/query/";
    getTreeUrl = end_url + '/api/modules/tree/';
    addModuleUrl = end_url + '/api/modules/create';
    editModuleUrl = end_url + '/api/modules/update';

    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      };

    constructor(props) {
        super(props);
        this.state = {
            current: 'module',
            productName: '',
            treeData: [],
            currentModuleId:'',
            addModalVisible: false,
            editModalVisible: false,
            moduleInfo:{},
        };
    }

    setProductName = productName => {
        this.setState({ productName, });
    }

    setTreeData = treeData => {
        this.setState({ treeData });
    }

    setCurrentModuleId = currentModuleId =>{
        this.setState({currentModuleId,});
    }

    setAddModalVisible = addModalVisible => {
        this.setState({ addModalVisible, });
    }

    setEditModalVisible = editModalVisible =>{
        this.setState({editModalVisible,});
    }

    setModuleInfo = moduleInfo => {
        this.setState({moduleInfo,});
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    //根据id获取产品名称
    getProductById = productId => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getProductUrl + productId, requestInfo)
            .then(response => response.json())
            .then(result => {
                // console.log(result.data.name);
                this.setProductName(result.data.name);
            })
            .catch(e => e);
    }

    //请求目录树
    fetchTree = (moduleId) => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getTreeUrl + moduleId, requestInfo)
            .then(response => response.json())
            .then(result => {
                this.setTreeData(result.data);
            })
            .catch(e => e);
    }

    //渲染树节点
    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                item.title = (
                    <div>
                        <span>{item.name}</span>
                        <Icon style={{ marginLeft: 10 }} type='edit' onClick={() => this.onEdit(item.id)} />
                        <Icon style={{ marginLeft: 10 }} type='delete' onClick={() => this.onDelete(item.id)} />
                        <Icon style={{ marginLeft: 10 }} type='plus' onClick={() => this.onAdd(item.id)} />
                    </div>
                );
                return (
                    <TreeNode title={item.title} key={item.id} dataRef={item}>

                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });

    saveFormRef = form => {
        this.form = form;
    };

    //点击目录树新增按钮，弹出新增弹出框
    onAdd = (moduleId) => {
        console.log(moduleId);
        this.setCurrentModuleId(moduleId);
        this.setAddModalVisible(true);
    }

    //编辑模块
    onEdit = (moduleId) =>{
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getProductUrl + moduleId, requestInfo)
            .then(response => response.json())
            .then(result => {this.setModuleInfo(result.data);})
            .catch(e => e);
        this.setEditModalVisible(true);
    }

    //新增弹出框确认操作
    handleAddOk = e => {
        const {currentModuleId} = this.state;
        e.preventDefault();
            this.form.validateFields((err, values) => {
              if (!err) {
                    values.parentId = currentModuleId;
                    this.postModuleData(this.addModuleUrl,values);
                  }  
              }
            );
    }

    //新增弹出框取消操作
    handleAddCancel = () => {
        this.setAddModalVisible(false);
    }

    //发起postModul请求
    postModuleData(url, data) {
        const {productId} = this.props.match.params;
        const requestInfo =  {
            body: JSON.stringify(data), 
            headers:this.requestHeaders,
            method: 'POST', 
            mode: 'cors',
          };
        return fetch(url,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.setAddModalVisible(false))
            .then(() =>this.fetchTree(productId))
            .catch(error => console.error(error)) 
      }
    
    //编辑弹出框确认操作
    handleEditOk = e => {
        const {moduleInfo} = this.state;
        e.preventDefault();
        this.form.validateFields((err, values) => {
            if (!err) {
                values.id = moduleInfo.id;
                this.putModuleData(this.editModuleUrl,values);
                }  
              }
            );
    }

    //更新模块数据
    putModuleData(url,data){
        const {productId} = this.props.match.params;
        const requestInfo = {
            body: JSON.stringify(data), 
            headers:this.requestHeaders,
            method: 'PUT', 
            mode: 'cors', 
          };
        fetch(url,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.setEditModalVisible(false))
            .then(() =>this.fetchTree(productId))
            .catch(error => console.error(error)) 
    }


    //编辑弹出框取消操作
    handleEditCancel = () => {
        this.setEditModalVisible(false);
    }


    componentDidMount() {
        const { productId } = this.props.match.params;
        this.getProductById(productId);
        this.fetchTree(productId);
    }

    render() {
        const { productId } = this.props.match.params;
        const { productName, treeData, addModalVisible, editModalVisible, moduleInfo} = this.state;
        console.log(treeData);
        const displayTree = treeData.length ? (<Tree onSelect={this.onSelectKey}>{this.renderTreeNodes(treeData)}</Tree>) : "";
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <div className="module segments-page" style={{ backgroundColor: '#e5e5e5' }}>
                    <div className="container" style={{ margin: '0 20px', backgroundColor: '#fff', border: '1px solid #e5e5e5', height: '1200px' }}>
                        <Content className="table-contents">
                            <div style={{ padding: '20px 50px 10px 50px' }}>
                                <div>
                                    <span>
                                        <Button>返回</Button>
                                        <Divider type="vertical" />
                                        <span>{productName}::<Button onClick={() => this.onAdd(productId)}>维护模块</Button></span>
                                    </span>

                                </div>
                                <Layout>
                                    { 
                                        treeData &&
                                        <Sider width={400} >
                                            <div className="tree" style={{ background: '#fff', border: '1px solid rgb(192,192,192)', height: '700px', overflow: 'auto' }}>
                                                {displayTree}
                                            </div>

                                        </Sider>
                                    }
                                        <Modal
                                            title="新增模块"
                                            visible={addModalVisible}
                                            onOk={this.handleAddOk}
                                            onCancel={this.handleAddCancel}
                                        >
                                            <ModuleInputForm
                                                wrappedComponentRef={this.saveFormRef}
                                            >
                                            </ModuleInputForm>
                                        </Modal>
                                        <Modal
                                            title="编辑模块"
                                            visible={editModalVisible}
                                            onOk={this.handleEditOk}
                                            onCancel={this.handleEditCancel}
                                        >
                                            <ModuleInputForm
                                                wrappedComponentRef={this.saveFormRef}
                                                moduleInfo = {moduleInfo}
                                            >
                                            </ModuleInputForm>
                                        </Modal>
                                    
                                </Layout>
                            </div>
                        </Content>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withRouter(ModuleMaintain);