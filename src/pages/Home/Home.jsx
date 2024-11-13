import React from "react";
import GridPattern from "../../components/GridPattern";
import './Home.css'
import Header from "../../components/Header/Header";
import ClientsReview from "../../components/ClientsReview/ClientsReview";
import WorksCarroussel from "../../components/worksCarroussel/worksCarroussel";

function Home() {
    return (
        <div className="relative h-screen w-screen">
            <GridPattern className="backgroundAnimated" /> {/* Adicione as classes conforme o design desejado */}
            <section className="homeSection">
                <Header />
                <h1 className="home__h1">Nossos trabalhos</h1>
                <WorksCarroussel />
                <ClientsReview />
                <h1 className="home__h1--2">Melhore o impacto das ações<br />da sua empresa</h1>
                <p className="home__p">Empower your decisions woth the wisdo, of astrolgy. Gain the
                    clarity you need to move forward with confidendce.</p>
                <button className="home__btn">Contate-nos</button>
            </section>
        </div>
    );
}

export default Home;
