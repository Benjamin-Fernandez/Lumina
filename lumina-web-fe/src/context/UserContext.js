import React, { createContext, useContext, useState } from "react";

// createContext --> create an instance of Context API that other components can read
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

  return (
    <UserContext.Provider value={{ email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
