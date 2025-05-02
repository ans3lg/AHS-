import React from "react";
import { Link } from "react-router-dom";
import "./MasterKlass.css";

function MasterKlass() {
  return (
    <div className="MasterKlass">
      <h2>Наши мастер-классы</h2>
      <div className="cards">
        <div className="card-el">
          <img src="/Card1.jpg" alt="Фотография" />
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="card-el">
          <img src="/Card2.jpg" alt="Фотография" />
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="card-el">
          <img src="/Card3.jpg" alt="Фотография" />
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
      <div className="link_mc_df">
        <Link to="/masterclasses" className="link_mc">
          Перейти к мастер-классам
        </Link>
      </div>
    </div>
  );
}

export default MasterKlass;
