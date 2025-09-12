import React, { createContext, useState, useMemo } from 'react';

export const LoginContext = createContext();

const LoginData = ({ children }) => {
    const [loginAPIData, setLoginAPIData] = useState(null);
    const [loginData, setLoginData] = useState(null);
    const [sessionTimeOut, setSessionTimeOut] = useState(null)

    const contextValue = useMemo(() => ({
        loginAPIData,
        setLoginAPIData,
        loginData,
        setLoginData,
        sessionTimeOut,
        setSessionTimeOut,
    }), [loginAPIData, loginData, sessionTimeOut]);


    return (
        <LoginContext.Provider value={contextValue}>
            {children}
        </LoginContext.Provider>
    );
};

export default React.memo(LoginData);
