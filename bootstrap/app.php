<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\RoleCheck;
use App\Http\Middleware\CheckStoreStatus;
use App\Http\Middleware\CheckSubscription;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Daftarkan alias middleware
        $middleware->alias([
            'role' => RoleCheck::class,
            'store-status' => CheckStoreStatus::class,
            'subscription' => CheckSubscription::class, // [BARU] Middleware untuk cek subscription level
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
