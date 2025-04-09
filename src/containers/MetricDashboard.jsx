import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import './Parallax.css'


const metrics = [
  { id: 1, label: 'Años Programando', value: 5 },
  { id: 2, label: 'Horas de Programación', value: 7000 },
  { id: 3, label: 'Proyectos Participados', value: 45 },
];

const MetricCard = ({ label, value, delay }) => (
  <motion.div
    className="metric-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <h2 className="metric-value">
      <CountUp end={value} duration={2} separator="," />
      {label.includes('Años') && '+'}
    </h2>
    <p className="metric-label">{label}</p>
  </motion.div>
);

const MetricsDashboard = () => {
  return (
    <section className="metrics-section">
      <div className="container-metrics">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.id}
            label={m.label}
            value={m.value}
            delay={i * 0.2}
          />
        ))}
      </div>
    </section>
  );
};

export default MetricsDashboard;
