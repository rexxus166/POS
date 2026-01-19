import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon, PencilIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { AddMaterialModal, EditMaterialModal, RestockModal } from '@/Components/RawMaterialModals';

export default function Index({ auth, rawMaterials, stats, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [showLowStock, setShowLowStock] = useState(filters.low_stock === 'true');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('raw-materials.index'), {
            search,
            category: selectedCategory,
            low_stock: showLowStock ? 'true' : 'false'
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Handle Filter Change
    const handleFilterChange = () => {
        router.get(route('raw-materials.index'), {
            search,
            category: selectedCategory,
            low_stock: showLowStock ? 'true' : 'false'
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Reset Filters
    const resetFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setShowLowStock(false);
        router.get(route('raw-materials.index'));
    };

    // Delete Material
    const handleDelete = (material) => {
        Swal.fire({
            title: 'Hapus Bahan Mentah?',
            text: `Apakah Anda yakin ingin menghapus "${material.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('raw-materials.destroy', material.id), {
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Bahan mentah berhasil dihapus.', 'success');
                    },
                    onError: (errors) => {
                        Swal.fire('Gagal!', errors.message || 'Terjadi kesalahan.', 'error');
                    }
                });
            }
        });
    };

    // Stock Status Badge
    const getStatusBadge = (material) => {
        const status = material.stock > material.min_stock * 1.5 ? 'safe' :
            material.stock > material.min_stock ? 'warning' : 'low';

        const colors = {
            safe: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            low: 'bg-red-100 text-red-800'
        };

        const labels = {
            safe: '🟢 Aman',
            warning: '🟡 Perhatian',
            low: '🔴 Menipis'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
                {labels[status]}
            </span>
        );
    };

    // Format Currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Bahan Mentah
                </h2>
            }
        >
            <Head title="Manajemen Bahan Mentah" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <ChartBarIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Bahan</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_items}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Stok Menipis</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.low_stock_count}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Nilai Stok</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_value)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama, SKU, atau supplier..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </form>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setTimeout(handleFilterChange, 100);
                                }}
                                className="block w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Low Stock Filter */}
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showLowStock}
                                    onChange={(e) => {
                                        setShowLowStock(e.target.checked);
                                        setTimeout(handleFilterChange, 100);
                                    }}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="text-sm text-gray-700">Stok Menipis</span>
                            </label>

                            {/* Reset Button */}
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:border-gray-300 focus:ring ring-gray-200 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                <ArrowPathIcon className="h-4 w-4 mr-1" />
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Table Section with Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Section Header with Button */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Daftar Bahan</h3>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Tambah Bahan
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bahan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stok
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Harga/Unit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Supplier
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rawMaterials.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <p className="text-lg font-medium">Belum ada bahan mentah</p>
                                                    <p className="text-sm mt-1">Klik tombol "Tambah Bahan" untuk memulai</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        rawMaterials.data.map((material) => (
                                            <tr key={material.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {material.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {material.category}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {material.sku || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {material.stock} {material.unit}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Min: {material.min_stock} {material.unit}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(material.cost_per_unit)}/{material.unit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(material)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {material.supplier || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMaterial(material);
                                                                setShowRestockModal(true);
                                                            }}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Restock"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMaterial(material);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(material)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Hapus"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {rawMaterials.links && rawMaterials.links.length > 3 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{rawMaterials.from || 0}</span> sampai{' '}
                                        <span className="font-medium">{rawMaterials.to || 0}</span> dari{' '}
                                        <span className="font-medium">{rawMaterials.total}</span> hasil
                                    </div>
                                    <div className="flex gap-2">
                                        {rawMaterials.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-1 text-sm rounded ${link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals will be added here */}
            {showAddModal && <AddMaterialModal onClose={() => setShowAddModal(false)} />}
            {showEditModal && selectedMaterial && (
                <EditMaterialModal
                    material={selectedMaterial}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedMaterial(null);
                    }}
                />
            )}
            {showRestockModal && selectedMaterial && (
                <RestockModal
                    material={selectedMaterial}
                    onClose={() => {
                        setShowRestockModal(false);
                        setSelectedMaterial(null);
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
}
