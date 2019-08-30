import React, { Component } from 'react';
import { Modal } from 'antd';
import ModuleForm from './ModuleForm';

class ModuleModal extends Component {
    constructor(props) {
        super(props);
    }

    saveFormRef = form => {
        this.form = form;
    }

    submit = () => {
        const {submitUrl,moduleId} = this.props;
        this.form.validateFields((err,values) => {
            if (!err) {
                if(submitUrl.indexOf('update')!=-1){
                    values.id = moduleId;
                    this.putEditData(submitUrl,values);
                }else{
                    this.postCreateData(submitUrl,values);
                }
               
              }
        });
    }

    postCreateData = (url,data) =>{
        const {setModuleModalVisible,setSubmitUrl,fetchModules} = this.props;
        fetch(url, {
            body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
              'user-agent': 'Mozilla/4.0 MDN Example',
              'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
          })
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => setModuleModalVisible(false))
            .then(() => setSubmitUrl('')) 
            .then(() => fetchModules())
            .catch(error => console.error(error))
    }

    putEditData = (url,data) =>{
        const {setModuleModalVisible,setSubmitUrl,fetchModules,setName,setDescs,setModuleId} = this.props;
        fetch(url, {
            body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
              'user-agent': 'Mozilla/4.0 MDN Example',
              'content-type': 'application/json'
            },
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
          })
            .then(response => response.json())
            .then(result => alert(result.message))
            .then(() => setModuleModalVisible(false))
            .then(() => setSubmitUrl('')) 
            .then(() => setName(''))
            .then(() => setDescs(''))
            .then(() => setModuleId(null))
            .then(() => fetchModules())
            .catch(error => console.error(error))
    } 

    

    render() {
        const { title,visible,setModuleModalVisible,name,descs } = this.props;
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel = {() => setModuleModalVisible(false)}
                onOk = {this.submit}
            >
                <ModuleForm 
                    wrappedComponentRef={this.saveFormRef}
                    name = {name}
                    descs = {descs}
                >
                </ModuleForm>
            </Modal>
        );
    };
}

export default ModuleModal;