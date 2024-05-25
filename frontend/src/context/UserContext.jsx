/* eslint-disable react/prop-types */


import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(URL + "/api/auth/refetch", { withCredentials: true });
      setUser(res.data);
      console.log("User refetched:", res.data);
    } catch (err) {
      if (err.response) {
        console.error(`Error: ${err.response.status} - ${err.response.data}`);
      } else {
        console.error(`Error: ${err.message}`);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
