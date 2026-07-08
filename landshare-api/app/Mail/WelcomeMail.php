<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🌿 Bienvenue sur LandShare Bénin !',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
            with: [
                'user'       => $this->user,
                'first_name' => $this->user->first_name ?? $this->user->name,
                'full_name'  => trim(($this->user->first_name ?? '') . ' ' . ($this->user->last_name ?? '')) ?: $this->user->name,
            ],
        );
    }
}
