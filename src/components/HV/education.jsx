import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function Education(props) {
  const { t } = useTranslation();
  
  if (!props.education || !Array.isArray(props.education) || props.education.length === 0) {
    return null;
  }

  return (
    <section id="my-timeline" className="section clearfix format-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <motion.div 
              className="heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <strong className="sect-title">
                <span>{t('education.title')}</span>
                <i className="heading-logo margin-logo fa fa-history"></i>
              </strong>
              <p>
                {t('education.subtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="timeline">
              {props.education.map((item, i) => {
                return (
                  <motion.div 
                    className="timeline-row" 
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="timeline-time">
                      <small>{item.date}</small>
                    </div>
                    <div className="timeline-dot sea-green-bg"></div>
                    <div className="timeline-content sea-green">
                      <img
                        className="fa-timeline"
                        alt=""
                        src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1630360986/i9usampbfu6yzyaj1z1w.png"
                      />
                      <h4>{item.institution_name}</h4>
                      <p className="description">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
