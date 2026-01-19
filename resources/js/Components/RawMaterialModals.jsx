import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

// ============================================
// 1. ADD MATERIAL MODAL
// ============================================
export function AddMaterialModal({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        sku: '',
        stock: '',
        unit: 'gram',
        cost_per_unit: '',
        min_stock: '',
        category: 'Bahan Baku',
        supplier: '',
        notes: ''
    });

    const units = ['gram', 'kg', 'ml', 'liter', 'pcs', 'unit', 'box', 'pack'];
    const categories = ['Bahan Baku', 'Bahan Pendukung', 'Bumbu', 'Kemasan', 'Lainnya'];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('raw-materials.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Tambah Bahan Mentah
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama Bahan */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="name" value="Nama Bahan *" />
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Contoh: Kopi Arabica, Susu UHT, dll"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* SKU */}
                    <div>
                        <InputLabel htmlFor="sku" value="SKU / Kode Bahan" />
                        <TextInput
                            id="sku"
                            type="text"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="RM-001"
                        />
                        <InputError message={errors.sku} className="mt-2" />
                    </div>

                    {/* Kategori */}
                    <div>
                        <InputLabel htmlFor="category" value="Kategori *" />
                        <select
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <InputError message={errors.category} className="mt-2" />
                    </div>

                    {/* Stok Awal */}
                    <div>
                        <InputLabel htmlFor="stock" value="Stok Awal *" />
                        <TextInput
                            id="stock"
                            type="number"
                            step="0.01"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="0"
                            required
                        />
                        <InputError message={errors.stock} className="mt-2" />
                    </div>

                    {/* Satuan */}
                    <div>
                        <InputLabel htmlFor="unit" value="Satuan *" />
                        <select
                            id="unit"
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            {units.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <InputError message={errors.unit} className="mt-2" />
                    </div>

                    {/* Harga per Unit */}
                    <div>
                        <InputLabel htmlFor="cost_per_unit" value="Harga per Unit *" />
                        <TextInput
                            id="cost_per_unit"
                            type="number"
                            step="0.01"
                            value={data.cost_per_unit}
                            onChange={(e) => setData('cost_per_unit', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="0"
                            required
                        />
                        <InputError message={errors.cost_per_unit} className="mt-2" />
                    </div>

                    {/* Min Stok */}
                    <div>
                        <InputLabel htmlFor="min_stock" value="Minimum Stok (Alert) *" />
                        <TextInput
                            id="min_stock"
                            type="number"
                            step="0.01"
                            value={data.min_stock}
                            onChange={(e) => setData('min_stock', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="0"
                            required
                        />
                        <InputError message={errors.min_stock} className="mt-2" />
                    </div>

                    {/* Supplier */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="supplier" value="Supplier" />
                        <TextInput
                            id="supplier"
                            type="text"
                            value={data.supplier}
                            onChange={(e) => setData('supplier', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Nama supplier"
                        />
                        <InputError message={errors.supplier} className="mt-2" />
                    </div>

                    {/* Catatan */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="notes" value="Catatan" />
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="3"
                            placeholder="Catatan tambahan..."
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

// ============================================
// 2. EDIT MATERIAL MODAL
// ============================================
export function EditMaterialModal({ material, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name: material.name || '',
        sku: material.sku || '',
        unit: material.unit || 'gram',
        cost_per_unit: material.cost_per_unit || '',
        min_stock: material.min_stock || '',
        category: material.category || 'Bahan Baku',
        supplier: material.supplier || '',
        notes: material.notes || ''
    });

    const units = ['gram', 'kg', 'ml', 'liter', 'pcs', 'unit', 'box', 'pack'];
    const categories = ['Bahan Baku', 'Bahan Pendukung', 'Bumbu', 'Kemasan', 'Lainnya'];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('raw-materials.update', material.id), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Edit Bahan Mentah
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama Bahan */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="name" value="Nama Bahan *" />
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* SKU */}
                    <div>
                        <InputLabel htmlFor="sku" value="SKU / Kode Bahan" />
                        <TextInput
                            id="sku"
                            type="text"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.sku} className="mt-2" />
                    </div>

                    {/* Kategori */}
                    <div>
                        <InputLabel htmlFor="category" value="Kategori *" />
                        <select
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <InputError message={errors.category} className="mt-2" />
                    </div>

                    {/* Satuan */}
                    <div>
                        <InputLabel htmlFor="unit" value="Satuan *" />
                        <select
                            id="unit"
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            {units.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <InputError message={errors.unit} className="mt-2" />
                    </div>

                    {/* Harga per Unit */}
                    <div>
                        <InputLabel htmlFor="cost_per_unit" value="Harga per Unit *" />
                        <TextInput
                            id="cost_per_unit"
                            type="number"
                            step="0.01"
                            value={data.cost_per_unit}
                            onChange={(e) => setData('cost_per_unit', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.cost_per_unit} className="mt-2" />
                    </div>

                    {/* Min Stok */}
                    <div>
                        <InputLabel htmlFor="min_stock" value="Minimum Stok (Alert) *" />
                        <TextInput
                            id="min_stock"
                            type="number"
                            step="0.01"
                            value={data.min_stock}
                            onChange={(e) => setData('min_stock', e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.min_stock} className="mt-2" />
                    </div>

                    {/* Supplier */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="supplier" value="Supplier" />
                        <TextInput
                            id="supplier"
                            type="text"
                            value={data.supplier}
                            onChange={(e) => setData('supplier', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.supplier} className="mt-2" />
                    </div>

                    {/* Catatan */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="notes" value="Catatan" />
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="3"
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    {/* Info Stok (Read-only) */}
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600">
                            <strong>Stok Saat Ini:</strong> {material.stock} {material.unit}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Untuk mengubah stok, gunakan tombol "Restock" atau "Adjust" di halaman utama
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

// ============================================
// 3. RESTOCK MODAL
// ============================================
export function RestockModal({ material, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('raw-materials.restock', material.id), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Restock Bahan Mentah
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                    <h3 className="font-semibold text-blue-900">{material.name}</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Stok Saat Ini: <strong>{material.stock} {material.unit}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        Minimum Stok: {material.min_stock} {material.unit}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Jumlah Tambahan */}
                    <div>
                        <InputLabel htmlFor="quantity" value={`Jumlah Tambahan (${material.unit}) *`} />
                        <TextInput
                            id="quantity"
                            type="number"
                            step="0.01"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="0"
                            required
                            autoFocus
                        />
                        <InputError message={errors.quantity} className="mt-2" />

                        {data.quantity && (
                            <p className="mt-2 text-sm text-green-600">
                                Stok setelah restock: <strong>{(parseFloat(material.stock) + parseFloat(data.quantity)).toFixed(2)} {material.unit}</strong>
                            </p>
                        )}
                    </div>

                    {/* Catatan */}
                    <div>
                        <InputLabel htmlFor="notes" value="Catatan" />
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="3"
                            placeholder="Contoh: Pembelian dari Supplier X, Invoice #123"
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Restock'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
