import * as React from 'react';
import styles from './SkyUi.module.scss';
import Conversation from './Conversation';

export interface Props {
  currentCC?: any;
  allCC?: any;
  options?: any;
  apiManager?: any;
}
export interface State {}

export default class Controller extends React.Component<Props, State> {

  /*
   * Updates the Conversation with the current conv's data.
   * (Other existing conversations are hidden and displayed back when they become the new current one.)
   */

  public render() {
    const {options, apiManager, currentCC, allCC} = this.props;
    const {participants} = options;
    return (
      <div className={styles.Controller}>
        {
          allCC && allCC.map(cc =>
            cc === currentCC &&
             <Conversation
              key={participants[0]}
              apiManager={apiManager}
              options={options}
              current={currentCC}
            />
          )
        }
      </div>
    );
  }

}
