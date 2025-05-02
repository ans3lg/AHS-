import React from 'react';
import Home from '../components/Home';
import About from '../components/About';
import Catalog from '../components/Catalog';
import MasterKlass from '../components/MasterKlass';


function HomePage() {
    return (
        <div className="HomePage">
            <Home />
            <About />
            <Catalog />
            <MasterKlass />
        </div>
    );
}

export default HomePage;