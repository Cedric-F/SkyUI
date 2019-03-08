import * as React from 'react';
import styles from './SkyUi.module.scss';

export interface Props {
  options?: any;
  apiManager?: any;
  current?: any;
}

export default class Conversation extends React.Component<Props, {}> {

  /*
   * Renders the current active conversation.
   */

  public renderConversation(): void {
    const { options, apiManager } = this.props;
    const { participants, modalities } = options;

    const conv = document.getElementById(`${participants[0]}`);

    if (!apiManager) return;

    let promise = apiManager.renderConversation(
      conv.dataset.active == "false" && conv,
      options
    ).then(() => conv.dataset.active = "true");
  }

  public componentDidUpdate(): void {
    this.renderConversation();
  }

  public componentDidMount(): void {
    this.renderConversation();
  }

  public render() {
    return (
      <div
        id={this.props.options.participants[0]}
        data-active="false"
      />
    );
  }
}
