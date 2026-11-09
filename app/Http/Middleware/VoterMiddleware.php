<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VoterMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        // User belum login
        if (! $request->user()) {
            return redirect()->route('login');
        }

        // User login, tetapi bukan voter
        if ($request->user()->role !== 'voter') {
            abort(403, 'Akses hanya untuk voter.');
        }

        return $next($request);
    }
}
