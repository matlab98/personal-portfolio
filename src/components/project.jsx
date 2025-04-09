import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const Project = ({ project }) => {
const { t } = useTranslation();

  const modal = (title, text, image, url) => {
    Swal.fire({
      title,
      text,
      imageUrl: image,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: url,
      showCloseButton: true,
      confirmButtonHtml: `<a class="buttonText" href="${url}" target="_blank" rel="noopener noreferrer">Ver</a>`,
    });
  };

  const filterSelection = (category) => {
    const elements = document.getElementsByClassName('dev-project');
    Array.from(elements).forEach((el) => {
      el.classList.remove('show');
      if (category === 'all' || el.classList.contains(category)) {
        el.classList.add('show');
      }
    });
  };

  useEffect(() => {
    const btns = document.querySelectorAll('#btnContainer .btn-project');

    const handleClick = (e) => {
      document.querySelector('.btn-project.active')?.classList.remove('active');
      e.currentTarget.classList.add('active');
    };

    btns.forEach((btn) => btn.addEventListener('click', handleClick));

    // Selección inicial
    filterSelection('all');

    // Cleanup
    return () => {
      btns.forEach((btn) => btn.removeEventListener('click', handleClick));
    };
  }, []);

  const categories = [
    { id: 0, label: "Todos", type: "all", count: "06", icon: "fa fa-tasks" },
    { id: 1, label: "FrontEnd", type: "FrontEnd", count: "06" },
    { id: 2, label: "BackEnd", type: "BackEnd", count: "03" },
    { id: 3, label: "Automatización", type: "Automation", count: "02" },
    { id: 4, label: "Devops", type: "Devops", count: "02" }
  ];

  return (
    
    <motion.section
    id="portfolio"
    className="format-section"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="heading">
            <motion.h2>
              Mis proyectos
            </motion.h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="portfolio-nav">
            <ul id="btnContainer">
              {categories.map(({ id, label, type, count, icon }) => (
                <li
                  key={id}
                  className={`btn-project ${id === 0 ? 'active' : ''}`}
                  onClick={() => filterSelection(type)}
                >
                  <span>{count}</span>
                  {icon ? <i className={icon}></i> : null}
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="portfolio-inner">
        <div className="row stylex">
          <div className="isotop-active">
            {project.map((a, i) => (
              <div
                key={i}
                className={`mix development html5 col-md-4 col-sm-6 col-xs-12 col-fix dev-project ${a.type}`}
              >
                <div className="portfolio-single">
                  <div className="portfolio-head">
                    <img src={a.cover_page} alt={a.name_project} />
                  </div>
                  <div className="portfolio-hover">
                    <h4><a href={a.link}>{a.name_project}</a></h4>
                    <div className="button">
                      <a onClick={() => modal(a.name_project, a.description, a.cover_page, a.link)}>
                        <i className="fa fa-search"></i>
                      </a>
                      <a href={a.link} className="primary">
                        <i className="fa fa-link"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
  </motion.section>
  );
};

export default Project;
