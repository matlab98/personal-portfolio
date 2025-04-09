import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const Introduction = ({ intro }) => {
  const { t } = useTranslation();
  const hasVideo = !!intro?.link;

  return (
    <motion.section
      id="introduction"
      className="format-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h2>{t('intro.whoami')}</motion.h2>
      <div className="intro-video" data-aos="fade-up">
        {hasVideo ? (
          <iframe
            width="560"
            height="315"
            src={intro.link}
            title="Introducción"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="intro-text">
            <p><strong></strong> {t('intro.description')}</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Introduction;
