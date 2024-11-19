import React, { useState, useEffect } from "react";
import "./CreateUser.css";


// import generatePassword from "../../../Services/passwordCreation"

const CreateUser = ({ show, handleClose, changeOnDB }) => {
    const showHideClassName = show
        ? "modal display-flex"
        : "modal display-none";
    // création du flou d'arrière-plan
    const overlay = show ? "overlay display-block" : "overlay display-none";

    const [mail, setMail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [alias, setAlias] = useState("");

    const [mess, setMess] = useState("");

    

    useEffect(() => {
        if (mail === "" || firstname === "" || alias === "") {
            setMess(
                "Les 3 champs sont requis pour la création d'un utilisateur!"
            );
        } else {
            setMess("");
        }
    }, [mail, firstname, alias]);

    useEffect(() => {
        if (!show) {
            // Réinitialise les valeurs des inputs quand la modal devient cachée
            setMail("");
            setFirstname("");
            setAlias("");
        }
        
    }, [show]);

    const handleCreate = async () => {
        console.log(mail, firstname, alias);
        //  envoyer le json avec les associations ci-dessous à l'adresse addUser
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${apiUrl}/drive_API/addUser`,
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ` + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mail,
                        firstname,
                        alias,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.log(data.error);
                // à recoder correctement
                setMess(data.error);
            
                
            } else {
                console.log("Réponse:", data);
                changeOnDB(true);
                handleClose();
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const handleChangeMail = (event) => {
        setMail(event.target.value);
    };
    const handleChangeFirstname = (event) => {
        setFirstname(event.target.value);
    };
    const handleChangeAlias = (event) => {
        setAlias(event.target.value);
    };

    // const handleGeneratePassword = (event)=>  {
        
    //     setMdp(generatePassword());
    // }

    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-main modalCreate">
                    <label htmlFor="mail">Email de connexion*</label>
                    <input
                        type="email"
                        onChange={handleChangeMail}
                        id="mail"
                        value={mail}
                    />
                    <label htmlFor="alias">
                        Pseudo de l'utilisateur* (affiché dans la liste)
                    </label>
                    <input
                        type="text"
                        onChange={handleChangeAlias}
                        id="alias"
                        value={alias}
                    />
                    <div className="MDP__label">
                        <label htmlFor="mdp">Prénom de l'utilisateur*</label>
                       
                    </div>
                    <input
                        type="text"
                        onChange={handleChangeFirstname}
                        id="mdp"
                        value={firstname}
                       
                    />

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
                    <p className="mess">{mess}</p>
                </section>
            </div>
        </>
    );
};

export default CreateUser;
