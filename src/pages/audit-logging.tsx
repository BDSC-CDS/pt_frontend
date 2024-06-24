// src/pages/audit-logging.tsx
import { Table } from 'flowbite-react';
import Head from 'next/head';

export default function AuditLogging() {

    const auditLogs = [
        { id: 2, date: '24/06/2024 6:30 PM', user: 'Test 1', action: 'Logged Out', status: 'Success' },
        { id: 1, date: '24/06/2024 6:00 PM', user: 'Test 1', action: 'Logged In', status: 'Success' },
    ];

    return (
        <>
            <Head>
                <title>Audit Log | My T3 App</title>
                <meta name="description" content="Audit logging page" />
            </Head>
            <div className="flex flex-col items-center p-5">
                <h1 className="text-4xl font-bold">Audit Logging Service</h1>
                <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Date</Table.HeadCell>
                            <Table.HeadCell>User</Table.HeadCell>
                            <Table.HeadCell>Action</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {auditLogs.map((log) => (
                                <Table.Row key={log.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {log.date}
                                    </Table.Cell>
                                    <Table.Cell>{log.user}</Table.Cell>
                                    <Table.Cell>{log.action}</Table.Cell>
                                    <Table.Cell>{log.status}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </>
    );
}
