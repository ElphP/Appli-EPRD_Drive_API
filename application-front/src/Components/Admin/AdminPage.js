import "./AdminPage.css";
// Importation des bibliothèques nécessaires
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import DocumentAdmin from "../Admin/DocumentAdmin";
import { useLocation } from "react-router-dom";
import imgTrash from "../../images/trash-can-solid.svg";
import imgPlus from "../../images/plus-solid (1).svg";

const AdminPage = () => {
    const location = useLocation();
    const { state } = location;
    const username = state.username || "'Utilisateur non identifié'";
    const collection = state.collection || [];

    return (
        <>
            <h1>Bonjour {username}</h1>
            <div className="present">
                <div className="align">
                    <p>Bienvenue sur l'interface d'administration de ta partothèque!</p>
                    <p>Ici tu pourras: </p>
                    <ul >
                        <li>Ajouter/ Enlever des partitions de ta partothèque</li>
                        <li>Ajouter/ Enlever des utilisateurs avec qui tu veux partager les partitions</li>
                        <li>Partager tes partitions avec les utilisateurs (en faisant un "glisserr/déposer' de la parttition sur l'utilisateur) </li>
                    </ul>
                </div>
            </div>
            <main>
                <ul className="containerAdmin">
                    <div className="CD">
                        <button
                            className="plus"
                            data-title="Cliquer ici pour ajouter une partition à la collection"
                        >
                            <img src={imgPlus} alt="ajouter" />
                        </button>
                        <img className="trash" src={imgTrash} alt="poubelle" />
                    </div>
                    <h2 className="admin">Partitions</h2>
                    {collection.length === 0 ? (
                        <li>Aucun utilisateur disponible</li>
                    ) : (
                        collection.map((user, index) => (
                            <li key={index}>
                                <DocumentAdmin titre={user} />
                            </li>
                        ))
                    )}
                </ul>
                <div className="containerUser">
                    <div className="CD">
                        <button
                            className="plus"
                            data-title="Cliquer ici pour ajouter un utilisateur"
                        >
                            <img src={imgPlus} alt="ajouter" />
                        </button>
                        <img className="trash" src={imgTrash} alt="poubelle" />
                    </div>
                    <h2 className="admin">Liste d'utilisateurs</h2>
                </div>
            </main>
        </>
    );
};
export default AdminPage;
