import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendar, map, chatbox } from "ionicons/icons";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

// redux store
import { RootState } from "./reducers/store";

// components
import SchedulePage from "./pages/SchedulePage";
import MapPage from "./pages/map/MapPage";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Loading from "./components/Loading";
import AuthLayout from "./components/layout/AuthLayout";
import { apiURL } from "./config/config";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./styles/auth/Auth.css";
import "./theme/variables.css";

setupIonicReact();

const socket = socketIOClient(apiURL);

const App: React.FC = () => {
  const loading = useSelector((state: RootState) => state.loading.loading);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <AuthLayout socket={socket}>
              <Route exact path="/schedules">
                <SchedulePage socket={socket} />
              </Route>
              <Route exact path="/maps">
                <MapPage />
              </Route>
              <Route exact path="/chats">
                <ChatPage socket={socket} />
              </Route>
            </AuthLayout>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="schedules" href="/schedules">
              <IonIcon aria-hidden="true" icon={calendar} />
              <IonLabel>Schedules</IonLabel>
            </IonTabButton>
            <IonTabButton tab="maps" href="/maps">
              <IonIcon aria-hidden="true" icon={map} />
              <IonLabel>Maps</IonLabel>
            </IonTabButton>
            <IonTabButton tab="chats" href="/chats">
              <IonIcon aria-hidden="true" icon={chatbox} />
              <IonLabel>Chats</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <Route exact path="/">
          <Redirect to="/schedules" />
        </Route>
        <AuthLayout socket={socket}>
          <Route exact path="/login">
            <Login socket={socket} />
          </Route>
          <Route exact path="/register">
            <Register socket={socket} />
          </Route>
        </AuthLayout>
      </IonReactRouter>
      {loading && <Loading loading={loading} />}
    </IonApp>
  );
};

export default App;
