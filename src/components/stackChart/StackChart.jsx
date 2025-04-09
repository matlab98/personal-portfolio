/* import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import "./style.css";

const StackChart = ({ data }) => {
  const filtered = data.filter(d => d.percent > 0.5);

  return (
    <section className="chart-section">
      <h2 className="chart-title">Stack Tecnológico</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={filtered}
            dataKey="percent"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            isAnimationActive={true}
          >
            {filtered.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) =>
              [`${value.toFixed(2)}%`, props.payload.name]
            }
          />
          <Legend verticalAlign="bottom" layout="horizontal" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default StackChart;

 */

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

const StackChart = ({ data }) => {
  // Top 10 lenguajes por porcentaje
  const topLanguages = [...data]
    .filter(d => d.name !== "Other" && d.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 10);

  return (
    <section className="chart-section">
      <h2 className="chart-title">Lenguajes Más Usados</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={topLanguages}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, Math.max(...topLanguages.map(d => d.percent))]} />
          <Radar
            name="Uso (%)"
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
