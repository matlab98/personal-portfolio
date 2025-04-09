import React from 'react';
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const service = (props) => {
  const { t } = useTranslation();

  return (
    <motion.section
      id="service"
      className="format-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h2>{t('service.title')}</motion.h2>
      <div className="services-box-container">
        {props['service'].map((a, i) => {
          return (
            <div className="service-box" key={i} data-aos="fade-up">
              <i className={a.icon}></i>
              <strong>{a.service}</strong>
              <p>{a.description}</p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default service;
