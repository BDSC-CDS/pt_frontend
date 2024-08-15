import TimeAgo from 'react-timeago';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listAuditLogs } from '../utils/auditlog';
import { TemplatebackendAuditLog, TemplatebackendUser } from '../internal/client';
import { useAuth } from '~/utils/authContext';
import { Button, Modal, Tooltip } from 'flowbite-react';
import { BiSolidMask } from "react-icons/bi";

export default function AuditLogging() {
    const [originalAuditLogsList, setOriginalAuditLogsList] = useState<Array<TemplatebackendAuditLog>>([]);
    const [filteredAuditLogsList, setFilteredAuditLogsList] = useState<Array<TemplatebackendAuditLog>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(20);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [logDetails, setLogDetails] = useState('');
    const { isLoggedIn } = useAuth();
    const [filters, setFilters] = useState<{ userId?: string; action?: string; createdAtFrom?: string; createdAtTo?: string; service?: string; body?: string; response?: string; error?: string }>({});

    const getListAuditLogs = async (offset?: number, limit?: number) => {
        try {
            const response = await listAuditLogs(offset, limit);
            if (response?.logs) {
                const sortedLogs = response.logs.filter(l => l.createdAt).sort((a, b) => (b?.createdAt?.getTime() || 0) - (a?.createdAt?.getTime() || 0));
                setOriginalAuditLogsList(sortedLogs);
                setFilteredAuditLogsList(sortedLogs);
            }
        } catch (error) {
            console.error("Error listing the audit logs:", error);
            alert("Error listing the audit logs");
        }
    };

    useEffect(() => {
        getListAuditLogs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, currentPage]);

    const applyFilters = () => {
        let filteredLogs = [...originalAuditLogsList];

        if (filters.userId) {
            filteredLogs = filteredLogs.filter(log =>
                `${log.user?.firstName} ${log.user?.lastName}`.toLowerCase().includes(filters.userId!.toLowerCase())
            );
        }
        if (filters.action) {
            filteredLogs = filteredLogs.filter(log =>
                log.action?.toLowerCase().includes(filters.action!.toLowerCase())
            );
        }
        if (filters.createdAtFrom) {
            filteredLogs = filteredLogs.filter(log =>
                log?.createdAt || new Date() >= new Date(filters.createdAtFrom!)
            );
        }
        if (filters.createdAtTo) {
            filteredLogs = filteredLogs.filter(log =>
                log?.createdAt || new Date() <= new Date(filters.createdAtTo!)
            );
        }
        if (filters.service) {
            filteredLogs = filteredLogs.filter(log =>
                log.service?.toLowerCase().includes(filters.service!.toLowerCase())
            );
        }
        if (filters.body) {
            filteredLogs = filteredLogs.filter(log =>
                log.body?.toLowerCase().includes(filters.body!.toLowerCase())
            );
        }
        if (filters.response) {
            filteredLogs = filteredLogs.filter(log =>
                log.response?.toLowerCase().includes(filters.response!.toLowerCase())
            );
        }
        if (filters.error) {
            filteredLogs = filteredLogs.filter(log =>
                // log.error?.toLowerCase().includes(filters.error!.toLowerCase())
                log.error
            );
        }

        setFilteredAuditLogsList(filteredLogs);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, filterType: string) => {
        const value = e.target.value || undefined;
        setFilters({ ...filters, [filterType]: value });
    };

    const handleLogClick = (log: TemplatebackendAuditLog | undefined) => {
        if (!log) {
            return;
        }
        setLogDetails(JSON.stringify(log, null, 2));
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
    };

    const getInitials = (user: TemplatebackendUser | undefined) => {
        if (!user || user.id === undefined) {
            return <BiSolidMask />;
        }
        const first = (user.firstName || " ")[0]?.toUpperCase() || "";
        const last = (user.lastName || " ")[0]?.toUpperCase() || "";
        const initials = first + last;
        return initials;
    };

    const getUserTooltip = (user: TemplatebackendUser | undefined) => {
        if (!user || user.id === undefined) {
            return <>Anonymous user</>;
        }

        return (
            <>
                {user.firstName} {user.lastName}<br />
                {user.username}
            </>
        );
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentLogs = filteredAuditLogsList.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredAuditLogsList.length / rowsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Head>
                <title>Audit Log</title>
                <meta name="description" content="Audit logging page" />
            </Head>
            {!isLoggedIn && <p className='m-8'>Please log in to view the audit logs.</p>}
            {isLoggedIn && (
                <div className="flex flex-col items-start p-5 w-full">
                    <h1 className="text-4xl font-bold mb-5">Audit Logs</h1>
                    <div className="w-full mb-4 flex flex-wrap space-y-4">
                        <div className="flex space-x-2 w-full">
                            <input
                                type="text"
                                placeholder="Filter by user"
                                onChange={(e) => handleFilterChange(e, 'userId')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Filter by action"
                                onChange={(e) => handleFilterChange(e, 'action')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="date"
                                onChange={(e) => handleFilterChange(e, 'createdAtFrom')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="date"
                                onChange={(e) => handleFilterChange(e, 'createdAtTo')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex space-x-2 w-full">
                            <input
                                type="text"
                                placeholder="Filter by service"
                                onChange={(e) => handleFilterChange(e, 'service')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Filter by body"
                                onChange={(e) => handleFilterChange(e, 'body')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Filter by response"
                                onChange={(e) => handleFilterChange(e, 'response')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Filter by error"
                                onChange={(e) => handleFilterChange(e, 'error')}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">User</th>
                                    <th className="px-4 py-2 border">Action</th>
                                    <th className="px-4 py-2 border">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLogs.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-2 border text-center" colSpan={3}>No logs found</td>
                                    </tr>
                                ) : (
                                    currentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleLogClick(log)}>
                                            <td className="px-4 py-2 border">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xl font-bold">
                                                        <Tooltip content={getUserTooltip(log.user)}>
                                                            {getInitials(log.user)}
                                                        </Tooltip>
                                                    </div>
                                                    <div className="ml-3">
                                                        {log.user?.firstName} {log.user?.lastName}<br />
                                                        <span className="text-sm text-gray-500">{log.user?.roles}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border">{log.action}</td>
                                            <td className="px-4 py-2 border">
                                                {formatDate(log.createdAt || new Date())}
                                                {/* <TimeAgo date={log.createdAt || ''} /> */}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex mt-5 justify-center items-center space-x-2">
                        <button
                            onClick={() => paginate(1)}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                            disabled={currentPage === 1}
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                            disabled={currentPage === 1}
                        >
                            {'<'}
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                            disabled={currentPage === totalPages}
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => paginate(totalPages)}
                            className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200'}`}
                            disabled={currentPage === totalPages}
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            )}
            <Modal show={isDetailModalOpen} onClose={() => closeDetailModal()}>
                <Modal.Header>Log Details</Modal.Header>
                <Modal.Body>
                    <pre>{logDetails}</pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => closeDetailModal()}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
