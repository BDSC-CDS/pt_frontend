import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listAuditLogs, getAuditLogDetails, storeAuditLog } from '../utils/auditlog';
import { TemplatebackendAuditLog } from '../internal/client';
import { useAuth } from '~/utils/authContext';
import { Button, Modal } from 'flowbite-react';

export default function AuditLogging() {
    const [auditLogsList, setAuditLogsList] = useState<Array<TemplatebackendAuditLog>>([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [logDetails, setLogDetails] = useState('');
    const { isLoggedIn } = useAuth();

    const getListAuditLogs = async (offset?: number, limit?: number) => {
        try {
            const response = await listAuditLogs(offset, limit);
            if (response?.logs) {
                setAuditLogsList(response.logs);
            }
        } catch (error) {
            alert("Error listing the audit logs");
        }
    };

    useEffect(() => {
        getListAuditLogs();
    }, []);

    const handleLogClick = async (id: number | undefined) => {
        if (id) {
            try {
                const response = await getAuditLogDetails(id);
                if (response) {
                    setLogDetails(JSON.stringify(response, null, 2));
                    setIsDetailModalOpen(true);
                }
            } catch (error) {
                alert("Error getting audit log details");
            }
        }
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
    };

    const router = useRouter();

    const getInitials = (name: string) => {
        const initials = name.split(' ').map(part => part[0].toUpperCase()).join('');
        return initials;
    };

    return (
        <>
            <Head>
                <title>Audit Log | My T3 App</title>
                <meta name="description" content="Audit logging page" />
            </Head>
            {!isLoggedIn && <p className='m-8'>Please log in to view the audit logs.</p>}
            {isLoggedIn && (
                <div className="flex flex-col items-start p-5">
                    <h1 className="text-4xl font-bold mb-5">Activity log</h1>
                    <div className="mt-5 w-full max-w-4xl">
                        {auditLogsList.map((log) => (
                            <div key={log.id} className="flex items-center mb-4" onClick={() => handleLogClick(log.id)}>
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xl font-bold">
                                    {getInitials(log.userid || 'User')}
                                </div>
                                <div className="ml-4">
                                    <p className="text-lg font-semibold">{log.userid}</p>
                                    <p className="text-gray-600">{log.action} - {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : 'Date not available'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex mt-5 space-x-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => getListAuditLogs()}>Load more</button>
                        <Link href="/" passHref>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded">Go back</button>
                        </Link>
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
