import * as React from 'react';
import styles from './SkyUi.module.scss';
import List from './List';
import Controller from './Controller';

export interface Props {
  apiManager?: any;
  contactList?: any;
  options?: any;
  newConv?: any;
  user?: any;
  isLogged?: any;
}

export default class Dashboard extends React.Component<Props, {}> {

  public state = {
    allCC: [],
    currentCC: null,

    options: {}
  };

  /*
   * The module's design is thought to display only one conversation at a time.
   * Each conversation can be recovered and shown over the previous one by clicking on a contact in the list view.
   *
   * This method simply changes the conversation window's modalities through the state.
   */

  public getSettings(options) {
    console.log(options);
    const { allCC, currentCC } = this.state;

    let entry = options.participants;

    this.setState({
      allCC: (allCC as any).includes(entry[0]) ? // if the EXISTING conversations list includes the newly rendered one
        allCC : allCC.concat(entry), // don't change it. Otherwise push the conversation to the list (when a conversation is CREATED)
      currentCC: entry[0], // then display it as the current conversation
      options: options // and set the current conversation's options
    });
  }

  public componentWillReceiveProps() {
    if (this.props.options && Object.keys(this.props.options).length)
    this.getSettings(this.props.options);
  }

  /*
   * This main frame is split into 2 sections.
   * The List component will render a list view of contacts, with their updated status, and conversation modalities.
   * The Controller will render the conversations area.
   */

  public render() {
    return (
      <div className={ styles.Dashboard }>
        <List
          contactList={ this.props.contactList }
          onConv={ this.getSettings.bind(this) }
          isLogged={ this.props.isLogged }
          user={ this.props.user }
        />
        <Controller
          currentCC={ this.state.currentCC }
          allCC={ this.state.allCC }
          options={ this.state.options }
          apiManager={ this.props.apiManager }
        />
      </div>
    );
  }
}
