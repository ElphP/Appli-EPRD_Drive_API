<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;


class TokenController extends AbstractController
{
    public function invalid(): Response
    {
        return $this->render('error/invalid.html.twig', [
            'message' => 'Votre token est invalide ou a expiré.',
        ]);
    }

    public function notFound(): Response
    {
        return $this->render('error/not_found.html.twig', [
            'message' => 'Aucun jeton d\'identification n\'a été trouvé dans la requête.',
        ]);
    }
}