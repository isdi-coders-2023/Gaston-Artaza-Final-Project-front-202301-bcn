import React from "react";
import decodeToken from "jwt-decode";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupStore, store } from "../../store/store";
import useUser from "./useUser";
import { type UserCredentials, type CustomTokenPayload } from "../../types";
import { loginUserActionCreator } from "../../store/features/userSlice/userSlice";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

jest.mock("jwt-decode", () => jest.fn());

const spyDispatch = jest.spyOn(store, "dispatch");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given the useUser hook", () => {
  describe("When it loginUser action recieves username 'jose' and a password 'larraldejose78' ", () => {
    test("Then it should call the dispatch method with the loginuserActionCreator", async () => {
      const mockUserCredentials: UserCredentials = {
        password: "kñnchytd/*6&!",
        username: "jose",
      };

      const tokenPayload: CustomTokenPayload = {
        username: "jose",
        id: "20269874633185966",
      };

      const loginMockUser = loginUserActionCreator({
        ...tokenPayload,
        token: "12365487pgta%jawqzxplkgcxddsf",
      });

      const mockStore = setupStore();
      const dispatchSpy = jest.spyOn(mockStore, "dispatch");
      (decodeToken as jest.MockedFunction<typeof decodeToken>).mockReturnValue(
        tokenPayload
      );
      const {
        result: {
          current: { loginUser },
        },
      } = renderHook(() => useUser(), {
        wrapper({ children }) {
          return <Provider store={mockStore}>{children}</Provider>;
        },
      });

      await loginUser(mockUserCredentials);
      expect(dispatchSpy.mock.calls[0][0]).toStrictEqual(loginMockUser);
    });
  });
});