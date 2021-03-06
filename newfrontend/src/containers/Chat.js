import React from "react";
import { connect } from "react-redux";
import WebSocketInstance from "../websocket";
import Hoc from "../hoc/hoc";
import { Smile } from "react-feather";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
class Chat extends React.Component {
  state = {
    message: "",
    showEmojiPicker: false,
  };
  initialiseChat() {
    this.waitForSocketConnection(() => {
      WebSocketInstance.fetchMessages(
        this.props.username,
        this.props.match.params.chatID
      );
    });
    WebSocketInstance.connect(this.props.match.params.chatID);
  }
  constructor(props) {
    super(props);
    this.initialiseChat();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    console.log(newProps);
    if (this.props.match.params.chatID !== newProps.match.params.chatID) {
      WebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        WebSocketInstance.fetchMessages(
          this.props.username,
          newProps.match.params.chatID
        );
      });
      WebSocketInstance.connect(newProps.match.params.chatID);
    }
  }
  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("conection is made!");
        callback();
        return;
      } else {
        console.log("waiting for connection....");
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }

  messageChangeHandler = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  sendMessageHandler = (e) => {
    e.preventDefault();
    const messageObject = {
      from: this.props.username,
      content: this.state.message,
      chatId: this.props.match.params.chatID,
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: "",
    });
  };

  renderTimestamp = (timestamp) => {
    let prefix = "";
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
      // less than one minute ago
      prefix = "just now...";
    } else if (timeDiff < 60 && timeDiff > 1) {
      // less than sixty minutes ago
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
      // less than 24 hours ago
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      // less than 7 days ago
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  renderMessages = (messages) => {
    const currentUser = this.props.username;
    return messages.map((message, i, arr) => (
      <div
        key={message.id}
        className={
          message.author === currentUser
            ? "d-flex justify-content-end mb-4"
            : "d-flex justify-content-start mb-4"
        }
      >
        <div className="img_cont_msg">
          <img
            src={message.author_photo}
            className="rounded-circle user_img_msg"
            alt="user"
          />
        </div>
        <div
          className={
            message.author === currentUser
              ? "red_msg_cotainer"
              : "gold_msg_cotainer"
          }
        >
          {message.author}
          <br />
          {message.content}
          <span className="msg_time">
            {this.renderTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    ));
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(newProps) {
    this.scrollToBottom();
  }

  toggleEmojiPicker = () => {
    this.setState({
      showEmojiPicker: !this.state.showEmojiPicker,
    });
  };

  addEmoji = (emoji) => {
    const { message } = this.state;
    const text = `${message}${emoji.native}`;

    this.setState({
      message: text,
    });
  };

  render() {
    const { showEmojiPicker } = this.state;
    return (
      <Hoc>
        <div className="card-header msg_head">
          <div className="d-flex bd-highlight">
            <div className="img_cont">
              <img
                src={this.props.profile.photo}
                alt="user_photo"
                className="rounded-circle active_user_img"
              />
              <span className="active_online_icon"></span>
            </div>
            <div className="user_info">
              <span className="username text-danger">
                {this.props.username}
              </span>
              <br />
              <span className="catch">{this.props.profile.catch_phrase}</span>
            </div>
          </div>
        </div>
        <div className="card-body msg_card_body">
          {this.props.messages && this.renderMessages(this.props.messages)}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          />
          {showEmojiPicker ? (
            <Picker set="apple" onSelect={this.addEmoji} />
          ) : null}
        </div>
        <div className="card-footer">
          <form onSubmit={this.sendMessageHandler}>
            <div className="input-group">
              <div className="input-group-append">
                <button
                  type="button"
                  className="input-group-text attach_btn toggle-emoji"
                  onClick={this.toggleEmojiPicker}
                >
                  <Smile />
                </button>
              </div>
              <input
                onChange={this.messageChangeHandler}
                value={this.state.message}
                required
                className="form-control type_msg"
                id="chat-message-input"
                type="text"
                placeholder="Type your message..."
              />
              <div id="chat-message-submit" className="input-group-append">
                <button type="submit" className="input-group-text send_btn">
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </Hoc>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    messages: state.message.messages,
    profile: state.auth.profile,
  };
};

export default connect(mapStateToProps)(Chat);
