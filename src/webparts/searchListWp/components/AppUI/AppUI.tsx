import * as React from 'react';
import {ISearchListWpProps} from '../ISearchListWpProps';
import styles from '../SearchListWp.module.scss';
import EmployeesUI from './EmployeesUI';
import { PivotLinkSize, PivotLinkFormat, PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';


export default class AppUI extends React.Component<ISearchListWpProps, {}> {

    constructor (props:ISearchListWpProps){
        super(props);
    }

    public render(): JSX.Element {
		return (
            <div className={styles.container}>
             <div className={styles.title}> Search on all List Data </div>
             <br></br>           
             <Pivot linkFormat={PivotLinkFormat.links} linkSize={PivotLinkSize.normal}>

              <PivotItem linkText="Employees">

                <br></br>
                <EmployeesUI description='' siteUrl={this.props.siteUrl} spContext={this.props.spContext} rootDOMElement={this.props.rootDOMElement}></EmployeesUI>
                     
               </PivotItem>
               <PivotItem linkText="List 2">
              
                <br></br>
                {/* <CDUI description='' siteUrl={this.props.siteUrl} spContext={this.props.spContext} rootDOMElement={this.props.rootDOMElement}></CDUI> */}
                                     
               </PivotItem>
               <PivotItem linkText="List 3">

                <br></br>
                {/* <EMFUI description='' siteUrl={this.props.siteUrl} spContext={this.props.spContext} rootDOMElement={this.props.rootDOMElement}></EMFUI> */}

               </PivotItem>
             </Pivot>
            </div>
        );
    }
}
