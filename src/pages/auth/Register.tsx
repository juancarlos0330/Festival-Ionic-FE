import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonInput,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";

import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { person } from "ionicons/icons";
import { Http } from "@capacitor-community/http";
import { Preferences } from "@capacitor/preferences";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

// redux store
import { RootState } from "../../reducers/store";
import { handleSetUser } from "../../reducers/authReducer";
import {
  handleClearErrors,
  handleSetErrors,
} from "../../reducers/errorsReducer";
import { AuthType, ErrorDataType } from "../../actions/types";
import { handleSetLoading } from "../../reducers/loadingReducer";
import { apiURL } from "../../config/config";
import { validateEmail } from "../../validation/validateEmail";
import isEmpty from "../../validation/is-empty";

interface RegisterPageProps {
  socket: Socket;
}

const Register: React.FC<RegisterPageProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector((state: RootState) => state.errors);

  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [errorSelectedImage, setErrorSelectedImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [userCPassword, setUserCPassword] = useState<string>("");
  const [regErrors, setRegErrors] = useState<ErrorDataType>({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    dispatch(handleClearErrors());
  }, []);

  useEffect(() => {
    setRegErrors({
      ...regErrors,
      username: "",
    });
  }, [userName]);

  useEffect(() => {
    setRegErrors({
      ...regErrors,
      email: "",
    });
  }, [userEmail]);

  useEffect(() => {
    setRegErrors({
      ...regErrors,
      password: "",
    });
  }, [userPassword]);

  useEffect(() => {
    setRegErrors({
      ...regErrors,
      password2: "",
    });
  }, [userCPassword]);

  useEffect(() => {
    setRegErrors(errors);
  }, [errors]);

  const setStorage = async (storageData: string) => {
    await Preferences.set({
      key: "jwtToken",
      value: storageData,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    const isValidEmail = validateEmail(userEmail);

    if (!selectedImage) {
      setErrorSelectedImage("no image data");
    }

    setRegErrors({
      ...regErrors,
      username: isEmpty(userName)
        ? "name is required"
        : userName.length < 3 && userName.length > 30
        ? "Name must be between 3 and 30 characters"
        : "",
      email: !isValidEmail ? "Email is invalid" : "",
      password: isEmpty(userPassword)
        ? "Password field is required"
        : userPassword.length < 6 && userPassword.length > 30
        ? "Password must be between 6 and 30 characters"
        : "",
      password2: isEmpty(userCPassword)
        ? "Confirm Password is required"
        : userCPassword.length < 6 && userCPassword.length > 30
        ? "Confirm Password must be between 6 and 30 characters"
        : userPassword !== userCPassword
        ? "Passwords must match"
        : "",
    });

    if (
      selectedImage &&
      !isEmpty(userName) &&
      isValidEmail &&
      !isEmpty(userPassword) &&
      !isEmpty(userCPassword) &&
      userPassword === userCPassword &&
      userName.length >= 3 &&
      userName.length <= 30 &&
      userPassword.length >= 6 &&
      userPassword.length <= 30 &&
      userCPassword.length >= 6 &&
      userCPassword.length <= 30
    ) {
      const regData = {
        image: selectedImage,
        username: userName,
        email: userEmail,
        password: userPassword,
        password2: userCPassword,
      };

      dispatch(handleSetLoading(true));

      try {
        const res = await Http.request({
          method: "POST",
          url: apiURL + "/api/users/reg",
          headers: {
            "Content-Type": "application/json",
          },
          data: regData,
        });

        if (res.status === 200) {
          const { token } = res.data;
          setStorage(token);
          const decode = jwtDecode<AuthType>(token);
          dispatch(handleSetUser(decode));
          dispatch(handleSetLoading(false));
          dispatch(handleClearErrors());
          socket.emit("userconnected", decode);
          socket.emit("userRegistered");
          history.push("/schedules");
        } else {
          dispatch(handleSetErrors(res.data));
          dispatch(handleSetLoading(false));
        }
      } catch (err) {
        dispatch(handleSetLoading(false));
        console.log("Request Failed: ", err);
      }

      dispatch(handleSetLoading(false));
    }
  };

  const handleImageChange = async () => {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        quality: 90,
      });

      setSelectedImage(image.dataUrl);
      setErrorSelectedImage("");
    } catch (error) {
      dispatch(handleSetLoading(false));
      console.error("Error taking photo:", error);
    }
  };

  const handleRoute = (path: string) => {
    history.push(path);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="auth-container">
          <div className="auth-main">
            <div className="auth-title-view">
              <IonText className="auth-title-text">Sign Up</IonText>
            </div>
            <div className="auth-image-view">
              <div
                className={
                  errorSelectedImage === ""
                    ? "auth-image-section"
                    : "auth-error-image-section"
                }
              >
                <div className="auth-image-label" onClick={handleImageChange}>
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
              </div>
            </div>
            <div className="auth-error-image-view">
              {!selectedImage && errorSelectedImage !== "" ? (
                <IonText className="auth-error-image-msg">
                  Image Required.
                </IonText>
              ) : null}
            </div>
            <div className="auth-error-view">
              {regErrors.username && (
                <IonText className="auth-error-msg">
                  {regErrors.username}
                </IonText>
              )}
            </div>
            <div
              className={
                regErrors.username ? "auth-error-input-view" : "auth-input-view"
              }
            >
              <IonInput
                placeholder="User Name"
                className="auth-text-input"
                value={userName}
                onIonInput={(e: Event) =>
                  setUserName((e.target as HTMLInputElement).value)
                }
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="auth-error-view">
              {regErrors.email && (
                <IonText className="auth-error-msg">{regErrors.email}</IonText>
              )}
            </div>
            <div
              className={
                regErrors.email ? "auth-error-input-view" : "auth-input-view"
              }
            >
              <IonInput
                type="email"
                placeholder="User Email"
                className="auth-text-input"
                value={userEmail}
                onIonInput={(e: Event) =>
                  setUserEmail((e.target as HTMLInputElement).value)
                }
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="auth-error-view">
              {regErrors.password && (
                <IonText className="auth-error-msg">
                  {regErrors.password}
                </IonText>
              )}
            </div>
            <div
              className={
                regErrors.password ? "auth-error-input-view" : "auth-input-view"
              }
            >
              <IonInput
                type="password"
                placeholder="Password"
                className="auth-text-input"
                value={userPassword}
                onIonInput={(e: Event) =>
                  setUserPassword((e.target as HTMLInputElement).value)
                }
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="auth-error-view">
              {regErrors.password2 && (
                <IonText className="auth-error-msg">
                  {regErrors.password2}
                </IonText>
              )}
            </div>
            <div
              className={
                regErrors.password2
                  ? "auth-error-input-view"
                  : "auth-input-view"
              }
            >
              <IonInput
                type="password"
                placeholder="Confirm Password"
                className="auth-text-input"
                value={userCPassword}
                onIonInput={(e: Event) =>
                  setUserCPassword((e.target as HTMLInputElement).value)
                }
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="auth-create-view">
              <IonText className="auth-create-title">
                Already have an Account?
              </IonText>
              <IonButton
                type="button"
                fill="clear"
                onClick={() => handleRoute("/login")}
                className="auth-create-button"
              >
                Sign In
              </IonButton>
            </div>
            <IonButton
              type="button"
              shape="round"
              fill="clear"
              className="auth-button-view"
              onClick={handleSignUp}
            >
              Sign Up
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
