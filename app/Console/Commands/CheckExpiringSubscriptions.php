<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Store;
use App\Models\User;
use App\Notifications\SubscriptionExpiringSoon;

class CheckExpiringSubscriptions extends Command
{
    protected $signature = 'subscription:check-expiring';
    protected $description = 'Check and notify users with expiring subscriptions';

    public function handle()
    {
        // Cari tenant yang akan expire dalam 3 hari
        $expiringTenants = Store::whereIn('status', ['active', 'trial'])
            ->whereDate('subscription_ends_at', '<=', now()->addDays(3))
            ->whereDate('subscription_ends_at', '>=', now())
            ->get();

        $count = 0;
        foreach ($expiringTenants as $tenant) {
            $daysLeft = now()->diffInDays($tenant->subscription_ends_at, false);

            if ($daysLeft > 0) {
                // Kirim email ke owner tenant
                $owner = User::where('tenant_id', $tenant->id)
                    ->where('role', 'admin')
                    ->first();

                if ($owner && $owner->email) {
                    $owner->notify(new SubscriptionExpiringSoon(
                        $daysLeft,
                        $tenant->subscription_ends_at->format('d F Y')
                    ));

                    $this->info("✅ Email sent to: {$owner->email} ({$daysLeft} days left)");
                    $count++;
                }
            }
        }

        $this->info("📧 Total emails sent: {$count}");
        return Command::SUCCESS;
    }
}
