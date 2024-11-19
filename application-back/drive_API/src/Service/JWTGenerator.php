<?php
namespace App\Service;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;


class JWTGenerator  {
    

    public function __construct(private JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }
    public function generateJwtToken( $user): string
    {
   

        return $this->jwtManager->create($user);
    }  
}