import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "$";
    const backendUrl = process.env.REACT_APP_BACKEND_URL; // Updated for React

    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "");
   

  
    const value = {
        currencySymbol,
        setToken,
        backendUrl,
        token,
    };

    
    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;