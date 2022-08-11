import React, { useContext, useState, useEffect, createContext } from "react";
import jwt_decode from "jwt-decode";

const UserContext = createContext();

const PATH = "https://bankindonesia-backend.herokuapp.com";

export function UserProvider({ children }) {
    const [authTokens, setAuthTokens] = useState();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        window.localStorage.removeItem("BIAuthTokens");
    };
    
    useEffect(() => {
        localStorage.getItem("BIAuthTokens") 
        ? setAuthTokens(JSON.parse(localStorage.getItem("BIAuthTokens")))
        : setAuthTokens(null)
        
        localStorage.getItem("BIAuthTokens")
        ? setUser(jwt_decode(localStorage.getItem("BIAuthTokens")))
        : setUser(null)
    }, []);

    useEffect(() => {
        const updateToken = async () => {
        const response = await fetch(`${PATH}/api/token/refresh/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: authTokens?.refresh }),
        });

        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("BIAuthTokens", JSON.stringify(data));
        } else {
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
        };
        if (authTokens) {
        if (loading) {
            updateToken();
        }

        let fourteenMinutes = 1000 * 60 * 14;

        let interval = setInterval(() => {
            if (authTokens) {
            updateToken();
            }
        }, fourteenMinutes);
        return () => clearInterval(interval);
        }
    }, [authTokens, loading]);

    return (
        <UserContext.Provider
        value={{
            authTokens,
            setAuthTokens,
            user,
            logoutUser,
        }}
        >
        {children}
        </UserContext.Provider>
    );
}

export function useLogin() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}