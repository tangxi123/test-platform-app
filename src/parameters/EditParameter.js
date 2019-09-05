import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ParameterForm from './ParameterForm';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

class EditParameter extends Component {

    queryParamByIdUrl = 'http://localhost:8081/api/parameters/query/';
    submitUrl = 'http://localhost:8081/api/parameters/update';

    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    constructor(props) {
        super(props);
        this.state = {
            current: 'parameters',
            loading: false,
            paramData: null,
        }
    }

    setLoading = loading => {
        this.setState({ loading, });
    }

    setParamData = paramData => {
        this.setState({ paramData, });
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    // 处理单选按钮事件，当单选按钮改变时，修改选中的值
    handleRadioChange = e => {
        const { paramData} = this.state;
        paramData.type =  e.target.value;
        this.setParamData(paramData)
    }

    componentDidMount() {
        this.fetchParamFormData();
    }

    fetchParamFormData = () => {
        const id = this.props.match.params.id;
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.queryParamByIdUrl + id, requestInfo)
            .then(response => response.json())
            .then(result => this.setParamData(result.data))
            .catch(e => e);
    }


    render() {
        const { paramData } = this.state;
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <div className="module segments-page">
                    <div className="container">
                        <Content style={{ border: '1px solid rgb(192,192,192)', margin: '50px 100px', padding: '20px 20px' }}>
                            <ParameterForm
                                submitUrl={this.submitUrl}
                                paramData={paramData}
                                handleRadioChange = {this.handleRadioChange}
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

export default EditParameter;