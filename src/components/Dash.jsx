import React from "react";
import { useTranslation } from 'react-i18next';

const intro = ({ resume, cv, status }) => {
  const { t, i18n } = useTranslation();

  const detectLanguage = () => {
    // `navigator.language` devuelve el lenguaje preferido del usuario
    const language = navigator.language || navigator.userLanguage; // para compatibilidad con navegadores más antiguos
    console.log(`El lenguaje del sistema es: ${language}`);
    
    // `navigator.languages` devuelve un array de los lenguajes preferidos
    const languages = navigator.languages;
    console.log(`Lenguajes preferidos: ${languages.join(', ')}`);
    
    return language;
  };

detectLanguage();

    return (
      <section id="main">
        <div className="main-text">
          <h1>{t("greeting")}</h1>
          <p className="description">{resume}</p>

          <div className="main-btns">
            <a href={cv.link} className="download-cv-btn" target="_blank" rel="noopener noreferrer" >
            {t("download_cv")}
            </a>

            <a href="#contact" className="hire-me-btn">
            {t("hire_me")}
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
      </section>
    );
};

export default intro;
