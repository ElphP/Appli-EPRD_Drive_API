import "./AdminPage.css";
// Importation des bibliothèques nécessaires
import React, { useEffect, useState, useRef } from "react";
// import { Navigate } from "react-router-dom";
import DocumentAdmin from "../Admin/DocumentAdmin";
import UserCard from "../Admin/UserCard";
import FileUpload from "./Modal/FileUpload";
import CreateUser from "./Modal/CreateUser";
import TrashModal from "./Modal/TrashModal";
import ChangeIdAdmin from "./Modal/ChangeIdAdmin";
import { useLocation, useNavigate } from "react-router-dom";
import imgTrash from "../../images/trash-can-solid.svg";
import imgPlus from "../../images/plus-solid (1).svg";

// hook personnalisé (gestion de l'obsolescence du token)
import useTokenExpiration from "../../hooks/useTokenExpiration";

const AdminPage = () => {

 useTokenExpiration();

    const location = useLocation();
    const { state } = location;
    const username = state.username || "'Utilisateur non identifié'";
    const [collection, setCollection] = useState(state.collection || []);
    const [listUsers, setListUsers] = useState(state.listUsers || []);

    const [dataDelete, setDataDelete] = useState([])
    const [changeDB, setChangeDB] = useState(false)

    //  pour le rafraîchissement
   const changeOnDB= (bool) => {
    setChangeDB(bool)
   }

    

        // affichage listes des partitions disponibles pour chaque utilisateur (onhover)
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
             const titre = event.target.getAttribute("titre");
                const data = JSON.stringify({
                    "type": "doc",
                    "docId": event.target.id,
                    "titre": titre,
                    "userId": "",
                    "alias": "",
                });
                
                
                event.dataTransfer.setData("application/json", data);
            // code ci-dessous sert à "cibler" la bonne poubelle (dans le JSX)
                setDragOrigin("doc");
         };

         const onDragStartUser = (event) => {
            // utilisation de l'attribut data-alias et data_userId créé dans userCard
             const alias = event.target.getAttribute("data-alias");
             const userId = event.target.getAttribute("data-userid");
             
             
              const data = JSON.stringify({
                  "type": "user",
                  "docId": "",
                  "titre": "",
                  "userId": userId,
                  "alias": alias,
              });

              event.dataTransfer.setData("application/json", data);
             
             // code ci-dessous sert à "cibler" la bonne poubelle
             setDragOrigin("user");
         };

         const onDragStartUserDoc = ( titre, id, alias, docId, event) => {
           
             const data = JSON.stringify({"type":"userDoc", "docId": docId, "titre":titre, "userId":id, "alias": alias  });
             event.dataTransfer.setData("application/json", data);
             
             event.stopPropagation();
             // code ci-dessous sert à "cibler" la bonne poubelle
             setDragOrigin("user");
         };
       

          const onDragOver = (event) => {
              event.preventDefault();
          };
        // drop function
        const onDrop = async (event, targetItem="trash") => {
            event.preventDefault();
            const draggedElementJSON =
               JSON.parse (event.dataTransfer.getData("application/json"));
                
           
            // cible + des utilisateurs
            if(targetItem!=="trash")  {
                console.log(draggedElementJSON, targetItem);
               
                  try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(
                    `${apiUrl}/drive_API/addFileToUser`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            file_id: draggedElementJSON.docId,
                            user_id: targetItem.user.id_user,
                        }),
                    }
                );

                const dataResponse = await response.json();
                if (!response.ok) {
                    console.error("Erreur de transfert d'un dossier à un utilisateur");
                } else {
                    console.log("Réponse:", dataResponse);
                    changeOnDB(true);
                   
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
            }

            else if (targetItem === "trash") {
                
                if (draggedElementJSON.type === "doc") {
                   setDataDelete([draggedElementJSON.type,
                        draggedElementJSON.docId, draggedElementJSON.titre])
                    ModalOpen3()
                    ;
                } else if (draggedElementJSON.type === "user") {
                    //  alert(
                    //      "Voulez-vous vraiment supprimer l'utilisateur " +
                    //          draggedElementJSON.userId +
                    //          " ?"
                    //  );
                      setDataDelete([
                          draggedElementJSON.type,
                          draggedElementJSON.userId,
                          draggedElementJSON.alias,
                      ]);
                    ModalOpen3(
                    );
                } else if (draggedElementJSON.type === "userDoc") {
                    //  alert(
                    //      "Voulez-vous vraiment supprimer la partition " +
                    //          draggedElementJSON.titre +
                    //          " de l'utilisateur " +
                    //          draggedElementJSON.userId +
                    //          " ?"
                    //  );
                      setDataDelete([
                          draggedElementJSON.type,
                          draggedElementJSON.docId,
                          draggedElementJSON.titre,
                          draggedElementJSON.userId,
                          draggedElementJSON.alias,
                      ]);
                    ModalOpen3(
                    );
                }
            }
           
        }

        
        const [showModal1, setShowModal1] = useState(false);
        const [showModal2, setShowModal2] = useState(false);
        const [showModal3, setShowModal3] = useState(false);
        const [showModal4, setShowModal4] = useState(false);
        
        // rafraichissement (si la BDD évolue)
   useEffect(() => {
       if (changeDB) {
           const fetchUpdatedData = async () => {
               try {
                    const apiUrl = process.env.REACT_APP_API_URL;
                   const response = await fetch(
                       `${apiUrl}/drive_API/user`,
                       {
                           method: "GET",
                           headers: {
                               Authorization:
                                   `Bearer ` + localStorage.getItem("token"),
                               "Content-Type": "application/json",
                           },
                       }
                   );
                   const updatedData = await response.json();

                   // Remplace la collection et la liste des utilisateurs avec les nouvelles données
                   setCollection(updatedData.collection);
                   setListUsers(updatedData.listUsers);
               } catch (error) {
                   console.error(
                       "Erreur lors du rafraîchissement des données",
                       error
                   );
               }
           };
           fetchUpdatedData();
           changeOnDB(false);
       }
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [changeDB]);



//    modales
        const ModalOpen1 = (event) => {
            // console.log(event.target.id);
            setShowModal1(true);
              }
        const ModalOpen2 = (event) => {
            // console.log(event.target.id);
            setShowModal2(true);
              }
        const ModalOpen3 = () => {
            setShowModal3(true);
              }
        const ModalOpen4 = () => {
            setShowModal4(true);
              }

        const handleClose1 = () => setShowModal1(false);
        const handleClose2 = () => setShowModal2(false);
        const handleClose3 = () => setShowModal3(false);
        const handleClose4 = () => setShowModal4(false);


        // logique pour ajouter le fondNoir
     const [isAtTop1, setIsAtTop1] = useState(false);
     const [isAtTop2, setIsAtTop2] = useState(false);
     const ref1 = useRef(null);
     const ref2 = useRef(null);

     useEffect(() => {
         const checkPosition = () => {
             if (ref1.current) {
                 const topPosition1 = ref1.current.getBoundingClientRect().top;
                 setIsAtTop1(topPosition1===5)
                
             }
             if (ref2.current) {
                 const topPosition2 = ref2.current.getBoundingClientRect().top;
                 setIsAtTop2(topPosition2 === 5);
             }
         };

        

         window.addEventListener("scroll", checkPosition); // Suivre le scroll si l'élément peut bouger

        
     }, []);
        
    

    //  déconnexion
     const navigate = useNavigate();

     const handleLogOut = () => {
         localStorage.removeItem("token");
         localStorage.removeItem("role");
         navigate("/login");
     };
   

// JSX

    return (
        <div className="fond">
            <header>
                <button
                    className="changeId"
                    onClick={(event) => ModalOpen4(event)}
                >
                    Changer mes identifiants
                </button>
                <h1>Bonjour {username}</h1>

                <button className="deconnect" onClick={handleLogOut}>
                    Me déconnecter
                </button>
            </header>
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
                        <div
                            className="CDFondNoir"
                            ref={ref1}
                            style={{
                                backgroundColor: isAtTop1
                                    ? "rgba(0,0,0,0.95)"
                                    : "transparent",
                            }}
                        >
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
                                    titre={user[0]}
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
                        <div
                            className="CDFondNoir"
                            ref={ref2}
                            style={{
                                backgroundColor: isAtTop2
                                    ? "rgba(0,0,0,0.95)"
                                    : "transparent",
                            }}
                        >
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
                                        userId={user.id_user}
                                        titres={user.titres}
                                        onDragStartUserDocFnct={
                                            onDragStartUserDoc
                                        }
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                    <FileUpload
                        show={showModal1}
                        handleClose={handleClose1}
                        changeOnDB={changeOnDB}
                    />
                    <CreateUser
                        show={showModal2}
                        handleClose={handleClose2}
                        changeOnDB={changeOnDB}
                    />

                    <TrashModal
                        show={showModal3}
                        handleClose={handleClose3}
                        data={dataDelete}
                        changeOnDB={changeOnDB}
                    />
                    <ChangeIdAdmin
                        show={showModal4}
                        handleClose={handleClose4}
                       handleLogOut={handleLogOut}
                    />
                </div>
            </main>
        </div>
    );
};
export default AdminPage;
