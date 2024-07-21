import "./AdminPage.css";
// Importation des bibliothèques nécessaires
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import DocumentAdmin from "../Admin/DocumentAdmin";
import UserCard from "../Admin/UserCard";
import { useLocation } from "react-router-dom";
import imgTrash from "../../images/trash-can-solid.svg";
import imgPlus from "../../images/plus-solid (1).svg";

const AdminPage = () => {
    const location = useLocation();
    const { state } = location;
    const username = state.username || "'Utilisateur non identifié'";
    const collection = state.collection || [];
    const listUsers = state.listUsers || [];

        
        const showList = (index) =>  {
            let popup= document.getElementById("popup"+index);
           popup.style.display = "block";
        }
        const hideList = (index) =>  {
            let popup= document.getElementById("popup"+index);
           popup.style.display = "none";
        }
            // drag and drop functions
         const onDragStart = (event) => {
             event.dataTransfer.setData("Text", event.target.id);
         };

          const onDragOver = (event) => {
              event.preventDefault();
          };
        // drop function
        const onDrop = (event, targetItem) => {
            event.preventDefault();
            const draggedItemId = event.dataTransfer.getData("Text");
            console.log(draggedItemId, targetItem);
            //ici remplacer le console.log ci-dessus en effectuant un Create de l'enregistrement ayant  user.id_user comme identifiant et en utilisant "draggedItemTitle" qui est l'ID du fichier à ajouter à cette entrée! (onDrop deviendra une fonction async) dans la table associative (users-fichiers)
        }
        


    // Simulate API call to save the dragged item for the target user
    return (
        <div className="fond">
            <h1>Bonjour {username}</h1>
            <div className="present">
                <div className="align">
                    <p>
                        Bienvenue sur l'interface d'administration de ta
                        partothèque!
                    </p>
                    <p>Ici tu pourras: </p>
                    <ul>
                        <li>
                            Ajouter/ Enlever des partitions de ta partothèque
                        </li>
                        <li>
                            Ajouter/ Enlever des utilisateurs avec qui tu veux
                            partager les partitions
                        </li>
                        <li>
                            Partager tes partitions avec les utilisateurs (en
                            faisant un "glisser/déposer' de la partition sur
                            l'utilisateur)
                        </li>
                        <li>
                            Visualiser (au survol) les partitions disponibles
                            dans la partothèque des utilisateurs
                        </li>
                    </ul>
                </div>
            </div>
            <main>
                <div className="containerAdmin">
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
                    <ul className="listDoc">
                        {collection.length === 0 ? (
                            <li className="noData">
                                Aucun utilisateur disponible
                            </li>
                        ) : (
                            collection.map((user, index) => (
                                <li
                                    draggable="true"
                                    key={"collection"+index}
                                    onDragStart={onDragStart}
                                    id={user[1]}
                                >
                                    <DocumentAdmin titre={user[0]} />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
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
                    <ul>
                        {listUsers.length === 0 ? (
                            <li className="noData">
                                Aucun utilisateur disponible
                            </li>
                        ) : (
                            listUsers.map((user, index) => (
                                <li
                                    key={"listUsers"+index}
                                    onMouseEnter={() => showList(index)}
                                    onMouseLeave={() => hideList(index)}
                                    onDragOver={onDragOver}
                                    onDrop={(event) => onDrop(event, {user})}
                                    id={user.id_user}
                                >
                                    <UserCard
                                        alias={user.name}
                                        id={index}
                                        titres={user.titres}
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};
export default AdminPage;
