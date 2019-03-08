import * as React from 'react';
import styles from './SkyUi.module.scss';
import Contact from './Contact';

export interface Props {
  contactList?: any;
  onConv?: any;
  user?: any;
}

export default class ListBody extends React.Component<Props, {}> {

  /*
   * Map over the contacts' list and for each person add a Contact component containing contact's data to the list view.
   */

  public render() {
    const { contactList } = this.props;
    return (
      <div className={styles.ListBody}>
        {
          !contactList.length || contactList.map((contact, id) =>
            this.props.user.personsAndGroupsManager.mePerson.displayName() !== contact.displayName() && <Contact key={contact.id()} contact={contact} onConv={ this.props.onConv } />
          )
        }
      </div>
    );
  }

}
