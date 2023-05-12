import React from "react";
import "./social.css";
import { FaLinkedin, FaGithubSquare, FaBehanceSquare } from "react-icons/fa";
import { motion } from "framer-motion";

const Social = ({ social }) => {
  return (
    <div className="socials-div">
      <motion.a
        href="https://www.behance.net/felipeandrade27"
        target="_blank"
        whileHover={{ scale: 1.3 }}
      >
        <FaBehanceSquare size="20" />
      </motion.a>
      <motion.a
        href={social["Linkedin"]}
        target="_blank"
        whileHover={{ scale: 1.3 }}
      >
        <FaLinkedin size="20" />
      </motion.a>
      <motion.a
        href={social["GitHub"]}
        target="_blank"
        whileHover={{ scale: 1.3 }}
      >
        <FaGithubSquare size="20" />
      </motion.a>
      <span className="vertical-line"></span>
    </div>
  );
};

export default Social;
