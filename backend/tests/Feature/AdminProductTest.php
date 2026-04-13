<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // 🔥 CREATE ADMIN USER (THIS FIXES 403)
        $user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),

            // 👉 IMPORTANT: MUST MATCH YOUR admin middleware
            'role' => 'admin', 
            // OR if your system uses:
            // 'is_admin' => true,
        ]);

        // 🔥 AUTH WITH PASSPORT
        Passport::actingAs($user);
    }

    private function createCategory()
    {
        return Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }

    private function createProduct($categoryId, $data = [])
    {
        return Product::create(array_merge([
            'category_id' => $categoryId,
            'name' => 'Sample Product',
            'slug' => 'sample-product-' . rand(1, 9999),
            'description' => 'Test description',
            'price' => 100,
            'discount_price' => 80,
            'image' => null,
            'type' => 'gift',
            'is_active' => true,
            'is_popular' => false,
            'stock' => 10,
        ], $data));
    }

    public function test_product_list()
    {
        $category = $this->createCategory();

        $this->createProduct($category->id);
        $this->createProduct($category->id);

        $response = $this->getJson('/api/admin/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                
            ]);
    }

    public function test_create_product()
    {
        Storage::fake('public');

        $category = $this->createCategory();

        $file = UploadedFile::fake()->image('product.jpg');

        $response = $this->postJson('/api/admin/products', [
            'category_id' => $category->id,
            'name' => 'New Product',
            'description' => 'Description here',
            'price' => 120,
            'discount_price' => 90,
            'image' => $file,
            'type' => 'floral',
            'is_active' => true,
            'is_popular' => true,
            'stock' => 5,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'New Product',
            ]);

        Storage::disk('public')->assertExists(
            'products/' . $file->hashName()
        );
    }

    public function test_show_single_product()
    {
        $category = $this->createCategory();

        $product = $this->createProduct($category->id);

        $response = $this->getJson("/api/admin/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $product->id,
            ]);
    }

    public function test_update_product()
    {
        $category = $this->createCategory();

        $product = $this->createProduct($category->id, [
            'name' => 'Old Product',
        ]);

        $response = $this->putJson("/api/admin/products/{$product->id}", [
            'name' => 'Updated Product',
            'price' => 250,
            'is_active' => false,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Updated Product',
            ]);
    }

    public function test_delete_product()
    {
        $category = $this->createCategory();

        $product = $this->createProduct($category->id);

        $response = $this->deleteJson("/api/admin/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Product deleted successfully',
            ]);
    }
}