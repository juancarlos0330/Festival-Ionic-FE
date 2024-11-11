import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { Camera, CameraResultType } from "@capacitor/camera";
import { add, close, person } from "ionicons/icons";
import { Http } from "@capacitor-community/http";
import { handleSetLoading } from "../../reducers/loadingReducer";
import { apiURL } from "../../config/config";
import isEmpty from "../../validation/is-empty";

interface Schedule {
  title: string;
  location: string;
  description: string;
  imageUrl: string | undefined;
  beginDate: Date;
  endDate: Date;
}

interface AddScheduleComponentProps {
  setNewUpdateFlag: (flag: boolean) => void;
  socket: Socket;
}

const AddScheduleComponent: React.FC<AddScheduleComponentProps> = ({
  setNewUpdateFlag,
  socket,
}: AddScheduleComponentProps) => {
  const dispatch = useDispatch();
  const [modalFlag, setModalFlag] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [schedule, setSchedule] = useState<Schedule>({
    title: "",
    location: "",
    description: "",
    imageUrl: undefined,
    beginDate: new Date(),
    endDate: new Date(),
  });

  const locations = [
    "Congo Square Stage",
    "Shell Gentilly Stage",
    "Economy Hall Tent",
    "Heritage Square",
    "Blues Tent",
    "Jazz & Heritage Stage",
    "Heritage Square",
    "Festival Stage",
    "WWOZ Jazz Tent",
    "Economy Hall Tent",
    "Sheraton New Orleans Fais Do-Do Stage",
    "Heritage Square",
    "Gospel Tent",
    "Grand Stand",
  ];

  const handleClickAddFestivalBtn = () => {
    setModalFlag(true);
  };

  const handleInputChange = (e: any) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.detail.value,
    });
  };

  const handleInputDateChange = (e: any, name: string) => {
    setSchedule({
      ...schedule,
      [name]: e.detail.value,
    });
  };

  const handleImageChange = async () => {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        quality: 90,
      });

      setSelectedImage(image.dataUrl);

      setSchedule({
        ...schedule,
        imageUrl: image.dataUrl,
      });
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handleSubmit = async () => {
    if (
      !isEmpty(schedule.title) &&
      !isEmpty(schedule.location) &&
      !isEmpty(schedule.description) &&
      !isEmpty(schedule.imageUrl)
    ) {
      dispatch(handleSetLoading(true));

      try {
        const res = await Http.request({
          method: "POST",
          url: apiURL + "/api/festivals/addFestivalData",
          headers: {
            "Content-Type": "application/json",
          },
          data: schedule,
        });

        if (res.status === 200) {
          console.log("success");
          setNewUpdateFlag(true);
          socket.emit("addNewFestivalToGroupList", { newFestival: res.data });
        }
      } catch (err) {
        console.log("Request Failed: ", err);
      }

      dispatch(handleSetLoading(false));
    }
  };

  return (
    <div className="schedule-add-view">
      <IonButton fill="clear" onClick={handleClickAddFestivalBtn}>
        <IonIcon
          slot="icon-only"
          className="schedule-add-icon"
          icon={add}
          size="large"
          color="default"
        />
      </IonButton>

      <IonModal isOpen={modalFlag}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Add Festival</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setModalFlag(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel position="floating">Image Url</IonLabel>
            <div
              className="auth-image-label"
              style={{ paddingTop: "20px" }}
              onClick={handleImageChange}
            >
              {selectedImage ? (
                <IonThumbnail slot="start" class="auth-image-thumb">
                  <img
                    alt="upload image"
                    className="auth-image-src"
                    src={selectedImage}
                  />
                </IonThumbnail>
              ) : (
                <IonIcon
                  style={{ width: "100%", height: "100%" }}
                  icon={person}
                  color="light"
                />
              )}
            </div>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Title</IonLabel>
            <IonInput
              value={schedule.title}
              onIonChange={handleInputChange}
              name="title"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Location</IonLabel>
            <IonSelect
              onIonChange={handleInputChange}
              value={schedule.location}
              name="location"
            >
              {locations.map((location, index) => (
                <IonSelectOption key={index} value={location}>
                  {location}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonInput
              value={schedule.description}
              onIonChange={handleInputChange}
              name="description"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel>Begin Date</IonLabel>
            <IonDatetime
              value={new Date(schedule.beginDate).toISOString()}
              onIonChange={(e) => handleInputDateChange(e, "beginDate")}
            />
          </IonItem>

          <IonItem>
            <IonLabel>End Date</IonLabel>
            <IonDatetime
              value={new Date(schedule.endDate).toISOString()}
              onIonChange={(e) => {
                handleInputDateChange(e, "endDate");
              }}
            />
          </IonItem>

          <IonButton
            expand="block"
            style={{ color: "#30b98f" }}
            onClick={handleSubmit}
          >
            Add Schedule
          </IonButton>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default AddScheduleComponent;
