import * as React from 'react';
import styles from './SkyUi.module.scss';

export interface Props {
  name?: string;
  status?: string;
  avatar?: any;
  hovered: boolean;
}

export default class Logo extends React.Component<Props, {}> {

  /*
   * If the contact is hovered, changes the presence indicator's position, and displays the avatar picture.
   * If the contact doesn't have a picture, an error is returned, and Skype's servers cannot provide their default one.
   * So a local one is loaded instead.
   * The presence indicator is an image representing a colored dot that matchs the status.
   */

  public render() {
    const { name, status, avatar, hovered } = this.props;

    return (
      <div className={styles.Status} id={`${name.replace(/\s/g, '-')}-status`}>
        <img
          src={require(`./../utils/${status}.png`)}
          className={[styles.statusLogo, !hovered || styles.positionned].join(' ')}
          alt=""
          title={status}
        />
        <img
          src={avatar}
          className={[styles.profilePic, !hovered && styles.hide].join(' ')}
          onError={(e) => (e.target as HTMLImageElement).src = require('./../utils/default.png')}
          alt=""
        />
      </div>
    );
  }
}
