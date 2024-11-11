import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Socket } from "socket.io-client";
import { close } from "ionicons/icons";
import UserPrivateChat from "./UserPrivateChat";
import {
  PrivateUnReadMessageResType,
  UserListPropsType,
} from "../../actions/types";
import chatDate from "../../validation/chatDate";
import isEmpty from "../../validation/is-empty";
import { apiURL } from "../../config/config";

interface props {
  item: UserListPropsType;
  socket: Socket;
  unReadMessageCountData: PrivateUnReadMessageResType[] | [];
  setUnreadMsgFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivateUser: React.FC<props> = ({
  item,
  socket,
  unReadMessageCountData,
  setUnreadMsgFlag,
}: props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [privateChatModalName, setPrivateChatModalName] = useState<string>("");

  const handleShowPrivateChatModal = (name: string) => {
    setIsOpen(true);
    setUnreadMsgFlag(true);
    setPrivateChatModalName(name);
  };

  const handleClosePrivateChatModel = () => {
    setIsOpen(false);
    setUnreadMsgFlag(false);
  };

  return (
    <>
      <div
        className="chat-user-view"
        onClick={() => handleShowPrivateChatModal(item.username)}
      >
        <div className="chat-user-avatar-view">
          <img
            src={apiURL + "/user/" + item.avatar}
            className="chat-user-avatar"
            alt="user avatar"
          />
        </div>
        <div className="chat-user-text-view">
          <h5 className="chat-user-name">{item.username}</h5>
          <p className="chat-user-last-message">{item.username}</p>
          {/* {item.username && (
            <div className="chat-user-unread-msg-box">
              <div className="chat-user-unread-msg-box-circle"></div>
            </div>
          )} */}
        </div>
        <div className="chat-user-date-view">
          <p className="chat-user-date">{chatDate(item.created_at)}</p>
          {!isEmpty(unReadMessageCountData) && (
            <>
              {unReadMessageCountData.filter(
                (messageData) => String(messageData.sender) === String(item.id)
              )[0]?.unReadMessageCount > 0 && (
                <div className="chat-user-unread-msg">
                  {
                    unReadMessageCountData.filter(
                      (messageData) =>
                        String(messageData.sender) === String(item.id)
                    )[0]?.unReadMessageCount
                  }
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{privateChatModalName}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => handleClosePrivateChatModel()}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <UserPrivateChat userItem={item} socket={socket} />
        </IonContent>
      </IonModal>
    </>
  );
};

export default PrivateUser;
