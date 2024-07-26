import "./AdminPage.css";
// Importation des bibliothèques nécessaires
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import DocumentAdmin from "../Admin/DocumentAdmin";
import UserCard from "../Admin/UserCard";
import FileUpload from "./Modal/FileUpload";
import CreateUser from "./Modal/CreateUser";
import { useLocation } from "react-router-dom";
import imgTrash from "../../images/trash-can-solid.svg";
import imgPlus from "../../images/plus-solid (1).svg";

const AdminPage = () => {
    const location = useLocation();
    const { state } = location;
    const username = state.username || "'Utilisateur non identifié'";
    const collection = state.collection || [];
    const listUsers = state.listUsers || [];

        // affichage listes des partitions disponibles pour chaque utilisateur
        const showList = (index) =>  {
            let popup= document.getElementById("popup"+index);
           popup.style.display = "block";
        }
        const hideList = (index) =>  {
            let popup= document.getElementById("popup"+index);
           popup.style.display = "none";
        }

        const [dragOrigin, setDragOrigin]= useState("");
            
        // drag and drop functions
         const onDragStartDoc = (event) => {
             
                const data = JSON.stringify({"type":"doc", "docId":event.target.id  });
                event.dataTransfer.setData("application/json", data);
            // code ci-dessous sert à "cibler" la bonne poubelle (dans le JSX)
                setDragOrigin("doc");
         };

         const onDragStartUser = (event) => {
              const data = JSON.stringify({
                "type": "user",
                  "userId": event.target.id    
              });

              event.dataTransfer.setData("application/json", data);
              console.log(data);
             // code ci-dessous sert à "cibler" la bonne poubelle
             setDragOrigin("user");
         };

         const onDragStartUserDoc = ( titre,id, event) => {
             const data = JSON.stringify({"type":"userDoc", "titre":titre, "userId":id  });
             event.dataTransfer.setData("application/json", data);
             console.log(data);
             event.stopPropagation();
             // code ci-dessous sert à "cibler" la bonne poubelle
             setDragOrigin("user");
         };
       

          const onDragOver = (event) => {
              event.preventDefault();
          };
        // drop function
        const onDrop = (event, targetItem="trash") => {
            event.preventDefault();
            const draggedElementJSON =
               JSON.parse (event.dataTransfer.getData("application/json"));
                
           

            if(targetItem!=="trash")  {
                console.log(draggedElementJSON, targetItem);
                //ici remplacer le console.log ci-dessus en effectuant un Create de l'enregistrement ayant  user.id_user comme identifiant et en utilisant "draggedItemTitle" qui est l'ID du fichier à ajouter à cette entrée! (onDrop deviendra une fonction async) dans la table associative (users-fichiers)
            }
            else  {
                 if (draggedElementJSON.type === "doc") {
                     alert(
                         "Voulez-vous vraiment supprimer la partition " +
                             draggedElementJSON.docId +
                             " ?"
                     );
                 } else if (draggedElementJSON.type === "user") {
                     alert(
                         "Voulez-vous vraiment supprimer l'utilisateur " +
                             draggedElementJSON.userId +
                             " ?"
                     );
                 } else if (draggedElementJSON.type === "userDoc") {
                     alert(
                         "Voulez-vous vraiment supprimer la partition " +
                             draggedElementJSON.titre +
                             " de l'utilisateur " +
                             draggedElementJSON.userId +
                             " ?"
                     );
                 }
            }
           
        }


       

  
        


        
        const [showModal1, setShowModal1] = useState(false);
        const [showModal2, setShowModal2] = useState(false);
        

        const ModalOpen1 = (event) => {
            console.log(event.target.id);
            setShowModal1(true);
              }
        const ModalOpen2 = (event) => {
            console.log(event.target.id);
            setShowModal2(true);
              }

        const handleClose1 = () => setShowModal1(false);
        const handleClose2 = () => setShowModal2(false);
        
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
                            Ajouter/ Supprimer des partitions de ta partothèque
                        </li>
                        <li>
                            Ajouter/ Supprimer des utilisateurs avec qui tu veux
                            partager les partitions
                        </li>
                        <li>
                            Visualiser (au survol) les partitions disponibles
                            dans la partothèque de tes utilisateurs
                        </li>
                        <li>
                            Partager tes partitions avec les utilisateurs (en
                            faisant un "glisser/déposer' de la partition sur
                            l'utilisateur) ou supprimer des partitions de leur
                            liste (glisser/déposer dans la poubelle)
                        </li>
                    </ul>
                </div>
            </div>
            <main>
                <div className="containerAdmin">
                        <h2 className="admin">Partitions</h2>
                    <div className="CD">
                        <button
                            className="plus"
                            data-title="Cliquer ici pour ajouter une partition à la collection"
                            onClick={(event) => ModalOpen1(event)}
                            id="plusPart"
                        >
                            <img
                                src={imgPlus}
                                alt="ajouter"
                                draggable="false"
                            />
                        </button>
                        <img
                            className="trash"
                            src={imgTrash}
                            alt="poubelle"
                            onDragOver={
                                dragOrigin === "doc" ? onDragOver : null
                            }
                            draggable="true"
                            onDrop={(event) => onDrop(event)}
                        />
                    </div>
                    <ul className="listDoc">
                        {collection.length === 0 ? (
                            <li className="noData">
                                Aucun utilisateur disponible
                            </li>
                        ) : (
                            collection.map((user, index) => (
                                <li
                                    draggable="true"
                                    key={"collection" + index}
                                    onDragStart={onDragStartDoc}
                                    id={user[1]}
                                >
                                    <DocumentAdmin titre={user[0]} />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="containerUser">
                        <h2 className="admin">Liste d'utilisateurs</h2>
                    <div className="CD">
                        <button
                            className="plus"
                            data-title="Cliquer ici pour ajouter un utilisateur"
                            onClick={(event) => ModalOpen2(event)}
                            id="plusUser"
                        >
                            <img
                                src={imgPlus}
                                alt="ajouter"
                                draggable="false"
                            />
                        </button>
                        <img
                            className="trash"
                            src={imgTrash}
                            alt="poubelle"
                            onDragOver={
                                dragOrigin === "user" ? onDragOver : null
                            }
                            draggable="true"
                            onDrop={(event) => onDrop(event)}
                        />
                    </div>
                    <ul>
                        {listUsers.length === 0 ? (
                            <li className="noData">
                                Aucun utilisateur disponible
                            </li>
                        ) : (
                            listUsers.map((user, index) => (
                                <li
                                    key={user.id_user}
                                    onMouseEnter={() => showList(index)}
                                    onMouseLeave={() => hideList(index)}
                                    onDragOver={onDragOver}
                                    onDrop={(event) => onDrop(event, { user })}
                                    id={user.id_user}
                                    onDragStart={onDragStartUser}
                                >
                                    <UserCard
                                        alias={user.name}
                                        id={index}
                                        titres={user.titres}
                                        onDragStartUserDocFnct={onDragStartUserDoc}
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                    <FileUpload show={showModal1} handleClose={handleClose1} />
                    <CreateUser show={showModal2} handleClose={handleClose2} />
                </div>
            </main>
        </div>
    );
};
export default AdminPage;
