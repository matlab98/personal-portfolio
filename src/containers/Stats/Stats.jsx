import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { urlStats } from "../../config/config";
import axios from 'axios-jsonp-pro';

const Stats = () => {
  const [data, setData] = useState({});
/** return axios.get(url)
    .then(response => response.data)
    .catch(error => console.log(error)); */
  useEffect(() => {
    axios.get(urlStats.statsLanguage)
      .then((responseJson) => {
        const labels = responseJson.data.data.map((item) => item.name);
        const hours = responseJson.data.data.map((item) => item.percent);

         setData({
          labels: labels,
          datasets: [
            {
              label: "Hours coded",
              data: hours,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        }); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Wakatime Stats</h2>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};
//
export default Stats;