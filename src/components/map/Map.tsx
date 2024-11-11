import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, location } from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import MapSwiperComponent from "./MapSwiperComponent";
import MapPreview from "../../pages/map/MapPreview";
import { RootState } from "../../reducers/store";
import { apiURL } from "../../config/config";

import "swiper/css";
import "@ionic/react/css/ionic-swiper.css";

const Map: React.FC = () => {
  const festivalList = useSelector(
    (state: RootState) => state.festivals.festivals
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sliderActiveIndex, setSliderActiveIndex] = useState<number>(0);
  const [mapViewFlag, setMapViewFlag] = useState<boolean>(false);

  const handleChangeSlider = (swiper: any) => {
    setSliderActiveIndex(swiper.activeIndex);
  };

  const handleClickMapSlider = (flag: boolean) => {
    setMapViewFlag(flag);
  };

  return (
    <IonContent>
      <Swiper
        className="map-slider-view"
        navigation={true}
        onSlideChange={handleChangeSlider}
      >
        <div className="map-view-modal-btn-view">
          <IonButton fill="clear" onClick={() => setIsOpen(true)}>
            <IonIcon slot="icon-only" icon={location} size="large"></IonIcon>
          </IonButton>
        </div>
        {festivalList.map((item, key) => {
          const mapImageUrl =
            item.location.toLowerCase().split(" ").join("_") + ".jpg";
          return (
            <SwiperSlide
              className="map-slider-item"
              key={key}
              style={{
                backgroundImage: "url(" + apiURL + "/map/" + mapImageUrl + ")",
              }}
              onClick={() => handleClickMapSlider(true)}
            >
              <MapSwiperComponent
                item={item}
                sliderActiveIndex={sliderActiveIndex}
                mapViewFlag={mapViewFlag}
                handleClickMapSlider={handleClickMapSlider}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Map</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <MapPreview />
        </IonContent>
      </IonModal>
    </IonContent>
  );
};

export default React.memo(Map);
