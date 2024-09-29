import React, { useState, useEffect } from "react";
import "./CreateUser.css";

const CreateUser = ({ show, handleClose, changeOnDB }) => {
    const showHideClassName = show
        ? "modal display-flex"
        : "modal display-none";
    // création du flou d'arrière-plan
    const overlay = show ? "overlay display-block" : "overlay display-none";

    const [mail, setMail] = useState("");
    const [mdp, setMdp] = useState("");
    const [alias, setAlias] = useState("");

    const [mess, setMess] = useState("");

    useEffect(() => {
        if (mail === "" || mdp === "" || alias === "") {
            setMess(
                "Les 3 champs sont requis pour la création d'un utilisateur!"
            );
        } else {
            setMess("");
        }
    }, [mail, mdp, alias]);

    useEffect(() => {
        if (!show) {
            // Réinitialise les valeurs des inputs quand la modal devient cachée
            setMail("");
            setMdp("");
            setAlias("");
        }
    }, [show]);

    const handleCreate = async () => {
        console.log(mail, mdp, alias);
        //  envoyer le json avec les associations ci-dessous à l'adresse addUser
        try {
            const response = await fetch(
                "https://127.0.0.1:8000/drive_API/addUser",
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ` + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        mail,
                        mdp,
                        alias,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.log(data.error);
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
    const handleChangeMdp = (event) => {
        setMdp(event.target.value);
    };
    const handleChangeAlias = (event) => {
        setAlias(event.target.value);
    };

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
                    <label htmlFor="mdp">Mot de passe*</label>
                    <input
                        type="text"
                        onChange={handleChangeMdp}
                        id="mdp"
                        value={mdp}
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
