
# Titre

Application de partage de documents (par exemple des partitions au format PDF)


## Authors

- [@L-FÈJ-P](https://github.com/ElphP)
- [@Remi](https://github.com/jeSuisUnDeveloppeur)


## Appendice

* **Présentation**
  
Cette application de partage de bibliothèque a été conçue pour faciliter la communication et le partage de documents (dans notre cas fictif: des partitions). Elle permet à un administrateur de gérer les documents à partager et aux utilisateurs (ici des musiciens) d'accéder facilement aux fichiers mis à disposition.

Le projet a été développé dans une optique pédagogique, avec une séparation claire entre le frontend (interface utilisateur) et le backend (gestion des données et logique métier). 

Cette structure permet de bien comprendre les interactions entre une interface web moderne et une API REST.

  * **Fonctionnalités**
  
    * Gestion des documents : L'administrateur peut ajouter,  supprimer des documents.
      Partage avec les utilisateurs : Les utilisateurs peuvent accéder aux partitions partagées par l'administrateur.
      Téléchargement des documents : Les membres peuvent télécharger les documents (format PDF dans notre cas).

    * Gestion des rôles : Deux types d'utilisateurs sont pris en charge :
      Administrateurs : Qui peuvent gérer l'ensemble des documents et leur portée.
      Utilisateurs (ici des musiciens) : Qui peuvent uniquement consulter et télécharger les documents partagés.
 
      
  * **Technologies utilisées**
 
    * Frontend : **React**
      
        React : Utilisé pour créer une interface utilisateur moderne et interactive. (avec des glisser-déposer)
      
        React Router : Pour la gestion de la navigation au sein de l'application.

    * Backend : **Symfony**-**MySQL**
    
        Symfony : Un framework PHP pour la gestion des utilisateurs, des documents, et la sécurisation des routes.
        API REST : L'application expose des endpoints API pour permettre la communication avec le frontend React.
        Doctrine ORM : Utilisé pour l'interaction avec la base de données.
        Authentification et sécurité : Gestion des utilisateurs et des rôles avec le Security Bundle de Symfony.

    * Base de données:
        La base de données qui a été utilisée pour le développement: **MySQL**.

![front_driveAPI](https://github.com/user-attachments/assets/8d3797d9-3eef-4135-876a-d4229f6df808)

----

![front_driveAPI2](https://github.com/user-attachments/assets/0a41817e-da51-45b9-9f6a-6a0248d2e20c)

* **Fonctionnalités à développer:**

  * Système de notifications : 
    * Envoi d'email au moment de la création du compte utilisateur (avec le mot de passe).
    * Informer les utilisateurs lorsqu'une nouvelle partition est ajoutée ou mise à jour.
    * créer la possibilité pour les utilisateurs de changer leur mot de passe



