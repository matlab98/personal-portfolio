import React from 'react';
import Particles from 'react-tsparticles';
import Opt from '../files/configuration';
const Banner = ({ resume, cv, status }) => {
  const particlesInit = (main) => {};

  const particlesLoaded = (container) => {};

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

  function Main() {
    return (
      <>
        <div className="main-text">
          {/* I think this would be text writting machine */}
          <h1>Hey, Yo soy FullStack Developer</h1>
          <p className="description">{resume}</p>

          <div className="main-btns">

          {/* this button would send a json to the new service to create cv */}
            <a href={cv.link} className="download-cv-btn">
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
//Probably i need to delete this part because affect the load time
  if (status === 'false') {
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
