import React from "react";
import { useTranslation } from 'react-i18next';
import './style.css';

const intro = ({ resume, cv, status }) => {
  const { t } = useTranslation();

  return (
    <main id="main">
      <div className="main-text">
        <h1 className="hero-title">
          <span className="hero-title-line">{t("hero.titleLine1")}</span>
          <span className="hero-title-line hero-title-line-accent">{t("hero.titleLine2")}</span>
        </h1>

        <p className="hero-subtitle">
          {t("hero.subtitle")}
        </p>

        <ul className="hero-bullets">
          <li><strong>{t("hero.bullets.0.strong")}</strong> {t("hero.bullets.0.rest")}</li>
          <li><strong>{t("hero.bullets.1.strong")}</strong> {t("hero.bullets.1.rest")}</li>
          <li><strong>{t("hero.bullets.2.strong")}</strong> {t("hero.bullets.2.rest")}</li>
        </ul>

        {resume && <p className="description hero-description">{resume}</p>}

        <div className="main-btns">
          {cv?.link && (
            <a 
              href={cv.link} 
              className="download-cv-btn" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t("download_cv")}
            </a>
          )}

          <a href="#contact" className="hire-me-btn">
            {t("hire_me")}
          </a>
        </div>
      </div>
      <div className="model">
        <div>
          <picture>
            <source media='(min-width: 900px)' srcSet='https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png'/>
            <source media='(min-width: 550px)' srcSet='https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png'/>
            <img src='https://res.cloudinary.com/dpykpv9hd/image/upload/v1628438688/xlrwpfzhyey6imvvoi9r.png' alt="me"/>
          </picture>            
        </div>
      </div>
    </main>
  );
};

export default intro;
