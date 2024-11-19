<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;


class JWTFailureListener
{
    private RouterInterface $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function onJWTInvalid(JWTInvalidEvent $event): void
    {
        // Redirection vers une page Twig en cas de token invalide
        $url = $this->router->generate('token_invalid_page');
        $response = new RedirectResponse($url);
        $event->setResponse($response);
    }

    public function onJWTNotFound(JWTNotFoundEvent $event): void
    {
        // Redirection vers une page Twig en cas de token absent
        $url = $this->router->generate('token_not_found_page');
        $response = new RedirectResponse($url);
        $event->setResponse($response);
    }

    public function onJWTExpired(JWTExpiredEvent $event)
    {
        // Traitez l'expiration du JWT ici, par exemple, redirigez l'utilisateur ou retournez une réponse d'erreur
        $url = $this->router->generate('token_invalid_page');
        $response = new RedirectResponse($url);
        $event->setResponse($response);
    }
}