import React, { Component } from 'react';
import { Modal } from 'antd';
import ParameterForm from './ParameterForm';

class ParameterModal extends Component {
    // getAllDBConfigByModuleIdUrl = 'http://localhost:8081/dbConfig/query/all/moduleId/';

    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };

    constructor(props) {
        console.log("constructor---ParameterModal");
        super(props);
    }


    getAllDBConfig = moduleId => {
        const requestInfo = {
            headers: this.reuqestHeaders,
            method: 'GET',
            mode: 'cors',
        };
        fetch(this.getAllDBConfigByModuleIdUrl + moduleId, requestInfo)
            .then(response => response.json())
            .then(result => this.setDbConfigs(result.data))
            .catch(e => e);
    }

    saveFormRef = form => {
        this.form = form
    }

    //点击modal确定按钮，提交事件
    handleSubmit = e => {
        const { submitUrl, parameterInfo, productId } = this.props;
        e.preventDefault();
        this.form.validateFields((err, values) => {
            if (!err) {
                if (submitUrl.indexOf('update') != -1) {
                    values.id = parameterInfo.id;
                    values.moduleId = productId;
                    this.updateUrl(submitUrl, this.joinSendData(values));
                } else {
                    values.moduleId = productId;
                    this.postData(submitUrl, this.joinSendData(values));
                }
            }
        });
        this.component.setParamType('');
    }

    joinSendData = values => {
        let paramValues = {};//子类型拼接的数据
        let resultData = {};//最终提交的数据
        let type;//子类型的类型
        if (values.radioGroup === "SQL") {
            type = "ParameterSql"
        }
        switch (values.radioGroup) {
            case 'SQL':
                type = "ParameterSql";
                paramValues = {
                    type: type,
                    dbConfigId: values.dbConfigId,
                    sql: values.sql,
                    param: values.param,
                };
                break;
            case 'TOKEN':
                type = "ParameterToken";
                paramValues = {
                    type: type,
                    url: values.url,
                    userData: values.userData,
                };
                break;
            case 'KEYVALUE':
                console.log(values);
                type = 'ParameterKeyValue';
                paramValues = {
                    type: type,
                    key: values.key,
                    value: values.value,
                };
        }
        resultData = values.id ?
            {
                id:values.id,
                name: values.name,
                descs: values.descs,
                type: values.radioGroup,
                moduleId: values.moduleId,
                parameter: paramValues,
            } : {
                name: values.name,
                descs: values.descs,
                type: values.radioGroup,
                moduleId: values.moduleId,
                parameter: paramValues,
            }
        return resultData;
    }

    //提交数据到后台                             
    postData(url, data) {
        const { setVisible, fetchParams, productId, searchInput } = this.props;
        const pageNum = 0;
        const searchKey = '';
        const requestInfo = {
            body: JSON.stringify(data),
            headers: this.requestHeaders,
            method: 'POST',
            mode: 'cors',
        };
        return fetch(url, requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => setVisible(false))
            .then(() => searchInput.input.state.value = '')
            .then(() => fetchParams(pageNum, productId, searchKey))
            .catch(error => console.error(error))
    }


    //更新Url数据
    updateUrl(url, data) {
        const { setVisible, fetchParams, productId, searchInput } = this.props;
        const pageNum = 0;
        const searchKey = '';
        const requestInfo = {
            body: JSON.stringify(data),
            headers: this.requestHeaders,
            method: 'PUT',
            mode: 'cors',
        };
        fetch(url, requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => setVisible(false))
            .then(() => searchInput.input.state.value = '')
            .then(() => fetchParams(pageNum, productId, searchKey))
            .catch(error => console.error(error))
    }


    getComponentInstance = component => {
        this.component = component;
    }


    render() {
        const { title, visible, setVisible, parameterInfo, setParameterInfo, productId } = this.props;
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={() => { setVisible(false); this.component.setParamType('') }}
                onOk={this.handleSubmit}
            >
                <ParameterForm
                    getInstance={this.getComponentInstance}
                    wrappedComponentRef={this.saveFormRef}
                    paramData={parameterInfo}
                    productId={productId}
                />
            </Modal>

        );
    }
}

export default ParameterModal;