import "./LoginPage.css";
// Importation des bibliothèques nécessaires
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    // États pour stocker le nom d'utilisateur et le mot de passe, le token et les données
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(null);
    const [dataAPI, setDataAPI] = useState({});

    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        if (token) {
            const apiUrl = process.env.REACT_APP_API_URL;
            const fetchData = async () => {
                try {
                    const response = await fetch(`${apiUrl}/drive_API/user`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    } else {
                        const data = await response.json();
                        setDataAPI(data); // Stocker les données utilisateur
                    }
                } catch (error) {
                    console.log("Erreur de récupération de données:", error);
                }
            };

            fetchData();
        }
    }, [token]);

    // Un autre useEffect pour la navigation
    useEffect(() => {
        if (dataAPI) {
            console.log(dataAPI);
            // Vérifiez que dataAPI.role existe et a au moins un élément
            if (dataAPI.role && dataAPI.role.length > 0) {
                if (dataAPI.role[0] === "ROLE_ADMIN") {
                    localStorage.setItem("role", "admin");
                } else if (dataAPI.role[0] === "ROLE_USER") {
                    localStorage.setItem("role", "user");
                }
                navigate(
                    dataAPI.role[0] === "ROLE_ADMIN"
                        ? `/admin`
                        : `/user/${dataAPI.id}`,
                    {
                        state: { ...dataAPI },
                    }
                );
            } else {
                console.log("Le rôle n'est pas défini ou vide");
            }
        }
    }, [dataAPI, navigate]);

    // Fonction pour gérer la soumission du formulaire d'authentification
    const handleSubmit = async (event) => {
        event.preventDefault();
        //appel API pour le token
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/drive_API/login_check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const dataToken = await response.json();
            setToken(dataToken.token);
            localStorage.setItem("token", dataToken.token);
        } else if (response.status === 401 || response.status === 400) {
            navigate("/", {
                state: {
                    message: "Identifiants non reconnus.\nVeuillez réessayer.",
                },
            });
        } else if (response.status === 500) {
            navigate("/", {
                state: {
                    message:
                        "Erreur du serveur.\nVeuillez réessayer plus tard.",
                },
            });
        } else {
            navigate("/", {
                state: {
                    message: "Erreur.\nVeuillez réessayer plus tard.",
                },
            });
        }

        //  code cidessous: dataTests pour l'app react avant la mise en place de l'API
        // let data = {
        //     // donnée qui sert à afficher le bon type de page (admin ou utilisateur?)
        //     role: "user",
        //     // donnée qui est injectée dans l'URL (pourra éventuellement servir si il y a plusieurs administrateurs)
        //     id_user: 1565,
        //     // donnée que j'utilise pour afficher le nom de l'utilisateur qui s'est connecté (admin ou user)
        //     username: "Rémi",
        //     // donnée qui permet l'affichage de la partothèque (en mode admin ou user)  je récupère le titre pour l'affichage et l'ID pour la future MAJ des partothèques User par l'admin (en drag and drop)
        //     collection: [
        //         ["Sakura", 89],
        //         ["Olympic fanfare and theme", 75],
        //         ["Ceremonial Hymn", 18],
        //         ["Arsenal", 32],
        //         ["The wind in the willows", 54],
        //     ],
        //     // ces données servent pour l'affichage des contenus des partothèques "utilisateurs" sur la page admin (id_user ne servira que pour la MAJ des partothèques User par l'admin , l'objet complet est renvoyé et il faudra en extraire id-user pour le rajouter dans la table associative exemple rajouter un enregistrement id_user=3 et id_fichier=75) ce qui permettra de rajouter "Olympic fanfare and theme" à l'utilisateur Flavie dans cet exemple)
        //     listUsers: [
        //         {
        //             name: "Elphège",
        //             id_user: 1,
        //             titres: [
        //                 ["Ceremonial Hymn", 18],
        //                 ["Arsenal", 32],
        //                 ["The wind in the willows", 54],
        //             ],
        //         },
        //         {
        //             name: "Magalie",
        //             id_user: 2,
        //             titres: [
        //                 ["Olympic fanfare and theme", 75],
        //                 ["Ceremonial Hymn", 18],
        //             ],
        //         },
        //         {
        //             name: "Flavie",
        //             id_user: 3,
        //             titres: [],
        //         },
        //         {
        //             name: "MarieH",
        //             id_user: 4,
        //             titres: [["The wind in the willows", 54]],
        //         },
        //     ],
        // };
        // localStorage.setItem("role", data.role);
        // navigate(data.role === "admin" ? "/admin" : `/user/${data.id_user}`, {
        //     state: { ...data },
        // });
    };

    const handleForgottenPassword = async () => {
       try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${apiUrl}/drive_API/request_new_password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username }),
                }
            );
        
                const data = await response.json();
           
            
                navigate("/", {
                state: {
                    message: data.message,
                },
            })
      
            
       
       } catch (error) {
            console.log(error);
            
       }
        
            
    }      
    
    
    return (
        <>
            <header>
                <h1 className="conn">Application Partothèque</h1>
            </header>
            <div className="containerConnex">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="username">Email de connexion</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="btnLogin" type="submit">
                        Se connecter
                    </button>
                    <div
                        className="btnOubliMDP"
                        data-title="Cliquez ici pour obtenir un mail de réinitialisation (en indiquant bien votre email de connexion)."
                        onClick={handleForgottenPassword}
                    >
                        <p>Créer ou réinitialiser son mot de passe</p>
                    </div>
                </form>
                <div>
                    {message && <div className="error-message">{message}</div>}
                </div>
            </div>
        </>
    );
};

export default LoginPage;
