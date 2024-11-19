<?php
// src/Controller/EmailController.php

namespace App\Service;

use App\Repository\EmailTemplatesRepository;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;



use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EmailService extends AbstractController
{
    private $mailer;
    private $emailTemplates;

    // Injection du service MailerInterface et emailTemplateRepo
    public function __construct(MailerInterface $mailer, EmailTemplatesRepository $emailTemplates)
    {
        $this->mailer = $mailer;
        $this->emailTemplates = $emailTemplates;
    }

    /**
     * @Route("/send-test-email", name="send_test_email", methods={"GET"})
     */
    public function sendEmailAddUser($emailUser, $firstnameUser): bool
    {
        $emailTemplateRow= $this->emailTemplates->findOneBy(['id' => 1]);
        $emailAddUserTemplate = $emailTemplateRow->getCode()  ;
        $emailAddUserTemplate = str_replace("######", $firstnameUser, $emailAddUserTemplate);
        $emailAddUserTemplate = str_replace("----adress----", $_ENV['ADRESS_APPLI'], $emailAddUserTemplate);
       
        
        
        // Création de l'email de test
        $email = (new Email())
            ->from($_ENV['SMTP_ORIGIN']) // L'adresse de l'expéditeur
            ->to($emailUser) // L'adresse du destinataire (à changer selon ton besoin)
            ->subject('Création de votre compte')
            ->html($emailAddUserTemplate)
            // Tu peux également ajouter du HTML si nécessaire
            // ->html('<p>Ceci est un email de test avec <strong>HTML</strong> content.</p>')
        ;

        try {
            // Envoi synchrone de l'email
            $this->mailer->send($email);

            // Retourner une réponse succès
            return true;
        } catch (\Exception $e) {
            // Si l'envoi échoue, retourne un booleéen pour créer le message d'échec
            return false;
        }
    }

    public function sendEmailPasswordChange($emailUser, $loginUrl, $firstnameUser): bool  {
        $emailTemplateRow = $this->emailTemplates->findOneBy(['id' => 2]);
        $emailAddUserTemplate = $emailTemplateRow->getCode();

        $emailAddUserTemplate = str_replace("######", $firstnameUser, $emailAddUserTemplate);
        $emailAddUserTemplate = str_replace("----loginTemp----", $loginUrl, $emailAddUserTemplate);


        // Création de l'email de test
        $email = (new Email())
            ->from($_ENV['SMTP_ORIGIN']) // L'adresse de l'expéditeur
            ->to($emailUser) // L'adresse du destinataire (à changer selon ton besoin)
            ->subject('Modification du mot de passe')
            ->html($emailAddUserTemplate)
            // Tu peux également ajouter du HTML si nécessaire
            // ->html('<p>Ceci est un email de test avec <strong>HTML</strong> content.</p>')
        ;

        try {
            // Envoi synchrone de l'email
            $this->mailer->send($email);

            // Retourner une réponse succès
            return true;
        } catch (\Exception $e) {
            // Si l'envoi échoue, retourne un booleéen pour créer le message d'échec
            return false;
        }
    }
    
}