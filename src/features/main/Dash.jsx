import React from "react";
import { useTranslation } from 'react-i18next';

const intro = ({ resume, cv, status }) => {
  const { t, i18n } = useTranslation();

    return (
      <main id="main">
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
            <picture>
              <source media='(min-width: 900px)' srcset='https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png'/>
              <source media='(min-width: 550px)' srcset='https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png'/>
              <img src='https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png' alt="me"/>
            </picture>            
          </div>
        </div>
      </main>
    );
};

export default intro;
