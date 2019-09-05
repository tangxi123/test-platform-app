import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import ActionForm from './ActionForm';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

class EditAction extends Component {

    queryActionByIdUrl = 'http://localhost:8081/api/actions/query/';
    submitUrl = 'http://localhost:8081/api/actions/update';

    requestHeaders = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    constructor(props) {
        super(props);
        this.state = {
            current: 'actions',
            loading: false,
            actionData: null,
        }
    }

    setLoading = loading => {
        this.setState({ loading, });
    }

    setActionData = actionData => {
        this.setState({ actionData, });
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    componentDidMount() {
        this.fetchActionFormData();
    }

    fetchActionFormData = () => {
        const id = this.props.match.params.id;
        const requestInfo = {
            headers: this.requestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.queryActionByIdUrl + id, requestInfo)
            .then(response => response.json())
            .then(result => this.setActionData(result.data))
            .catch(e => e);
    }


    render() {
        const { actionData } = this.state;
        // console.log(this.state.actionData);
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
                            actionData={actionData}
                        />
                    </Content>
                    </div>
                </div>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2018 Created by Ant UED
            </Footer>
            </Layout >
        );
    }
}

export default EditAction;