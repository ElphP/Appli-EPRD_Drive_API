<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use App\Entity\File;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $userPasswordHasher;

    public function __construct(UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userPasswordHasher = $userPasswordHasher;
    }
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        // création d'objets fichiers 
        $file3 = new File();
        $file3->setType("pdf");
        $file3->setNom("file3");
        $manager->persist($file3);

        $file1 = new File();
        $file1->setType("pdf");
        $file1->setNom("file1");
        $manager->persist($file1);

        $file2 = new File();
        $file2->setType("pdf");
        $file2->setNom("file2");
        $manager->persist($file2);

       
   
        // Création d'un user "normal"
        $user = new User();
        $user->setEmail("user@drive_API.com");
        $user->setRoles(["ROLE_USER"]);
        $user->setPassword($this->userPasswordHasher->hashPassword($user, "password"));
        $user->setName("user1");
        // relation manytomany 2files
        $user->addFile($file2);
        $user->addFile($file3);
        $manager->persist($user);

       
        $user2 = new User();
        $user2->setEmail("user2@drive_API.com");
        $user2->setRoles(["ROLE_USER"]);
        $user2->setPassword($this->userPasswordHasher->hashPassword($user2, "password"));
        $user2->setName("user2");
        // relation manytomany 1files
        $user2->addFile($file1); 
        $manager->persist($user2);
        
        $user3 = new User();
        $user3->setEmail("user3@drive_API.com");
        $user3->setRoles(["ROLE_USER"]);
        $user3->setPassword($this->userPasswordHasher->hashPassword($user3, "password"));
        $user3->setName("user3");
        // relation manytomany 1files
        
        $manager->persist($user3);
       

        // Création d'un user admin
        $userAdmin = new User();
        $userAdmin->setEmail("admin@drive_API.com");
        $userAdmin->setRoles(["ROLE_ADMIN"]);
        $userAdmin->setPassword($this->userPasswordHasher->hashPassword($userAdmin, "password"));
        $userAdmin->setName("admin1");
           // relation manytomany 3files
        $userAdmin->addFile($file1);
        $userAdmin->addFile($file2);
        $userAdmin->addFile($file3);
        $manager->persist($userAdmin);

        

        $manager->flush();
    }
}