import React, { useState, useEffect } from 'react';
import Stats from '../components/experience/stats';
import Footer from '../components/footer';
import Main from '../components/main';
import Service from '../components/service';
import Introduction from '../components/introduction';
import Touch from '../components/touch';
import Education from '../components/HV/education';
import Portfolio from '../components/project';
import { db } from '../firebase/firebase.config';

function App() {
  const [dato, setDato] = useState([]);
  const [mode, setMode] = useState(localStorage.getItem('dark-mode'));

  const fetchData = async () => {
    const response = db.collection('0001');
    const data = await response.get();
    data.docs.forEach((item) => {
      setDato([...dato, item.data()]);
    });
  };

  useEffect(() => {
    fetchData();
    if (localStorage.getItem('dark-mode') == 'true') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setMode('true');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setMode('false');
    }
  }, []);

  const change = () => {
    const Body = document.documentElement;
    if (Body.getAttribute('data-theme') == 'dark') {
      Body.setAttribute('data-theme', 'light');
      localStorage.setItem('dark-mode', 'false');
      setMode('false');
    } else {
      Body.setAttribute('data-theme', 'dark');
      localStorage.setItem('dark-mode', 'true');
      setMode('true');
    }
  };

  if (dato.length > 0) {
    return (
      <div className="App">
        {dato &&
          dato.map((data, id) => {
            return (
              <div key={id}>
                <nav className="navigation">
                  <a href="#" className="logo">
                    <img
                      src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1628388753/dsn8q08orztuibj1xycc.png"
                      alt="me"
                    />
                  </a>

                  <input type="checkbox" className="menu-btn" id="menu-btn" />
                  <label htmlFor="menu-btn" className="menu-icon">
                    <span className="nav-icon"></span>
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
                  <div id="buttonToggle" className="toggle">
                    <input type="checkbox" className="checkbox" id="chk" />
                    <label
                      id="ChangeToggle"
                      className="label"
                      htmlFor="chk"
                      onClick={change}
                    >
                      <img
                        id="back"
                        className="icon"
                        src={
                          mode === 'true'
                            ? 'https://res.cloudinary.com/dpykpv9hd/image/upload/v1625873457/dc8ns3cosiuucyozkdtz.jpg'
                            : 'https://res.cloudinary.com/dpykpv9hd/image/upload/v1625873510/vul55efz2mvaqqxddmjv.jpg'
                        }
                      />
                      <img
                        id="ball"
                        className="ball"
                        src={
                          mode === 'true'
                            ? 'https://res.cloudinary.com/dpykpv9hd/image/upload/v1625875186/jjoinqjjxquczkqr4s3a.svg'
                            : 'https://img.icons8.com/128/fluent/000000/weather.png'
                        }
                      />
                    </label>
                  </div>
                </nav>
                <Main resume={data['resume']} cv={data['CV']} status={mode} />
                <Introduction intro={data['introduction']} />
                <Education education={data['Education']} />
                <Stats status={mode} />
                <Service service={data['services']} />
                <Portfolio project={data['portfolio']} />
                <Touch email={data['email']} />
                <Footer
                  cel={data['cel']}
                  social={data['socialN']}
                  loc={data['location']}
                />
              </div>
            );
          })}
      </div>
    );
  } else {
    return (
      <div id="loader-wrapper">
        <div className="main" id="loader"></div>
      </div>
    );
  }
}

export default App;
