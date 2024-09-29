import "./UserPage.css";
// Importation des bibliothèques nécessaires
import { useLocation } from "react-router-dom";
import Document from "../Document/Document";
import { useState, useEffect } from "react";
// import { useState } from "react";

const UserPage = () => {
    const location = useLocation();
    const { state } = location;
    const username = state.username || "'Utilisateur non identifié'";
    const collection = state.collection || [];
    const[nom, setNom]= useState("");
    const[id, setId]= useState("");



    //appel API pour le téléchargement
const handleFolderClick = (folder, event) => {
   
        console.log(`Dossier cliqué : ${folder[0]}, ${folder[1]}`);
        setNom(folder[0]);
        setId(folder[1]);  
};

useEffect(() => {
  const fetchData = async () => {
      try {
          const response = await fetch(
              "https://127.0.0.1:8000/drive_API/downloadFile",
              {
                  method: "POST",
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ nom, id }),
              }
          );
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          } else {
              const blob = await response.blob(); // Convertir la réponse en blob
              const url = window.URL.createObjectURL(blob); // Créer un lien vers le blob
              const link = document.createElement("a"); // Créer un élément <a>
              link.href = url;
              link.setAttribute("download", nom); // Nom du fichier à télécharger
              document.body.appendChild(link);
              link.click(); // Simuler le clic
              link.parentNode.removeChild(link); // Supprimer le lien après le téléchargement
          }

          //   const data = await response.json();
          //   setDataAPI(data); // Stocker les données utilisateur
      } catch (error) {
          console.log("Erreur de récupération de données:", error);
      }
  };


    if (nom && id) {
        fetchData(); // Appel de la fonction fetchData si nom et id sont valides

        // Réinitialiser nom et id après l'appel (pour réinitialiser le useeffect) mais si nom et id sont vides fetchData n'est pas relancé donc le nouveau useeffect déclenché n'a pas d'action....
        setNom("");
        setId("");
    }
 
}, [nom,id])



    return (
        <>
            <h1>Bonjour {username},</h1>
            <h2 className="user">
                Voici les partitions que nous mettons à ta disposition !
            </h2>

            <ul className="container">
                {collection.length === 0 ? (
                    <li>Aucun utilisateur disponible</li>
                ) : (
                    collection.map((folder, index) => (
                        <li
                            key={index}
                        >
                            <Document
                                titre={folder[0]}
                                telecharg={(event) =>
                                    handleFolderClick(folder, event)
                                }
                            />
                        </li>
                    ))
                )}
            </ul>
        </>
    );
};
export default UserPage;
