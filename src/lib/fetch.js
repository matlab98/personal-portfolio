import axios from 'axios-jsonp-pro';

function fetchData(url) {
  return axios.get(url)
    .then(response => response.data)
    .catch(error => console.log(error));
}

export default fetchData;