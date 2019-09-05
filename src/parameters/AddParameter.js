import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ParameterForm from './ParameterForm';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

class AddParameter extends Component {

    submitUrl = 'http://localhost:8081/api/parameters/create';
    constructor(props) {
        super(props);
        this.state = {
            current: 'parameters',
            paramData:{},
        }
    }

    setParamData = paramData =>{
        this.setState({paramData,});
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    handleRadioChange = e => {
        const { paramData} = this.state;
        paramData.type =  e.target.value;
        this.setParamData(paramData)
    }

    render() {
        const { paramData} = this.state;
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
                        <Footer style={{ textAlign: 'center' }}>
                            Ant Design ©2018 Created by Ant UED
                        </Footer>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default AddParameter;