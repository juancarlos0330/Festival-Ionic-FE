import React from "react";
import { MessagePropsType } from "../../actions/types";
import { apiURL } from "../../config/config";
import chatDate from "../../validation/chatDate";

interface props {
  item: MessagePropsType;
}

const Message: React.FC<props> = ({ item }: props) => {
  return (
    <>
      {item.flag ? (
        <div
          className={
            item.duplicationFlag
              ? "chat-message-item-me"
              : "chat-message-item-me chat-message-item-margin"
          }
        >
          <div className="chat-message-text-view-me">
            <div className="chat-message-text">{item.message}</div>
            {!item.duplicationFlag && (
              <p className="chat-message-date-me">
                {chatDate(item.created_date)}
              </p>
            )}
          </div>
          <div className="chat-message-avatar-view-me">
            {!item.duplicationFlag && (
              <img
                src={apiURL + "/user/" + item.avatar}
                className="chat-message-user-avatar"
                alt="chat-user-avatar"
              />
            )}
          </div>
        </div>
      ) : (
        <div
          className={
            item.duplicationFlag
              ? "chat-message-item"
              : "chat-message-item chat-message-item-margin"
          }
        >
          <div className="chat-message-avatar-view">
            {!item.duplicationFlag && (
              <img
                src={apiURL + "/user/" + item.avatar}
                className="chat-message-user-avatar"
                alt="chat-user-avatar"
              />
            )}
          </div>
          <div className="chat-message-text-view">
            <div className="chat-message-text">{item.message}</div>
            {!item.duplicationFlag && (
              <p className="chat-message-date">
                {chatDate(item.created_date)} {item.username}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
