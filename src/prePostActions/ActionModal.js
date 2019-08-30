import React, { Component } from 'react';
import { Modal } from 'antd';
import ActionForm from './ActionForm';

class ActionModal extends Component{
    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    };
    constructor(props){
        super(props);
    }

    getComponentInstance = component =>{
        this.component = component;
    } 

    saveFormRef = form => {
        this.form = form
    }

    saveFormComponent = item =>{
        this.item = item;
    }

    onCancelClick = () =>{
        const {setVisible} = this.props;
        setVisible(false);
        this.component.setActionType('');  //将actionForm的ActionType重置为''
    }

   //处理表单提交事件，当url包含update时，调用putEditData方法用于编辑，否则调用postCreateData方法用于提交
   handleSubmit = e => {
    const { submitUrl,actionInfo,productId } = this.props;
    e.preventDefault();
    let tableData = this.component.table.state.data;
    let resultData = tableData.map(item =>({id:item.id, sql:item.sql}));  //[{"id":1,"sql":"2222"},{"id":2,"sql":"3333"},{"id":3,"sql":"1111"}]
    this.form.validateFields((err, values) => {
        if (!err) {
            if (submitUrl.indexOf('update') != -1) {
                console.log(actionInfo);
                values.id = actionInfo.id;  //将id加入到编辑数据里
                values.moduleId = productId;
                values.sql = resultData //从sqlTable里获取到的值
                this.updateAction(submitUrl, this.joinSendData(values));
            } else {
                values.moduleId = productId;
                values.sql = resultData //从sqlTable里获取到的值
                this.postData(submitUrl, this.joinSendData(values));
            }

        }
    });
}

//提交时，最终将提交数据拼接为以下json格式
// 最终拼接为
// {
//     "name": "删除插入的新增前置动作数据112",
//     "descs": "在测试时插入的前置动作测试数据删除掉",
//     "actionType": "SQL",
//     "action": {
//         "type": "SqlPrePostAction",
//         "host": "localhost",
//         "port": "3308",
//         "database": "tplatform_pro",
//         "user": "root",
//         "password": "tx123456",
//         "sql": "DELETE FROM tplatform_pro.zsi_prepostaction WHERE name='删除插入的新增前置动作数据';"
//     }
// }
joinSendData = values => {
    let actionValues = {};//子类型拼接的数据
    let resultData = {};//最终提交的数据
    let actionType;//子类型的类型
    if (values['radio-group'] == "SQL") {
        actionType = "PrePostActionSql"
    }
    actionValues = {
        type:actionType,
        dbConfigId: values.dbConfigId,
        sql: values.sql,
    }
    resultData = values.id ? 
    {
        id : values.id,
        name: values.name,
        descs: values.descs,
        actionType: values['radio-group'],
        moduleId : values.moduleId,
        action: actionValues,
    } :{
        name: values.name,
        descs: values.descs,
        actionType: values['radio-group'],
        moduleId : values.moduleId,
        action: actionValues,
    }
    return resultData;
}

//提交数据到后台                             
postData(url, data) {
    console.log(data);
    const { setVisible, fetchActions, productId, searchInput } = this.props;
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
        .then(() => searchInput.input.state.value = '')  //将搜索框里的搜索关键字重置为空
        .then(() => fetchActions(pageNum, productId, searchKey))
        .catch(error => console.error(error))
}

   //更新Action数据
   updateAction(url, data) {
    const { setVisible, fetchActions, productId, searchInput } = this.props;
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
        .then(() => fetchActions(pageNum, productId, searchKey))
        .catch(error => console.error(error))
}



    render(){
        const {title,visible,productId,actionInfo} = this.props;
        return(
            <Modal
                title = {title}
                visible = {visible}
                onCancel = {this.onCancelClick}
                onOk = {this.handleSubmit}
            >
                <ActionForm
                    getInstance = {this.getComponentInstance}
                    wrappedComponentRef={this.saveFormRef}
                    productId = {productId}
                    actionData = {actionInfo}
                />
            </Modal>    
        );
    }
}

export default ActionModal;