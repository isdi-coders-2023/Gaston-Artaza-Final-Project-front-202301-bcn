import axios from "axios";
import decodeToken from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUserActionCreator } from "../../store/features/userSlice/userSlice";
import { useAppDispatch } from "../../store/hooks";
import {
  type LoginResponse,
  type UserCredentials,
  type CustomTokenPayload,
  type User,
} from "../../types";

const useUser = () => {
  const dispatch = useAppDispatch();
  const loginUser = async (userInfo: UserCredentials) => {
    const response = await axios.post(
      "http://localhost:5000/users/login",
      userInfo
    );

    const { token } = response.data as LoginResponse;
    const { id, username }: CustomTokenPayload = decodeToken(token);

    const userLogged: User = {
      id,
      token,
      username,
    };
    dispatch(loginUserActionCreator(userLogged));

    await AsyncStorage.setItem("token", token);
  };

  return {
    loginUser,
  };
};

export default useUser;