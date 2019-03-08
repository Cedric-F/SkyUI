import * as React from 'react';
import styles from './SkyUi.module.scss';

import ListHead from './ListHead';
import ListBody from './ListBody';

export interface Props {
  contactList?: any;
  onConv?: any;
  isLogged?: any;
  user?: any;
}

export default class List extends React.Component<Props, {}> {
  public render() {
    return (
      <div className={[styles.List, !this.props.contactList.length && styles.Loading].join(' ') /* loading gif displayed while searching for contacts */}>
        <ListHead />
        <ListBody user={ this.props.user } contactList={ this.props.contactList } onConv={ this.props.onConv }/>
      </div>
    );
  }

}
