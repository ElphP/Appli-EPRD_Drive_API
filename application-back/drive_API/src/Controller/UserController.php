<?php

namespace App\Controller;

use App\Repository\FileRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use App\Service\UserService;
use App\Service\EmailService;

use App\Service\JWTGenerator;
use App\Service\UrlGeneratorService;
use App\Service\PasswordCreateService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class UserController extends AbstractController
{
   

    public function __construct(
      private  UserService $userService,
       private EmailService $emailService,
       private PasswordCreateService $passwordService,
       private JWTGenerator $jwtTokenService, 
       private EntityManagerInterface $entityManager,
       private UserPasswordHasherInterface $passwordHasher
        
    ) {
        $this->userService = $userService;
        $this->emailService = $emailService;
        $this->passwordService = $passwordService;
        $this->jwtTokenService = $jwtTokenService;
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
       
    }


    #[Route('drive_API/request_new_password', name: 'request_new_password', methods: ['POST'])]
    public function sendEmailNewPassword(Request $request, UserRepository $userRepository, UrlGeneratorService $UrlGeneratorservice) : JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['username'] ?? null;
        
        
        if(!$email) {
            return new JsonResponse(['message' => 'L\'email est manquant'], JsonResponse::HTTP_NOT_FOUND);
        }
        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user) {
            return new JsonResponse(['message' => 'Cet email n\'existe pas dans notre base de données.'], JsonResponse::HTTP_NOT_FOUND);
        }
        else  {
            $firstname = $user->getFirstname();

            $token = $this->jwtTokenService->generateJwtToken($user);
         
            // ici création de l'URL a envoyer dans le mail
            $loginUrl = $UrlGeneratorservice->generateResetpasswordUrl($token);
            // $loginUrl = "fake";
            
            if(!$this->emailService->sendEmailPasswordChange($email, $loginUrl, $firstname)){
                return new JsonResponse(['message' => 'L\'email n\'a pas pu être envoyé.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
            else  {
                return new JsonResponse(['message' => 'Un email vient d\'être envoyé pour réinitialiser ton mot de passe. Pense à vérifier dans tes spams!'] , JsonResponse::HTTP_OK);
        }
    }
}

   
    
    
    // Route pour la première connexion ou la réinitialisation du mot de passe
    #[Route('drive_API/reset-password', name: 'reset_password', methods: ['GET'])]
    public function resetPassword(): Response
    {
        // return $authenticationSuccessHandler->handleAuthenticationSuccess($user, $jwt);
        // Vérifiez ici si le token est valide (en le décodant ou en le recherchant dans la base)

        // Décodez le JWT
        
            // Grâce à Lexik, le token est automatiquement validé et décodé
            $user = $this->getUser(); // Obtenu depuis le token décodé

            if (!$user) {
                return $this->render('error/invalid.html.twig', [
                    'message' => 'Votre token est invalide ou a expiré.',
                ]); return new JsonResponse('Unauthorized', Response::HTTP_UNAUTHORIZED);
            }


            // Générer un mot de passe aléatoire
            $randomPassword = $this->passwordService->generateRandomPassword();

            // Hacher le mot de passe avant de le définir
            $hashedPassword = $this->passwordHasher->hashPassword($user, $randomPassword);
            $user->setPassword($hashedPassword);

            // Sauvegarder l'utilisateur avec le mot de passe encodé
            $this->entityManager->persist($user);
            $this->entityManager->flush();



           
            // Traitement spécifique (par exemple, afficher un formulaire de réinitialisation)
            return $this->render('user/index.html.twig', [
                'message' => 'Le mot de passe ci-dessous est ton nouveau mot de passe!',
                'password' => $randomPassword
            ]);
        }
    


      
       

       
    
    


    // route pour l'affichage initiale après la connection
    #[Route('drive_API/user', name: 'drive_API_user',  methods: ['GET'])]
    public function getUserData(FileRepository $fileRepository, UserRepository $userRepository): JsonResponse
    {
        // Récupérer l'utilisateur authentifié directement
        $user = $this->getUser();

        $listUsers = [];

        // Génération de la réponse admin
        if ($user->getRoles() === ["ROLE_ADMIN"]) {
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
                        'name' => $data['user_alias'],
                        'id_user' => $userId,
                        'titres' => []
                    ];
                }

                // Ajoute le fichier à l'utilisateur correspondant
                if ($data['file_id'] != null) {
                    $listUsers[$userId]['titres'][] = [$data['file_name'], $data['file_id']];
                }
            }

            // Réindexe le tableau pour obtenir une liste propre
            $listUsers = array_values($listUsers);
        }




        // génération de la réponse user standard
        else if ($user->getRoles() === ["ROLE_USER"]) {
            
            $files = $userRepository->findSpecificUserFileProperties($user->getId());

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
            'id_user' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getAlias(),
            'role' => $user->getRoles(),
            'listUsers' => $listUsers,
            'collection' => $collection,
        ]);
    }

  
    #[Route('drive_API/addUser', name: 'drive_API_addUser', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour créer un utilisateur')]
    public function addUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['mail'] ?? null;
        $firstname = $data['firstname'] ?? null;
        $alias = $data['alias'] ?? null;

        if (
            !$email || !$firstname || !$alias
        ) {
            return new JsonResponse(['error' => 'L\'email, l\'alias et le prénom de l\'utilisateur sont requis!'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->userService->createUser($email, $firstname, $alias);
        if (!$user) {
            return new JsonResponse(['error' => 'Cet email et/ou cet alias sont déjà utilisés!'], JsonResponse::HTTP_CONFLICT);
        }
        if(!$this->emailService->sendEmailAddUser($email, $firstname))  {
            new JsonResponse(['status' => 'L\'utilisateur a bien été créé mais l\'email n\'a pas été envoyé'], JsonResponse::HTTP_CREATED);
        }
        else {
            return new JsonResponse(['status' => 'L\'utilisateur a bien été créé et un email de confirmation contenant le mot de passe lui a été envoyé!'], JsonResponse::HTTP_CREATED);
            
        }
    }

    #[Route(
        'drive_API/deleteUser',
        name: 'drive_API_deleteUser',
        methods: ['DELETE']
    )]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour supprimer un utilisateur')]
    public function deleteUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user_id = $data['user_id'];
        $alias = $data['alias'];
        $user = $this->userService->deleteUser($user_id);
        if (!$user) {
            return new JsonResponse(['error' => 'Cet utilisateur n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }
        return new JsonResponse(['status' => 'L\'utilisateur avec le pseudo "' . $alias . '" a bien été supprimé'], JsonResponse::HTTP_CREATED);
    }


    #[Route(
        'drive_API/changeIdAdmin',
        name: 'drive_API_changeIdAdmin',
        methods: ['PUT']
    )]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour changer ces identifiants')]
    public function changeIdAdmin(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);


        $email = $data['mail'] ?? null;
        $password = $data['mdp'] ?? null;

        $user = $this->getUser();



        if (
            !$email || !$password
        ) {
            return new JsonResponse(['error' => 'L\'email et le mot de passe sont requis!'], JsonResponse::HTTP_BAD_REQUEST);
        }
        // Validation du format de l'email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'L\'adresse email est invalide.'], JsonResponse::HTTP_BAD_REQUEST);
        }
        // Validation de la longueur du mot de passe (exemple: minimum 8 caractères)
        if (strlen($password) < 8) {
            return new JsonResponse(['error' => 'Le mot de passe doit comporter au moins 8 caractères.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->userService->changeIdAdmin($email, $password, $user);

        return new JsonResponse(['status' => 'Les identifiants ont bien été changés.'], JsonResponse::HTTP_CREATED);
    }

   
}