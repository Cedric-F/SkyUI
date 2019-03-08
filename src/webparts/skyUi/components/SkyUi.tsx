import * as React from 'react';
import styles from './SkyUi.module.scss';
import { ISkyUiProps } from './ISkyUiProps';
import { escape } from '@microsoft/sp-lodash-subset';
const Skype = require('../utils/SkypeBootstrap.min.js');

import Dashboard from './Dashboard';

export default class SkyUi extends React.Component<ISkyUiProps, {}> {
  public state = {
    apiManager: null,
    client: null,

    hasToken: false, // If false, logs O365 account
    isOAuth: false, // When true, initialize Skype SDK
    isSDK: false, // When true, logs to Skype servers
    isLogged: false,

    list: [], // Contacts list

    options: {}
  };

  /*
   * Unless isSDK is true initializes the SDK instance, calling its API, provided by the SkypeBootstrap.js file.
   * Then call the LogIn function to connect the user to Lync Servers.
   */

  public initSDK(): void {
    const { apiManager, client, isLogged } = this.state;
    (window as any).Skype.initialize(
      { apiKey: this.props.apiKey }, // Provide Skype with the API key for Conversation Controller
      function(api) {
        if (!apiManager) this.setState({
          apiManager: api,
          client: api.UIApplicationInstance
        });

        // Notifies the application state on changes.
        if (client) client.signInManager.state.changed((state) => {
          console.log(state);
        });

        this.getConversation();

    console.log('Skype Web SDK initialisé.');
    this.setState({isSDK: true});

    if (!isLogged) this.logIn();

    }.bind(this)); // Keep the App context
  }

  /*
   * The API needs an access token provided by an OAuth protocol in order to get the user's Office 365 licenses informations.
   * This method redirects the user to a login page that will send them back to the plugin's page (reply url), this time with the access token.
   */

  public O365(): void {
    if (!this.state.isOAuth) window.location.assign(
      'https://login.microsoftonline.com/common/oauth2/authorize?response_type=token' +
        '&client_id=' +
        this.props.clientId +
        '&resource=' +
        'https://webdir.online.lync.com' +
        '&redirect_uri=' +
        this.props.replyUrl
    );
  }

  /*
   * Connects the user to Lync Server using their Office 365 license credentials and subscribes to their status' changes events
   * When the user is successfully connected, get the diffusion list through getList() method.
   */

  public logIn(): void {
    const { client } = this.state;

    let params = {
      client_id: this.props.clientId,
      origins: [
        'https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root'
      ],
      cors: true,
      version: this.props.appName + '/1.0.0',
      redirect_uri: this.props.replyUrl
    };

    client.signInManager.signIn(params).then(
      () => {
        setTimeout(() => {
          let status = client.personsAndGroupsManager.mePerson.status
            .get()
            .then((newStatus) => {
              if (newStatus === 'Invisible') newStatus = 'Offline';
              console.log(`Connecté en tant que ${client.personsAndGroupsManager.mePerson.displayName()} (${newStatus})`);
            });
        }, 1000);
        this.setState({isLogged: true});
        if (!this.state.list.length) this.getList();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /*
   * Check for the API and client's settings existence
   *
   * If an access_token parameter exists in the URL, it was successfully granted by the OAuth protocol. Otherwise execute it.
   * This will cause a quick redirection to Office 365 login page to access user's license credentials, which redirects back to the reply url (where the plugin is located)
   *
   * Once the OAuth is a success, starts the SDK configuration.
   */

  public paramCheck(): void {
    setTimeout(() => {
      const {apiKey, clientId, replyUrl, validate} = this.props;

      if (!(apiKey && clientId && replyUrl && validate)) return;

      if (window.location.hash) {
        let hasharr = window.location.hash.substr(1).split('&');
        hasharr.forEach((hashelem) => {
          let elemarr = hashelem.split('=');
          if (elemarr[0] === 'access_token') {
            this.setState({hasToken: true, isOAuth: true});
          }
        }, this);
      } else this.O365();

      if (!this.state.isSDK) this.initSDK();
    }, 0);
  }

  /*
   * Execute the whole events chain to create the Skype instance
   */

  public componentDidMount(): void {
    this.paramCheck();
  }

  /*
   * The component receives new props as the admin fills in the Property Panel.
   * Those props are required in order to scaffold the SDK instance and let the module perform its tasks.
   */

  public componentWillReceiveProps(): void {
    this.paramCheck();
  }

  public render(): React.ReactElement<ISkyUiProps> {
    const { apiManager, list, options, isLogged, client } = this.state;

    return (
      <div className={ styles.skyUi }>
        <Dashboard
          apiManager={ apiManager }
          contactList={ list }
          newConv={ options }
          isLogged={ isLogged }
          user={ client }
        />
      </div>
    );
  }

  /*
   * This is the method that will get the diffusion list (Skype contacts group), specified in the Property Panel by the admin.
   * The query is set to return a single list matching the group_name@contoso.com adress from the lists' data base, in an async Promise.
   * The result is an array of a unique element (the group), containing the contacts' list.
   * The get methods returns another Promise providing the contacts, allowing us to store them in the module's state.
   */

  public getList() {
    const { client } = this.state;
    const { appName, name } = this.props;
    client.personsAndGroupsManager
      .createGroupSearchQuery()
      .text(`${appName}@${domain}`)
      .limit(1)
      .getMore()
      .then(group => {
        group[0].result.persons.get()
        .then(persons => this.setState({list: persons}));
      });
  }

  /*
   * Conversation Control that listens to incoming conversations.
   */

  public getConversation() {
    const { client } = this.state;

    const accept = (conversation) => {
      // Accepts the conversation modalities
      conversation.chatService.accept();
      conversation.audioService.accept();
      conversation.videoService.accept();
    }

    client.conversationsManager.conversations.added(conversation => {
      // Allow the user to accept the conversation modalities
      conversation.audioService.accept.enabled();
      conversation.videoService.accept.enabled();
      conversation.chatService.accept.enabled();

      /*
       * Notify the user when they receive an ongoing conversation (Audio or Chat).
       * If they accept, update the state with the conv settings and pass it down directly to the Controller
       */

      conversation.selfParticipant.audio.state.changed((newValue, reason, oldValue) => {
        if (newValue !== 'Notified') return conversation.audioService.reject();

        let sip = conversation.participants(0).person.id();

        if (window.confirm(`Accepter l'appel de ${conversation.participants(0).person.displayName()}?`)) {
          setTimeout(() => {
            let options = {
              modalities: ['Chat', 'Audio'],
              participants: [sip]
            };
            this.setState({ options: options});

            accept(conversation);

          }, 0);
        }
      });

      conversation.selfParticipant.chat.state.changed((newValue, reason, oldValue) => {
        if (newValue !== 'Notified') return conversation.chatService.reject();

        let sip = conversation.participants(0).person.id();

        if (window.confirm(`Rejoindre la conversation avec ${conversation.participants(0).person.displayName()}?`)) {
          setTimeout(() => {
            let options = {
              modalities: ['Chat'],
              participants: [sip]
            };
            this.setState({ options: options});

            // Accepts the conversation modalities
            accept(conversation);
          }, 0);
        }

      });
    });
  }
}
