import React from 'react';
import axios from 'axios-jsonp-pro';

import Chart from 'react-google-charts';

let one =
  'https://wakatime.com/share/@hilbrakaku/f6ec4610-5ec8-4e0a-b40d-aec4d11abefd.json';
let two =
  'https://wakatime.com/share/@hilbrakaku/eea4d614-7178-46fa-8828-54ef59996ac1.json';
let three =
  'https://wakatime.com/share/@hilbrakaku/b4730f03-b81c-464a-953c-567e27e89a34.json';
let four =
  'https://wakatime.com/share/@hilbrakaku/96dd4b3d-19f6-4f40-8637-facf512c41a1.json';

const requestOne = axios.jsonp(one);
const requestTwo = axios.jsonp(two);
const requestThree = axios.jsonp(three);
const requestFour = axios.jsonp(four);
class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      responseOne: [],
      responseTwo: [],
      responseThree: [],
      responseFour: [],
      company: null,
    };
  }

  async componentDidMount() {
    await axios
      .all([requestOne, requestTwo, requestThree, requestFour])
      .then(
        axios.spread((...responses) => {
          this.setState({
            isLoaded: true,
            responseOne: responses[0].data,
            responseTwo: responses[1].data,
            responseThree: responses[2].data,
            responseFour: responses[3].data,
          });
        })
      )
      .catch((error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      });
    this.setState({ company: this.props.dato });
  }

  render() {
    const { isLoaded, responseOne, responseTwo, responseThree, responseFour } =
      this.state;

    const options = (Title, Position, titleText, background) => ({
      title: Title,
      titleTextStyle: { color: titleText },
      pieHole: 0.4,
      is3D: false,
      pieSliceText: 'label',
      pieSliceBorderColor: 'transparent',
      pieResidueSliceLabel: 'Otros',
      backgroundColor: background,
      slices: {
        4: { offset: 0.2 },
        12: { offset: 0.3 },
        14: { offset: 0.4 },
        15: { offset: 0.5 },
      },
      legend: 'none',
    });
    /*
{
        backgroundColor: '#ffffff',
        textStyle: { color: '#ffffff', fontSize: 14 },
        labels: {
          fontSize: 7,
          color: '#ffffff',
          boxWidth: 3,
          ,
        position: Position,
      }
        }
        * */
    const dmt = (Data) => Data.map((a) => [a['name'], a['percent']]);
    const Graph = ({ response, Title, Color, Background, Post, Width, Height }) => {
      return (
        <Chart
          chartType="PieChart"
          width={Width}
          height={Height}
          data={[[Title, 'Porcentaje']].concat(dmt(response))}
          options={options(Title, Post, Color, Background)}
        />
      );
    };

    const Total = () => {
      return (
        <div className="s-box-icon">
          <strong>
            Total programado:{' '}
            {
              responseFour.grand_total[
                'human_readable_total_including_other_language'
              ]
            }
          </strong>
        </div>
      );
    };

    if (isLoaded) {
      const dato = this.props.status;
      if (dato === 'true') {
        return (
          <section id="skills" className="section clearfix format-section">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="heading">
                    <strong className="sect-title">
                      Mis habilidades
                      <i className="heading-logo skill-logo" alt=""></i>
                    </strong>
                    <p>Mi experticia</p>
                  </div>
                </div>
              </div>
              <div className="scrolling-wrapper">
                <div className="s-box-container">
                  <div className="skill-box">
                    <div className="s-box-text">
                      <Graph
                        response={responseTwo}
                        Title={'Lenguajes'}
                        Color={'white'}
                        Background={'#282632'}
                        Post={'right'}
                        Width={'45rem'}
                        Height={'500px'}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Total />
            </div>
          </section>
        );
      } else {
        return (
          <section id="skills" className="section clearfix format-section">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="heading">
                    <strong className="sect-title">
                      Mis habilidades
                      <i className="heading-logo skill-logo" alt=""></i>
                    </strong>
                    <p>Mi experticia</p>
                  </div>
                </div>
              </div>
              <div className="scrolling-wrapper">
                <div className="s-box-container">
                  <div className="skill-box">
                    <div className="s-box-text">
                      <Graph
                        response={responseTwo}
                        Title={'Lenguajes'}
                        Color={'black'}
                        Background={'#f8f5fa'}
                        Post={'right'}
                        Width={'45rem'}
                        Height={'500px'}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Total />
              <div className="others">
                <div className="other">
                  <div className="skill-box-2">
                    <Graph
                      response={responseOne}
                      Title={'Editores'}
                      Color={'black'}
                      Background={'#f8f5fa'}
                      Post={'bottom'}
                      Width={'20rem'}
                      Height={'300px'}
                    />
                  </div>
                </div>
                <div className="other">
                  <div className="skill-box-2">
                    <Graph
                      response={responseThree}
                      Title={'Sistemas operativos'}
                      Color={'black'}
                      Background={'#f8f5fa'}
                      Post={'bottom'}
                      Width={'20rem'}
                      Height={'300px'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }
    } else {
      return (
      <div id="loader-wrapper">
      <div id="loader"></div>
    </div>);
    }
  }
}

export default Stats;
