import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { close } from "ionicons/icons";
import GroupPrivateChat from "./GroupPrivateChat";
import {
  ScheduleListPropsType,
  UnreadMessageResType,
} from "../../actions/types";
import chatDate from "../../validation/chatDate";
import isEmpty from "../../validation/is-empty";
import { apiURL } from "../../config/config";
import { RootState } from "../../reducers/store";

interface GroupFestivalProps {
  item: ScheduleListPropsType;
  socket: Socket;
  unReadMessageCountData: UnreadMessageResType | null;
  setUnreadMsgFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupFestival: React.FC<GroupFestivalProps> = ({
  item,
  socket,
  unReadMessageCountData,
  setUnreadMsgFlag,
}: GroupFestivalProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [groupChatModalName, setGroupChatModalName] = useState<string>("");

  const handleGroupChatModal = (name: string) => {
    setIsOpen(true);
    setGroupChatModalName(name);
    setUnreadMsgFlag(true);
  };

  const handleCancelChatModel = () => {
    setIsOpen(false);
    setUnreadMsgFlag(false);
  };

  return (
    <>
      <div
        className="chat-user-view"
        onClick={() => handleGroupChatModal(item.title)}
      >
        <div className="chat-user-avatar-view">
          <IonImg
            src={apiURL + "/festival/" + item.imageUrl}
            className="chat-user-avatar"
            alt="user avatar"
          />
        </div>
        <div className="chat-user-text-view">
          <IonText className="chat-user-name">{item.title}</IonText>
          <IonText className="chat-user-last-message">{item.title}</IonText>
        </div>
        <div className="chat-user-date-view">
          <IonText className="chat-user-date">
            {chatDate(item.beginDate)}
          </IonText>
          {!isEmpty(unReadMessageCountData) && (
            <>
              {!isEmpty(
                unReadMessageCountData?.unReadUsers.filter((unReadData) => {
                  return String(unReadData.user) === auth.user.id;
                })
              ) && (
                <>
                  {unReadMessageCountData?.unReadUsers.filter((unReadData) => {
                    return String(unReadData.user) === auth.user.id;
                  })[0]?.unReadCount !== 0 && (
                    <div className="chat-user-unread-msg">
                      {
                        unReadMessageCountData?.unReadUsers.filter(
                          (unReadData) => {
                            return String(unReadData.user) === auth.user.id;
                          }
                        )[0]?.unReadCount
                      }
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{groupChatModalName}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => handleCancelChatModel()}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <GroupPrivateChat festivalItem={item} socket={socket} />
        </IonContent>
      </IonModal>
    </>
  );
};

export default GroupFestival;
