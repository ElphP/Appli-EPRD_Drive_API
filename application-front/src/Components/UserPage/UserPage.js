import "./UserPage.css";
// Importation des bibliothèques nécessaires
import { useLocation } from "react-router-dom";
import Document from "../Document/Document";

const UserPage = () => {
    const location = useLocation();
    const { state } = location;
    const username = state.username || "'Utilisateur non identifié'";
    const collection = state.collection || [];

    //appel API pour le téléchargement
 const handleFolderClick = (folderId) => {
     console.log(`Dossier cliqué: ${folderId}`);
 };


    return (
        <>
            <h1>Bonjour {username},</h1>
            <h2 className="user">Voici les partitions que nous mettons à ta disposition !</h2>

            <ul className="container">
                {collection.length === 0 ? (
                    <li>Aucun utilisateur disponible</li>
                ) : (
                    collection.map((user, index) => (
                        <li key={index}>
                            <Document
                                titre={user}
                                telecharg={()=> handleFolderClick(index)}
                            />
                        </li>
                    ))
                )}
            </ul>
        </>
    );
};
export default UserPage;
