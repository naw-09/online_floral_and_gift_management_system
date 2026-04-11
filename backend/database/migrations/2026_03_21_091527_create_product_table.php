<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->string('type')->default('floral'); 
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('stock')->default(0);
            $table->timestamps();
        });
    
    }

    public function down(): void
    {

         Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};
