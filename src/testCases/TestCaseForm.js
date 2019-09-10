import {end_url} from '../common/Config';
import React, { Component } from 'react';
import ActionsModal from './ActionsModal';
import CheckPointsTable from './CheckPointsTable';
import {
    Form, Input, Button, Radio, InputNumber, Select, Checkbox, Modal, Table, Row, Col
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;
const Option = Select.Option;


class TestCaseForm extends Component {

    getAllProductsUrl = end_url+'/api/modules/querySiblingSubmodules/0';
    getAllModulesUrl = end_url+'/api/modules/queryFormattedModules/';
    getAllTestEnvsUrl = end_url+'/api/url/query/all/';
    getAllActionsUrl = end_url+'/api/actions/query/actionWrappers/?pageNum=';

    requestHeaders =  {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

   

    selectedPostActionNames = [];

    actionColumns = [ //前置动作数据
        { title: '前置/后置动作名称', dataIndex: 'name' },
    ];


    constructor(props) {
        super(props);

        this.state = {
            current: 'testcases',
            products: [],         //产品数据
            productId:this.props.productId,       //产品id
            modules: [],          //模块数据
            moduleId:this.props.moduleId,        //模块id
            testEnv:[],           //测试环境地址
            actions: [],          //前后置动作数据
            actionPagination: {}, //前后置动作分页数据
            preActionVisible: false,
            postActionVisible: false,
            selectedPreRowKeys:this.props.testCase ? this.props.testCase.preActionNames : [],
            selectedPostRowKeys:this.props.testCase ? this.props.testCase.postActionNames : [],
            selectedPreActionNames: [],
            selectedPostActionNames: [],
        }
    };

    setCurrent = current =>{
        this.setState({current,});
    }

    setProducts = products =>{
        this.setState({products,});
    }

    setProductId = productId =>{
        this.setState({productId,});
    }

    setModules = modules =>{
        this.setState({modules,});
    }

    setModuleId = moduleId =>{
        this.setState({moduleId,});
    }

    setTestEnv = testEnv =>{
        this.setState({testEnv,});
    }

    setActions = actions =>{
        this.setState({actions,});
    }

    setActionPagination = actionPagination =>{
        this.setState({actionPagination,});
    }

    setPreActionVisible = preActionVisible =>{
        this.setState({preActionVisible,});
    }

    setPostActionVisible = postActionVisible =>{
        this.setState({postActionVisible});
    }


    setSelectedPreRowKeys = selectedPreRowKeys =>{
        this.setState({selectedPreRowKeys,});
    }


    setSelectedPostRowKeys = selectedPostRowKeys =>{
        this.setState({selectedPostRowKeys,});
    }

  

    componentDidMount() {
        console.log(this.props);
        const currentActionPageNum = 0;
        const {productId} = this.props; 
        this.fetchProduts();
        this.fetchModules(productId);
        this.fetchTestEnv();
        this.fetchActions(currentActionPageNum);
    };


    //获取产品数据
    fetchProduts = () => {
       
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET', 
            mode: 'cors', 
        };
        fetch(this.getAllProductsUrl, requestInfo)
            .then(response => response.json())
            .then(result => this.setProducts(result.data))
            .catch(e => e);
    }

    //获取模块数据
    fetchModules = (productId) => {
        
        const requestInfo = {
            headers:this.requestHeaders,
            method: 'GET', 
            mode: 'cors', 
        };
        fetch(this.getAllModulesUrl+productId, requestInfo)
            .then(response => response.json())
            .then(result => this.setModules(result.data))
            .catch(e => e);

    }

    //获取所有测试环境地址数据
    fetchTestEnv = () =>{
        const requestInfo = {
            headers:this.requestHeaders,
            method: 'GET', 
            mode: 'cors', 
        };
        fetch(this.getAllTestEnvsUrl, requestInfo)
            .then(response => response.json())
            .then(result => this.setTestEnv(result.data))
            .catch(e => e);
    }

    //获取前后置动作
    fetchActions = (pageNum) => {
        const productId = this.props.productId;
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET', 
            mode: 'cors', 
        };
        fetch(this.getAllActionsUrl + pageNum + '&pageSize=10&moduleId='+productId+'&searchKey=', requestInfo)
            .then(response => response.json())
            .then(result => {
                const actionPagination = { ...this.state.actionPagination };
                actionPagination.total = result.data.total;
                actionPagination.current = result.data.pageNum;
                this.setActions(result.data.list);
                this.setActionPagination(actionPagination);
            })
            .catch(e => e);
    }

    //选择下拉框中的产品
    onSelectProductChange = value =>{
        this.props.form.setFieldsValue({moduleId:''});//当重新选择产品时，设置模块select值为空
        this.setProductId(value);    //更新moduleId
        this.fetchModules(value);    //根据选择的productId，重新获取该产品下的模块
        
    }

    //选中某块下拉框中的内容，触发事件
    onSelectModuleChange = value =>{
        this.setModuleId(value);
    }

    //展示前置按钮多选框
    showPreActions = () => {
        this.setPreActionVisible(true);
    }

    //展示后置按钮多选框
    showPostActions = () => {
        this.setPostActionVisible(true);
    }

    //前后置动作列表翻页
    handleActionTableChange = (pagination) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setActionPagination(pager);
        this.fetchActions(pager.current);
    };

    onAddCheckPointButton = () =>{
        this.setCheckPointVisible(true);
    }

    //保存检查点列表
    saveTableRef = table =>{
        this.table = table;
    }

    //删除检查点
    deleteCheckPoint = key =>{
        console.log(key);
        const checkPoints = [...this.state.checkPoints];
        this.setState({checkPoints:checkPoints.filter(item => item.key !== key)});
    }

    //提交表单
    handleSubmit = (e,values) =>{
        const {submitUrl,testCase} = this.props;
        const tableData = this.table.state.data;
        let checkResult = tableData.map(o=>{
            let checkType = "";
            switch(o.types){
                case "StrCheckPoint":
                    checkType = "strCheckPointType";
                    break;
                case "ListCheckPoint":
                    checkType = "listCheckPointType";
                    break;
                case "NumCheckPoint":
                    checkType = "numCheckPointType";
                    break;
            }
            return{key:o.id,type:o.types,[checkType]:o.checkPointType,checkKey:o.checkKey,expected:o.expected}
        });
        console.log(checkResult);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log("values的值");
            console.log(values);
            if (!err) {
                
                values.checkPoints = checkResult;
                values.preActionNames = this.state.selectedPreRowKeys;
                values.postActionNames = this.state.selectedPostRowKeys;
                if(submitUrl.indexOf('update')!=-1){
                    values.id = testCase.id;
                    // console.log(values);
                    this.updateData(submitUrl,values);
                }else{ 
                    this.postData(submitUrl,values);
                }  
            }
           
        })
    }

    //像后台提交创建测试用例请求数据
    postData = (url,data) =>{
        // const {setVisible,fetchUrls} = this.props;
        console.log(data);
        const requestInfo =  {
            body: JSON.stringify(data), 
            headers:this.requestHeaders,
            method: 'POST', 
            mode: 'cors',
          };
        return fetch(url,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.linkToTestCase())
            .catch(error => console.error(error)) 
            
    }

    //像后台提交更新测试用例请求数据
    updateData = (url,data) =>{
        // const {setVisible,fetchUrls} = this.props;
        const requestInfo =  {
            body: JSON.stringify(data), 
            headers:this.requestHeaders,
            method: 'PUT', 
            mode: 'cors',
          };
        return fetch(url,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => this.linkToTestCase())
            .catch(error => console.error(error)) 
    }

    linkToTestCase = () =>{
        this.props.history.push('/testcases');
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { products, modules, productId,moduleId,testEnv,actions, actionPagination,selectedPreRowKeys,selectedPostRowKeys,preActionVisible,postActionVisible } = this.state;
        const {testCase} = this.props;
       
        let testName = null;
        let descs = null;
        let method = null;
        let baseUrlId = null;
        let url = null;
        let headers = null;
        let parameters = null;
        let preActionNames = null;
        let postActionNames = null;
        let checkPoints = null;
        if(testCase){
            testName = testCase.testName;
            descs = testCase.descs;
            method = testCase.method;
            baseUrlId = testCase.baseUrlId;
            url = testCase.url;
            headers = testCase.headers;
            parameters = testCase.parameters;
            preActionNames = testCase.preActionNames;
            postActionNames = testCase.postActionNames;
            checkPoints = testCase.checkPoints;
        }else{
            testName = null;
            descs = null;
            method = null;
            baseUrlId = null;
            url = null;
            headers = null;
            parameters = null;
            preActionNames = null;
            postActionNames = null;
            checkPoints = null;
        }
        const formItemLayout = {
            labelCol: {
                sm: { span: 4, offset: 2 },
            },
            wrapperCol: {
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            labelCol: {
                sm: { span: 4, offset: 2 },
            },
            wrapperCol: {
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <Form {...formItemLayout}  onSubmit={this.handleSubmit} className="action-form">
                    <Form.Item label="所属产品">
                    
                            {getFieldDecorator('suite',
                                {
                                    rules: [{ required: true, message: '请选择产品' }],
                                    initialValue :productId + "",
                                })(
                                    <Select onChange = {this.onSelectProductChange}>
                                        {
                                            products.map(item => (
                                                <Option key={item.id}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>
                                    
                                )
                                    }
                    </Form.Item>
                    <Form.Item label="所属模块">
                        {
                            getFieldDecorator('moduleId',
                                {
                                    rules: [{ required: true, message: '请选择所属模块' }],
                                    initialValue:moduleId + "",
                                })(
                                    <Select onChange = {this.onSelectModuleChange}>
                                        {
                                            modules.map(item => (
                                                <Option key={item.id}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>
                                )
                        }
                    </Form.Item>
                    <Form.Item label="测试环境">
                        {   testEnv.length > 0 &&
                            getFieldDecorator('baseUrlId',
                                {
                                    rules: [{ required: true, message: '请输入测试环境' }],
                                    // initialValue:baseUrlId ? testEnv.filter(item => item.id === baseUrlId)[0].descs : baseUrlId,
                                    initialValue:baseUrlId + "",
                                })(
                                    <Select>
                                        {
                                            testEnv.map(item =>(
                                                <Option key={item.id}>{item.descs}</Option>
                                            ))
                                        }
                                    </Select>
                                )
                                    }
                    </Form.Item>
                    <Form.Item label="用例名称">
                        {
                            getFieldDecorator('testName',
                                {
                                    rules: [{ required: true, message: '请输入用例名称' }],
                                    initialValue:testName,
                                })(
                                    <Input placeholder="请输入用例名称" />
                                )
                        }
                    </Form.Item>    
                    <Form.Item label='用例描述'>
                        {
                            getFieldDecorator('descs',
                            {
                                initialValue:descs,
                            })(
                                <TextArea placeholder="请输入用例描述" />
                            )
                        }
                    </Form.Item>               
                    <Form.Item label="请求方式">
                        {
                            getFieldDecorator('method',
                                {
                                    rules: [{ required: true, message: '请选择请求方式' }],
                                    initialValue:method,
                                })(
                                    <Select>
                                        <Option value='POST'>POST</Option>
                                        <Option value='GET'>GET</Option>
                                        <Option value='DELETE'>DELETE</Option>
                                        <Option value='PUT'>PUT</Option>
                                    </Select>
                                )
                        }
                    </Form.Item>
                    <Form.Item label="请求URL">
                        {
                            getFieldDecorator('url',
                                {
                                    rules: [{ required: true, message: '请输入请求的url' }],
                                    initialValue:url,
                                })(
                                    <Input placeholder="请输入请求的url" />
                                )
                        }
                    </Form.Item>
                    <Form.Item label="请求头部信息">
                        {
                            getFieldDecorator('headers',
                                {
                                    rules: [{ required: true, message: '请输入请求头信息' }],
                                    initialValue:headers,
                                })(
                                    <Input placeholder="请输入请求头信息" />
                                )
                        }
                    </Form.Item>
                    <Form.Item label="请求参数">
                        {
                            getFieldDecorator('parameters',{
                                initialValue:parameters,
                            }
                            )(
                                <Input placeholder="请输入请求参数" />
                            )
                        }
                    </Form.Item>   
                    <Form.Item label="前置动作">
                        {
                            getFieldDecorator('preActionNames',{
                                initialValue:preActionNames,
                            }
                            )(
                                <div>
                                    <Button onClick={this.showPreActions}>新增前置动作</Button>
                                    <ActionsModal
                                        title = "前后置动作列表"
                                        visible = {preActionVisible}
                                        setVisible = {this.setPreActionVisible}  
                                        columns = {this.actionColumns}
                                        dataSource = {actions}
                                        pagination = {actionPagination}
                                        onChange = {this.handleActionTableChange}
                                        setSelectedRowKeys = {this.setSelectedPreRowKeys}
                                        setActionPagination = {this.setActionPagination}
                                        selectedActionNames = {preActionNames}
                                    > 
                                    </ActionsModal>
                                </div>
                            )
                        }
                    </Form.Item>
                    
                    <Form.Item label="后置动作">
                        {
                            getFieldDecorator('postActionNames',{
                                initialValue:postActionNames,
                            }
                            )(
                                <div>
                                    <Button onClick={this.showPostActions}>新增后置动作</Button>
                                    <ActionsModal
                                        title = "前后置动作列表"
                                        visible = {postActionVisible}
                                        setVisible = {this.setPostActionVisible}  
                                        columns = {this.actionColumns}
                                        dataSource = {actions}
                                        pagination = {actionPagination}
                                        onChange = {this.handleActionTableChange}
                                        setSelectedRowKeys = {this.setSelectedPostRowKeys}
                                        setActionPagination = {this.setActionPagination}
                                        selectedActionNames = {postActionNames}
                                    > 
                                    </ActionsModal>
                                </div>
                            )
                        }
                    </Form.Item>
                   
                    <Form.Item label="测试用例检查点">
                        {
                            getFieldDecorator('checkPoints',
                                {
                                    rules: [{ required: false, message: '请输入测试用例检查点' }],
                                    initialValue:checkPoints,
                                })(
                                    <div>
                                        <CheckPointsTable
                                            ref = {this.saveTableRef}
                                            // setCheckPoints = {this.setCheckPoints}
                                            checkPoints = {checkPoints}
                                        />
                                       
                                    </div>
                                    
                                )
                        }
                    </Form.Item>
                    
                    <Form.Item {...tailFormItemLayout}>
                        <Row>
                            <Col span={2}>
                        <Button type="primary" className="cancel-form-button" onClick={this.linkToTestCase}>
                            取消
                    </Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" htmlType="submit" className="action-form-button">
                            提交
                    </Button>
                    </Col>
                    </Row>
                    </Form.Item>


                </Form>

            </div>
        );
    }
}
const WrappedTestCaseForm = Form.create({ name: 'actions' })(TestCaseForm);
export default withRouter(WrappedTestCaseForm);