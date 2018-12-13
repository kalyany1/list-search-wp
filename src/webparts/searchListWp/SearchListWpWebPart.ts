import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SearchListWpWebPartStrings';
import SearchListWp from './components/SearchListWp';
import { ISearchListWpProps } from './components/ISearchListWpProps';

export interface ISearchListWpWebPartProps {
  description: string;
}

export default class SearchListWpWebPart extends BaseClientSideWebPart<ISearchListWpWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISearchListWpProps > = React.createElement(
      SearchListWp,
      {
        description: this.properties.description,
        siteUrl:this.context.pageContext.web.absoluteUrl,
        spContext: this.context,
        rootDOMElement: this.domElement,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
