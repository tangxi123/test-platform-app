import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export {EditableContext,EditableFormRow};