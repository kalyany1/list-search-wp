import { IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';

export const DayPickerStrings: IDatePickerStrings = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',  
    isRequiredErrorMessage: 'Start date is required.',
    invalidInputErrorMessage: 'Invalid date format.'
  };

export const CheckAndUpdateSPQuery = (fName:string,fValue:string,  
  filterValue:string, oldQuery:string) : string => {    
  if(fName && fValue && filterValue){
    if(oldQuery){
      oldQuery += ` and (` + fName + ' ' + filterValue  +  ` '` + fValue + `') `;
    }else{
      oldQuery += ` (` + fName + ' ' + filterValue  +  ` '` + fValue + `') `;
    }
  }
  return oldQuery;
};

export const Get_dropdown_values = (iType: number) : string => {
  
  const DEFAULT_PARTNERSHIP_VALUE: string = 'Select a Partnership';
  const DEFAULT_PARTNERSHIP_TYPE_VALUE: string = 'Select a Partnership Type';
  const DEFAULT_YEAR_VALUE: string = 'Select a Year';
  const DEFAULT_PAY_STATUS_VALUE: string = 'Select a Pay Status';
  const DEFAULT_STATUS_VALUE: string = 'Select a Status';

  if(iType == 0){
    return DEFAULT_PARTNERSHIP_VALUE;
  }else if(iType == 1){
    return DEFAULT_PARTNERSHIP_TYPE_VALUE;
  }else if(iType == 2){
    return DEFAULT_YEAR_VALUE;
  }else if(iType == 3){
    return DEFAULT_PAY_STATUS_VALUE;
  }else if(iType == 4){
    return DEFAULT_STATUS_VALUE;
  }else{
    return '';
  }
};

export const AddCommas = (objValue) : string => {
  if (objValue) {    
    if (objValue.toString().indexOf(',') > 0) {        
        objValue = this.RemoveCommas(objValue);
    }      
    var sArray = objValue.toString().split(".");
    sArray[0] = sArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return sArray.join(".");
  } else { return objValue; }
};
export const RemoveCommas = (objValue) : string => { 
  if (objValue) { 
    if (objValue.toString().indexOf(',') != -1) {
      objValue = objValue.replace(/,/g, "");}
  }
  return objValue;
};
export const AddBrackets = (objValue: string) : string => {
  if (objValue) {
    if (objValue.toString().indexOf('-') != -1) {
      objValue = objValue.replace(/-/g, "");
      objValue = '(' + objValue + ')';
    }
  }
  return objValue; 
};
export const FixCurrencyField = (objValue: string): string => {
  if (objValue) {    
    objValue = AddBrackets(AddCommas(objValue));    
  }
  return (objValue ? objValue : '');
};
export const CreateATag = (sURL : string, objID: string, objTicket: string): string => {
  let returnValue = '';
  if (sURL && objID && objTicket) {    
    returnValue = '<a href="' + sURL + objID +'" target="_blank">' + objTicket +'</a>';     
  }
  return returnValue;
};