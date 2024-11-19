import React, { useState,useEffect } from "react";
import  "./FileUpload.css";

const FileUpload = ({show, handleClose, changeOnDB}) => {

     const showHideClassName = show
         ? "modal display-flex"
         : "modal display-none";
    const overlay = show
        ? "overlay display-block"
        : "overlay display-none";

    const [selectedFile, setSelectedFile] = useState(null);
    const [messUpLoad, setMessUpLoad] = useState("");
    const [titre, setTitre] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleChangeTitre = (event) =>  {
         setTitre(event.target.value);
    }

     useEffect(() => {
        if (!titre && !selectedFile) {
            setMessUpLoad("Choisissez un fichier et donnez-lui un nom unique.");
        } else if (!titre) {
            setMessUpLoad("Le nom est requis.");
        } else if (!selectedFile) {
            setMessUpLoad("Aucun fichier PDF n'a été sélectionné.");
        } 
        else {
            setMessUpLoad("");
        }
     }, [titre,selectedFile]);

      useEffect(() => {
          if (!show) {
              // Réinitialise les valeurs des inputs quand la modal devient cachée
              setTitre("");
              setSelectedFile(null);
          }
      }, [show]);

    const handleUpload = async () => {
        if (!selectedFile) {
            // alert("Un fichier doit être sélectionné!");
            return;
        }
        else if(titre == null || titre ==="")  {
            //   alert("Le titre du fichier est obligatoire!");
              return;
        }
        else {
            console.log("Fichier sélectionné :", selectedFile);
             const formData = new FormData();
             formData.append("file", selectedFile);
             formData.append("nom", titre);

              try {
                const apiUrl = process.env.REACT_APP_API_URL;
                  const response = await fetch(
                      `${apiUrl}/drive_API/upLoadFile`,
                      {
                          method: "POST",
                          headers: {
                              Authorization: `Bearer `+localStorage.getItem("token")
                          },
                          body: formData, // Envoi du FormData
                      }
                  );

                  const data = await response.json();
                  if(!response.ok)  {
                      console.error(data.error);
                      setMessUpLoad(data.error);
                  }
                  else  {
                      console.log("Réponse:", data);
                      changeOnDB(true);
                    handleClose();
                  }
              } catch (error) {
                  console.error("Erreur:", error);
              }
        }
       

     
        //Appel API
    // Create Post
    };

    return (
        <>
            <div className={overlay}></div>
            <div className={showHideClassName}>
                <section className="modal-main">
                    <div className="titre">
                        <label htmlFor="nameFile">
                            Titre de la partition:{" "}
                        </label>
                        <input
                            type="text"
                            name="nameFile"
                            id="nameFile"
                            value={titre}
                            onChange={handleChangeTitre}
                        />
                    </div>
                    <div className="upLoad">
                        <div className="inputUpload">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf"
                            />
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

                    <p className="messUpLoad">{messUpLoad}</p>
                    <button
                        onClick={handleClose}
                        className="btnModal btnModal2 btnCloseUpLoad"
                    >
                        Fermer
                    </button>
                </section>
            </div>
        </>
    );
};

export default FileUpload;
