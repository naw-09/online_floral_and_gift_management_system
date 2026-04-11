<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');

    $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'role' => 'admin', 
    ]);

    $this->actingAs($admin, 'api');
});

it('list all products', function () {

    $category = Category::create([
        'name' => 'Flowers',
        'slug' => 'flowers',
    ]);

    Product::create([
        'category_id' => $category->id,
        'name' => 'Rose Bouquet',
        'description' => 'Beautiful roses',
        'price' => 100,
        'type' => 'floral',
        'is_active' => true,
        'is_popular' => false,
        'stock' => 10,
        'slug' => 'rose-bouquet',
    ]);

    $response = $this->getJson('/api/admin/products');

    $response->assertStatus(200);

    expect($response->json('data.0.name'))->toBe('Rose Bouquet');
});

it('filter products by category', function () {

    $category1 = Category::create([
        'name' => 'Flowers',
        'slug' => 'flowers',
    ]);

    $category2 = Category::create([
        'name' => 'Gifts',
        'slug' => 'gifts',
    ]);

    Product::create([
        'category_id' => $category1->id,
        'name' => 'Rose',
        'price' => 100,
        'type' => 'floral',
        'slug' => 'rose',
    ]);

    Product::create([
        'category_id' => $category2->id,
        'name' => 'Chocolate Box',
        'price' => 50,
        'type' => 'gift',
        'slug' => 'chocolate-box',
    ]);

    $response = $this->getJson('/api/admin/products?category_id=' . $category1->id);

    $response->assertStatus(200);

    expect($response->json('data.0.category_id'))->toBe($category1->id);
});



it('delete a product and remove image', function () {

    $category = Category::create([
        'name' => 'Flowers',
        'slug' => 'flowers',
    ]);

    Storage::disk('public')->put('products/test.jpg', 'dummy');

    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Delete Product',
        'description' => 'Will be deleted',
        'price' => 80,
        'type' => 'floral',
        'image' => 'products/test.jpg',
        'is_active' => true,
        'is_popular' => false,
        'stock' => 5,
        'slug' => 'delete-product',
    ]);

    $response = $this->deleteJson("/api/admin/products/{$product->id}");

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Product deleted successfully'
        ]);

    Storage::disk('public')->assertMissing('products/test.jpg');

    $this->assertDatabaseMissing('products', [
        'id' => $product->id
    ]);
});