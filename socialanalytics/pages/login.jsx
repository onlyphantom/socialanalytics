import React, { useState } from "react";
import { useLogin } from "../context/UserContext";
import Router from "next/router";

import APICall from "../APICall";
import { BarLoader } from "react-spinners";
import Image from "next/image";

const LoginPage = () => {
  const { setAuthTokens } = useLogin();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState({
    message: "",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginInfo((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  };


  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(loginInfo)
    APICall.loginUser(loginInfo)
      .then((response) => {
        setAuthTokens(response);
        localStorage.setItem("BIAuthTokens", JSON.stringify(response));
        setError(false);
        setTimeout(() => Router.push("/"), 2000);
      })
      .catch((error) => {
        setLoading(false);
        setMessage({
          message: "Log In Failed!",
          description: "Username or password is invalid.",
        });
        setError(true);
        setVisible(true);
      });
  };

  return (
    <div className="login-page">
      {loading ? (
        <section className="grid">
            <div className="loading">
                <Image
                    src="/bi-b.png"
                    alt="Bank Indonesia Logo"
                    width={220.1}
                    height={65}
                />
                <BarLoader width={200}/>
            </div>
      </section>
      ) : (
        <>
          <div className="login-text">
            <Image
                src="/bi-b.png"
                alt="Bank Indonesia Logo"
                width={220.1}
                height={65}
                className="bi-logo"
            />
            <h1>
              Social <br /> Media <br /> Analytics
            </h1>
            <div className="supertype-wrapper">
              <p>By</p>
              <Image
                src="/supertype.png"
                alt="Supertype Logo"
                width={110}
                height={60}
                className="supertype-logo"
            />
            </div>
          </div>

          <div className="login-box">
            <div className="w-full mx-auto md:mx-0">
              <div className="p-14 flex flex-col w-full shadow-xl rounded-xl">
                <h2 className="text-2xl font-bold text-white text-center mb-5">
                  Welcome Back
                </h2>
                {visible && (
                  <div className={ error ? "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" : "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" } role="alert">
                  <strong className="font-bold">{message.message}</strong>
                  <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setVisible(false)}>
                    <svg className={ error ? "fill-current h-6 w-6 text-red-500" : "fill-current h-6 w-6 text-green-500"} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                  </button>
                  </div>
                )}
                <form action="" className="w-full" onSubmit={(e) => handleLoginSubmit(e)}>
                  <div className="flex flex-col w-full my-3">
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      className="appearance-none bg-transparent border-2 border-gray-700 rounded px-4 py-3 placeholder-gray-500g focus:outline-none focus:ring-1 focus:ring-blue-400 focus:shadow-l"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full mt-5">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      className="appearance-none bg-transparent border-2 border-gray-700 rounded px-4 py-3 placeholder-gray-500g focus:outline-none focus:ring-1 focus:ring-blue-400 focus:shadow-l"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
              
                  <div id="button" className="flex flex-col w-full my-5">
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-500 rounded text-white"
                    >
                      LOGIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;