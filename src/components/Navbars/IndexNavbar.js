/*eslint-disable*/
import React from "react";
import { Link, useHistory } from "react-router-dom";
// components

import IndexDropdown from "components/Dropdowns/IndexDropdown.js";

export default function Navbar(props) {

  const history = useHistory();

  const [auth, setAuth] = React.useState(true);

  const initialLoad = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/get-admin-authenticate-by-jwt`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        localStorage.setItem("jwtToken", data.jwtToken);
        setAuth(true);
        return;
      }
      else {
        localStorage.removeItem("jwtToken");
        setAuth(false);
        return;
      }

    }
    catch (error) {
      alert(error?.message);
      return;
    }
  }

  React.useEffect(() => {

    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken) {
      setAuth(true);
    } else {
      setAuth(false);
      initialLoad();
    }
  }, [])

  const logout = async () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userDetails");
    setAuth(false);
    history.push("/");
    return;
  }


  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              Metadaters
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="flex items-center">
                <IndexDropdown />
              </li>
              <div style={{ marginRight: "15px" }} id="google_translate_element"></div>
              <li className="flex items-center">
                {
                  auth ?
                    <button
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                      onClick={() => { logout() }}
                      type="button">
                      Logout
                    </button>
                    :
                    <Link
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                      type="button"
                      to="/auth"
                    >
                      Sign In
                    </Link>
                }
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
