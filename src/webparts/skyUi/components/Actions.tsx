import * as React from 'react';
import styles from './SkyUi.module.scss';
import Modality from './Modality';

const Call = require('./../utils/Call.png');
const IM = require('./../utils/IM.png');
const Video = require('./../utils/Video.png');

export interface Props {
  hovered: boolean;
  sip: string;
  onConv: any;
  name: string;
}

export default class Actions extends React.Component<Props, {}> {

  /*
   * When the contact is hovered, display it's related conversation modality buttons.
   * They're provided with the contact's data.
   */

  public render() {
    return (
      <div className="Actions">

        <div className={this.props.hovered ? styles.Modalities : styles.hide}>
          {
            [Call, IM, Video].map((e, i) =>
              <Modality
                sip={this.props.sip}
                onConv={this.props.onConv}
                key={this.props.name + '-' + i}
                name={e}
                alt=''
                title={(!i && 'Audio') || (i === 1 && 'Chat') || (i === 2 && 'Video')}
              />
            )
          }
        </div>
        <p className={this.props.hovered ? styles.hide : "Name"}>{this.props.name}</p>

      </div>
    );
  }
}
