import React, { useState, useRef, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
} from "@ionic/react";
import { arrowDownCircle, paperPlane } from "ionicons/icons";
import { useSelector } from "react-redux";
import { Http } from "@capacitor-community/http";
import { Socket } from "socket.io-client";
import Message from "./Message";
import {
  GroupChatHistoryResType,
  MessagePropsType,
  ScheduleListPropsType,
} from "../../actions/types";
import { RootState } from "../../reducers/store";
import { getTimeDifference } from "../../validation/getTimeDifference";
import isEmpty from "../../validation/is-empty";
import { apiURL } from "../../config/config";

interface GroupPrivateChatProps {
  socket: Socket;
  festivalItem: ScheduleListPropsType;
}

const GroupPrivateChat: React.FC<GroupPrivateChatProps> = ({
  socket,
  festivalItem,
}) => {
  const chatContentScrollRef = useRef<HTMLIonContentElement | null>(null);
  const chatInputRef = useRef<HTMLIonInputElement>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const [pageCount, setPageCount] = useState(20);
  const [chatHisTotalCount, setChatHisTotalCount] = useState(0);
  const [infiniteScrollFlag, setInfiniteScrollFlag] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Array<MessagePropsType>>([]);
  const [bottomFlag, setBottomFlag] = useState<boolean>(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [messageData, setMessageData] = useState({});

  useEffect(() => {
    const init = async () => {
      await handleGetGroupChatHistory(pageCount);
    };

    init();
  }, []);

  useEffect(() => {
    if (!isEmpty(messageList)) {
      if (unreadMessageCount <= 0) {
        scrollToBottom(true);
      }

      if (pageCount > chatHisTotalCount) {
        setInfiniteScrollFlag(true);
      } else {
        setInfiniteScrollFlag(false);
      }
    }
  }, [messageList, unreadMessageCount]);

  useEffect(() => {
    if (!isEmpty(messageData)) {
      handleReceiveMessageToGroup(messageData);
    }
  }, [messageData]);

  // infinite scroll event
  const handleLoadMoreMessages = async (ev: any) => {
    try {
      if (ev && ev.target) {
        setTimeout(async () => {
          setPageCount(pageCount + 20);
          await handleGetGroupChatHistory(pageCount + 20);
          ev.target.complete();

          if (pageCount + 20 > chatHisTotalCount) {
            setInfiniteScrollFlag(true);
          }
        }, 200);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get chat history action
  const handleGetGroupChatHistory = async (pageCount: number) => {
    try {
      const res = await Http.request({
        method: "POST",
        url: apiURL + "/api/chats/getGroupChatData",
        headers: {
          "Content-Type": "application/json",
        },
        data: { pageCount, festivalID: festivalItem._id },
      });

      if (res.status === 200) {
        if (isEmpty(res.data.results)) {
          setMessageList([]);
        } else {
          let tempMessageList: GroupChatHistoryResType[] = [];
          setChatHisTotalCount(res.data.totalCount);

          const results = res.data.results.sort(
            (a: GroupChatHistoryResType, b: GroupChatHistoryResType) => {
              const dateA = new Date(a.created_date);
              const dateB = new Date(b.created_date);
              return dateA.getTime() - dateB.getTime();
            }
          );

          for (let i = 0; i < results.length; i++) {
            if (i !== 0) {
              tempMessageList.push({
                _id: results[i]._id,
                created_date: results[i].created_date,
                message: results[i].message,
                user: results[i].user,
                duplicationFlag:
                  results[i].user._id === results[i - 1].user._id &&
                  getTimeDifference(
                    results[i - 1].created_date,
                    results[i].created_date
                  ) <= 30
                    ? true
                    : false,
              });
            } else {
              tempMessageList.push({
                _id: results[i]._id,
                created_date: results[i].created_date,
                message: results[i].message,
                user: results[i].user,
                duplicationFlag: false,
              });
            }
          }

          setMessageList([
            ...tempMessageList.map((item: GroupChatHistoryResType) => {
              return {
                id: item.user._id,
                avatar: item.user.avatar,
                created_date: item.created_date,
                message: item.message,
                username: item.user.username,
                flag: item.user._id === auth.user.id ? true : false,
                duplicationFlag: item.duplicationFlag,
              };
            }),
            ...messageList,
          ]);
        }
        handleSaveUnreadMessageCount(0);
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

  const handleChatContentScroll = async (event: CustomEvent) => {
    if (chatContentScrollRef.current) {
      const scrollElement =
        await chatContentScrollRef.current.getScrollElement();

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;

      if (scrollHeight - scrollTop >= clientHeight + 20) {
        setBottomFlag(true);
      } else {
        setBottomFlag(false);
        setUnreadMessageCount(0);
        handleSaveUnreadMessageCount(0);
      }
    }
  };

  // set scroll to bottom
  const scrollToBottom = async (type: boolean) => {
    const scrollableElement = chatContentScrollRef.current;
    if (scrollableElement) {
      const scrollElement = await scrollableElement.getScrollElement();
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;

      if (type) {
        scrollableElement.scrollToBottom(0);
      } else {
        if (scrollTop === scrollHeight - clientHeight) {
          scrollableElement.scrollToBottom(0);
          setUnreadMessageCount(0);
          handleSaveUnreadMessageCount(0);
        } else {
          setUnreadMessageCount(unreadMessageCount + 1);
          handleSaveUnreadMessageCount(unreadMessageCount + 1);
        }
      }
    }
  };

  const handleReceiveMessageToGroup = (msgData: any) => {
    if (festivalItem._id === msgData.festival) {
      if (isEmpty(messageList[messageList.length - 1])) {
        setMessageList([
          ...messageList,
          {
            ...msgData,
            flag: false,
            duplicationFlag: false,
          },
        ]);
      } else {
        setMessageList([
          ...messageList,
          {
            ...msgData,
            flag: false,
            duplicationFlag:
              messageList[messageList.length - 1].id === msgData.id &&
              getTimeDifference(
                msgData.created_date,
                messageList[messageList.length - 1].created_date
              ) <= 30
                ? true
                : false,
          },
        ]);
      }

      scrollToBottom(false);
    }
  };

  // receive the updated message from others
  socket.on("receiveMessageToGroup", (msgData) => {
    setMessageData(msgData);
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter") {
      if (message.trim() === "") {
        setMessage("");
        chatInputRef.current?.setFocus();
        return;
      }

      const msgData = {
        id: auth.user.id,
        avatar: auth.user.avatar,
        created_date: new Date(),
        message: message,
        username: auth.user.username,
        festival: festivalItem._id,
      };

      socket.emit("sendMessageToGroup", msgData);

      if (isEmpty(messageList[messageList.length - 1])) {
        setMessageList([
          ...messageList,
          {
            ...msgData,
            flag: true,
            duplicationFlag: false,
          },
        ]);
      } else {
        setMessageList([
          ...messageList,
          {
            ...msgData,
            flag: true,
            duplicationFlag:
              messageList[messageList.length - 1].id === msgData.id &&
              getTimeDifference(
                msgData.created_date,
                messageList[messageList.length - 1].created_date
              ) <= 30
                ? true
                : false,
          },
        ]);
      }

      setMessage(""); // clear message text
      scrollToBottom(true);
      chatInputRef.current?.setFocus();
      setUnreadMessageCount(0);
      handleSaveUnreadMessageCount(0);
    }
  };

  const handleSendMsg = () => {
    if (message.trim() === "") {
      setMessage("");
      chatInputRef.current?.setFocus();
      return;
    }

    const msgData = {
      id: auth.user.id,
      avatar: auth.user.avatar,
      created_date: new Date(),
      message: message,
      username: auth.user.username,
      festival: festivalItem._id,
    };

    socket.emit("sendMessageToGroup", msgData);

    if (isEmpty(messageList[messageList.length - 1])) {
      setMessageList([
        ...messageList,
        {
          ...msgData,
          flag: true,
          duplicationFlag: false,
        },
      ]);
    } else {
      setMessageList([
        ...messageList,
        {
          ...msgData,
          flag: true,
          duplicationFlag:
            messageList[messageList.length - 1].id === msgData.id &&
            getTimeDifference(
              msgData.created_date,
              messageList[messageList.length - 1].created_date
            ) <= 30
              ? true
              : false,
        },
      ]);
    }

    setMessage(""); // clear message text
    scrollToBottom(true);
    chatInputRef.current?.setFocus();
    setUnreadMessageCount(0);
    handleSaveUnreadMessageCount(0);
  };

  const handleSaveUnreadMessageCount = async (count: number) => {
    const paramData = {
      user: auth.user.id,
      festival: festivalItem._id,
      unReadMessageCount: count,
    };

    try {
      const res = await Http.request({
        method: "POST",
        url: apiURL + "/api/chats/saveUnReadMessageCount",
        headers: {
          "Content-Type": "application/json",
        },
        data: paramData,
      });

      if (res.status === 200) {
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

  return (
    <div className="chat-content-view">
      <IonContent
        className="chat-message-view"
        ref={chatContentScrollRef}
        scrollEvents={true}
        onIonScroll={handleChatContentScroll}
      >
        <IonInfiniteScroll
          position="top"
          threshold="10px"
          onIonInfinite={handleLoadMoreMessages}
          disabled={infiniteScrollFlag}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
        {messageList.map((item, key) => {
          return <Message key={key} item={item} />;
        })}
      </IonContent>
      <div className="chat-input-view">
        <IonInput
          type="text"
          className="chat-input-text"
          placeholder="Type a message..."
          value={message}
          ref={chatInputRef}
          onIonInput={(e: Event) =>
            setMessage((e.target as HTMLInputElement).value)
          }
          onKeyDown={handleKeyDown}
        />
        <IonButton
          type="button"
          shape="round"
          fill="clear"
          className="chat-send-btn"
          onClick={handleSendMsg}
        >
          <IonIcon
            className="chat-send-btn-icon"
            color="light"
            size="small"
            icon={paperPlane}
          />
        </IonButton>
      </div>
      {bottomFlag && (
        <div
          className="chat-bottom-cursor"
          onClick={() => scrollToBottom(true)}
        >
          <IonIcon icon={arrowDownCircle} color="primary" size="large" />
        </div>
      )}
      {unreadMessageCount > 0 && (
        <div
          className="chat-unread-message-alert"
          onClick={() => scrollToBottom(true)}
        >
          You have {unreadMessageCount} new messages
        </div>
      )}
    </div>
  );
};

export default GroupPrivateChat;
