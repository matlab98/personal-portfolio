import React, { useState, useEffect } from "react";

import db from "../config/firebase.config";
import Social from "./Social/Social";
import Portfolio from "./Portfolio/Portfolio";
import NavBar from "./Nav/NavBar";
import Stats from "./Stats/Stats";

function App() {
  const [language, setLanguage] = useState("en");
  const [isEnglish, setIsEnglish] = useState(true);
  const [dato, setDato] = useState([]);

  const fetchData = async (language) => {
    try {
      const response = await db.collection("portfolio").doc(language).get();

      if (response.exists) {
        setDato([response.data()]);
      } else {
        console.log("No document found!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleToggle = () => {
    setLanguage(isEnglish ? "es" : "en");
    setIsEnglish(!isEnglish);
    fetchData(language);
  };

  useEffect(() => {
    fetchData(language);
  }, [language]);

  //const Portfolio = React.lazy(() => import('./Portfolio/Portfolio'));

  return (
    <div>
      {dato.map((data) => {
        return (
          <div key={data.id}>
            <NavBar />

            <Social social={data["socialN"]} />
            <Portfolio project={data["portfolio"]} />
          </div>
        );
      })}
    </div>
  );
}

export default App;
