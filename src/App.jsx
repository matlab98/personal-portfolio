import React, { useState, useEffect, Suspense } from "react";

import { motion } from "framer-motion";

import Main from "./components/Dash";

import Footer from "./components/Footer";

import AskAi from "./features/containers/AskAi";

import { db, getCities } from "./firebase/firebase.config";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "./hooks/useLocalStorage";

function App() {
  const Introduction = React.lazy(() => import("./components/Introduction"));
  const Education = React.lazy(() => import("./components/HV/education"));

  /*   const Stats = React.lazy(() => import("./components/experience/stats")); */
  const Portfolio = React.lazy(() => import("./components/project"));
  const Service = React.lazy(() => import("./components/service"));
  const Touch = React.lazy(() => import("./features/touch/Touch"));

  const [dato, setDato] = useState([]);

  const [mode, setMode] = useState(getLocalStorageItem("dark-mode"));

  const [isOn, setIsOn] = useState(false);

  const fetchData = async () => {
    const data = await getCities(db);

    data.docs.forEach((item) => {
      setDato([...dato, item.data()]);
    });
  };
  const Body = document.documentElement;
  useEffect(() => {
    fetchData();
    const isDarkMode = getLocalStorageItem("dark-mode");
    const theme = isDarkMode ? "dark" : "light";

    // Configurar el tema y el modo en localStorage y el documento
    Body.setAttribute("data-theme", theme);
    setMode(isDarkMode.toString());
  }, []);

  const change = () => {
    const newTheme = Body.getAttribute("data-theme") === "dark" ? "light" : "dark";

    // Cambiar el tema y actualizar localStorage
    Body.setAttribute("data-theme", newTheme);
    const isDarkMode = newTheme === "dark";
    setLocalStorageItem("dark-mode", isDarkMode.toString());
    setMode(isDarkMode.toString());
  };

  if (dato.length > 0) {
    return (
      <div className="App">
        <AskAi />
        {dato &&
          dato.map((data, id) => {
            return (
              <div key={id}>
                <nav className="navigation">
                  <a href="{#}" className="logo">
                    <img
                      src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1628388753/dsn8q08orztuibj1xycc.png"
                      alt="me"
                    />
                  </a>

                  <input type="checkbox" className="menu-btn" id="menu-btn" />
                  <label htmlFor="menu-btn" className="menu-icon">
                    <span className="nav-icon" />
                  </label>

                  <ul className="menu">
                    <li>
                      <a href="#main">Inicio</a>
                    </li>
                    <li>
                      <a href="#skills">Habilidades</a>
                    </li>
                    <li>
                      <a href="#introduction">Introducción</a>
                    </li>
                    <li>
                      <a href="#services">Servicio</a>
                    </li>
                    <li>
                      <a href="#contact">Contacto</a>
                    </li>
                  </ul>
                  <div className="switch" data-isOn={mode} onClick={change}>
                    <motion.div className="handle" layout transition={spring} />
                  </div>
                </nav>
                <Main resume={data["resume"]} cv={data["CV"]} status={mode} />

                <Suspense fallback={<div>Cargando...</div>}>
                  <Introduction intro={data["introduction"]} />
                </Suspense>
                <Suspense fallback={<div>Cargando...</div>}>
                  <Education education={data["Education"]} />
                </Suspense>
                {/*                 <Suspense fallback={<div>Cargando...</div>}>
                  <Stats status={mode} />
                </Suspense> */}
                <Suspense fallback={<div>Cargando...</div>}>
                  <Service service={data["services"]} />
                </Suspense>
                <Suspense fallback={<div>Cargando...</div>}>
                  <Portfolio project={data["portfolio"]} />
                </Suspense>
                <Suspense fallback={<div>Cargando...</div>}>
                  <Touch email={data["email"]} />
                </Suspense>
                <Suspense fallback={<div>Cargando...</div>}>
                  <Footer
                    cel={data["cel"]}
                    social={data["socialN"]}
                    loc={data["location"]}
                  />
                </Suspense>
              </div>
            );
          })}
      </div>
    );
  } else {
    return (
      <div id="loader-wrapper">
        <div className="main" id="loader" />
      </div>
    );
  }
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

export default App;
