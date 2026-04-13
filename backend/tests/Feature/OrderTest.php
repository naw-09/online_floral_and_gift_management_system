<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Passport\Passport;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
        ]);

        Passport::actingAs($this->user);
    }

    private function createCategory()
    {
        return Category::create([
            'name' => 'Flowers',
            'slug' => 'flowers',
        ]);
    }

    private function createProduct($categoryId)
    {
        return Product::create([
            'category_id' => $categoryId,
            'name' => 'Rose',
            'slug' => 'rose',
            'price' => 100,
            'discount_price' => 0,
            'description' => 'Test product',
            'type' => 'gift',
            'is_active' => true,
            'is_popular' => false,
            'stock' => 10,
        ]);
    }


    private function createOrder($userId, $overrides = [])
    {
        return Order::create(array_merge([
            'status' => 'pending',
            'total' => 100,
            'delivery_address' => 'Test Address',
            'delivery_phone' => '0912345678',
            'gift_message' => null,
            'delivery_date' => null,
        ], $overrides, [
            'user_id' => $userId,
        ]));
    }

    /** @test */
    public function test_user_view_orders()
    {
        $this->createOrder($this->user->id, [
            'total' => 200,
        ]);

        $response = $this->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
               
            ]);
    }

    /** @test */
    public function test_user_create_order_from_cart()
    {
        $category = $this->createCategory();
        $product = $this->createProduct($category->id);

        $this->user->cartItems()->create([
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->postJson('/api/orders', [
            'delivery_address' => 'Yangon',
            'delivery_phone' => '0912345678',
            'gift_message' => 'Happy Birthday',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'user_id',
                'total',
                'items',
            ]);
    }

    /** @test */
    public function test_user_cannot_create_order_if_cart_empty()
    {
        $response = $this->postJson('/api/orders', [
            'delivery_address' => 'Yangon',
            'delivery_phone' => '0912345678',
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function test_user_view_single_order()
    {
        $order = $this->createOrder($this->user->id);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $order->id,
            ]);
    }

    /** @test */
    public function test_user_cannot_view_other_user_order()
    {
        $otherUser = User::create([
            'name' => 'Other User',
            'email' => 'other@test.com',
            'password' => bcrypt('password'),
        ]);

        $order = $this->createOrder($otherUser->id);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response->assertStatus(403);
    }
}