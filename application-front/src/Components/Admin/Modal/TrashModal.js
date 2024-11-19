// import React, { useState } from "react";
import "./TrashModal.css";

const TrashModal = ({ show, handleClose, data, changeOnDB }) => {
    const showHideClassName = show
        ? "modal display-flex"
        : "modal display-none";
    const overlay = show ? "overlay display-block" : "overlay display-none";

    const handleDelete = async (event) => {
        if (data[0] === "user") {
            // envoyer un json avec user_id et alias pour supprimer (user_id) et renvoyer le nom de l'utilisateur supprimé (son alias) à  l'adress deleteUser
                try {
                    const apiUrl = process.env.REACT_APP_API_URL;
                    const response = await fetch(
                        `${apiUrl}/drive_API/deleteUser`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user_id: data[1],
                                alias: data[2],
                            }),
                        }
                    );

                    const dataResponse = await response.json();
                    if (!response.ok) {
                        console.error("Erreur d'effacement de l'utilisateur");
                    } else {
                        console.log("Réponse:", dataResponse);
                        changeOnDB(true);
                        handleClose();
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                }
            console.log(data, event);
            
        } else if (data[0] === "userDoc") {
            // envoyer un json avec user_id et file_id pour supprimer le fichier file_id pour l'user (défini par user_id) à l'adress removeFileToUser
            console.log(data, event);
            // Poubelle utilisée avec un doc pour un utilisateur donné: appel à la méthode removeFileToUser de l'API
           
             try {
                const apiUrl = process.env.REACT_APP_API_URL;
                 const response = await fetch(
                     `${apiUrl}/drive_API/removeFileToUser`,
                     {
                         method: "DELETE",
                         headers: {
                             Authorization: `Bearer ${localStorage.getItem(
                                 "token"
                             )}`,
                             "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                             user_id: data[3],
                             file_id: data[1],
                         }),
                     }
                 );

                 const dataResponse = await response.json();
                 if (!response.ok) {
                     console.error("Erreur d'effacement de la donnée");
                 } else {
                     console.log("Réponse:", dataResponse);
                     changeOnDB(true);
                     handleClose();
                 }
             } catch (error) {
                 console.error("Erreur:", error);
             }
        }
        // Poubelle utilisée avec doc admin : appel à la methode deletePrivateFile de l'api
        else if (data[0] === "doc") {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(
                    `${apiUrl}/drive_API/deleteFile`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            nom: data[2], 
                            id: data[1]
                        }),
                    }
                );

                const dataResponse = await response.json();
                if (!response.ok) {
                    console.error("Erreur d'effacement de la donnée");
                } else {
                    console.log("Réponse:", dataResponse);
                    changeOnDB(true);
                    handleClose();
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
            console.log(data, event);
        }

     
       
    };

    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-trash ">
                    {data[0] === "doc" && (
                        <p className="text">
                            Etes-vous sur de vouloir supprimer la partition{" "}
                            <span className="colorText">{data[2]}</span> de
                            votre bibliothèque?
                        </p>
                    )}
                    {data[0] === "user" && (
                        <p className="text">
                            Etes-vous sur de vouloir supprimer l'utilisateur{" "}
                            <span className="colorText">{data[2]} </span> de
                            votre zone d'échange?
                        </p>
                    )}
                    {data[0] === "userDoc" && (
                        <p className="text">
                            Etes-vous sur de vouloir supprimer la partition{" "}
                            <span className="colorText">{data[2]}</span> pour
                            l'utilisateur{" "}
                            <span className="colorText">{data[4]}</span>?
                        </p>
                    )}

                    <div className="buttons">
                        <button
                            onClick={handleDelete}
                            className="btnModal btnModal1"
                        >
                            Oui
                        </button>

                        <button
                            onClick={handleClose}
                            className="btnModal btnModal2"
                        >
                            Non
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TrashModal;
