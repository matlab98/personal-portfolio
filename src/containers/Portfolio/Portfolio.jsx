import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pagination } from "antd";
import Card from "../../components/Card";
import "./portfolio.css";

const Portfolio = ({ project }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeProjectType, setActiveProjectType] = useState("All");

  const handleProjectTypeChange = (projectType) => {
    setActiveProjectType(projectType);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = currentPage - 1;
  const endIndex = startIndex + 1;

  const myProjects = project.filter((project) => {
    if (activeProjectType === "All") {
      return project; // Devuelve project sin filtrar
    } else {
      return project.type.includes(activeProjectType);
    }
  });

  const totalProjects = myProjects.length;
  console.log(project)
  return (
    <div id="container-portfolio">
      <div id="portfolio">
        <h1 className="margin-h1-bottom center-text">Projects</h1>
        <div className="div-buttons">
          <motion.button
            type="button"
            onClick={() => handleProjectTypeChange("All")}
            className={
              activeProjectType === "All"
                ? "active btn-tag"
                : "inactive btn-tag"
            }
            whileHover={{ scale: 1.08 }}
          >
            All
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleProjectTypeChange("Devops")}
            className={
              activeProjectType === "Devops"
                ? "active btn-tag"
                : "inactive btn-tag"
            }
            whileHover={{ scale: 1.08 }}
          >
            Devops
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleProjectTypeChange("BackEnd")}
            className={
              activeProjectType === "BackEnd"
                ? "active btn-tag"
                : "inactive btn-tag"
            }
            whileHover={{ scale: 1.08 }}
          >
            Back End
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleProjectTypeChange("FrontEnd")}
            className={
              activeProjectType === "FrontEnd"
                ? "active btn-tag"
                : "inactive btn-tag"
            }
            whileHover={{ scale: 1.08 }}
          >
            Front End
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleProjectTypeChange("Art")}
            className={
              activeProjectType === "Art"
                ? "active btn-tag"
                : "inactive btn-tag"
            }
            whileHover={{ scale: 1.08 }}
          >
            Automazation
          </motion.button>
        </div>

        <div id="projects-div">
          {myProjects.slice(startIndex * 3, endIndex * 3).map((project) => {
            return (
              <motion.div
                key={project.key}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                initial="hidden"
                whileInView="visible"
              >
                <Card
                  title={project.name_project}
                  description={project.description}
                  src={project.cover_page}
                  link={project.link}
                  type={project.type}
                  skill={project.skill_use}
                />
              </motion.div>
            );
          })}
          {myProjects.length > 0 ? (
            <Pagination
              simple
              current={currentPage}
              pageSize={3}
              total={totalProjects}
              onChange={handlePageChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
