import React, { useState, useRef } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { add, remove } from "ionicons/icons";
import { apiURL } from "../../config/config";

const MapPreview: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 0.1);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const handleStartPanning = (
    event:
      | React.MouseEvent<HTMLImageElement>
      | React.TouchEvent<HTMLImageElement>
  ) => {
    let clientX = 0;
    let clientY = 0;

    if (event.type === "mousedown") {
      clientX = (event as React.MouseEvent<HTMLImageElement>).clientX;
      clientY = (event as React.MouseEvent<HTMLImageElement>).clientY;
    } else {
      clientX = (event as React.TouchEvent<HTMLImageElement>).touches[0]
        .clientX;
      clientY = (event as React.TouchEvent<HTMLImageElement>).touches[0]
        .clientY;
    }

    setStartPanPosition({
      x: clientX - panOffset.x,
      y: clientY - panOffset.y,
    });

    // Enable moving tracking
    document.addEventListener("mousemove", handlePanning);
    document.addEventListener("touchmove", handlePanning);
    document.addEventListener("mouseup", handleStopPanning);
    document.addEventListener("touchend", handleStopPanning);
  };

  const handlePanning = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    let clientX = 0;
    let clientY = 0;

    if (event.type === "mousemove") {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    } else {
      clientX = (event as TouchEvent).touches[0].clientX;
      clientY = (event as TouchEvent).touches[0].clientY;
    }

    const newPanOffset = {
      x: clientX - startPanPosition.x,
      y: clientY - startPanPosition.y,
    };

    setPanOffset(newPanOffset);
  };

  const handleStopPanning = () => {
    // Disable moving tracking
    document.removeEventListener("mousemove", handlePanning);
    document.removeEventListener("touchmove", handlePanning);
    document.removeEventListener("mouseup", handleStopPanning);
    document.removeEventListener("touchend", handleStopPanning);
  };

  return (
    <div className="map-preview-view">
      <div className="map-image-container">
        <img
          ref={imageRef}
          src={apiURL + "/map/map.jpg"}
          alt="Preview"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transition: "transform 0.1s ease-out",
            touchAction: "none",
          }}
          onMouseDown={handleStartPanning}
          onTouchStart={handleStartPanning}
        />
      </div>
      <div className="map-image-zoom-button-group">
        <IonButton onClick={handleZoomIn} size="large" fill="clear">
          <IonIcon icon={add} slot="icon-only" />
        </IonButton>
        <IonButton onClick={handleZoomOut} size="large" fill="clear">
          <IonIcon icon={remove} slot="icon-only" />
        </IonButton>
      </div>
    </div>
  );
};

export default MapPreview;
