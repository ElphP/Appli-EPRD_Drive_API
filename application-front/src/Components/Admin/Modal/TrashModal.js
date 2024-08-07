// import React, { useState } from "react";
import "./TrashModal.css";

const TrashModal = ({ show, handleClose, data }) => {
    
    const showHideClassName = show
        ? "modal display-flex"
        : "modal display-none";
    const overlay = show ? "overlay display-block" : "overlay display-none";

     const handleDelete = async (event) => {
         console.log(data, event);

         // ici Appel à l'API pour supprimer l'élément (utiliser un try catch)
       handleClose();
    }
    
  
    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-trash ">
                  {data[0]==="doc" &&
                    <p className="text">Etes-vous sur de vouloir supprimer la partition <span className="colorText">{data[2]}</span> de votre bibliothèque?</p>
                  } 
                  {data[0]==="user" &&
                    <p className="text">Etes-vous sur de vouloir supprimer l'utilisateur <span className="colorText">{data[2]} </span> de votre zone d'échange?</p>
                  } 
                  {data[0]==="userDoc" &&
                    <p className="text">Etes-vous sur de vouloir supprimer la partition <span className="colorText">{data[2]}</span> pour l'utilisateur <span className="colorText">{data[4]}</span>?</p>
                  } 
                 

                    <div className="buttons">
                        <button
                            onClick={handleDelete}
                            className="btnModal btnModal1"
                        >
                            Supprimer l'élément
                        </button>

                        <button
                            onClick={handleClose}
                            className="btnModal btnModal2"
                        >
                            Fermer
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TrashModal;