import React from "react";
import { Link } from "react-router-dom";
import './AboutPage.css';

function AboutPage() {
    return (
        <section className="about">
            <h2>О нас</h2>
            <section className="about_blocks">
                <section className="about_left">
                    <div className="about_left_photo">
                        <img src="/about1.jpg" alt="Фотография" />
                    </div>
                    <div className="about_left_text">
                        {/* <h2>Lorem ipsum</h2> */}
                        <p>Мы верим, что искусство — это язык души, доступный каждому. В нашей студии проходят занятия для всех уровней подготовки, от новичков до опытных художников. Мы создаём не просто картины — мы создаём эмоции, впечатления и истории, которые остаются с вами навсегда.</p>
                        <Link href="/" className="link_about_mail">Написать нам на почту</Link>
                    </div>
                </section>
                <section className="about_right">
                    <div className="about_right_text">
                        {/* <h2>Lorem ipsum</h2> */}
                        <p>Наша художественная студия — это пространство творчества, где искусство оживает в каждом штрихе и оттенке. Мы объединяем людей, влюблённых в живопись, графику и другие виды визуального искусства, помогая каждому раскрыть свой талант и выразить себя через творчество. Здесь царит вдохновение, а атмосфера наполнена светом идей и красок.</p>
                    </div>
                    <div className="about_right_photo">
                        <img src="/about2.jpg" alt="Фотография" />
                    </div>
                </section>
            </section>
        </section>
    );
}

export default AboutPage;