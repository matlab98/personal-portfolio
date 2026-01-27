import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./assets/style/style.css";

const service = (props) => {
  const { t } = useTranslation();
  const services = props?.service || [];

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="services"
      className="format-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h2>{t("service.title")}</motion.h2>
      <div className="services-box-container">
        {services.map((a, i) => {
          return (
            <div className="service-box" key={i} data-aos="fade-up">
              {a.icon && <i className={a.icon}></i>}
              {a.service && <strong>{a.service}</strong>}
              {a.description && <p>{a.description}</p>}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default service;
