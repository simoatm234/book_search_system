<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class confirmationMail extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $confirmationToken; 

    /**
     * Create a new message instance.
     */
    public function __construct( $confirmationToken,User $user,)
    {
        $this->user = $user;
        $this->confirmationToken = $confirmationToken;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirm Your Email Address',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $title = 'Email Confirmation';
        $confirmationUrl = env('FRONTEND_URL') . '/confirm-email/' . $this->confirmationToken;
        return new Content(
            view: 'auth.Confimation_email',
            with: [
                'title' => $title,
                'userName' => $this->user->name,
                'confirmationUrl' => $confirmationUrl
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
