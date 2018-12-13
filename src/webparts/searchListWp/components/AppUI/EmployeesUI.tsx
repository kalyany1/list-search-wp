import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse  } from '@microsoft/sp-http';
import * as jquery from 'jquery';
import { DayPickerStrings, CheckAndUpdateSPQuery,Get_dropdown_values,FixCurrencyField, CreateATag } from './CommonConsts';
import { ISPCCRListItems, ISPCCRListItem } from './ICommonInterfaces';
import styles from '../SearchListWp.module.scss';
import {ISearchListWpProps} from '../ISearchListWpProps';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, IDetailsList , buildColumns,
  DetailsListLayoutMode as LayoutMode, ConstrainMode, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import Paging from '../Paging/Paging';

export interface IList1GetState {
  employeesItems:[
      {
          "ccEmployee":string;
          "ccEmployeeType": string;
          "CCVintageYear":string;
          "ccSalary":string;          
      }
  ];
  employees: String[];
  employeeTypes:[
      {
          "ccEmployeeType": string;
      }
  ];
  employeeVintageYear:[{
      "CCVintageYear":string;
  }];
  vintageYears: String[];
  typesOfEmployees: String[];    
  optionsEmployees: IDropdownOption[];
  optionsTypes: IDropdownOption[];
  optionsYears: IDropdownOption[];  
  startDate?: Date | null;
  endDate?: Date | null;
  firstDayOfWeek?: DayOfWeek;  
  pageSize?: number;
  statusMessage?:string;
  lastItemId?:number;
  startItemId?:number;
  currentPage?: number;
  itemsCount?: number;
  items?: any[];
  columns?:IColumn[];
}

export default class EmployeesUI extends React.Component<ISearchListWpProps,IList1GetState > {  

    private selectedStartDate: React.ReactText; private selectedEndDate: React.ReactText;
    private selectedEmployee: React.ReactText; private selectedEmployeeType: React.ReactText;
    private selectedYear: React.ReactText; 
    
    //private selectedStatus: React.ReactText;
    //private selectedPayStatus: React.ReactText;
    private iSPQueryTop : number = 300;
    private sURL = `${this.props.spContext.pageContext.web.absoluteUrl}/Lists/Employees/DispForm.aspx?ID=`;

    private _columns: IColumn[] = [
        {
          key: 'column1',
          name: 'ID',
          fieldName: 'ID',
          minWidth: 80,
          maxWidth: 100,
          isResizable: true,
          ariaLabel: 'ID',
          onRender: (item: any) => {
            return (
              <span> 
                <a href={this.sURL + item.Id} target="_blank">{item.ID}</a>
              </span>
            );
          }    
        },
        {
          key: 'column2',
          name: 'Start Date',
          fieldName: 'ccStartDate',
          minWidth: 600,
          maxWidth: 100,
          isResizable: true,
          ariaLabel: 'Start Date',
        },
        {
          key: 'column3',
          name: 'Employee',
          fieldName: 'ccEmployee',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
          ariaLabel: 'Employee',
        },  
        {
          key: 'column4',
          name: 'Employee Type',
          fieldName: 'ccEmployeeType',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
          ariaLabel: 'Employee Type',    
        },
        {
          key: 'column5',
          name: 'Vintage Year',
          fieldName: 'CCVintageYear',
          minWidth: 60,
          maxWidth: 80,
          isResizable: true,
          ariaLabel: 'Vintage Year',
        },
        {
          key: 'column6',
          name: 'Net Salary',
          fieldName: 'ccSalary',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
          ariaLabel: 'Net Salary',
          onRender: (item: any) => {
            return (
              <span> ${FixCurrencyField(item.ccSalary)} </span>
            );
          }
        }
      ];
      
      constructor (props:ISearchListWpProps){
        super(props);
        this.state={                      
          employeesItems:[
                {
                    "ccEmployee":"",
                    "ccEmployeeType": "",
                    "CCVintageYear":"",
                    "ccSalary": "",                    
                }
            ],
            employees:[],
            employeeTypes:[
                {
                    "ccEmployeeType": ""
                }
            ],
            employeeVintageYear:[{
                "CCVintageYear":""
            }],
            vintageYears: [],
            typesOfEmployees: [],            
            optionsEmployees: undefined,
            optionsTypes: undefined,
            optionsYears: undefined,            
            pageSize:20,
            statusMessage: undefined,
            lastItemId:0,
            startItemId:1,
            itemsCount:0,
            currentPage:1,
            items:[],
            columns: this._columns,
        };
        this._onPageUpdate = this._onPageUpdate.bind(this);
      }

      public componentDidMount(){  
        let reactHandler=this;
        jquery.ajax({          
          url:`${this.props.siteUrl}/_api/web/lists/getbytitle('Employees')/items` +
          //url:`${this.props.siteUrl}/_api/web/lists/getbytitle('Employees')/items` +
          `?$select=Title,Id,ccEmployee,ccEmployeeType,CCVintageYear,ccSalary&$top=500`,
          type: "GET",
          headers: {'Accept' :'application/json; odata=verbose;'},
          success: (resultData) => {     
            
            let iCount = 0;
            let allEmployees: Array<String> = new Array<String>();
            let allYears: Array<String> = new Array<String>();
            let allTypesOfEmployees: Array<String> = new Array<String>();
            
            resultData.d.results.forEach((item: IList1GetState) => {
              if(allEmployees.indexOf(resultData.d.results[iCount].ccEmployee) < 0){
                allEmployees.push(resultData.d.results[iCount].ccEmployee);
              }
              if(allTypesOfEmployees.indexOf(resultData.d.results[iCount].ccEmployeeType) < 0){
                allTypesOfEmployees.push(resultData.d.results[iCount].ccEmployeeType);
              }
              if(allYears.indexOf(resultData.d.results[iCount].CCVintageYear) < 0){
                allYears.push(resultData.d.results[iCount].CCVintageYear);            
              }
              iCount++;
            });      
            //allEmployees = allEmployees.filter((el, i, a) => i === a.indexOf(el)).sort();                  
            allEmployees.sort(); allTypesOfEmployees.sort();       
            allYears.sort( (a: any, b:any) => { return (b - a); });
            
            allEmployees.push('Select Employee');allTypesOfEmployees.push('Select Employee Type');
            allYears.push('Select a Year');            
      
            reactHandler.setState({
                employees: allEmployees,                
                vintageYears:allYears,
                typesOfEmployees: allTypesOfEmployees,
                
                optionsEmployees: allEmployees.map( (p) => ({key: p.toString(), text: p.toString()} as IDropdownOption)),
                optionsTypes: allTypesOfEmployees.map( (p) => ({key: p.toString(), text: p.toString()} as IDropdownOption)),
                optionsYears: allYears.map( (p) => ({key: p.toString(), text: p.toString()} as IDropdownOption)),                
            });
          },
          error: (jqXHR, textStatus, errorThrown) => {
          }
        });
      }

      private _onPageUpdate(pageNumber: number) {
        console.log('----INSIDE onPageUpdate----');
      
        this.setState({
          currentPage: pageNumber,
          startItemId: ((pageNumber - 1) * this.state.pageSize) + 1,
          lastItemId: (this.state.lastItemId > 0) ? ( this.state.itemsCount < (pageNumber * this.state.pageSize) ? 
                       this.state.itemsCount: (pageNumber * this.state.pageSize) ) : 
                      (this.state.itemsCount > this.state.pageSize ? this.state.pageSize : this.state.itemsCount),    
        });
        
        this._onSearch_Emp();
      }
      private readItems(url: string) {
        this.setState({
          statusMessage: undefined,
          items: []
        });
        
        this.props.spContext.spHttpClient.get(url,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        }).then((response: SPHttpClientResponse): Promise<{value: any[]}> =>{
          return response.json();
        }).then((response: {value: any[]}): void => {     
          
          this.setState({      
            items: response.value,
            itemsCount: response.value.length,            
            statusMessage: `Showing items ${(this.state.startItemId)} - ${(this.state.lastItemId)} of ${response.value.length}`
          });      
        }, (error: any): void => {
          this.setState({      
            statusMessage: 'Loading all items failed with error: ' + error
          });
        });
        
      }

      private _get_Emp_ListData(): Promise<ISPCCRListItems> {  

        let _sSPQuery:string = '';
        if(this.selectedStartDate){
          _sSPQuery = CheckAndUpdateSPQuery('ccStartDate',this.selectedStartDate.toString(),'ge',_sSPQuery);
        }
        if(this.selectedEndDate){
          _sSPQuery = CheckAndUpdateSPQuery('ccStartDate',this.selectedEndDate.toString(),'le',_sSPQuery);
        }
        if(this.selectedEmployee){
          if(this.selectedEmployee.toString() != Get_dropdown_values(0)){
            _sSPQuery = CheckAndUpdateSPQuery('ccEmployee',this.selectedEmployee.toString(),'eq',_sSPQuery);
          }
        }
        if(this.selectedEmployeeType){      
          if(this.selectedEmployeeType.toString() != Get_dropdown_values(1)){
            _sSPQuery = CheckAndUpdateSPQuery('ccEmployeeType',this.selectedEmployeeType.toString(),'eq',_sSPQuery);
          }
        }
        if(this.selectedYear){
          if(this.selectedYear.toString() != Get_dropdown_values(2)){
            _sSPQuery = CheckAndUpdateSPQuery('CCVintageYear',this.selectedYear.toString(),'eq',_sSPQuery);
          }      
        }  
              
        _sSPQuery = _sSPQuery ? `(` + _sSPQuery + `)&$top=${this.iSPQueryTop}&$orderby=Created desc` : '';
        
        this.readItems(this.props.spContext.pageContext.web.absoluteUrl +   
          `/_api/web/lists/getbytitle('Employees')/items?$select=Id,ccEmployee,ccEmployeeType,CCVintageYear,ccSalary` +
          `&$filter=` + _sSPQuery);
      
        return this.props.spContext.spHttpClient.get(this.props.spContext.pageContext.web.absoluteUrl +   
          `/_api/web/lists/getbytitle('Employees')/items?$select=Id,ccEmployee,ccEmployeeType,CCVintageYear,ccSalary,` +
          `ccStartDate` +
          `&$filter=` + _sSPQuery
          , SPHttpClient.configurations.v1)  
          .then((response: SPHttpClientResponse) => {      
            return response.json();
          });
      }

      private _render_Emp_List_Div(items: ISPCCRListItem[]): void {    
        let html: string = '';
        // console.log('After Request; CurrentPage: ' + this.state.currentPage + '; PageSize: ' + this.state.pageSize
        //     + '; StartItemId: ' + this.state.startItemId+ '; LastItemId: ' + this.state.lastItemId);
      
        html +=`<div  class="${ styles.searchListWp }">
                  <div>
                    <div class="${styles.tableDIV}">                  
                      
                      <div class="${styles.tableCaptionStyle}" > Employee Request Search Results  </div>
                      <div class="${styles.tableStyle}">
                        <div class="${styles.rowStyle}">                     
                          <div class="${styles.headerStyle}">ID</div>  
                          <div class="${styles.headerStyle}">Date</div>  
                          <div class="${styles.headerStyle}">Employee</div>  
                          <div class="${styles.headerStyle}">Employee Type</div>  
                          <div class="${styles.headerStyle}">Vintage Year</div>  
                          <div class="${styles.headerStyle}">Net Salary</div>
                        </div>
                    `;
        
        let iItemsCount : number = 1;
        items.forEach((item: ISPCCRListItem) => {
          if(iItemsCount >= this.state.startItemId && iItemsCount <= this.state.lastItemId){      
            let sDueDate = item.ccStartDate ? item.ccStartDate.slice(0,10) : '';
            html += `<div class="${styles.rowStyle}">
                      <div class="${styles.cellStyle}">
                        <a style="text-decoration:none; color:#1a73e8;" href="${this.props.spContext.pageContext.web.absoluteUrl}/Lists/CapitalCallRequest/DispForm.aspx?ID=${item.Id}" target="_blank">
                              ${item.Id}</a>
                      </div>
                      <div class="${styles.cellStyle}">${sDueDate}</div>  
                      <div class="${styles.cellStyle} ${styles.cellStyle_Large}">${item.ccEmployee}</div>  
                      <div class="${styles.cellStyle} ${styles.cellStyle_Large}">${item.ccEmployeeType}</div>  
                      <div class="${styles.cellStyle}">${item.CCVintageYear}</div>  
                      <div class="${styles.cellStyle}">$${FixCurrencyField(item.ccSalary)}</div>
                    </div>`;
          }
          iItemsCount++;
        });
        html += `</div></div>
                </div>
              </div>`;
      
        const listContainer: Element = this.props.rootDOMElement.querySelector('#sp_CCR_ListContainer');
        listContainer.innerHTML = html;
      }

      private _onSelectStartDate_CCR = (date: Date | null | undefined): void => {
        if(date)
          { this.selectedStartDate = date.getFullYear() + '-' + (date.getMonth() + 1) + 
            '-' + (date.getDate() + 'T00:00:00Z');}
        else { this.selectedStartDate = null; }    
        this.setState({ startDate: date });
      }
      private _onSelectEndDate_CCR = (date: Date | null | undefined): void =>{
        if(date)
          { this.selectedEndDate = date.getFullYear() + '-' + (date.getMonth() + 1) + 
            '-' + (date.getDate() + 'T00:00:00Z');}
        else 
          this.selectedEndDate = null;    
        this.setState({ endDate: date });
      }
      private _onFormatDate_CCR = (date: Date): string => {    
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate());
      }
      private _onParseDateFromString = (value: string): Date => {
        const date = this.state.startDate || new Date();
        const values = (value || '').trim().split('-');
        const day = values.length > 0 ? Math.max(1, Math.min(31, parseInt(values[0], 10))) : date.getDate();
        const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : date.getMonth();
        let year = values.length > 2 ? parseInt(values[2], 10) : date.getFullYear();
        if (year < 100) {
          year += date.getFullYear() - (date.getFullYear() % 100);
        }
        console.log('Date: ' + new Date(year, month, day));
        return new Date(year, month, day);
      }
      private onChanged_Employee = (option: IDropdownOption, index?: number) : void => {
      
        this.selectedEmployee = option.text;  
      
        const options: IDropdownOption[] = this.state.optionsEmployees;
        options.forEach((o: IDropdownOption): void => {          
          if (o.text !== option.text) {
            o.selected = false;
          }else{
            o.selected = true;
          }
        });
        this.setState({
          optionsEmployees: options
        });
      }
      private onChanged_EmployeeType = (option: IDropdownOption, index?: number) : void => {
                
        this.selectedEmployeeType = option.text;
        
        const optionsTypes: IDropdownOption[] = this.state.optionsTypes;
        optionsTypes.forEach((o: IDropdownOption): void => {          
          if (o.text !== option.text) {
            o.selected = false;
          }
        });
        this.setState({
          optionsTypes: optionsTypes
        });
      }
      private onChanged_Years = (option: IDropdownOption, index?: number) : void => {
                
        this.selectedYear = option.text;
        
        const optionsYears: IDropdownOption[] = this.state.optionsYears;
        optionsYears.forEach((o: IDropdownOption): void => {          
          if (o.text !== option.text) {
            o.selected = false;
          }
        });
        this.setState({
          optionsYears: optionsYears
        });
      }
      
      private _onSearch_Emp = () : void => {
        try{
          //const { startItemId, lastItemId, statusMessage, pageSize, currentPage, items } = this.state;
          
          console.log('Before Request; CurrentPage: ' + this.state.currentPage + '; PageSize: ' + this.state.pageSize 
              + '; StartItemId: ' + this.state.startItemId + '; LastItemId: ' + this.state.lastItemId);
      
          this._get_Emp_ListData()
          .then((response) => {      
            this.setState({        
              lastItemId: (this.state.lastItemId == 0) ? 
                (response.value.length > this.state.pageSize ? this.state.pageSize : response.value.length) : this.state.lastItemId
              // lastItemId: (this.state.lastItemId > 0) ? ( response.value.length < (this.state.lastItemId + this.state.pageSize) ? 
              //                                             response.value.length : (this.state.lastItemId + this.state.pageSize) ) : 
              //                                           (response.value.length > this.state.pageSize ? this.state.pageSize : response.value.length),
              // startItemId: (this.state.startItemId > 0) ? (response.value.length >  (this.state.startItemId + this.state.pageSize) ? 
              //                                             (this.state.startItemId + this.state.pageSize) :this.state.startItemId) : 
              //                                             (response.value.length > 0 ? 1: 0),
              // statusMessage: `Showing items ${(this.state.startItemId)} - 
              //                ${(this.state.lastItemId)} of ${response.value.length}`
            });
            this.setState({        
              statusMessage: `Showing items ${(this.state.startItemId)} - ${(this.state.lastItemId)} of ${response.value.length}`
            });
            console.log('After Request; CurrentPage: ' + this.state.currentPage + '; PageSize: ' + this.state.pageSize + '; Length: ' + response.value.length
            + '; StartItemId: ' + this.state.startItemId+ '; LastItemId: ' + this.state.lastItemId);      
            this._render_Emp_List_Div(response.value);      
          });
        }
        catch(ex){
          console.log(ex.message);
        }
      }    

      public render(): JSX.Element {
  
        const { firstDayOfWeek, startDate, endDate, pageSize, items } = this.state;
      
        return (
              <div className="ms-Grid"> 
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm6">
                    <DatePicker
                      label="Pick Start date"
                      isRequired={false}
                      allowTextInput={true}
                      value={startDate!}
                      strings={DayPickerStrings}
                      onSelectDate={this._onSelectStartDate_CCR}
                      formatDate={this._onFormatDate_CCR}
                      parseDateFromString={this._onParseDateFromString}
                      placeholder="Start date..."
                    />
                  </div>
                  <div className="ms-Grid-col ms-u-sm6">
                    <DatePicker
                      label="Pick End date"
                      isRequired={false}
                      allowTextInput={true}
                      value={endDate!}
                      strings={DayPickerStrings}
                      onSelectDate={this._onSelectEndDate_CCR}
                      formatDate={this._onFormatDate_CCR}
                      parseDateFromString={this._onParseDateFromString}
                      placeholder="End date..."
                    />
                  </div>
                </div>
                <div className="padding_yk">                
                    <Dropdown        
                      label="Employee: "
                      onChanged={this.onChanged_Employee.bind(this)}
                      placeHolder="Select Employee"          
                      id="ddlEmployee" multiSelect={false}
                      options={this.state.employees.map( (item) => {                      
                          return { text: item.toString() };
                      })}
                    />
                </div>
                <div className="padding_yk">                
                    <Dropdown
                      label="Employee Type: "
                      onChanged={this.onChanged_EmployeeType.bind(this)}
                      placeHolder="Select Employee Type"          
                      id="ddlEmployeeType" multiSelect={false}                    
                      options={this.state.employeeTypes.map( (item) => {                      
                        return { text: item.toString() };
                      })}
                    />
                </div>
                <div className="padding_yk">
                    <Dropdown
                      label="Year: "
                      onChanged={this.onChanged_Years.bind(this)}
                      placeHolder="Select year"
                      id="ddlYear" multiSelect={false}                    
                      options={this.state.vintageYears.map( (item) => {
                        return {text: item.toString()};
                      })}
                    />                
                </div>
                      
                <br></br>
                <DefaultButton
                  primary={true}
                  data-automation-id="CCSubmit"
                  text="Search"
                  onClick={this._onSearch_Emp}
                />
                {/* <DefaultButton                
                  data-automation-id="CCClear"
                  text="Clear all"
                  onClick={this.onCCallsClearAll}
                /> */}
                <br></br>
                <label id='lblError'></label>          
                <div id="sp_CCR_ListContainer" />
                <div>{this.state.statusMessage}</div>
                {/* <DefaultButton
                  primary={false}
                  data-automation-id="CCNext"
                  text="Next"
                  onClick={this._onClick_Next}
                />
                <DefaultButton
                  primary={false}
                  data-automation-id="CCPrevious"
                  text="Previous"
                  onClick={this._onClick_Prev}
                /> */}
      
                <div>
                {/* <DetailsList
                    items = {items}
                    columns = {this._columns}
                    isHeaderVisible = {true}
                    layoutMode = {LayoutMode.justified}
                    constrainMode ={ConstrainMode.unconstrained}
                    checkboxVisibility={CheckboxVisibility.hidden} 
                    onColumnHeaderClick={ this._onColumnClick }              
                    ></DetailsList>                           */}
                </div>
                <div>
                  <Paging  
                    totalItems={ this.state.itemsCount }
                    itemsCountPerPage={ this.state.pageSize } 
                    onPageUpdate={ this._onPageUpdate } 
                    currentPage={ this.state.currentPage }/>
                </div>
              </div>
          );
      }
      
      /* Others */
      @autobind
      private _onColumnClick(event: React.MouseEvent<HTMLElement>, column: IColumn) {
        let { items, columns } = this.state;
        let isSortedDescending = column.isSortedDescending;
      
        // If we've sorted this column, flip it.
        if (column.isSorted) {
          isSortedDescending = !isSortedDescending;
        }
      
        // Sort the items.
        items = items!.concat([]).sort((a, b) => {
          let firstValue = a[column.fieldName];
          let secondValue = b[column.fieldName];
      
          if (isSortedDescending) {
            return firstValue > secondValue ? -1 : 1;
          } else {
            return firstValue > secondValue ? 1 : -1;
          }
        });
      
        // Reset the items and columns to match the state.
        this.setState({
          items: items,
          columns: columns!.map(col => {
            col.isSorted = (col.key === column.key);
      
            if (col.isSorted) {
              col.isSortedDescending = isSortedDescending;
            }
            return col;
          })
        });
      }
      private _getListData(): Promise<ISPCCRListItems> {  
        return this.props.spContext.spHttpClient.get(this.props.spContext.pageContext.web.absoluteUrl +   
          `/_api/web/lists/getbytitle('Employees')/items?$select=Title,Id,ccEmployee,ccEmployeeType,CCVintageYear,ccSalary`, SPHttpClient.configurations.v1)    
          .then((response: SPHttpClientResponse) => {
            return response.json();
          });
      }
      private _renderList(items: ISPCCRListItem[]): void {
        let html: string = '';
        items.forEach((item: ISPCCRListItem) => {
          html += `<ul>
                    <li>
                      <span class="ms-font-l">${item.ccEmployee}</span>
                    </li>
                  </ul>`;
        });
      
        const listContainer: Element = this.props.rootDOMElement.querySelector('#sp_CCR_ListContainer');
        listContainer.innerHTML = html;
      }      


}