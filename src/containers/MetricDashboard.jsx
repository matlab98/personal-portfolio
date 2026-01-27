import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './style.css';
import formatDate from '../utils/formatDate';

const MetricCard = ({ label, value, delay, showPlus }) => (
  <motion.div
    className="metric-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <h3 className="metric-value">
      <CountUp end={value} duration={2} separator="," />
      {showPlus && '+'}
    </h3>
    <p className="metric-label">{label}</p>
  </motion.div>
);

const MetricDashboard = ( data ) => {
  const { t } = useTranslation();
  console.log(data.data["grand_total"]["human_readable_total_including_other_language"]);
  const metrics = [
    { id: 1, label: t('metrics.yearsProgramming'), value: formatDate.convertDaysToYearsByDate(data.data["range"]["days_including_holidays"]), showPlus: true },
    { id: 2, label: t('metrics.hoursProgramming'), value: formatDate.getHours(data.data["grand_total"]["human_readable_total_including_other_language"]), showPlus: false },
    { id: 3, label: t('metrics.projectsParticipated'), value: "45", showPlus: false },
  ];

  return (
    <section className="metrics-section">
      <div className="container-metrics">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.id}
            label={m.label}
            value={m.value}
            showPlus={m.showPlus}
            delay={i * 0.2}
          />
        ))}
      </div>
    </section>
  );
};

export default MetricDashboard;
