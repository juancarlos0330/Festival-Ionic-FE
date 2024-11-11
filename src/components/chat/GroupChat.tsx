import React, { useEffect, useState } from "react";
import { Http } from "@capacitor-community/http";
import { Socket } from "socket.io-client";
import { IonContent, IonText } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { handleSetFestival } from "../../reducers/festivalReducer";
import { UnreadMessageResType } from "../../actions/types";
import { RootState } from "../../reducers/store";
import { apiURL } from "../../config/config";
import GroupFestival from "./GroupFestival";
import isEmpty from "../../validation/is-empty";

interface GroupChatProps {
  socket: Socket;
}

const GroupChat: React.FC<GroupChatProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const festivals = useSelector(
    (state: RootState) => state.festivals.festivals
  );
  const [unReadMessageCountList, setUnReadMessageCountList] = useState<
    UnreadMessageResType[]
  >([]);
  const [unreadMsgFlag, setUnreadMsgFlag] = useState<boolean>(false);
  const [totalMsgCount, setTotalMsgCount] = useState(0);
  const [totalFestivalCount, setTotalFestivalCount] = useState(0);

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
    handleGetFestivalList();
  }, [totalFestivalCount]);

  const init = async () => {
    try {
      const res = await Http.request({
        method: "GET",
        url: apiURL + "/api/chats/getUnReadMessageList",
      });

      if (res.status === 200) {
        setUnReadMessageCountList(res.data);
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

  const handleGetFestivalList = async () => {
    try {
      const res = await Http.request({
        method: "GET",
        url: apiURL + "/api/festivals/getFestivalData",
      });

      if (res.status === 200) {
        dispatch(handleSetFestival(res.data));
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

  socket.on("receiveMessageToGroup", (msgData: any) => {
    setTotalMsgCount(msgData.totalMsgNum);
  });

  socket.on("updateAddedFestival", (msgData: any) => {
    setTotalFestivalCount(msgData.totalMsgNum);
  });

  return (
    <IonContent className="chat-content-view">
      <IonContent className="chat-message-view">
        {!isEmpty(festivals) ? (
          festivals.map((item, key) => {
            const unReadMessageData =
              unReadMessageCountList.filter(
                (unReadMessage: UnreadMessageResType) =>
                  String(unReadMessage.festival) === String(item._id)
              ).length > 0
                ? unReadMessageCountList.filter(
                    (unReadMessage: UnreadMessageResType) =>
                      String(unReadMessage.festival) === String(item._id)
                  )[0]
                : null;
            return (
              <GroupFestival
                key={key}
                socket={socket}
                item={item}
                unReadMessageCountData={unReadMessageData}
                setUnreadMsgFlag={setUnreadMsgFlag}
              />
            );
          })
        ) : (
          <IonContent class="chat-empty-view">
            <IonText class="chat-empty-text">No Group</IonText>
          </IonContent>
        )}
      </IonContent>
    </IonContent>
  );
};

export default GroupChat;
