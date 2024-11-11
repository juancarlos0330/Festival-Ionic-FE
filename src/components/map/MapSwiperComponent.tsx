import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  checkbox,
  chevronForwardOutline,
  close,
  location,
  locationOutline,
  personOutline,
  timeOutline,
} from "ionicons/icons";
import { Http } from "@capacitor-community/http";

import {
  FestivalStatusItemType,
  ScheduleListPropsType,
} from "../../actions/types";
import { RootState } from "../../reducers/store";
import { handleSetLoading } from "../../reducers/loadingReducer";
import getDateFormat from "../../validation/getDateFormat";
import {
  getFestivalMonth,
  getFestivalTime,
  getFestivalTimeDifference,
  getFestivalTimeStatus,
} from "../../validation/getTimeDifference";
import isEmpty from "../../validation/is-empty";
import { apiURL } from "../../config/config";

type ClickEvent = any;

type HandleClickMapSliderType = (flag: ClickEvent) => void;

interface props {
  item: ScheduleListPropsType;
  sliderActiveIndex: number;
  mapViewFlag: boolean;
  handleClickMapSlider: HandleClickMapSliderType;
}

const MapSwiperComponent: React.FC<props> = ({
  item,
  sliderActiveIndex,
  mapViewFlag,
  handleClickMapSlider,
}: props) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const userList = useSelector((state: RootState) => state.users.users);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userFlag, setUserFlag] = useState<boolean>(false);
  const [joinStatus, setJoinStatus] = useState(0);
  const [festivalStatusList, setFestivalStatusList] = useState<
    FestivalStatusItemType[]
  >([]);
  const [mapItemViewFlag, setMapItemViewFlag] = useState<boolean>(false);

  useEffect(() => {
    setMapItemViewFlag(mapViewFlag);
  }, [mapViewFlag]);

  useEffect(() => {
    handleClickMapSlider(false);
    setMapItemViewFlag(false);
  }, [sliderActiveIndex]);

  const handleShowFestivalDetail = async () => {
    dispatch(handleSetLoading(true));
    setIsOpen(true);

    const res = await Http.request({
      method: "POST",
      url: apiURL + "/api/festivals/getStatus",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        festivalId: item._id,
      },
    });

    if (res.status === 200) {
      if (!isEmpty(res.data)) {
        const getOneItem = res.data.filter(
          (dataItem: FestivalStatusItemType) => {
            return (
              dataItem.user === auth.user.id && dataItem.festival === item._id
            );
          }
        );

        !isEmpty(getOneItem) && setJoinStatus(getOneItem[0].status);

        setFestivalStatusList(res.data);
      } else {
        setFestivalStatusList([]);
      }
    }
    dispatch(handleSetLoading(false));
  };

  const handleSetFestivalStatus = async (status: number) => {
    dispatch(handleSetLoading(true));

    const res = await Http.request({
      method: "POST",
      url: apiURL + "/api/festivals/addStatus",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        festivalId: item._id,
        userId: auth.user.id,
        status,
      },
    });

    if (res.status === 200) {
      if (res.data.status === "ok") {
        console.log("set success");
      }
    }

    dispatch(handleSetLoading(false));
  };

  return (
    <div
      className={
        mapItemViewFlag
          ? "map-modal-view map-modal-view-show"
          : "map-modal-view"
      }
    >
      <div className="schedule-item-view" onClick={handleShowFestivalDetail}>
        <div className="schedule-image-view">
          <IonImg
            src={apiURL + "/festival/" + item.imageUrl}
            alt="festival image"
            className="schedule-image"
          />
          <div
            className={`schedule-status-view ${getFestivalTimeDifference(
              item.beginDate,
              item.endDate
            )}`}
          ></div>
        </div>
        <div className="schedule-content">
          <IonText className="schedule-title">{item.title}</IonText>
          <div className="schedule-place-view">
            <IonIcon icon={locationOutline} className="schedule-place-icon" />
            <IonText className="schedule-place-text">{item.location}</IonText>
          </div>
          <div className="schedule-date-view">
            <IonIcon icon={timeOutline} className="schedule-date-icon" />
            <IonText className="schedule-date-text">
              {getDateFormat(item.beginDate)}
              {" - "}
              {getDateFormat(item.endDate)}
            </IonText>
          </div>
        </div>
        <div className="schedule-user-count-view">
          <IonText
            className={`schedule-user-logged ${getFestivalTimeDifference(
              item.beginDate,
              item.endDate
            )}`}
          >
            {getFestivalTimeStatus(item.beginDate, item.endDate)}
          </IonText>
        </div>
      </div>
      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>{item.title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="schedule-modal-view">
            <div className="schedule-modal-title-view">
              <IonText className="schedule-modal-title">{item.title}</IonText>
            </div>
            <div className="schedule-modal-description-view">
              <IonText className="schedule-modal-description">
                {item.description}
              </IonText>
            </div>
            <div className="schedule-modal-image-place-view">
              <div className="schedule-modal-image-view">
                <IonImg
                  class="schedule-modal-image"
                  src={apiURL + "/festival/" + item.imageUrl}
                  alt="festival image"
                />
              </div>
              <div className="schedule-modal-place-view">
                <IonIcon
                  icon={location}
                  className="schedule-modal-place-icon"
                />
                <div className="schedule-modal-place">{item.location}</div>
              </div>
              <div className="schedule-modal-going-view">
                <IonText className="schedule-modal-going-text">
                  {getFestivalTimeStatus(item.beginDate, item.endDate) ===
                  "Ended"
                    ? "Have you joined?"
                    : "Are you going to join?"}
                </IonText>
                {getFestivalTimeStatus(item.beginDate, item.endDate) ===
                "Ended" ? (
                  <IonRadioGroup
                    className="schedule-modal-user-radio-group"
                    value={joinStatus.toString()}
                    onIonChange={(ev) =>
                      handleSetFestivalStatus(ev.detail.value)
                    }
                  >
                    <div className="schedule-modal-user-radio">
                      <IonText className="schedule-modal-user-radio-text">
                        Yes
                      </IonText>
                      <IonRadio value="1" />
                    </div>
                    <div className="schedule-modal-user-radio">
                      <IonText className="schedule-modal-user-radio-text">
                        No
                      </IonText>
                      <IonRadio value="0" />
                    </div>
                  </IonRadioGroup>
                ) : (
                  <IonRadioGroup
                    className="schedule-modal-user-radio-group"
                    value={joinStatus.toString()}
                    onIonChange={(ev) =>
                      handleSetFestivalStatus(ev.detail.value)
                    }
                  >
                    <div className="schedule-modal-user-radio">
                      <IonText className="schedule-modal-user-radio-text">
                        Yes
                      </IonText>
                      <IonRadio value="1" />
                    </div>
                    <div className="schedule-modal-user-radio">
                      <IonText className="schedule-modal-user-radio-text">
                        No
                      </IonText>
                      <IonRadio value="0" />
                    </div>
                  </IonRadioGroup>
                )}
              </div>
            </div>
            <div className="schedule-modal-image-place-view">
              <div className="schedule-modal-date-view">
                <IonIcon
                  icon={timeOutline}
                  className="schedule-modal-date-icon"
                />
                <div className="schedule-modal-date-plan-view">
                  <IonText className="schedule-modal-date">
                    {getFestivalMonth(item.beginDate, item.endDate)}
                  </IonText>
                  <IonText className="schedule-modal-date-time">
                    {getFestivalTime(item.beginDate, item.endDate)}
                  </IonText>
                </div>
                <div
                  className={`schedule-modal-status-view ${getFestivalTimeDifference(
                    item.beginDate,
                    item.endDate
                  )}`}
                ></div>
              </div>
              <div
                className={
                  userFlag
                    ? "schedule-modal-people-view schedule-modal-people-view-border"
                    : "schedule-modal-people-view"
                }
                onClick={() => setUserFlag(!userFlag)}
              >
                <IonIcon
                  icon={personOutline}
                  className="schedule-modal-people-icon"
                />
                <div className="schedule-modal-people-plan-view">
                  <IonText className="schedule-modal-count">
                    {
                      festivalStatusList.filter((statusItem) => {
                        return (
                          statusItem.user !== auth.user.id &&
                          statusItem.status === 1
                        );
                      }).length
                    }
                    /{userList?.length - 1}
                  </IonText>
                  <IonText className="schedule-modal-explaination">
                    Participants
                  </IonText>
                </div>
                <div className="schedule-modal-drop-view">
                  <IonIcon
                    icon={chevronForwardOutline}
                    className={
                      userFlag
                        ? "schedule-modal-drop-icon schedule-modal-drop-icon-rotate"
                        : "schedule-modal-drop-icon"
                    }
                  />
                </div>
              </div>
              <div
                className={
                  userFlag
                    ? "schedule-modal-user-group-view schedule-modal-user-group-view-show"
                    : "schedule-modal-user-group-view"
                }
              >
                {userList?.map((item, key) => {
                  if (auth.user.id !== item.id) {
                    return (
                      <div key={key} className="schedule-modal-user-group">
                        <div className="schedule-modal-user-group-avatar-view">
                          <IonImg
                            src={apiURL + "/user/" + item.avatar}
                            className="schedule-modal-user-avatar"
                            alt="user avatar"
                          />
                          {!isEmpty(
                            festivalStatusList.filter((statusItem) => {
                              return (
                                statusItem.user === item.id &&
                                statusItem.status === 1
                              );
                            })
                          ) && (
                            <div className="schedule-modal-user-group-avatar-icon-view">
                              <IonIcon
                                icon={checkbox}
                                className="schedule-modal-user-group-avatar-icon"
                              />
                            </div>
                          )}
                        </div>
                        <div className="schedule-modal-user-group-section">
                          <IonText className="schedule-modal-user-name">
                            {item.username}
                          </IonText>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default MapSwiperComponent;
