<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $subscriptionAlert = null;

        if ($user && $user->tenant) {
            $endsAt = $user->tenant->subscription_ends_at;

            if ($endsAt) {
                // Hitung selisih hari dari SEKARANG
                // false = absolute value off (bisa negatif)
                $daysLeft = now()->diffInDays($endsAt, false);

                // Jika tinggal 5 hari atau kurang (tapi masih aktif / >= 0)
                if ($daysLeft <= 5 && $daysLeft >= 0) {
                    $subscriptionAlert = [
                        'days_left' => (int) $daysLeft,
                        'date' => $endsAt->format('d M Y')
                    ];
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'subscription_alert' => $subscriptionAlert,
        ];
    }
}
