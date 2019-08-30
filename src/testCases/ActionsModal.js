import React, { Component } from 'react';
import { Modal} from 'antd';
import ActionsTable from './ActionsTable';

class ActionsModal extends Component {
    constructor(props) {
        super(props);
       
    } 

    saveTableRef = table => {
        this.table = table;
    };

    submitActions = () => {
        const {setSelectedRowKeys,setVisible,pagination,setActionPagination} = this.props; 
        const {selectedRowKeys} = this.table.state;
        console.log(selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
        setVisible(false);
    }

    render() {
        const {
            title,
            visible,
            setVisible,
            columns,
            dataSource,
            selectedActionNames,
            pagination,
            onChange,
        } = this.props;


        return (
            <Modal
                title = {title}
                visible = {visible}
                onCancel = {() => setVisible(false)}
                onOk = {this.submitActions}
            >
                <ActionsTable
                    ref = {this.saveTableRef}
                    columns = {columns}
                    dataSource = {dataSource}
                    pagination = {pagination}
                    selectedActionNames = {selectedActionNames}
                    onChange = {onChange}
                >         
                </ActionsTable>
            </Modal>
        );
    }
}

export default ActionsModal;