import React from "react";
import Particles from "react-tsparticles";
import Opt from "../files/configuration";

const Banner = ({ resume, cv, status }) => {

  const particlesInit = () => {};

  const particlesLoaded = () => {};

  const detectLanguage = () => {
    // `navigator.language` devuelve el lenguaje preferido del usuario
    const language = navigator.language || navigator.userLanguage; // para compatibilidad con navegadores más antiguos
    console.log(`El lenguaje del sistema es: ${language}`);
    
    // `navigator.languages` devuelve un array de los lenguajes preferidos
    const languages = navigator.languages;
    console.log(`Lenguajes preferidos: ${languages.join(', ')}`);
    
    return language;
  };

  function AP(dato) {
    return (
      <Particles
        id="particles-js"
        init={particlesInit}
        loaded={particlesLoaded}
        options={dato}
      />
    );
  }
detectLanguage();
  function Main() {
    return (
      <>
        <div className="main-text">
          <h1>Hey, Yo soy FullStack Developer</h1>
          <p className="description">{resume}</p>

          <div className="main-btns">
            <a href={cv.link} className="download-cv-btn" target="_blank" rel="noopener noreferrer" >
              Descargar CV
            </a>

            <a href="#contact" className="hire-me-btn">
              Contrátame
            </a>
          </div>
        </div>
        <div className="model">
          <div>
            <img
              src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png"
              alt="me"
            />
          </div>
        </div>
      </>
    );
  }

  if (status === "false") {
    return (
      <section id="main">
        <AP {...Opt("#000000")} />
        <Main />
      </section>
    );
  } else {
    return (
      <section id="main">
        <AP {...Opt("#ffffff")} />
        <Main />
      </section>
    );
  }
};
export default Banner;
