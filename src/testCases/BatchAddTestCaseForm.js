import React, { Component } from 'react';
import ActionsModal from './ActionsModal';
import BatchAddTestCaseTable from './BatchAddTestCaseTable';
import {
    Form, Input, Button, Radio, InputNumber, Select, Checkbox, Modal, Table, Row, Col
} from 'antd';

import {
    withRouter
} from 'react-router'
const { TextArea } = Input;
const Option = Select.Option;


class BatchAddTestCaseForm extends Component {

    getAllProductsUrl = 'http://localhost:8081/api/modules/querySiblingSubmodules/0';
    getAllModulesUrl = 'http://localhost:8081/api/modules/queryFormattedModules/';
    getAllTestEnvsUrl = 'http://localhost:8081/api/url/query/all/';
    getAllActionsUrl = 'http://localhost:8081/api/actions/query/actionWrappers/?pageNum=';
    submitUrl = 'http://localhost:8081/api/testcases/insertBatchTestCases';

    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };


    constructor(props) {
        super(props);

        this.state = {
            current: 'testcases',
            products: [],         //产品数据
            modules: [],          //模块数据
            testEnv: [],           //测试环境地址
        }
    };

    setCurrent = current => {
        this.setState({ current, });
    }

    setProducts = products => {
        this.setState({ products, });
    }

    setModules = modules => {
        this.setState({ modules, });
    }

    setTestEnv = testEnv => {
        this.setState({ testEnv, });
    }

    componentDidMount() {
        const { productId } = this.props;
        this.fetchProduts();
        this.fetchModules(productId);
        this.fetchTestEnv();
    }

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
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getAllModulesUrl + productId, requestInfo)
            .then(response => response.json())
            .then(result => this.setModules(result.data))
            .catch(e => e);

    }

    //获取所有测试环境地址数据
    fetchTestEnv = () => {
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getAllTestEnvsUrl, requestInfo)
            .then(response => response.json())
            .then(result => this.setTestEnv(result.data))
            .catch(e => e);
    }

    //提交表单
    //提交表单
    handleSubmit = (e,values) =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(this.table.state.data);
            values = this.table.state.data;
                if (!err) {
                    const requestInfo =  {
                        body: JSON.stringify(values), 
                        headers:this.requestHeaders,
                        method: 'POST', 
                        mode: 'cors',
                      };
                    return fetch(this.submitUrl,requestInfo)
                        .then(response => response.json())
                        .then(result => alert(result.message))
                        .then(() => this.linkToTestCase())
                        .catch(error => console.error(error)) 
                }
    
            })
        }

    //返回测试用例列表界面
    linkToTestCase = () =>{
        this.props.history.push('/testcases');
    }



    render() {
        const { products, modules, testEnv } = this.state;
        const { getFieldDecorator } = this.props.form;
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
                <Form onSubmit={this.handleSubmit} className="action-form">
                    <Form.Item>
                        {
                            products.length > 0 && modules.length > 0 && testEnv.length > 0 &&
                            getFieldDecorator('batchTestCases', { 
                                rules: [{ required: false, message: '请输入测试用例' }]
                            })(
                                <BatchAddTestCaseTable
                                    products={products}
                                    modules={modules}
                                    testEnvs={testEnv}
                                    ref = {table => this.table = table}
                                />)
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
const WrappedBatchAddTestCaseForm = Form.create({ name: 'actions' })(BatchAddTestCaseForm);
export default withRouter(WrappedBatchAddTestCaseForm);