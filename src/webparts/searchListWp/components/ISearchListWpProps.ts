import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISearchListWpProps {
  description: string;
  siteUrl: string;
  spContext: WebPartContext;
  rootDOMElement : HTMLElement;
}
