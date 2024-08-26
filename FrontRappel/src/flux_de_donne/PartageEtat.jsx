import { useState } from "react";

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="À propos"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Avec une population d’environ 2 millions d’habitants, Almaty est la plus
        grande ville du Kazakhstan. De 1929 à 1997, elle en était la capitale.
      </Panel>
      <Panel
        title="Étymologie"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Le nom vient de <span lang="kk-KZ">алма</span>, le mot kazakh pour
        « pomme » et est souvent traduit comme « plein de pommes ». En fait, la
        région d’Almaty est considérée comme le berceau ancestral de la pomme,
        et la <i lang="la">Malus sieversii</i> sauvage est considérée comme
        l’ancêtre probable de la pomme domestique moderne.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>Afficher</button>
      )}
    </section>
  );
}
