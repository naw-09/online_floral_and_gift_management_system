<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Product;
use App\Models\Category;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private function createCategory($name = 'Flowers')
    {
        return Category::create([
            'name' => $name,
            'slug' => strtolower($name)
        ]);
    }


    private function createProduct($categoryId, $data = [])
    {
        return Product::create(array_merge([
            'name' => 'Test Product',
            'slug' => 'test-product-' . rand(1, 9999),
            'description' => '',
            'price' => 100,
            'category_id' => $categoryId,
            'is_active' => true,
            'is_popular' => false,
            'discount_price' => 0
        ], $data));
    }

    /** @test */
    public function test_get_products()
    {
        $category = $this->createCategory();

        $this->createProduct($category->id);
        $this->createProduct($category->id);

        $this->createProduct($category->id, [
            'is_active' => false
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);

        $this->assertCount(2, $response->json('data'));
    }

    /** @test */
    public function test_filter_by_category()
    {
        $category1 = $this->createCategory('Flowers');
        $category2 = $this->createCategory('Gifts');

        $this->createProduct($category1->id);
        $this->createProduct($category2->id);

        $response = $this->getJson("/api/products?category_id={$category1->id}");

        $response->assertStatus(200);

        $this->assertCount(1, $response->json('data'));
    }

    /** @test */
    public function test_search_products()
    {
        $category = $this->createCategory();

        $this->createProduct($category->id, [
            'name' => 'Rose Flower',
            'slug' => 'rose-flower'
        ]);

        $this->createProduct($category->id, [
            'name' => 'Chocolate',
            'slug' => 'chocolate'
        ]);

        $response = $this->getJson('/api/products?search=Rose');

        $response->assertStatus(200);

        $this->assertCount(1, $response->json('data'));
    }

    /** @test */
    public function test_filter_by_price_range()
    {
        $category = $this->createCategory();

        $this->createProduct($category->id, [
            'price' => 50,
            'slug' => 'cheap'
        ]);

        $this->createProduct($category->id, [
            'price' => 200,
            'slug' => 'expensive'
        ]);

        $response = $this->getJson('/api/products?min_price=100');

        $response->assertStatus(200);

        $this->assertCount(1, $response->json('data'));
    }

    /** @test */
    public function test_show_active_product()
    {
        $category = $this->createCategory();

        $product = $this->createProduct($category->id);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $product->id
                 ]);
    }

    /** @test */
    public function test_show_inactive_product()
    {
        $category = $this->createCategory();

        $product = $this->createProduct($category->id, [
            'is_active' => false
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function test_get_popular_products()
    {
        $category = $this->createCategory();

        for ($i = 0; $i < 6; $i++) {
            $this->createProduct($category->id, [
                'name' => 'Popular ' . $i,
                'slug' => 'popular-' . $i,
                'is_popular' => true
            ]);
        }

        $response = $this->getJson('/api/products/popular');

        $response->assertStatus(200);

        $this->assertCount(6, $response->json());
    }

    /** @test */
    public function test_get_discounted_products()
    {
        $category = $this->createCategory();

        for ($i = 0; $i < 6; $i++) {
            $this->createProduct($category->id, [
                'name' => 'Discount ' . $i,
                'slug' => 'discount-' . $i,
                'discount_price' => 20
            ]);
        }

        $response = $this->getJson('/api/products/discounted');

        $response->assertStatus(200);

        $this->assertCount(6, $response->json());
    }
}