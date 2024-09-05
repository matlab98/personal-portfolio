import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
const Project = (props) => {
  const modal = (Title, Text, Image, Url) => {
    Swal.fire({
      title: Title,
      text: Text,
      imageUrl: Image,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: Url,
      showCloseButton: true,
      confirmButtonText: `<a class="buttonText" href=${Url}>Ver</a>`,
    });
  };

  useEffect(() => {
    if(document.getElementById(0).classList.value === 'btn-project active'){
      filterSelection('all');
    }
    var btnContainer = document.getElementById('btnContainer');
    var btns = btnContainer.getElementsByClassName('btn-project');
    for (const value of btns) {
      value.addEventListener('click', function () {
        var current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
      });
    }
  });

  function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName('dev-project');
    if (c == 'all') c = '';
    for (i = 0; i < x.length; i++) {
      removeClass(x[i], 'show');
      if (x[i].className.indexOf(c) > -1) addClass(x[i], 'show');
    }
  }

  function addClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(' ');
    arr2 = name.split(' ');
    for (i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) == -1) {
        element.className += ' ' + arr2[i];
      }
    }
  }

  function removeClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(' ');
    arr2 = name.split(' ');
    for (i = 0; i < arr2.length; i++) {
      while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
      }
    }
    element.className = arr1.join(' ');
  }

  return (
    <section id="portfolio" className="format-section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <div className="heading">
              <strong className="sect-title">
                <span>Mi portafolio</span>
                <i className="heading-logo project-logo"></i>
              </strong>
              <p>Estos son todos los proyectos que he realizado hasta ahora.</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <div className="portfolio-nav">
              <ul id="btnContainer">
                <li
                  className="btn-project active"
                  id="0"
                  onClick={() => filterSelection('all')}
                >
                  <span>06</span>
                  <i className="fa fa-tasks"></i>Todos
                </li>
                <li
                  className="btn-project"
                  id="1"
                  onClick={() => filterSelection('FrontEnd')}
                >
                  <span>06</span>
                  FrontEnd
                </li>
                <li
                  className="btn-project"
                  id="2"
                  onClick={() => filterSelection('BackEnd')}
                >
                  <span>03</span>
                  BackEnd
                </li>
                <li
                  className="btn-project"
                  id="3"
                  onClick={() => filterSelection('Automation')}
                >
                  <span>02</span>
                  Automatización
                </li>
                <li
                  className="btn-project"
                  id="4"
                  onClick={() => filterSelection('Devops')}
                >
                  <span>02</span>
                  Devops
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="portfolio-inner">
          <div className="row stylex">
            <div className="isotop-active">
              {props['project'].map((a, i) => {
                return (
                  <div
                    key={i}
                    className={`mix development html5 col-md-4 col-sm-6 col-xs-12 col-fix dev-project ${a.type}`}
                  >
                    <div className="portfolio-single">
                      <div className="portfolio-head">
                        <img src={a.cover_page} alt="" />
                      </div>
                      <div className="portfolio-hover">
                        <h4>
                          <a href={a.link}>{a.name_project}</a>
                        </h4>

                        <div className="button">
                          <a
                            data-fancybox="gallery"
                            onClick={() => {
                              modal(
                                a.name_project,
                                a.description,
                                a.cover_page,
                                a.link
                              );
                            }}
                          >
                            <i className="fa fa-search"></i>
                          </a>
                          <a href={a.link} className="primary">
                            <i className="fa fa-link"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="button">
            <Link to="/portfolio-full-width" className="btn">
              Más Proyectos<i className="fa fa-angle-double-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;
