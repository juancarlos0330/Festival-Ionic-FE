import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Http } from "@capacitor-community/http";
import { useHistory } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import { handleClearUser, handleSetUser } from "../../reducers/authReducer";
import { AuthType } from "../../actions/types";
import { RootState } from "../../reducers/store";
import { apiURL } from "../../config/config";

interface props {
  children: React.ReactNode;
  socket: Socket;
}

const AuthLayout: React.FC<props> = ({ children, socket }: props) => {
  const history = useHistory(); // manage route
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const setStorage = async (storageData: string) => {
    await Preferences.set({
      key: "jwtToken",
      value: storageData,
    });
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      const { value } = await Preferences.get({ key: "jwtToken" });

      if (value) {
        const user = jwtDecode<AuthType>(value);

        // check for expired token
        const currentTime = Date.now() / 1000;
        if (user.exp < currentTime) {
          setStorage("");
          dispatch(handleClearUser());
          history.push("/login");
        }

        try {
          const res = await Http.request({
            method: "POST",
            url: apiURL + "/api/users/checkUser",
            headers: {
              "Content-Type": "application/json",
            },
            data: { id: user.id },
          });

          if (res.status === 200) {
            if (res.data.message == "success") {
              dispatch(handleSetUser(user));
              socket.emit("userconnected", user);
            } else {
              setStorage("");
              dispatch(handleClearUser());
              history.push("/login");
            }
          }
        } catch (err) {
          console.log("Request Failed: ", err);
          setStorage("");
          dispatch(handleClearUser());
          history.push("/login");
        }
      }
    };

    checkUserAuth();
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push("/schedules");
    } else {
      history.push("/login");
    }
  }, [auth]);

  return <>{children}</>;
};

export default AuthLayout;
