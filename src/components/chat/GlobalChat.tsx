import React, { useState, useRef, useEffect } from "react";
import {
    IonButton,
    IonContent,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput
} from "@ionic/react";
import { arrowDownCircle, paperPlane } from "ionicons/icons";
import { useSelector } from "react-redux";
import { Http } from "@capacitor-community/http";
import { Socket } from "socket.io-client";
import Message from "./Message";
import { GlobalChatHistoryResType, MessagePropsType } from "../../actions/types";
import { RootState } from "../../reducers/store";
import { getTimeDifference } from "../../validation/getTimeDifference";
import { apiURL } from "../../config/config";
import isEmpty from "../../validation/is-empty";

interface GlobalChatProps {
    socket: Socket;
    handleSetGlobalUnreadFlag: (globalFlag: number) => void;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ socket, handleSetGlobalUnreadFlag }) => {
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

    useEffect(() => {
        async function init() {
            await handleGetGlobalChatHistory(pageCount);
        }

        init();
    }, []);

    useEffect(() => {
        if (!isEmpty(messageList)) {
            if (unreadMessageCount <= 0) scrollToBottom(true);

            if (pageCount > chatHisTotalCount) setInfiniteScrollFlag(true);
            else setInfiniteScrollFlag(false);
        }
    }, [messageList, unreadMessageCount]);

    // infinite scroll event
    const handleLoadMoreMessages = async (ev: any) => {
        try {
            if (ev && ev.target)
                setTimeout(async () => {
                    setPageCount(pageCount + 20);
                    await handleGetGlobalChatHistory(pageCount + 20);
                    ev.target.complete();

                    if (pageCount + 20 > chatHisTotalCount) setInfiniteScrollFlag(true);
                }, 200);
            else console.log("error");
        } catch (err) {
            console.log(err);
        }
    };

    // get chat history action
    const handleGetGlobalChatHistory = async (pageCount: number) => {
        try {
            const res = await Http.request({
                method: "POST",
                url: apiURL + "/api/chats/getGlobalChatData",
                headers: {
                    "Content-Type": "application/json"
                },
                data: { pageCount }
            });

            if (res.status === 200)
                if (isEmpty(res.data.results)) {
                    setMessageList([]);
                } else {
                    const tempMessageList: GlobalChatHistoryResType[] = [];
                    setChatHisTotalCount(res.data.totalCount);

                    const results = res.data.results.sort(
                        (a: GlobalChatHistoryResType, b: GlobalChatHistoryResType) => {
                            const dateA = new Date(a.created_date);
                            const dateB = new Date(b.created_date);
                            return dateA.getTime() - dateB.getTime();
                        }
                    );

                    for (let i = 0; i < results.length; i++)
                        if (i !== 0)
                            tempMessageList.push({
                                _id: results[i]._id,
                                created_date: results[i].created_date,
                                message: results[i].message,
                                user: results[i].user,
                                duplicationFlag: !!(
                                    results[i].user._id === results[i - 1].user._id &&
                                    getTimeDifference(
                                        results[i - 1].created_date,
                                        results[i].created_date
                                    ) <= 30
                                )
                            });
                        else
                            tempMessageList.push({
                                _id: results[i]._id,
                                created_date: results[i].created_date,
                                message: results[i].message,
                                user: results[i].user,
                                duplicationFlag: false
                            });

                    setMessageList([
                        ...tempMessageList.map((item: GlobalChatHistoryResType) => {
                            return {
                                id: item.user._id,
                                avatar: item.user.avatar,
                                created_date: item.created_date,
                                message: item.message,
                                username: item.user.username,
                                flag: item.user._id === auth.user.id,
                                duplicationFlag: item.duplicationFlag
                            };
                        }),
                        ...messageList
                    ]);
                }
        } catch (err) {
            console.log("Request Failed: ", err);
        }
    };

    const handleChatContentScroll = async (event: CustomEvent) => {
        if (chatContentScrollRef.current) {
            const scrollElement = await chatContentScrollRef.current.getScrollElement();

            const { scrollTop, scrollHeight, clientHeight } = scrollElement;

            if (scrollHeight - scrollTop >= clientHeight + 20) {
                setBottomFlag(true);
            } else {
                setBottomFlag(false);
                setUnreadMessageCount(0);
                handleSetGlobalUnreadFlag(0);
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
            } else if (scrollTop === scrollHeight - clientHeight) {
                scrollableElement.scrollToBottom(0);
                setUnreadMessageCount(0);
                handleSetGlobalUnreadFlag(0);
            } else {
                setUnreadMessageCount(unreadMessageCount + 1);
                handleSetGlobalUnreadFlag(unreadMessageCount + 1);
            }
        }
    };

    // receive the updated message from others
    socket.on("updateMessages", (msgData) => {
        if (isEmpty(messageList[messageList.length - 1]))
            setMessageList([
                ...messageList,
                {
                    ...msgData,
                    flag: false,
                    duplicationFlag: false
                }
            ]);
        else
            setMessageList([
                ...messageList,
                {
                    ...msgData,
                    flag: false,
                    duplicationFlag: !!(
                        messageList[messageList.length - 1].id === msgData.id &&
                        getTimeDifference(
                            msgData.created_date,
                            messageList[messageList.length - 1].created_date
                        ) <= 30
                    )
                }
            ]);

        scrollToBottom(false);
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
                message,
                username: auth.user.username
            };

            socket.emit("message", msgData);

            if (isEmpty(messageList[messageList.length - 1]))
                setMessageList([
                    ...messageList,
                    {
                        ...msgData,
                        flag: true,
                        duplicationFlag: false
                    }
                ]);
            else
                setMessageList([
                    ...messageList,
                    {
                        ...msgData,
                        flag: true,
                        duplicationFlag: !!(
                            messageList[messageList.length - 1].id === msgData.id &&
                            getTimeDifference(
                                msgData.created_date,
                                messageList[messageList.length - 1].created_date
                            ) <= 30
                        )
                    }
                ]);

            setUnreadMessageCount(0);
            handleSetGlobalUnreadFlag(0);
            setMessage(""); // clear message text
            scrollToBottom(true);
            chatInputRef.current?.setFocus();
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
            message,
            username: auth.user.username
        };

        socket.emit("message", msgData);

        if (isEmpty(messageList[messageList.length - 1]))
            setMessageList([
                ...messageList,
                {
                    ...msgData,
                    flag: true,
                    duplicationFlag: false
                }
            ]);
        else
            setMessageList([
                ...messageList,
                {
                    ...msgData,
                    flag: true,
                    duplicationFlag: !!(
                        messageList[messageList.length - 1].id === msgData.id &&
                        getTimeDifference(
                            msgData.created_date,
                            messageList[messageList.length - 1].created_date
                        ) <= 30
                    )
                }
            ]);

        setUnreadMessageCount(0);
        handleSetGlobalUnreadFlag(0);
        setMessage(""); // clear message text
        scrollToBottom(true);
        chatInputRef.current?.setFocus();
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
                    onIonInput={(e: Event) => setMessage((e.target as HTMLInputElement).value)}
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
                <div className="chat-bottom-cursor" onClick={() => scrollToBottom(true)}>
                    <IonIcon icon={arrowDownCircle} color="primary" size="large" />
                </div>
            )}
            {unreadMessageCount > 0 && (
                <div className="chat-unread-message-alert" onClick={() => scrollToBottom(true)}>
                    You have {unreadMessageCount} new messages
                </div>
            )}
        </div>
    );
};

export default GlobalChat;
