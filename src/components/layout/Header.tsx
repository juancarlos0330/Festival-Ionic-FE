import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTitle,
  IonToolbar,
  IonImg,
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import { useDispatch, useSelector } from "react-redux";
import { handleClearUser } from "../../reducers/authReducer";
import { handleSetLoading } from "../../reducers/loadingReducer";
import { RootState } from "../../reducers/store";
import { apiURL } from "../../config/config";

// style
import "../../styles/layout/Header.css";

// props type
type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = (props) => {
  const history = useHistory(); // manage route
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>();

  const openPopover = (e: any) => {
    e.persist();
    setShowPopover(true);
    setPopoverEvent(e);
  };

  const setStorage = async (storageData: string) => {
    await Preferences.set({
      key: "jwtToken",
      value: storageData,
    });
  };

  const handleLogoutUser = () => {
    dispatch(handleSetLoading(true));
    setStorage("");
    dispatch(handleClearUser());
    dispatch(handleSetLoading(false));
    setShowPopover(false);
    history.push("/login");
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{props.title}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={openPopover}>
            <div className="header-avatar-view">
              <IonImg
                class="header-avatar-image"
                src={apiURL + "/user/" + auth.user.avatar}
                alt="User Avatar"
              />
            </div>
          </IonButton>
          <IonPopover
            isOpen={showPopover}
            event={popoverEvent}
            onDidDismiss={() => setShowPopover(false)}
          >
            <IonList>
              <IonItem button onClick={handleLogoutUser}>
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
