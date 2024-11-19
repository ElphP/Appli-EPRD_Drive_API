<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;



/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findAllUserProperties()
    {
        return $this->createQueryBuilder('u')
            ->select('u.id AS user_id , u.alias AS user_alias , f.nom AS file_name , f.id AS file_id')
            ->leftJoin('u.files', 'f') 
            ->where('u.roles LIKE :role') // Filtre pour le rôle ROLE_USER
            ->setParameter('role', '%ROLE_USER%') // Paramètre pour le filtre
            ->orderBy('u.alias','ASC')
            ->addOrderBy('f.nom', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }

    public function findSpecificUserFileProperties($user_id)
    {
        // Utilisation du QueryBuilder pour sélectionner file_id et file_name pour le user défini
        return $this->createQueryBuilder('u')
            ->select(' f.nom AS file_name , f.id AS file_id')
            ->leftJoin('u.files', 'f')
            ->where('u.id LIKE :id') // Filtre pour le user
            ->setParameter('id', $user_id) // Paramètre pour le filtre
            ->getQuery()
            ->getArrayResult();
    }

    // public function findAdmin(): ?User
    // {
    //     $qb = $this->createQueryBuilder('u');
    //     $users = $qb->getQuery()->getResult();

    //     foreach ($users as $user) {
    //         $roles = $user->getRoles();
    //         if (in_array('ROLE_ADMIN', $roles)) {
    //             return $user;
    //         }
    //     }

    //     return null;
    // }

    // public function findUserWithTitles(): array
    // {
    //     return $this->createQueryBuilder('user')
    //     ->leftJoin('user.titles', 'title')
    //     ->addSelect('title')
    //     ->where(':role MEMBER OF user.roles')
    //     ->setParameter('role', 'ROLE_USER')
    //     ->getQuery()
    //         ->getArrayResult();
    // }

    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}