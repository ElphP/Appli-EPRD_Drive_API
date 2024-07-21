import React, { useState } from "react";
import  "./FileUpload.css";

const FileUpload = ({show, handleClose}) => {

     const showHideClassName = show
         ? "modal display-flex"
         : "modal display-none";
    const overlay = show
        ? "overlay display-block"
        : "overlay display-none";

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Un fichier doit être sélectionné!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        console.log(formData);
     
        //Appel API
    // Create Post
    };

    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div className="upLoad">
                        <div className="inputUpload">
                            <input type="file" onChange={handleFileChange} />
                            <span className="fichierSelect">
                                {selectedFile
                                    ? selectedFile.name
                                    : "Pas de fichier sélectionné"}
                            </span>
                        </div>
                        <button
                            onClick={handleUpload}
                            className="btnModal btnModal1"
                        >
                            Télécharger
                        </button>
                    </div>
                    <button
                        onClick={handleClose}
                        className="btnModal btnModal2"
                    >
                        Fermer
                    </button>
                </section>
            </div>
        </>
    );
};

export default FileUpload;
