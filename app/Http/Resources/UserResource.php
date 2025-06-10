<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            // Pastikan BARIS INI ADA PERSIS SEPERTI INI:
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name'); // Ini akan menghasilkan array string (misal: ["admin"])
            }),
            // Jika ada properti lain seperti profile_photo_url, tambahkan juga di sini:
            // 'profile_photo_url' => $this->profile_photo_url,
        ];
    }
}