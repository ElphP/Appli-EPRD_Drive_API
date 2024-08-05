import "./LoginPage.css";
// Importation des bibliothèques nécessaires
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    
    // États pour stocker le nom d'utilisateur et le mot de passe
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async  (event) => {
        event.preventDefault();
        // Logique d'authentification ici
        console.log("Nom d'utilisateur:", username);
        console.log("Mot de passe:", password);


        
        //appel API
        // const response = await fetch("https://example.com/api/login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ username, password }),
        // });

        // if (response.ok) {
        //     const data = await response.json();
        //     localStorage.setItem("token", data.token);
        //     localStorage.setItem("role", data.role);
        //     navigate(data.role === "admin" ? "/admin" : "/user");
        // } else {
        //     console.log("Erreur de connexion");
        // }
        let data = {
            // donnée qui sert à afficher le bon type de page (admin ou utilisateur?)
            role: "admin",
            // donnée qui est injectée dans l'URL (pourra éventuellement servir si il y a plusieurs administrateurs)
            id_user: 1565,
            // donnée que j'utilise pour afficher le nom de l'utilisateur qui s'est connecté (admin ou user)
            username: "Rémi",
            // donnée qui permet l'affichage de la partothèque (en mode admin ou user)  je récupère le titre pour l'affichage et l'ID pour la future MAJ des partothèques User par l'admin (en drag and drop)
            collection: [
                ["Sakura", 89],
                ["Olympic fanfare and theme", 75],
                ["Ceremonial Hymn", 18],
                ["Arsenal", 32],
                ["The wind in the willows", 54],
            ],
            // ces données servent pour l'affichage des contenus des partothèques "utilisateurs" sur la page admin (id_user ne servira que pour la MAJ des partothèques User par l'admin , l'objet complet est renvoyé et il faudra en extraire id-user pour le rajouter dans la table associative exemple rajouter un enregistrement id_user=3 et id_fichier=75) ce qui permettra de rajouter "Olympic fanfare and theme" à l'utilisateur Flavie dans cet exemple)
            listUsers: [
                {
                    name: "Elphège",
                    id_user: 1,
                    titres: [
                        ["Ceremonial Hymn", 18],
                        ["Arsenal", 32],
                        ["The wind in the willows", 54],
                    ],
                },
                {
                    name: "Magalie",
                    id_user: 2,
                    titres: [
                        ["Olympic fanfare and theme", 75],
                        ["Ceremonial Hymn", 18],
                    ],
                },
                {
                    name: "Flavie",
                    id_user: 3,
                    titres: [],
                },
                {
                    name: "MarieH",
                    id_user: 4,
                    titres: [ ["The wind in the willows", 54],]
                },
            ],
        };
        
         localStorage.setItem("role", data.role);
        navigate(data.role === "admin" ? "/admin" : `/user/${data.id_user}`, {
            state: { ...data },
        });
    };

    return (
        <>
            <h1 className="conn">Application Partothèque</h1>
            <div className="containerConnex">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="username">Nom d'utilisateur</label>
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
                            required
                        />
                    </div>
                    <button className="btnLogin" type="submit">Se connecter</button>
                </form>
            </div>
        </>
    );
};



export default LoginPage;
