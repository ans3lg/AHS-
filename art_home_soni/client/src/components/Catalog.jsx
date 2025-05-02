import React from 'react';
import { Link } from "react-router-dom";
import './Catalog.css';

function Catalog() {
    return (
        <section className="catalog_sec">
            <div className="catalog">
                <div className="catalog_left">
                    <h2>Каталог картин</h2>
                    <p>В нашем каталоге представлены Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias, molestiae. Dolorum deleniti fugiat quod incidunt.</p>
                    <div className="catalog_left_link">
                        <Link to="/catalog">Каталог</Link>
                    </div>
                </div>
                <img src="/catalog.jpg" alt="Каталог" />
            </div>
        </section>
    );
}

export default Catalog;