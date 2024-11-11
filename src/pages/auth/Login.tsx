import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { Http } from "@capacitor-community/http";
import { useHistory } from "react-router";
import { Socket } from "socket.io-client";
import { Preferences } from "@capacitor/preferences";
import { validateEmail } from "../../validation/validateEmail";
import isEmpty from "../../validation/is-empty";
import { AuthType, ErrorDataType } from "../../actions/types";
import { RootState } from "../../reducers/store";
import { handleSetUser } from "../../reducers/authReducer";
import { handleSetLoading } from "../../reducers/loadingReducer";
import {
  handleClearErrors,
  handleSetErrors,
} from "../../reducers/errorsReducer";
import { apiURL } from "../../config/config";
import { jwtDecode } from "jwt-decode";

interface LoginPageProps {
  socket: Socket;
}

const Login: React.FC<LoginPageProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector((state: RootState) => state.errors);

  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [loginErrors, setLoginErrors] = useState<ErrorDataType>({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    dispatch(handleClearErrors());
  }, []);

  useEffect(() => {
    setLoginErrors(errors);
  }, [errors]);

  useEffect(() => {
    setLoginErrors({
      ...loginErrors,
      email: "",
    });
  }, [userEmail]);

  useEffect(() => {
    setLoginErrors({
      ...loginErrors,
      password: "",
    });
  }, [userPassword]);

  const setStorage = async (storageData: string) => {
    await Preferences.set({
      key: "jwtToken",
      value: storageData,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  const handleSignIn = async () => {
    const isValidEmail = validateEmail(userEmail);
    setLoginErrors({
      ...loginErrors,
      email: isEmpty(userEmail)
        ? "Email is required"
        : !isValidEmail
        ? "Email is invalid"
        : "",
      password: isEmpty(userPassword) ? "Password field is required" : "",
    });

    if (isValidEmail && !isEmpty(userPassword)) {
      const signInData = {
        email: userEmail,
        password: userPassword,
      };

      // Login feature
      dispatch(handleSetLoading(true));

      try {
        const res = await Http.request({
          method: "POST",
          url: apiURL + "/api/users/login",
          headers: {
            "Content-Type": "application/json",
          },
          data: signInData,
        });

        if (res.status === 200) {
          const { token } = res.data;
          setStorage(token);
          const decode = jwtDecode<AuthType>(token);
          dispatch(handleSetUser(decode));
          dispatch(handleSetLoading(false));
          dispatch(handleClearErrors());
          socket.emit("userconnected", decode);
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

  const handleRoute = (path: string) => {
    history.push(path);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="auth-container">
          <div className="auth-main">
            <div className="auth-title-view">
              <IonText className="auth-title-text">Welcome</IonText>
            </div>
            <div className="auth-error-view">
              {loginErrors.email && (
                <IonText className="auth-error-msg">
                  {loginErrors.email}
                </IonText>
              )}
            </div>
            <div
              className={
                loginErrors.email ? "auth-error-input-view" : "auth-input-view"
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
              {loginErrors.password && (
                <IonText className="auth-error-msg">
                  {loginErrors.password}
                </IonText>
              )}
            </div>
            <div
              className={
                loginErrors.password
                  ? "auth-error-input-view"
                  : "auth-input-view"
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
            <div className="auth-create-view">
              <IonText className="auth-create-title">
                Don't have an Account?
              </IonText>
              <IonButton
                type="button"
                fill="clear"
                onClick={() => handleRoute("/register")}
                className="auth-create-button"
              >
                Sign Up
              </IonButton>
            </div>
            <IonButton
              type="button"
              shape="round"
              fill="clear"
              className="auth-button-view"
              onClick={handleSignIn}
            >
              Sign In
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
