import React, { Component } from 'react';
import { Modal } from 'antd';
import DatabaseForm from './DatabaseForm';

class DatabaseModal extends Component{
    requestHeaders = {  //发送请求的头部信息
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      };

    constructor(props){
        super(props);
    }

    saveFormRef = form =>{
        this.form = form
    }

    //点击modal确定按钮，提交事件
    handleSubmit = e =>{
        const {submitUrl,dbConfigInfo,productId} = this.props;
        e.preventDefault();
            this.form.validateFields((err, values) => {
              if (!err) {
                  if(submitUrl.indexOf('update')!=-1){
                      values.id = dbConfigInfo.id;
                      values.moduleId = productId;
                      this.updateUrl(submitUrl,values);
                  }else{
                        values.moduleId = productId;
                        this.postData(submitUrl,values);
                  }  
              }
            });
    }

    //提交数据到后台                             
    postData(url, data) {
        const {setVisible,getDBConfigs,productId,searchInput} = this.props;
        const pageNum = 0;
        const searchKey = '';
        const requestInfo =  {
            body: JSON.stringify(data), 
            headers:this.requestHeaders,
            method: 'POST', 
            mode: 'cors',
          };
        return fetch(url,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => setVisible(false))
            .then(() => searchInput.input.state.value = '')
            .then(() =>getDBConfigs(pageNum,productId,searchKey))
            .catch(error => console.error(error)) 
      }

   
    //更新Url数据
    updateUrl(url,data){
        const {setVisible,getDBConfigs,productId,searchInput} = this.props;
        const pageNum = 0;
        const searchKey = '';
        const requestInfo = {
            body: JSON.stringify(data), 
            headers:this.requestHeaders,
            method: 'PUT', 
            mode: 'cors', 
          };
        fetch(url,requestInfo)
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => setVisible(false))
            .then(() => searchInput.input.state.value = '')
            .then(() => getDBConfigs(pageNum,productId,searchKey))
            .catch(error => console.error(error))
    }
 
    render(){
        const {title,visible,setVisible,dbConfigInfo} = this.props;
        return(
            <Modal
                title = {title}
                visible = {visible}
                onCancel = {() =>setVisible(false)}
                onOk = {this.handleSubmit}
            >
                <DatabaseForm
                    wrappedComponentRef={this.saveFormRef}
                    dbConfigInfo = {dbConfigInfo}
                />
            </Modal>
            
        );
    }
}

export default DatabaseModal;