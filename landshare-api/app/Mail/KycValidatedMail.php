<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KycValidatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🪪 Votre identité a été vérifiée — LandShare Bénin',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.kyc-validated',
            with: [
                'user' => $this->user,
            ],
        );
    }
}
