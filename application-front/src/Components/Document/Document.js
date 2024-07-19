import "./Document.css";
// Importation des bibliothèques nécessaires
import img from "../../images/document-icon-18.png";


const Document = ({titre,telecharg}) => {
    return (
        <>
            <div className="card">
                <img
                    src={img}
                    alt="document"
                    onClick={telecharg}
                />
                <p>{titre}</p>
            </div>
        </>
    );
}

export default Document;