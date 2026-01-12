import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ProductIndex({ auth, products }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form State
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        stock: '',
        category: 'Coffee', // Default
        image: null,
        _method: 'POST' // Trick untuk update file di Laravel (method spoofing)
    });

    // Buka Modal Tambah
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        reset();
        clearErrors();
        setData('_method', 'POST'); // Pastikan method POST biasa
        setIsModalOpen(true);
    };

    // Buka Modal Edit
    const openEditModal = (product) => {
        setIsEditMode(true);
        setEditId(product.id);
        clearErrors();
        setData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: null, // Reset input file
            _method: 'PUT' // Penting untuk Update pakai FormData
        });
        setIsModalOpen(true);
    };

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            // Logic Update
            // PENTING: Pakai route POST tapi dengan _method: PUT di data, dan forceFormData: true
            post(route('products.update', editId), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire('Sukses', 'Produk berhasil diupdate', 'success');
                }
            });
        } else {
            // Logic Create
            post(route('products.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    Swal.fire('Sukses', 'Produk baru ditambahkan', 'success');
                }
            });
        }
    };

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Yakin hapus?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('products.destroy', id), {
                    onSuccess: () => Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success')
                });
            }
        });
    };

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Produk</h2>}
        >
            <Head title="Produk" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* Tombol Tambah */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-700">Daftar Menu</h3>
                            <button
                                onClick={openCreateModal}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold hover:bg-indigo-700 flex items-center"
                            >
                                + Tambah Produk
                            </button>
                        </div>

                        {/* Tabel Produk */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Gambar</th>
                                        <th className="px-4 py-3">Nama Produk</th>
                                        <th className="px-4 py-3">Kategori</th>
                                        <th className="px-4 py-3">Harga</th>
                                        <th className="px-4 py-3 text-center">Stok</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? products.map((product) => (
                                        <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {product.image ? (
                                                    <img src={`/storage/${product.image}`} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">No img</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{product.category}</span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-green-600">{formatRupiah(product.price)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">Belum ada produk. Silakan tambah baru.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- MODAL FORM (Create & Edit) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in-down">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{isEditMode ? 'Edit Produk' : 'Tambah Menu Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Nama */}
                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Nama Produk</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Contoh: Kopi Susu Aren"
                                />
                                {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {/* Harga */}
                                <div>
                                    <label className="block text-sm font-bold mb-1">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-md"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        placeholder="15000"
                                    />
                                    {errors.price && <div className="text-red-500 text-xs">{errors.price}</div>}
                                </div>
                                {/* Stok */}
                                <div>
                                    <label className="block text-sm font-bold mb-1">Stok Awal</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-md"
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            {/* Kategori */}
                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-1">Kategori</label>
                                <select
                                    className="w-full border-gray-300 rounded-md"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                >
                                    <option value="Coffee">Coffee</option>
                                    <option value="Non-Coffee">Non-Coffee</option>
                                    <option value="Pastry">Pastry/Snack</option>
                                    <option value="Main Course">Makanan Berat</option>
                                </select>
                            </div>

                            {/* Upload Gambar */}
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-1">Foto Produk</label>
                                <input
                                    type="file"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={e => setData('image', e.target.files[0])}
                                />
                                <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengganti gambar.</p>
                                {errors.image && <div className="text-red-500 text-xs">{errors.image}</div>}
                            </div>

                            {/* Tombol Simpan */}
                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-md font-bold text-gray-700 hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 rounded-md font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}