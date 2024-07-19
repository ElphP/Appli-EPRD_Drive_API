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
        let data={
            "role":"admin",
        }
        
         localStorage.setItem("role", data.role);
        navigate(data.role === "admin" ? "/admin" : "/user");
    };

    return (
        <>
            <div className="container">
            <h1>Application Partothèque</h1>
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
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </>
    );
};



export default LoginPage;
