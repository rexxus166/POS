<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpiringSoon extends Notification
{
    use Queueable;

    protected $daysLeft;
    protected $endDate;

    public function __construct($daysLeft, $endDate)
    {
        $this->daysLeft = $daysLeft;
        $this->endDate = $endDate;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('⚠️ Masa Aktif Segera Berakhir - SobatNiaga POS')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Masa aktif langganan Anda akan berakhir dalam **' . $this->daysLeft . ' hari** lagi.')
            ->line('Tanggal berakhir: **' . $this->endDate . '**')
            ->action('Perpanjang Sekarang', 'https://wa.me/6283186523420?text=Halo%20Admin,%20saya%20mau%20perpanjang%20langganan')
            ->line('Jangan sampai bisnis Anda terganggu. Perpanjang sekarang untuk tetap menikmati semua fitur premium!')
            ->salutation('Salam hangat, Tim SobatNiaga');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'days_left' => $this->daysLeft,
            'end_date' => $this->endDate,
        ];
    }
}
