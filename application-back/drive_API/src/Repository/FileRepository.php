<?php

namespace App\Repository;

use App\Entity\File;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<File>
 */
class FileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, File::class);
    }

    /**
     * Récupérer uniquement l'ID et le nom de tous les fichiers
     */
    public function findAllFileProperties()
    {
        // Utilisation du QueryBuilder pour sélectionner seulement deux colonnes
        return $this->createQueryBuilder('f')
            ->select('f.id, f.nom')
            ->orderBy('f.nom', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }
    public function findAllFileNames()
    {
        // Utilisation du QueryBuilder pour créer un tableau des noms des fichiers
        return $this->createQueryBuilder('f')
            ->select( 'f.nom')
            ->getQuery()
            ->getArrayResult();
    }

    
    
  

//    /**
//     * @return File[] Returns an array of File objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?File
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}