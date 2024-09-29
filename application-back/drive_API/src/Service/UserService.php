<?php

namespace App\Service;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;

class UserService
{
    private $userPasswordHasher;
    private $userRepository;
    private $entityManager;

    public function __construct(
        UserPasswordHasherInterface $userPasswordHasher,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->userPasswordHasher = $userPasswordHasher;
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    public function createUser(string $email, string $password, string $name): ?User
    {
        // Vérifier si l'utilisateur existe déjà (email et/ou alias)
        $existingMail = $this->userRepository->findOneBy(['email' => $email]);
        $existingName = $this->userRepository->findOneBy(['name' => $name]);
        if ($existingMail  || $existingName) {
            return null;
        }

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setName($name);
        $hashedPassword = $this->userPasswordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);
        $user->setRoles(["ROLE_USER"]);

        // Sauvegarder l'utilisateur dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    public function deleteUser(string $user_id): ?user {
       $user= $this->userRepository->find($user_id);
        // Vérifier si l'utilisateur existe
        if (!$user) {
            return null;
        }

        // Supprimer l'utilisateur
        $this->entityManager->remove($user);
        $this->entityManager->flush();

        // Retourner une réponse de succès
        return $user;

    }

  
}