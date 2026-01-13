import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ActivityLogs({ auth, logs, users, actionTypes, filters }) {
    const [actionType, setActionType] = useState(filters.action_type || '');
    const [userId, setUserId] = useState(filters.user_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const handleFilter = () => {
        router.get(route('activity-logs.index'), {
            action_type: actionType,
            user_id: userId,
            start_date: startDate,
            end_date: endDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleReset = () => {
        setActionType('');
        setUserId('');
        setStartDate('');
        setEndDate('');
        router.get(route('activity-logs.index'));
    };

    const getActionBadge = (action) => {
        const badges = {
            'login': 'bg-green-100 text-green-800',
            'logout': 'bg-gray-100 text-gray-800',
            'transaction': 'bg-blue-100 text-blue-800',
            'product_create': 'bg-purple-100 text-purple-800',
            'product_update': 'bg-yellow-100 text-yellow-800',
            'product_delete': 'bg-red-100 text-red-800',
            'employee_create': 'bg-indigo-100 text-indigo-800',
            'employee_delete': 'bg-pink-100 text-pink-800',
        };
        return badges[action] || 'bg-gray-100 text-gray-800';
    };

    const getActionIcon = (action) => {
        const icons = {
            'login': '🔓',
            'logout': '🔒',
            'transaction': '💰',
            'product_create': '➕',
            'product_update': '✏️',
            'product_delete': '🗑️',
            'employee_create': '👤➕',
            'employee_delete': '👤🗑️',
        };
        return icons[action] || '📝';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">📋 Log Aktivitas Karyawan</h2>}
        >
            <Head title="Log Aktivitas" />

            <div className="py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6"
                >
                    {/* Filter Section */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Log</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Action Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Aktivitas</label>
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Semua</option>
                                    {Object.entries(actionTypes).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* User Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Karyawan</label>
                                <select
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Semua</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleFilter}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Terapkan Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </motion.div>

                    {/* Logs Table */}
                    <motion.div variants={itemVariants} className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4">Waktu</th>
                                        <th className="px-6 py-4">Karyawan</th>
                                        <th className="px-6 py-4">Aktivitas</th>
                                        <th className="px-6 py-4">Deskripsi</th>
                                        <th className="px-6 py-4">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.length > 0 ? (
                                        logs.data.map((log) => (
                                            <motion.tr
                                                key={log.id}
                                                variants={itemVariants}
                                                className="bg-white border-b hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(log.created_at).toLocaleTimeString('id-ID')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                                                            {log.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{log.user?.name}</div>
                                                            <div className="text-xs text-gray-500 capitalize">{log.user?.role}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getActionBadge(log.action_type)}`}>
                                                        <span>{getActionIcon(log.action_type)}</span>
                                                        {actionTypes[log.action_type] || log.action_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-900">{log.description}</div>
                                                    {log.metadata && (
                                                        <details className="mt-1">
                                                            <summary className="text-xs text-indigo-600 cursor-pointer hover:underline">Detail</summary>
                                                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                                                                {JSON.stringify(log.metadata, null, 2)}
                                                            </pre>
                                                        </details>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {log.ip_address || '-'}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <div className="text-4xl mb-2">📭</div>
                                                <div>Belum ada log aktivitas</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {logs.data.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Menampilkan <span className="font-bold">{logs.from}</span> - <span className="font-bold">{logs.to}</span> dari <span className="font-bold">{logs.total}</span> log
                                </div>
                                <div className="flex gap-2">
                                    {logs.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded ${link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
