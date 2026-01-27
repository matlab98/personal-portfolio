import React, { useState, useEffect, useCallback } from "react";
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Main from "./features/main/Dash";
import ScrollBar from "./components/scrollBar/scrollBar";
import { getCollectionData } from "./firebase/firebase.config";
import LazySectionWrapper from "./components/LazySectionWrapper";
import Navbar from "./components/Navbar/Navbar";

// Lazy loading de componentes para mejor rendimiento
const Introduction = React.lazy(() => import("./features/intro/introduction"));
const Education = React.lazy(() => import("./components/HV/education"));
const Stats = React.lazy(() => import("./features/metric/containers/stats"));
const Portfolio = React.lazy(() => import("./features/portfolio/project"));
const Service = React.lazy(() => import("./features/service/service"));
const Touch = React.lazy(() => import("./features/touch/Touch"));
const Footer = React.lazy(() => import("./features/footer/footer"));

// Componente de carga para Suspense
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <CircularProgress />
  </Box>
);

function App() {

  const [dato, setDato] = useState([]);

  const dataFetch = useCallback(async () => {
    try {
      const data = await getCollectionData();
      const info = data.docs.map((item) => item.data());
      setDato(info);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Mantener el estado vacío para mostrar el loader
    }
  }, []);

  useEffect(() => {
    dataFetch();
  }, [dataFetch]);

  // Loading state
  if (dato.length === 0) {
    return (
      <div id="loader-wrapper">
        <div className="main" id="loader" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Toolbar />
      <ScrollBar />
      <div id="example">
        {dato.map((data, id) => (
          <React.Fragment key={id}>
            {/* Hero Section / Main Resume */}
            <LazySectionWrapper>
              <Main resume={data["resume"]} cv={data["CV"]} />
            </LazySectionWrapper>
            
            {/* Introduction Section */}
            <section id="introduction" className="section-container">
              <LazySectionWrapper fallback={<LoadingFallback />}>
                <Introduction intro={data["introduction"]} />
              </LazySectionWrapper>
            </section>
            
            {/* Education / Resume Timeline Section */}
            {data["education"] && (
              <section id="resume" className="section-container">
                <LazySectionWrapper fallback={<LoadingFallback />}>
                  <Education education={data["education"]} />
                </LazySectionWrapper>
              </section>
            )}
            
            {/* Services Section */}
            {data["services"] && (
              <section id="services" className="section-container">
                <LazySectionWrapper fallback={<LoadingFallback />}>
                  <Service service={data["services"]} />
                </LazySectionWrapper>
              </section>
            )}
            
            {/* Portfolio Section */}
            {data["portfolio"] && (
              <section id="portfolio" className="section-container">
                <LazySectionWrapper fallback={<LoadingFallback />}>
                  <Portfolio project={data["portfolio"]} />
                </LazySectionWrapper>
              </section>
            )}
            
            {/* Statistics / Metrics Section */}
            <section id="statistics" className="section-container">
              <LazySectionWrapper fallback={<LoadingFallback />}>
                <Stats /> 
              </LazySectionWrapper>
            </section>
            
            {/* Contact Section */}
            <div id="contact" className="section-container">
              <LazySectionWrapper fallback={<LoadingFallback />}>
                {data["email"] && <Touch email={data["email"]} />}
                <Footer
                  cel={data["cel"]}
                  social={data["socialN"]}
                  loc={data["location"]}
                />
              </LazySectionWrapper>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default App;
