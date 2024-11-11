import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";

import { handleSetUser } from "../../reducers/authReducer";
import { RootState } from "../../reducers/store";

interface props {
  children: React.ReactNode;
}

const MainLayout: React.FC<props> = ({ children }: props) => {
  const history = useHistory(); // manage route
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkUserAuth = async () => {
      const { value } = await Preferences.get({ key: "jwtToken" });

      if (value) {
        const user = JSON.parse(value);
        console.log(user, "-- main layout ---");
        dispatch(handleSetUser(user));
      }
    };

    checkUserAuth();
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    }
  }, [auth]);

  return <>{children}</>;
};

export default MainLayout;
