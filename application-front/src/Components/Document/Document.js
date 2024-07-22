import "./Document.css";

import img from "../../images/document-icon-18.png";


const Document = ({titre,telecharg}) => {
    return (
        <>
            <div className="card">
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