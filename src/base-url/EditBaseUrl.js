import React, { Component } from 'react';
import AppHeader from '../common/AppHeader';
import BaseUrlForm from './BaseUrlForm';
import {
    Route,
    withRouter,
    Switch,
    Link,
} from 'react-router-dom';
import { Layout, Menu, Avatar, List, Icon, Button, Form, Input, Checkbox } from 'antd';
const { Header, Content, Footer } = Layout;

class EditBaseUrl extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        this.state = {
            current: 'baseUrl',
            url:null,
            descs:null,
        }

        this.handleClick = this.handleClick.bind(this);
        
    }

    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }

    renderUrlFormData = ()=>{
        const id = this.props.match.params.id;
        console.log(this.props.match.params.id);
        if(id==undefined){
            return false;
        }else{
            fetch('http://localhost:8081/url/query/'+id,{
            headers: {
              'user-agent': 'Mozilla/4.0 MDN Example',
              'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
          })
        .then(response => response.json())
        .then(result => this.setUrlAndRemarkData(result))
        .catch(e => e);
        }
       
    }

    setUrlAndRemarkData = (result) =>{
        console.log(result);
        const url = result.data.url;
        const descs = result.data.descs;
        this.setState({url,descs});
        console.log(this.state.url);
        console.log(this.state.descs);
        

    }

    componentDidMount(){
        this.renderUrlFormData();
    }

   

    render() {
        const {url,descs} = this.state;
        return (
            <Layout className="layout">
                <AppHeader
                    handleClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                />
                <Content style={{ border:'1px solid black',margin:'50px 100px',padding:'20px 20px' }}>
                   <BaseUrlForm
                        url={url}
                        descs={descs}
                   />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
            </Footer>
            </Layout>
        );
    }
}



export default EditBaseUrl;