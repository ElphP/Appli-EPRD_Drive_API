import React from "react";
import { Navigate } from "react-router-dom";


 

const SecurityRoute = ({ requiredRole, children }) => {
    // a changer: ici le role est récupéré directementà la suite du log et enregistré alors que, pour plus de sécurité il faudra qu'à chaque appel de page (admin ou user) le role soit vérifié sur le serveur à l'aide du token!
    const userRole = localStorage.getItem("role");

    if (!userRole || userRole !== requiredRole) {
        // Si l'utilisateur n'est pas authentifié ou n'a pas le bon rôle, redirigez-le vers la page de connexion
        return <Navigate to="/login" />;
    }

    // Sinon, affichez le contenu protégé
    return children;
};

export default SecurityRoute;
