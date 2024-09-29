<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Entity\File;


use Doctrine\ORM\EntityManagerInterface;
use DateTime;

class FileUpLoader
{

    private $privateDirectory;
    private $entityManager;
       

    // Constante pour les extensions acceptées
    private const ALLOWED_EXTENSIONS = ['pdf'];


    public function __construct(string $privateDirectory, EntityManagerInterface $entityManager)
    {
        $this->privateDirectory = $privateDirectory;
        $this->entityManager = $entityManager;       
        
    }



    public function upload(UploadedFile $file, String $nom): ?string
    {
        
        // Vérifier si le répertoire existe, sinon le créer
        if (!is_dir($this->privateDirectory)) {
            mkdir($this->privateDirectory, 0777, true);
        }
        $uploadDirectory =  $this->privateDirectory;
        $fileExtension = strtolower($file->guessExtension());
        $fileName = uniqid() . '.' . $fileExtension;

        // test si l'extension est parmi les extensions autorisées.
        if (in_array($fileExtension, self::ALLOWED_EXTENSIONS)) {
            try {
                $file->move($uploadDirectory, $fileName);
            } catch (FileException $e) {
                throw new \Exception('Erreur lors du téléchargement du fichier: ' . $e->getMessage());
            }
            //vérification si le nom du fichier n'est pas déjà utilisé en bdd
            
            
            //si tout est OK Créer un novueau fichier
            $file = new File();
            $file->setNom($nom);
            $file->setType($fileExtension);
            
            $file->setPath($fileName);
            $file->setUploadDate(new DateTime());
            $this->entityManager->persist($file);

            // association entre admin et le fichier qui vient d'être créé 
            // code ci-dessous non nécessaire étant donné que, par définition dans cette appli, l'admin contrôle la totalité des files!   (pourrait être utilisé dans le cadre d'une appli partagée multi-admin n'ayant pas la propriété des mêmes fichiers...)
            
            // $user=$this->userRepository->findAdmin();
            // $user->addFile($file);
            // $this->entityManager->persist($user);

            // 
            $this->entityManager->flush();
           

            return $fileName;
        } else {
            return null;
        }
    }

     public function removeUpLoadedFile($existingFile): bool  {
        // on supprime le fichier
        $path = $existingFile->getPath();
        if(!$path) {
            return false;
        }
            // Construction du chemin complet
            $filePath = $this->privateDirectory . DIRECTORY_SEPARATOR . $path;

            // Vérification et suppression
            if (file_exists($filePath) && unlink($filePath)) {
                // Suppression de l'entrée dans la BDD
                $this->entityManager->remove($existingFile);
                $this->entityManager->flush();
                return true;
            }
            else return false;
       
      
     }



    public function getPrivateDirectory(): string
    {
        return $this->privateDirectory;
    }
}