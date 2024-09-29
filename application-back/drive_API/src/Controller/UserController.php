<?php

namespace App\Controller;

use App\Repository\FileRepository;
use App\Repository\UserRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use App\Service\UserService;


class UserController extends AbstractController
{
    // route pour l'affichage initiale après la connection
    #[Route('drive_API/user', name: 'drive_API_user', methods: ['GET'])]
    public function getUserData(FileRepository $fileRepository, UserRepository $userRepository): JsonResponse
    {
        // Récupérer l'utilisateur authentifié directement
        $user = $this->getUser();

        $listUsers = [];

        // Génération de la réponse admin
        if($user->getRoles() === ["ROLE_ADMIN"])  {
        // Récupère les données de fichiers
        $files = $fileRepository->findAllFileProperties();

        // Transforme les données en tableau de tableaux pour la bibliotheque
        $collection = array_map(function ($file) {
            return [$file['nom'], $file['id']];
        }, $files);
       
        // Récupère les données des utilisateurs
        $usersData = $userRepository->findAllUserProperties();
            // Transforme les données en un format attendu
            foreach ($usersData as $data) {
                $userId = $data['user_id'];
                if (!isset($listUsers[$userId])) {
                    // Si l'utilisateur n'existe pas encore dans le tableau, l'ajoute
                    $listUsers[$userId] = [
                        'name' => $data['user_name'],
                        'id_user' => $userId,
                        'titres' => []
                    ];
                }

                // Ajoute le fichier à l'utilisateur correspondant
                if
                ($data['file_id']!=null){     
                    $listUsers[$userId]['titres'][] = [$data['file_name'], $data['file_id']];
                }
            }

            // Réindexe le tableau pour obtenir une liste propre
            $listUsers = array_values($listUsers);
    }

      

           
        // génération de la réponse user standard
        else if($user->getRoles() === ["ROLE_USER"])  {
            $files= $userRepository->findSpecificUserFileProperties($user->getId());

            // Transforme les données en tableau de tableaux pour la bibliotheque

            $collection = [];
            foreach ($files as $file) {
                if ($file['file_id'] !== NULL) {
                    $collection[] = [$file['file_name'], $file['file_id']];
                }
            }
        }
       
       

       

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non identifié!'], 401);
        }

        return new JsonResponse([
            'id_user'=> $user->getId(),
            'email'=> $user->getEmail(),
            'username'=> $user->getName(),
            'role' => $user->getRoles(),
            'listUsers'=> $listUsers,
            'collection'=> $collection,
        ]);
    }
    // injection de dépendance dans la propriété $userService pour utilise les méthodes de la classe UserService
    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    #[Route('drive_API/addUser', name: 'drive_API_addUser', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour créer un utilisateur')]
    public function addUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['mail'] ?? null;
        $password = $data['mdp'] ?? null;
        $name = $data['alias'] ?? null;

        if (!$email || !$password || !$name
        ) {
            return new JsonResponse(['error' => 'L\'email, le mot de passe et l\'alias sont requis!'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->userService->createUser($email, $password, $name);
        if (!$user) {
            return new JsonResponse(['error' => 'Cet email et/ou cet alias sont déjà utilisés!'], JsonResponse::HTTP_CONFLICT);
        }

        return new JsonResponse(['status' => 'L\'utilisateur a bien été créé'], JsonResponse::HTTP_CREATED);
    }

    #[Route('drive_API/deleteUser', name: 'drive_API_deleteUser',
        methods: ['DELETE']
    )]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour supprimer un utilisateur')]
    public function deleteUser(Request $request): JsonResponse  {
        $data = json_decode($request->getContent(), true);
        $user_id = $data['user_id'];
        $alias= $data['alias'];
        $user= $this->userService->deleteUser($user_id);
        if(!$user) {
            return new JsonResponse(['error' => 'Cet utilisateur n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }
        return new JsonResponse(['status' => 'L\'utilisateur avec le pseudo "'.$alias. '" a bien été supprimé'], JsonResponse::HTTP_CREATED);
    }
}