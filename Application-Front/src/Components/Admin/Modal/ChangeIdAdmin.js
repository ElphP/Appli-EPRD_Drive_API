import React, { useState, useEffect } from "react";
import "./ChangeIdAdmin.css";

const ChangeIdAdmin = ({ show, handleClose, changeOnDB, handleLogOut }) => {
    const showHideClassName = show
        ? "modal display-flex"
        : "modal display-none";
    // création du flou d'arrière-plan
    const overlay = show ? "overlay display-block" : "overlay display-none";

    const [mail, setMail] = useState("");
    const [mdp, setMdp] = useState("");

    const [mess, setMess] = useState("");

    useEffect(() => {
        if (mail === "" || mdp === "") {
            setMess(
                "Le mail de connexion et le mot de passe sont obligatoires"
            );
        } else {
            setMess("Attention: après validation, l'application sera déconnectée!");
        }
    }, [mail, mdp]);

    useEffect(() => {
        if (!show) {
            // Réinitialise les valeurs des inputs quand la modal devient cachée
            setMail("");
            setMdp("");
        }
    }, [show]);

    const handleCreate = async () => {
        // console.log(mail, mdp);
        //  envoyer le json avec les associations ci-dessous à l'adresse addUser
        try {
           
            const apiUrl = process.env.REACT_APP_API_URL;
            console.log(`${apiUrl}/drive_API/changeIdAdmin`);
            
            const response = await fetch(`${apiUrl}/drive_API/changeIdAdmin`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mail,
                    mdp,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.log("Erreur HTTP:", response.status);
                console.log(data.error);
                setMess(data.error);
            } else {
                 
               handleLogOut();
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

    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-main modalCreate">
                    <label htmlFor="mail">Mail de connexion*</label>
                    <input
                        type="email"
                        onChange={handleChangeMail}
                        id="mail"
                        value={mail}
                    />
                    <label htmlFor="mdp">Nouveau mot de passe*</label>
                    <input
                        type="text"
                        onChange={handleChangeMdp}
                        id="mdp"
                        value={mdp}
                    />

                    <div className="buttons">
                        <button
                            onClick={handleCreate}
                            className="btnModal btnModal1"
                        >
                            Valider le changement
                        </button>

                        <button
                            onClick={handleClose}
                            className="btnModal btnModal2"
                        >
                            Fermer sans sauvegarder
                        </button>
                    </div>
                    <p className="mess">{mess}</p>
                </section>
            </div>
        </>
    );
};

export default ChangeIdAdmin;
