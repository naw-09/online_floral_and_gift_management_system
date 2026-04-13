<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\Passport;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_user_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '0912345678',
            'address' => 'Yangon'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user',
                     'token',
                     'token_type'
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    /** @test */
    public function test_register_validation_fails()
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /** @test */
    public function test_user_login()
    {
        $user = User::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user',
                     'token',
                     'token_type'
                 ]);
    }

    /** @test */
    public function test_login_fails_with_wrong_password()
    {
        $user = User::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials'
                 ]);
    }

    /** @test */
    public function test_user_logout()
    {
        $user = User::create([
            'name' => 'John',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true
        ]);

        Passport::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Logged out'
                 ]);
    }
}