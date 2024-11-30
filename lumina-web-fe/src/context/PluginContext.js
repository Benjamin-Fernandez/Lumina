import React, { createContext, useContext, useState } from "react";

// createContext --> create an instance of Context API that other components can read
const PluginContext = createContext();

export const PluginProvider = ({ children }) => {
  const [plugin, setPlugin] = useState(null);

  return (
    <PluginContext.Provider value={{ plugin, setPlugin }}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePlugin = () => useContext(PluginContext);
