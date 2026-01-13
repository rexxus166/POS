<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth')->head('/ping', function () {
    return response()->json(['status' => 'ok']);
});
