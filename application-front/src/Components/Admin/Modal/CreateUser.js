import React, { useState } from "react";
import "./CreateUser.css";

const CreateUser = ({ show, handleClose }) => {
    const showHideClassName = show
        ? "modal display-flex"
        : "modal display-none";
    const overlay = show ? "overlay display-block" : "overlay display-none";

    const[mail,setMail]= useState("");
    const[alias,setAlias]= useState("");
    const[nom,setNom]= useState("");
    const[prenom,setPrenom]= useState("");



   const handleCreate = ()=>  {
        console.log(mail, alias, nom, prenom);
   }

   const handleChangeMail= (event) =>  {
       setMail(event.target.value);
   }
   const handleChangeAlias= (event) =>  {
       setAlias(event.target.value);
   }
   const handleChangeNom= (event) =>  {
       setNom(event.target.value);
   }
   const handleChangePrenom= (event) =>  {
       setPrenom(event.target.value);
   }
   

  

    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-main modalCreate">
                    <label htmlFor="mail">Email de connexion</label>
                    <input type="email" onChange={handleChangeMail} id="mail" />
                    <label htmlFor="alias">Alias de l'utilisateur (nom affiché dans la liste)</label>
                    <input type="text" onChange={handleChangeAlias} id="alias"/>
                    <label htmlFor="nom">Nom</label>
                    <input type="text" onChange={handleChangeNom}id="nom"/>
                    <label htmlFor="prenom">Prénom</label>
                    <input type="text" onChange={handleChangePrenom} id="prenom" />
                    <div className="buttons">
                        <button
                            onClick={handleCreate}
                            className="btnModal btnModal1"
                        >
                            Créer l'utilisateur
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

export default CreateUser;
