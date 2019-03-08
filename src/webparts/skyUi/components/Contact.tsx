import * as React from 'react';
import styles from './SkyUi.module.scss';

import Logo from './Logo';
import Actions from './Actions';

export interface Props {
  contact?: any;
  onConv?: any;
}

export default class Contact extends React.Component<Props, {}> {

  /*
   * Until proven otherwise, the contact default status is set as Offline.
   */

  public state = {
    isHovered: false,

    status: 'Offline',
    name: null,
    avatar: null
  };

  public getName() {
    return this.props.contact.displayName.get()
    .then(name => this.setState({ name: name }));
  }

  public getAvatar() {
    return this.props.contact.avatarUrl.get()
    .then(url => this.setState({avatar: url}))
  }

  public getStatus() {
    return this.props.contact.status.get()
    .then(s => this.setState({status: s}))
  }

  public updateStatus() {
    this.props.contact.status.changed(s => this.setState({ status: s }));
  }

  /*
   * When the contact element is mounted, start a chain of promises to get the person's information from the Skype API.
   * Then subscribe to their presence and avatar changes to immediately keep the list view up to date.
   */

  public componentDidMount() {

    this.getName()
      .then(this.getAvatar.bind(this))
      .then(this.getStatus.bind(this))
      .then(this.updateStatus.bind(this))
      .catch(e => throw new Error(e))
      .finally(() => {
        this.props.contact.status.subscribe();
        this.props.contact.avatarUrl.subscribe();
      }.bind(this));

  }

  /*
   * Logo is merely the contact's Avatar (picture), and the presence indicator.
   * Actions is the list of conversation modalities, displayed only when hovering over this contact.
   */

  public render() {
    const { contact } = this.props;
    const { isHovered } = this.state;

    return (
      <div
        className={styles.Contact}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <Logo
          name={contact.displayName()}
          status={this.state.status}
          avatar={this.state.avatar}
          hovered={isHovered}
        />
        <Actions
          name={this.state.name}
          hovered={isHovered}
          onConv={this.props.onConv}
          sip={contact.id()}
        />
      </div>
    );
  }
}
