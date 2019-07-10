import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-webpart-base';

import * as strings from 'SkyUiWebPartStrings';
import SkyUi from './components/SkyUi';
import { ISkyUiProps } from './components/ISkyUiProps';

export interface ISkyUiWebPartProps {
  apiKey: string;
  clientId: string;
  replyUrl: string;
  appName: string;
  domain: string;
  validate?: boolean;
}

export default class SkyUiWebPart extends BaseClientSideWebPart<ISkyUiWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISkyUiProps > = React.createElement(
      SkyUi,
      {
        apiKey: this.properties.apiKey,
        clientId: this.properties.clientId,
        replyUrl: this.properties.replyUrl,
        appName: this.properties.appName,
        domain: this.properties.domain,
        validate: this.properties.validate
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /*
   * A Property Panel used to provide the module with the necessary authentications settings.
   * API keys are provided by Microsoft's documentation on their Skype Development Kit.
   * Client ID is a key provided by Microsoft Azure Active Directory when registering the application.
   * Reply URL is the page URL on which is loaded the application. Also required in AAD during application's registration.
   * Domain corresponds to the Diffusion List's domain adress. As it may vary from one company / SharePoint solution to another, it is also required here.
   * The Validate checkbox is a fail safe method to prevent the page from reloading without saving the changes to the Panel. Should be checked only when all required informations are correct.
   */

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Should only be edited by an experienced Admin user.'
          },
          groups: [
            {
              groupName: 'Application config',
              groupFields: [
                PropertyPaneTextField('apiKey', {
                  label: 'API Key for Conversation Controller (unlikely to change)'
                }),
                PropertyPaneTextField('clientId', {
                  label: 'Application ID'
                }),
                PropertyPaneTextField('replyUrl', {
                  label: 'Reply URL'
                }),
                PropertyPaneTextField('domain', {
                  label: 'Group domain'
                }),
                PropertyPaneCheckbox('validate', {
                  text: 'Validate and save Application Settings',
                  checked: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
