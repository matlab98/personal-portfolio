import React from 'react';
import "./navBar.css";

const NavBar = () => {
  return (
    <nav className="navigation">
    <div className="logo">
      <img
        src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1628388753/dsn8q08orztuibj1xycc.png"
        alt="me"
      />
    </div>

    <input type="checkbox" className="menu-btn" id="menu-btn" />
    <label htmlFor="menu-btn" className="menu-icon">
      <span className="nav-icon"></span>
    </label>

    <ul className="menu">
      <li>
        <a href="#main">Inicio</a>
      </li>
      <li>
        <a href="#skills">Habilidades</a>
      </li>
      <li>
        <a href="#introduction">Introducción</a>
      </li>
      <li>
        <a href="#services">Servicio</a>
      </li>
      <li>
        <a href="#contact">Contacto</a>
      </li>
    </ul>
  </nav>
  )
};

export default NavBar;