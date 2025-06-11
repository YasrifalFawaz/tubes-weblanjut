<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Project;
use App\Models\Task;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Project::class => ProjectPolicy::class, // <<< Tambahkan ini
        Task::class => TaskPolicy::class,       // <<< Tambahkan ini
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
