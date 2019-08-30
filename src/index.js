import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import BaseUrl from './base-url/BaseUrl';
import AddBaseUrl from './base-url/AddBaseUrl';
import EditBaseUrl from './base-url/EditBaseUrl';
import Module from './module/Module';
import ModuleMaintain from './module/ModuleMaintain';
import Actions from './prePostActions/Actions';
import AddAction from './prePostActions/AddAction';
import EditAction from './prePostActions/EditAction';
import Parameter from './parameters/Parameter';
import AddParameter from './parameters/AddParameter';
import EditParameter from './parameters/EditParameter';
import TestCase from './testCases/TestCase';
import AddTestCase from './testCases/AddTestCase';
import BatchAddTestCase from './testCases/BatchAddTestCase';
import EditTestCase from './testCases/EditTestCase';
import CopyTestCase from './testCases/CopyTestCase';
import TestcaseResult from './testCases/TestcaseResult';
import TestCaseLogInfo from './testCases/TestCaseLogInfo';
import Reports from './reports/Reports';
import ReadReport from './reports/ReadReport';
import BaseConfig from './baseConfig/BaseConfig';


import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Route path="/" exact render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={App}/>
        <Route path="/baseUrl" component={BaseUrl}/>
        <Route path="/addBaseUrl" component={AddBaseUrl}/>
        <Route path="/editBaseUrl/:id?" component={EditBaseUrl}/>
        <Route path="/module" component={Module}/>
        <Route path="/moduleMaintain/:productId" component={ModuleMaintain}/>
        <Route path="/actions" component={Actions}/>
        <Route path="/addAction" component={AddAction}/>
        <Route path="/editAction/:id" component={EditAction}/>
        <Route path="/parameters" component={Parameter}/>
        <Route path="/addParameter" component={AddParameter}/>
        <Route path="/editParameter/:id" component={EditParameter}/>
        <Route path="/testcases" component={TestCase}/>
        <Route path="/addTestcase/:productId/:moduleId" component={AddTestCase}/>
        <Route path="/batchAddTestcase/:productId/:moduleId" component={BatchAddTestCase}/>
        <Route path="/editTestcase/:productId/:moduleId/:testCaseId" component={EditTestCase}/>
        <Route path="/copyTestcase/:productId/:moduleId/:testCaseId" component={CopyTestCase}/>
        <Route path="/testcaseResult/:testCaseId" component={TestcaseResult}/>
        <Route path="/testCaseLogInfo/:logId" component={TestCaseLogInfo}/>
        <Route path="/reports" component={Reports}/>
        <Route path="/readReport/:reportId/:productId" component={ReadReport}/>
        <Route path="/baseConfig" component={BaseConfig}/>

    </BrowserRouter>, 
    document.getElementById('root')
);

serviceWorker.unregister();

if(module.hot){
    module.hot.accept();
}
