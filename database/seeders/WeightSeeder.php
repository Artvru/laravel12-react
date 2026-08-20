<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Weight;

class WeightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Weight::create([
            'weight_date' => '2024-12-15',
            'weight_value' => 72.5,
            'note' => 'ก่อนออกกำลัง'
        ]);

        Weight::create([
            'weight_date' => '2024-12-16',
            'weight_value' => 72.0,
            'note' => 'หลังออกกำลัง'
        ]);

        Weight::create([
            'weight_date' => '2024-12-17',
            'weight_value' => 71.8,
            'note' => 'เช้า'
        ]);

        Weight::create([
            'weight_date' => '2024-12-18',
            'weight_value' => 71.5,
            'note' => 'หลังกิจกรรม'
        ]);

        Weight::create([
            'weight_date' => '2024-12-19',
            'weight_value' => 71.2,
            'note' => 'ทำงานหนัก'
        ]);

        Weight::create([
            'weight_date' => '2024-12-20',
            'weight_value' => 70.9,
            'note' => 'ส่วนท้ายสัปดาห์'
        ]);
    }
}