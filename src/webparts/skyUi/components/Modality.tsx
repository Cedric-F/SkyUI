import * as React from 'react';
import styles from './SkyUi.module.scss';

export interface Props {
  sip?: any;
  title?: any;
  src?: any;
  name?: any;
  alt?: any;
  onConv?: any;
}

export default class Modality extends React.Component<Props, {}> {

  /*
   * Declares the conversation's "environment", whether it is a call, or a chat.
   * The component is linked to its contact's data so that when clicked it updates the controller accordingly.
   */

  public render() {
    return (
      <img
        src={this.props.name}
        onClick={() => this.props.onConv({modalities: [this.props.title], participants: [this.props.sip]})}
        alt={this.props.alt}
        title={this.props.title}
      />
    );
  }
}
