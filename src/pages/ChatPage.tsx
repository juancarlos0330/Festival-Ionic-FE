import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import { Socket } from "socket.io-client";
import { heart, globe, person } from "ionicons/icons";
import Header from "../components/layout/Header";
import GlobalChat from "../components/chat/GlobalChat";
import GroupChat from "../components/chat/GroupChat";
import PrivateChat from "../components/chat/PrivateChat";
import "../styles/Chat.css";

interface ChatPageProps {
  socket: Socket;
}

const ChatPage: React.FC<ChatPageProps> = ({ socket }) => {
  const [flag, setFlag] = useState<string>("Global");
  const [globalUnreadCount, setGlobalUnreadCount] = useState<number>(0);

  const handleSetGlobalUnreadFlag = (globalCount: number) => {
    setGlobalUnreadCount(globalCount);
  };

  return (
    <IonPage>
      <Header title="Chat" />
      <IonHeader>
        <IonToolbar color="primary">
          <IonSegment value={flag}>
            <IonSegmentButton
              type="button"
              value="Global"
              layout="icon-start"
              onClick={() => setFlag("Global")}
            >
              <IonLabel>Global</IonLabel>
              <IonIcon icon={globe}></IonIcon>
              {globalUnreadCount > 0 && (
                <div className="chat-unread-msg-box">
                  <div className="chat-unread-msg-box-circle">
                    {globalUnreadCount}
                  </div>
                </div>
              )}
            </IonSegmentButton>
            <IonSegmentButton
              type="button"
              value="Group"
              layout="icon-start"
              onClick={() => setFlag("Group")}
            >
              <IonLabel>Group</IonLabel>
              <IonIcon icon={heart}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton
              type="button"
              value="Private"
              layout="icon-start"
              onClick={() => setFlag("Private")}
            >
              <IonLabel>Private</IonLabel>
              <IonIcon icon={person}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {flag === "Global" ? (
          <GlobalChat
            handleSetGlobalUnreadFlag={handleSetGlobalUnreadFlag}
            socket={socket}
          />
        ) : flag === "Group" ? (
          <GroupChat socket={socket} />
        ) : (
          <PrivateChat socket={socket} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChatPage;
