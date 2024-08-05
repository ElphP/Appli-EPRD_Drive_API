import "./DocumentAdmin.css";
// Importation des bibliothèques nécessaires
import img from "../../images/document-icon-18.png";


const Document = ({titre ,telecharg}) => {
   
    
    return (
        <>
            <div className="cardAdmin" >
                <img
                    src={img}
                    alt="document"
                    onClick={telecharg}
                    draggable="false"
                />
                <p className="doc">{titre}</p>
            </div>
        </>
    );
}

export default Document;