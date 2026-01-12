import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SettingsIndex({ auth, store }) {
    // Setup Form menggunakan useForm dari Inertia
    const { data, setData, post, processing, errors } = useForm({
        name: store?.name || '',
        address: store?.address || '',
        qris_image: null, // Wadah untuk file baru
        qris_raw_string: store?.qris_raw_string || '', // Data string mentah (penting!)
    });

    // Fungsi saat tombol Simpan ditekan
    const submit = (e) => {
        e.preventDefault();
        post(route('store.update')); // Kirim ke route store.update
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Toko</h2>}
        >
            <Head title="Pengaturan Toko" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {store ? (
                            <form onSubmit={submit} className="space-y-6">
                                {/* INPUT NAMA TOKO */}
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Nama Toko</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>

                                {/* INPUT ALAMAT */}
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Alamat</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* UPLOAD & PREVIEW QRIS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Kolom Upload */}
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Upload QRIS Baru</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('qris_image', e.target.files[0])}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">*Format: JPG/PNG, Max 2MB</p>
                                        {errors.qris_image && <div className="text-red-500 text-sm mt-1">{errors.qris_image}</div>}
                                    </div>

                                    {/* INPUT QRIS RAW STRING (MANUAL) */}
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 font-bold mb-2">QRIS Raw String (PENTING!)</label>
                                        <p className="text-xs text-gray-500 mb-2">
                                            Scan QRIS Shopee/Gopay asli kamu pakai Google Lens/Scanner, lalu copy text panjangnya kesini.
                                            Format biasanya: 000201010211...
                                        </p>
                                        <textarea
                                            value={data.qris_raw_string}
                                            onChange={(e) => setData('qris_raw_string', e.target.value)}
                                            rows="4"
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
                                            placeholder="Contoh: 00020101021126580011ID.CO.SHOPEE.WWW0118938000020000000000..."
                                        />
                                        {errors.qris_raw_string && <div className="text-red-500 text-sm mt-1">{errors.qris_raw_string}</div>}
                                    </div>

                                    {/* Kolom Preview Gambar Saat Ini */}
                                    <div>
                                        <p className="block text-gray-700 font-bold mb-2">QRIS Saat Ini:</p>
                                        {store.qris_static_image ? (
                                            <div className="border p-2 rounded w-fit">
                                                <img
                                                    src={`/storage/${store.qris_static_image}`}
                                                    alt="QRIS Toko"
                                                    className="w-40 h-40 object-cover rounded"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
                                                Belum ada gambar
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* TOMBOL SIMPAN */}
                                <div className="flex justify-end border-t pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center text-red-500">
                                Data toko tidak ditemukan. Silakan hubungi admin.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}