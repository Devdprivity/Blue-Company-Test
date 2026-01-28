<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'nombre' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $users = User::factory(5)->create();
        $allUsers = $users->push($admin);

        foreach ($allUsers as $user) {
            $projects = Project::factory(rand(2, 4))->create([
                'owner_id' => $user->id,
            ]);

            foreach ($projects as $project) {
                $tasks = Task::factory(rand(3, 8))->create([
                    'project_id' => $project->id,
                ]);

                foreach ($tasks as $task) {
                    Comment::factory(rand(0, 5))->create([
                        'task_id' => $task->id,
                        'user_id' => $allUsers->random()->id,
                    ]);
                }
            }
        }
    }
}
