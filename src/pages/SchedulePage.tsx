import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonContent, IonPage, IonText } from "@ionic/react";
import { Socket } from "socket.io-client";
import { Http } from "@capacitor-community/http";
import Header from "../components/layout/Header";
import ScheduleList from "../components/schedule/ScheduleList";
import AddScheduleComponent from "../components/schedule/AddScheduleComponent";
import { ScheduleListPropsType } from "../actions/types";
import { handleSetUserList } from "../reducers/userReducer";
import { handleSetLoading } from "../reducers/loadingReducer";
import { handleSetFestival } from "../reducers/festivalReducer";
import { apiURL } from "../config/config";
import "../styles/Schedule.css";
import isEmpty from "../validation/is-empty";
import { RootState } from "../reducers/store";

interface SchedulePageProps {
  socket: Socket;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [startedFestivalList, setStartedFestivalList] = useState<
    ScheduleListPropsType[]
  >([]);
  const [upcomingFestivalList, setUpcomingFestivalList] = useState<
    ScheduleListPropsType[]
  >([]);
  const [endedFestivalList, setEndedFestivalList] = useState<
    ScheduleListPropsType[]
  >([]);
  const [newUpdateFlag, setNewUpdateFlag] = useState<boolean>(false);

  async function init() {
    dispatch(handleSetLoading(true));
    await handleGetFestivalList();
    await handleGetUserList();
    dispatch(handleSetLoading(false));
    setNewUpdateFlag(false);
  }

  useEffect(() => {
    init();
  }, [newUpdateFlag]);

  const handleGetFestivalList = async () => {
    try {
      const res = await Http.request({
        method: "GET",
        url: apiURL + "/api/festivals/getFestivalData",
      });

      if (res.status === 200) {
        const results = res.data;

        setStartedFestivalList(
          results.filter((item: ScheduleListPropsType) => {
            const currentDateTime = new Date();
            const endDateTime = new Date(item.endDate);
            const beginDateTime = new Date(item.beginDate);
            return (
              Number(currentDateTime) < Number(endDateTime) &&
              Number(currentDateTime) > Number(beginDateTime)
            );
          })
        );
        setUpcomingFestivalList(
          results.filter((item: ScheduleListPropsType) => {
            const currentDateTime = new Date();
            const endDateTime = new Date(item.endDate);
            const beginDateTime = new Date(item.beginDate);
            return Number(currentDateTime) < Number(beginDateTime);
          })
        );
        setEndedFestivalList(
          results.filter((item: ScheduleListPropsType) => {
            const currentDateTime = new Date();
            const endDateTime = new Date(item.endDate);
            const beginDateTime = new Date(item.beginDate);
            return Number(currentDateTime) > Number(endDateTime);
          })
        );

        dispatch(handleSetFestival(res.data));
      }
    } catch (err) {
      console.log("Request Failed: ", err);
    }
  };

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

  return (
    <IonPage>
      <Header title="Schedule" />
      <IonContent className="schedule-view">
        {!isEmpty(startedFestivalList) && (
          <div className="schedule-part-section schedule-part-section-started">
            <IonText className="schedule-part-section-text schedule-status-view-progressing">
              Started
            </IonText>
            {startedFestivalList.map((item, key) => {
              return <ScheduleList item={item} key={key} />;
            })}
          </div>
        )}
        {!isEmpty(upcomingFestivalList) && (
          <div className="schedule-part-section schedule-part-section-upcoming">
            <IonText className="schedule-part-section-text schedule-status-view-upcoming">
              Upcoming
            </IonText>
            {upcomingFestivalList.map((item, key) => {
              return <ScheduleList item={item} key={key} />;
            })}
          </div>
        )}
        {!isEmpty(endedFestivalList) && (
          <div className="schedule-part-section schedule-part-section-ended">
            <IonText className="schedule-part-section-text schedule-status-view-end">
              Ended
            </IonText>
            {endedFestivalList.map((item, key) => {
              return <ScheduleList item={item} key={key} />;
            })}
          </div>
        )}

        {!isEmpty(auth) && auth.user.username === "administrator" && (
          <AddScheduleComponent
            setNewUpdateFlag={setNewUpdateFlag}
            socket={socket}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default SchedulePage;
