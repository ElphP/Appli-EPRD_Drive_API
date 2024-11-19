<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ErrorController extends AbstractController
{
    #[Route('/token_expired_page', name: 'token_expired_page')]
    public function onJWTExpired(): Response
    {
        return $this->render('error/token_expired.html.twig');
    }
    #[Route('/token_invalid_page', name: 'token_invalid_page')]
    public function onJWTInvalid(): Response
    {
        return $this->render('error/token_invalid.html.twig');
    }
}