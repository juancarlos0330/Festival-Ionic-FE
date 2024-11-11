import React from "react";
import { IonLoading } from "@ionic/react";
import "../styles/Loading.css";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  return (
    <div className="loading-screen">
      <IonLoading className="loading" isOpen={loading} />
    </div>
  );
};

export default Loading;
