<?php

namespace App\Controller;


use App\Repository\UserRepository;
use App\Repository\FileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use App\Service\FileUpLoader;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class FileController extends AbstractController
{
    private $userRepository;
    private $fileRepository;
    private $entityManager;

    private $FileUpLoader;

    public function __construct(UserRepository $userRepository, FileRepository $fileRepository, EntityManagerInterface
    $entityManager, FileUpLoader $FileUpLoader)
    {
        $this->userRepository = $userRepository;
        $this->fileRepository = $fileRepository;
        $this->entityManager = $entityManager;
        $this->FileUpLoader = $FileUpLoader;
    }

    #[Route('drive_API/addFileToUser', name: 'drive_API_addFileToUser', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour ajouter des fichiers aux utilisateurs')]
    public function addFileToUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'] ?? null;
        $fileId = $data['file_id'] ?? null;

        if (!$userId || !$fileId) {
            return new JsonResponse(
                ['error' => 'L\'ID de l\'utilisateur et l\'ID du fichier sont requis!'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $this->userRepository->find($userId);
        $file = $this->fileRepository->find($fileId);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé!'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!$file) {
            return new JsonResponse(['error' => 'Fichier non trouvé!'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Ajouter le fichier à l'utilisateur
        $user->addFile($file);


        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Fichier ajouté à l\'utilisateur avec succès'], JsonResponse::HTTP_OK);
    }

    #[Route('drive_API/removeFileToUser', name: 'drive_API_removeFileToUser', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour enlever des fichiers aux utilisateurs')]
    public function removeFileToUser(Request $request): JsonResponse
    {
        
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'] ?? null;
        $fileId = $data['file_id'] ?? null;
        

        if (!$userId || !$fileId) {
            return new JsonResponse(
                ['error' => 'L\'ID de l\'utilisateur et l\'ID du fichier sont requis!'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $this->userRepository->find($userId);
        $file = $this->fileRepository->find($fileId);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé!'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!$file) {
            return new JsonResponse(['error' => 'Fichier non trouvé!'], JsonResponse::HTTP_NOT_FOUND);
        }

        
        $user->removeFile($file);


        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'Fichier enlevé à l\'utilisateur avec succès'], JsonResponse::HTTP_OK);
    }


    // route pour l'upload de fichiers
    #[Route('drive_API/upLoadFile', name: 'drive_API_upLoadFile', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour télécharger des fichiers')]

    public function uploadPrivateFile(Request $request): JsonResponse
    {

        $nom = $request->request->get('nom');
        $file = $request->files->get('file');
        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier fourni'], Response::HTTP_BAD_REQUEST);
        }

        if (!$nom) {
            return new JsonResponse(['error' => 'Le nom du fichier est manquant'], Response::HTTP_BAD_REQUEST);
        }
        //vérifiaction d'un doublon sur le nom 
        $existingFileNamesList = array_column($this->fileRepository->findAllFileNames(), 'nom');
        if (in_array($nom, $existingFileNamesList)) {
            return new JsonResponse(['error' => 'Un fichier du même nom existe déjà dans la Base de données'], Response::HTTP_CONFLICT);
        }



        try {
            $fileName = $this->FileUpLoader->upload($file, $nom);
            if (!$fileName) {
                return new JsonResponse(['error' => 'Le type de fichier n\'est pas accepté (fichiers acceptés: PDF)'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors du téléchargement' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }



        return new JsonResponse(['status' => 'Fichier privé uploadé et chargé avec succès'], Response::HTTP_CREATED);
    }

    // route pour supprimer un fichier
    #[Route('drive_API/deleteFile', name: 'drive_API_deleteFile', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour supprimer des fichiers')]

    public function deletePrivateFile(Request $request): JsonResponse
    {
        // avec la méthode delete, voici la manière de récupérer le JSON dans le body
        $data = json_decode($request->getContent(), true);

       $nom = $data['nom'] ?? null;;
       $doc_id = $data['id'] ?? null;;
        
        // Vérification des paramètres
        if (!$nom || !$doc_id
        ) {
            return new JsonResponse(['error' => 'Le nom du fichier et/ou son ID sont manquants'], Response::HTTP_BAD_REQUEST);
        }
        // recherche du fichier
        $existingFile = $this->fileRepository->findOneBy(['nom' => $nom, 'id' => $doc_id]);
        if (!$existingFile) {
            return new JsonResponse(['error' => 'Ce fichier n\'existe pas dans notre base de donnée'], Response::HTTP_NOT_FOUND);
        }

        

        try {
            $removedFileName = $this->FileUpLoader->removeUpLoadedFile($existingFile);
            if (!$removedFileName) {
                return new JsonResponse(['error' => 'Le chemin n\'a pas pu être trouvé pour supprimer le fichier'], Response::HTTP_NOT_FOUND);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la suppression' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['status' => 'Le fichier '.$nom. ' a été supprimé avec succès'], Response::HTTP_OK);
    }

    // route pour télécharger un fichier depuis l'interface User
    #[Route('drive_API/downloadFile', name: 'drive_API_downloadFile', methods: ['POST'])]
    #[IsGranted( 'ROLE_USER', message: 'Vous n\'avez pas les droits suffisants pour télécharger des fichiers')]
    public function download(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        // Accédez aux valeurs
        $nom = $data['nom'] ?? null; 
        $doc_id = $data['id'] ?? null; 
       
        // Vérification des paramètres
        if (
            !$nom || !$doc_id
        ) {
            return new JsonResponse(['error' => 'Le nom du fichier et/ou son ID sont manquants'], Response::HTTP_BAD_REQUEST);
        }
        // recherche du fichier
        $existingFile = $this->fileRepository->findOneBy(['nom' => $nom, 'id' => $doc_id]);
        if (!$existingFile) {
            return new JsonResponse(['error' => 'Ce fichier n\'est pas répertorié dans notre base de donnée'], Response::HTTP_NOT_FOUND);
        }
        $filePath= $existingFile->getPath();
      
        // Récupérer le paramètre
        $privateDirectory = $this->getParameter('upload_directory_private');

        $filePathComplete = $privateDirectory . DIRECTORY_SEPARATOR . $filePath;
       

        // Vérification si le fichier existe
        if (!file_exists($filePathComplete)) {
            return new JsonResponse(['error' => 'Ce fichier n\'existe pas sur notre serveur'], Response::HTTP_NOT_FOUND);
        }

        // Créer une réponse binaire
        $response = new BinaryFileResponse($filePathComplete);

        // Configurer les en-têtes de la réponse
        $response->headers->set('Content-Type', 'application/pdf');
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $existingFile->getNom()
        );

        return $response;
    }
}