<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Tambahkan kolom 'attachment_path' setelah kolom 'content'
            // nullable() berarti attachment tidak wajib ada untuk setiap komentar
            $table->string('attachment_path')->nullable()->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Saat rollback migrasi, hapus kolom 'attachment_path'
            $table->dropColumn('attachment_path');
        });
    }
};