import { IonContent, IonPage } from "@ionic/react";
import Header from "../../components/layout/Header";
import Map from "../../components/map/Map";
import "../../styles/Map.css";

const MapPage: React.FC = () => {
  return (
    <IonPage>
      <Header title="Schedule" />
      <IonContent className="schedule-view">
        <Map />
      </IonContent>
    </IonPage>
  );
};

export default MapPage;
