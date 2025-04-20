import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";

import Main from "./features/main/Dash";
//import Footer from "./components/Footer";
import AskAi from "./features/metric/containers/stats";
import ScrollBar from "./components/scrollBar/scrollBar";
import { getCollectionData } from "./firebase/firebase.config";
import MetricDashBoard from "./containers/MetricDashboard";
import ThemeToggle from '@/components/ThemeToggle';

function App() {
  const Introduction = React.lazy(() => import("./features/intro/introduction"));
  const Education = React.lazy(() => import("./components/HV/education"));
  const Stats = React.lazy(() => import("./features/metric/containers/stats"));
  const Portfolio = React.lazy(() => import("./features/portfolio/project"));
  const Service = React.lazy(() => import("./features/service/service"));
  const Touch = React.lazy(() => import("./features/touch/Touch"));
  const Footer = React.lazy(() => import("./features/footer/footer"));

  const [dato, setDato] = useState([]);

  const dataFetch = useCallback(async () => {
    const data = await getCollectionData();
    const info = data.docs.map((item) => item.data());
    setDato(info);
  }, []);

  useEffect(() => {
    dataFetch();
  }, [dataFetch]);

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
          <div ref={ref}>
            <Suspense fallback={null}>
              <Main resume={data["resume"]} cv={data["CV"]} />
            </Suspense>
          </div>
          <section key={id} className="section-container">
            <div ref={ref}>
              <Suspense fallback={null}>
                <ThemeToggle />

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
          <section className="section-container">
            <div ref={ref}>
              <Suspense fallback={null}>
                <MetricDashBoard />
                <Stats />

              </Suspense>
            </div>
          </section>
          <div ref={ref}>
            <Suspense fallback={null}>

              <Touch email={data["email"]} />
              <Footer
                cel={data["cel"]}
                social={data["socialN"]}
                loc={data["location"]}
              />
            </Suspense>
          </div>

        </>
      ))
      }
    </div>
  </>





}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

export default App;
