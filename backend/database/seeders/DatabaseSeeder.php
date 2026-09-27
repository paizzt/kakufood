<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Equipment;
use App\Models\DamageReport;
use App\Models\Maintenance;
use App\Models\AuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Database is fresh, no need to truncate.

        // 1. Branches
        $branchMakassar = Branch::create(['code' => 'MKS', 'name' => 'Cabang Makassar (Pusat)', 'city' => 'Makassar', 'status' => 'active']);
        $branchGowa = Branch::create(['code' => 'GWA', 'name' => 'Cabang Gowa', 'city' => 'Gowa', 'status' => 'active']);
        $branchMaros = Branch::create(['code' => 'MRS', 'name' => 'Cabang Maros', 'city' => 'Maros', 'status' => 'active']);
        $branchBone = Branch::create(['code' => 'BNE', 'name' => 'Cabang Bone', 'city' => 'Bone', 'status' => 'active']);

        // 2. Categories
        $catKitchen = Category::create(['name' => 'Kitchen', 'status' => 'active']);
        $catBeverage = Category::create(['name' => 'Beverage', 'status' => 'active']);
        $catFurniture = Category::create(['name' => 'Furniture', 'status' => 'active']);
        $catElectronic = Category::create(['name' => 'Electronic', 'status' => 'active']);
        $catVehicle = Category::create(['name' => 'Vehicle', 'status' => 'active']);

        // 3. Users
        $admin = User::create([
            'name' => 'Admin Kaku Food',
            'email' => 'admin@kakufood.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'branch_id' => $branchMakassar->id,
            'status' => 'active'
        ]);

        $staff = User::create([
            'name' => 'Staff Kaku Food',
            'email' => 'staff@kakufood.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'branch_id' => $branchMakassar->id,
            'status' => 'active'
        ]);

        $staffGowa = User::create([
            'name' => 'Staff Gowa',
            'email' => 'gowa@kakufood.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'branch_id' => $branchGowa->id,
            'status' => 'active'
        ]);

        // 4. Equipment
        $equipments = [
            ['KFU-KIT-0001', 'Deep Fryer Gas 2 Tungku', $catKitchen, $branchMakassar, 'Baik', 'Aktif', '2023-01-15', 5500000, 'Dapur Utama'],
            ['KFU-BEV-0002', 'Espresso Machine', $catBeverage, $branchGowa, 'Rusak Ringan', 'Dalam Perbaikan', '2022-11-10', 12000000, 'Bar Depan'],
            ['KFU-FUR-0003', 'Meja Makan Kayu Jati', $catFurniture, $branchMakassar, 'Baik', 'Aktif', '2023-02-05', 1500000, 'Area Makan VIP'],
            ['KFU-ELE-0004', 'AC Daikin 2 PK', $catElectronic, $branchMakassar, 'Baik', 'Aktif', '2023-03-10', 6500000, 'Ruang Tunggu'],
            ['KFU-VEH-0005', 'Motor Honda Beat', $catVehicle, $branchMaros, 'Baik', 'Aktif', '2023-04-20', 18000000, 'Parkiran'],
            ['KFU-KIT-0006', 'Oven Listrik Besar', $catKitchen, $branchBone, 'Rusak Berat', 'Tidak Digunakan', '2021-08-11', 8500000, 'Dapur Belakang'],
            ['KFU-BEV-0007', 'Blender Philips', $catBeverage, $branchGowa, 'Baik', 'Aktif', '2023-05-12', 850000, 'Dapur Utama'],
            ['KFU-FUR-0008', 'Sofa Tunggu', $catFurniture, $branchMaros, 'Rusak Ringan', 'Aktif', '2022-01-20', 3200000, 'Lobi'],
            ['KFU-ELE-0009', 'Mesin Kasir POS', $catElectronic, $branchMakassar, 'Baik', 'Aktif', '2023-06-15', 4500000, 'Kasir Utama'],
            ['KFU-KIT-0010', 'Freezer Daging', $catKitchen, $branchGowa, 'Baik', 'Aktif', '2022-09-05', 7500000, 'Gudang'],
        ];

        $eqModels = [];
        foreach ($equipments as $eq) {
            $model = Equipment::create([
                'code' => $eq[0],
                'name' => $eq[1],
                'category_id' => $eq[2]->id,
                'branch_id' => $eq[3]->id,
                'condition' => $eq[4],
                'status' => $eq[5],
                'purchase_date' => $eq[6],
                'purchase_price' => $eq[7],
                'location' => $eq[8],
                'person_in_charge' => 'Budi Santoso',
                'description' => 'Fasilitas untuk operasional Kaku Food'
            ]);
            $model->hash_value = hash('sha256', $model->id . '|' . $model->code . '|' . $model->purchase_date);
            $model->save();
            $eqModels[] = $model;

            // Log Audit Create Equipment
            $log = AuditLog::create([
                'user_id' => $admin->id,
                'module' => 'equipment',
                'action' => 'create',
                'record_id' => $model->id,
                'new_data' => $model->toJson(),
                'ip_address' => '127.0.0.1'
            ]);
            $log->hash_value = hash('sha256', $log->id . '|' . $log->action . '|' . $log->record_id);
            $log->save();
        }

        // 5. Damage Reports
        $dr1 = DamageReport::create([
            'equipment_id' => $eqModels[1]->id, // Espresso Machine
            'reporter_id' => $staffGowa->id,
            'damage_type' => 'Elektrikal',
            'severity' => 'Rusak Ringan',
            'description' => 'Mesin kadang mati sendiri saat proses brewing espresso.',
            'status' => 'Dalam Perbaikan',
            'reported_at' => Carbon::now()->subDays(5)
        ]);

        $dr2 = DamageReport::create([
            'equipment_id' => $eqModels[5]->id, // Oven
            'reporter_id' => $admin->id,
            'damage_type' => 'Mekanikal',
            'severity' => 'Rusak Berat',
            'description' => 'Elemen pemanas terbakar dan kaca depan retak.',
            'status' => 'Ditolak',
            'admin_notes' => 'Oven sudah terlalu tua, lebih baik pengadaan baru.',
            'reported_at' => Carbon::now()->subDays(20),
            'resolved_at' => Carbon::now()->subDays(19)
        ]);

        $dr3 = DamageReport::create([
            'equipment_id' => $eqModels[7]->id, // Sofa
            'reporter_id' => $staff->id,
            'damage_type' => 'Fisik',
            'severity' => 'Rusak Ringan',
            'description' => 'Kulit sofa sobek di bagian lengan kiri.',
            'status' => 'Baru',
            'reported_at' => Carbon::now()->subDays(1)
        ]);

        // 6. Maintenances
        Maintenance::create([
            'equipment_id' => $eqModels[0]->id, // Deep Fryer
            'maintenance_type' => 'Rutin',
            'maintenance_date' => Carbon::now()->subDays(30),
            'technician' => 'Andi Teknisi',
            'description' => 'Pembersihan kerak minyak dan pengecekan saluran gas.',
            'cost' => 150000,
            'condition_before' => 'Kotor',
            'condition_after' => 'Bersih',
            'notes' => 'Lakukan pembersihan rutin setiap 3 bulan',
            'user_id' => $admin->id
        ]);

        Maintenance::create([
            'equipment_id' => $eqModels[1]->id, // Espresso Machine
            'maintenance_type' => 'Perbaikan',
            'maintenance_date' => Carbon::now()->subDays(2),
            'technician' => 'Budi Kopi Service',
            'description' => 'Penggantian kabel power dan kalibrasi pompa air.',
            'cost' => 850000,
            'condition_before' => 'Rusak Ringan',
            'condition_after' => 'Proses Testing',
            'notes' => 'Masih butuh observasi selama 3 hari',
            'user_id' => $staffGowa->id
        ]);
        
        Maintenance::create([
            'equipment_id' => $eqModels[3]->id, // AC
            'maintenance_type' => 'Rutin',
            'maintenance_date' => Carbon::now()->subDays(15),
            'technician' => 'CV Multi Karya',
            'description' => 'Cuci AC dan tambah freon.',
            'cost' => 250000,
            'condition_before' => 'Kurang dingin',
            'condition_after' => 'Dingin normal',
            'notes' => 'Freon tidak ada bocor besar, hanya kurang',
            'user_id' => $admin->id
        ]);

        // 7. Extra Audit Logs (Simulate updates)
        $updateLog = AuditLog::create([
            'user_id' => $admin->id,
            'module' => 'equipment',
            'action' => 'update',
            'record_id' => $eqModels[1]->id,
            'old_data' => json_encode(['status' => 'Aktif']),
            'new_data' => json_encode(['status' => 'Dalam Perbaikan']),
            'ip_address' => '127.0.0.1'
        ]);
        $updateLog->hash_value = hash('sha256', $updateLog->id . '|' . $updateLog->action . '|' . $updateLog->record_id);
        $updateLog->save();
        
        $updateLog2 = AuditLog::create([
            'user_id' => $staffGowa->id,
            'module' => 'damage_reports',
            'action' => 'create',
            'record_id' => $dr1->id,
            'old_data' => null,
            'new_data' => $dr1->toJson(),
            'ip_address' => '192.168.1.15'
        ]);
        $updateLog2->hash_value = hash('sha256', $updateLog2->id . '|' . $updateLog2->action . '|' . $updateLog2->record_id);
        $updateLog2->save();
    }
}
