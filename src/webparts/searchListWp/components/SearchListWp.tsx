import * as React from 'react';
import { ISearchListWpProps } from './ISearchListWpProps';
import AppUI from './AppUI/AppUI';

export default class SearchListWp extends React.Component<ISearchListWpProps, {}> {

  constructor (props:ISearchListWpProps){
    super(props);
  }

  public render(): React.ReactElement<ISearchListWpProps> {
    return (
      <div>
        
        <AppUI description='' siteUrl={this.props.siteUrl} spContext={this.props.spContext} rootDOMElement={this.props.rootDOMElement}></AppUI>
         
      </div>
    );
  }
}
