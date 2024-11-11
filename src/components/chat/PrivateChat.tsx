import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { IonContent, IonText } from "@ionic/react";
import { Http } from "@capacitor-community/http";
import { handleSetUserList } from "../../reducers/userReducer";
import { PrivateUnReadMessageResType } from "../../actions/types";
import PrivateUser from "./PrivateUser";
import { RootState } from "../../reducers/store";
import isEmpty from "../../validation/is-empty";
import { apiURL } from "../../config/config";

interface PrivateChatProps {
  socket: Socket;
}

const PrivateChat: React.FC<PrivateChatProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const userList = useSelector((state: RootState) => state.users.users);
  const [unReadMessageCountList, setUnReadMessageCountList] = useState<
    PrivateUnReadMessageResType[]
  >([]);
  const [unreadMsgFlag, setUnreadMsgFlag] = useState<boolean>(false);
  const [totalMsgCount, setTotalMsgCount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    init();
  }, [unreadMsgFlag]);

  useEffect(() => {
    init();
  }, [totalMsgCount]);

  useEffect(() => {
    handleGetUserList();
  }, [totalUserCount]);

  const handleGetUserList = async () => {
    try {
      const res = await Http.request({
        method: "GET",
        url: apiURL + "/api/users/getUsers",
      });

      if (res.status === 200) {
        dispatch(handleSetUserList(res.data));
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

  const init = async () => {
    try {
      const res = await Http.request({
        method: "POST",
        url: apiURL + "/api/chats/getPrivateUnReadMessageList",
        headers: {
          "Content-Type": "application/json",
        },
        data: { recipient: auth.user.id },
      });

      if (res.status === 200) {
        setUnReadMessageCountList(res.data);
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

  socket.on("receiveMessageToPrivate", (msgData: any) => {
    setTotalMsgCount(msgData.totalMsgNum);
  });

  socket.on("updateRegisteredUser", (msgData: any) => {
    setTotalUserCount(msgData.totalMsgNum);
  });

  return (
    <IonContent className="chat-content-view">
      <IonContent className="chat-message-view">
        {!isEmpty(userList) ? (
          userList
            .filter((filterItem) => filterItem.id !== auth.user.id)
            .map((item, key) => {
              return (
                <PrivateUser
                  key={key}
                  socket={socket}
                  item={item}
                  unReadMessageCountData={unReadMessageCountList}
                  setUnreadMsgFlag={setUnreadMsgFlag}
                />
              );
            })
        ) : (
          <IonContent className="chat-empty-view">
            <IonText className="chat-empty-text">No Users</IonText>
          </IonContent>
        )}
      </IonContent>
    </IonContent>
  );
};

export default PrivateChat;
