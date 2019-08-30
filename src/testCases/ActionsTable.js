import React, { Component } from 'react';
import { Table } from 'antd';

class ActionsTable extends Component{
   
    selectedActionNames = []; //临时作为被选中的动作名字

    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys:this.props.selectedActionNames ? this.props.selectedActionNames.map(item => parseInt(item)) : [],
            selectedActionNames:[],
        }
    }

    setSelectedRowKeys = selectedRowKeys =>{
        this.setState({selectedRowKeys,});
    }

    setSelectedActionNames = selectedActionNames =>{
        this.setState({selectedActionNames,});
    }




    render(){
        const {
            columns,
            dataSource,
            pagination,
            onChange,
        } = this.props;
        const actionRowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedRowKeys) => {
                this.setSelectedRowKeys(selectedRowKeys);
            },
        };
       
        return(
            
            <Table
                rowKey = {item => item.id}
                columns = {columns}
                dataSource = {dataSource}
                pagination = {pagination}
                onChange = {onChange}
                rowSelection = {actionRowSelection}
            >
            </Table>
        );
    }
}

export default ActionsTable;