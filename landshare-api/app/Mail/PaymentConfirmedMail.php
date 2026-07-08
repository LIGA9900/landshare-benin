<?php

namespace App\Mail;

use App\Models\Investment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Investment $investment
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✅ Paiement confirmé — ' . $this->investment->reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-confirmed',
            with: [
                'investment' => $this->investment,
                'investor'   => $this->investment->investor,
                'land'       => $this->investment->land,
            ],
        );
    }
}
