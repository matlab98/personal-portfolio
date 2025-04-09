import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";

import Main from "./components/Dash";
//import Footer from "./components/Footer";
import AskAi from "./features/metric/containers/AskAi";
import ScrollBar from "./components/scrollBar/scrollBar";
import { db, getCities } from "./firebase/firebase.config";
import Parallax from "./containers/Parallax"
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "./hooks/useLocalStorage";

function App() {
  const Introduction = React.lazy(() => import("./features/intro/introduction"));
  const Education = React.lazy(() => import("./components/HV/education"));
  /*   const Stats = React.lazy(() => import("./components/experience/stats")); */
  const Portfolio = React.lazy(() => import("./components/project"));
  const Service = React.lazy(() => import("./components/service"));
  // const Touch = React.lazy(() => import("./features/touch/Touch"));
  const Footer = React.lazy(() => import("./features/footer/components/footer"));

  const [dato, setDato] = useState([]);
  const [mode, setMode] = useState(getLocalStorageItem("dark-mode"));
  const [isOn, setIsOn] = useState(false);

  const fetchData = useCallback(async () => {
    const data = await getCities(db);
    const info = data.docs.map((item) => item.data());
    setDato(info);
  }, []);

  const Body = document.documentElement;

  useEffect(() => {
    fetchData();

    const isDarkMode = getLocalStorageItem("dark-mode") ?? "false";
    const theme = isDarkMode === "true" ? "dark" : "light";

    Body.setAttribute("data-theme", theme);
    setMode(isDarkMode.toString());
  }, [fetchData]);

  const change = () => {
    const newTheme = Body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    Body.setAttribute("data-theme", newTheme);
    const isDarkMode = newTheme === "dark";
    setLocalStorageItem("dark-mode", isDarkMode.toString());
    setMode(isDarkMode.toString());
  };


  const sections = [
    { id: 1, title: "Hero", content: "Bienvenido a nuestra web." },
    { id: 2, title: "Servicios", content: "Ofrecemos soluciones a medida." },
    { id: 3, title: "Portafolio", content: "Proyectos recientes." },
    { id: 4, title: "Equipo", content: "Conoce a nuestro equipo." },
    { id: 5, title: "Contacto", content: "Escríbenos para más info." },
  ]
  const ref = useRef(null)

  if (dato.length === 0) {
    return (
      <div id="loader-wrapper">
        <div className="main" id="loader" />
      </div>
    );
  }

  return <>
    <ScrollBar />

    <div id="example">
      {dato.map((data, id) => (
        <>
        <section className="section-container">
          <div ref={ref}>
            <Suspense fallback={null}>
              <Introduction intro={data["introduction"]} />
            </Suspense>
          </div>
        </section>
        <section className="section-container">
        <div ref={ref}>
          <Suspense fallback={null}>
             <Service service={data["services"]} />
          </Suspense>
        </div>
      </section>
      <section className="section-container">
        <div ref={ref}>
          <Suspense fallback={null}>
            <Portfolio project={data["portfolio"]} />
          </Suspense>
        </div>
      </section>
      </>
      ))
      }

  {/*     {sections.map((sec) => (
        <section className="section-container">
          <div ref={ref}>
            <p>{sec.content}</p>
          </div>
        </section>
      )
      )} */}
    </div>
  </>





  //     return (
  //       <div className="App">
  //         <AskAi />
  //         
  //         {dato.map((data, id) => (
  //           <div key={id}>
  //             <nav className="navigation">
  //               <a href="{#}" className="logo">
  //                 <img
  //                   src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1628388753/dsn8q08orztuibj1xycc.png"
  //                   alt="me"
  //                 />
  //               </a>

  //               <input type="checkbox" className="menu-btn" id="menu-btn" />
  //               <label htmlFor="menu-btn" className="menu-icon">
  //                 <span className="nav-icon" />
  //               </label>

  //               <ul className="menu">
  //                 <li>
  //                   <Link to="main" smooth={true} duration={500}>Inicio</Link>
  //                 </li>
  //                 <li>
  //                   <Link to="skills" smooth={true} duration={500}>Habilidades</Link>
  //                 </li>
  //                 <li>
  //                   <Link to="introduction" smooth={true} duration={500}>Introducción</Link>
  //                 </li>
  //                 <li>
  //                   <Link to="services" smooth={true} duration={500}>Servicio</Link>
  //                 </li>
  //                 <li>
  //                   <Link to="footer" smooth={true} duration={500}>Contacto</Link>
  //                 </li>
  //               </ul>


  //             </nav> 

  //             <Element name="main">
  //             <section style={{ height: '100vh' }}>
  //               <Main resume={data["resume"]} cv={data["CV"]} status={mode} />
  //               </section>
  //             </Element>

  //             <Suspense fallback={<div>Cargando...</div>}>
  //               <Element name="introduction">
  //               <section style={{ height: '100vh' }}>
  //                 <Introduction intro={data["introduction"]} />
  //                 </section>
  //               </Element>
  //             </Suspense>

  //             {/* <Suspense fallback={<div>Cargando...</div>}>
  //               <Element name="skills">
  //                 <Stats status={mode} />
  //               </Element>
  //             </Suspense> */}

  //             {/* <Suspense fallback={<div>Cargando...</div>}>
  //               <Element name="services">
  //                 <Service service={data["services"]} />
  //               </Element>
  //             </Suspense>
  //             <Suspense fallback={<div>Cargando...</div>}>
  //               <Element name="projects">
  //                 <Portfolio project={data["portfolio"]} />
  //               </Element>
  //             </Suspense> */}

  //             {/* <Suspense fallback={<div>Cargando...</div>}>
  //               <Element name="contact">
  //                 <Touch email={data["email"]} />
  //               </Element>
  //             </Suspense> */}

  //             <Suspense fallback={<div>Cargando...</div>}>
  //             <Element name="footer">
  //             <section style={{ height: '100vh' }}>
  //               <Footer
  //                 cel={data["cel"]}
  //                 social={data["socialN"]}
  //                 loc={data["location"]}
  //               />
  //               </section>
  //               </Element>
  //             </Suspense>
  //           </div>
  //         ))}
  //       </div>
  //     );

}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

export default App;
