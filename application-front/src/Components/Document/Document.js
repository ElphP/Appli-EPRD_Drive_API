import "./Document.css";
import {useState, useEffect} from "react";


import img from "../../images/document-icon-18.png";


const Document = ({titre,telecharg}) => {
    
    
    const[clicks,setClicks]= useState(0);
    // test dblClick
     useEffect(() => {
         let timer;

         if (clicks === 2) {
             telecharg();
             setClicks(0); // Réinitialiser les clics après l'appel à telecharg
         } else {
             // Réinitialiser l'état des clics après 300ms si pas de second clic
             timer = setTimeout(() => {
                 setClicks(0);
             }, 300);
         }

         return () => clearTimeout(timer); // Nettoyage du timer
     }, [clicks, telecharg]);
    
  
    return (
        <>
            <div className="card">
                <img
                    src={img}
                    alt="document"
                    onClick={() => {
                        setClicks((prev) => prev + 1); // Incrémenter le compteur de clics
                    }}
                    draggable="false"
                />
                <p className="doc">{titre}</p>
            </div>
        </>
    );
}

export default Document;