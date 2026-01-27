import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const StackChart = ({ data }) => {
  const { t } = useTranslation();

  // Top 10 lenguajes por porcentaje
  const topLanguages = [...data]
    .filter(d => d.name !== 'Other' && d.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 10);

  const maxPercent = Math.max(...topLanguages.map(d => d.percent));

  return (
    <section className="chart-section">
      <h2 className="chart-title">{t('stackChart.title')}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={topLanguages}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, maxPercent]} />
          <Radar
            name={t('stackChart.seriesName')}
            dataKey="percent"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
        </RadarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default StackChart;
