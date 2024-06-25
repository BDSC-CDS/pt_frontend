// src/pages/audit-logging.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function AuditLogging() {

    const auditLogs = [
        { id: 2, date: '14.02.2024', user: 'kobivkaj', action: 'added a new group' },
        { id: 1, date: '14.02.2024', user: 'samiperrin', action: 'added a new group' },
        { id: 3, date: '14.02.2024', user: 'palomacito', action: 'added a new group' },
    ];

    return (
        <>
            <Head>
                <title>Audit Log | My T3 App</title>
                <meta name="description" content="Audit logging page" />
            </Head>
            <div className="flex flex-col items-start p-5">
                <h1 className="text-4xl font-bold mb-5">Activity log</h1>
                <div className="mt-5 w-full max-w-4xl">
                    {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center mb-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xl font-bold">
                                {log.user.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-4">
                                <p className="text-lg font-semibold">{log.user}</p>
                                <p className="text-gray-600">{log.action} - {log.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex mt-5 space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">Load more</button>
                    <Link href="/" passHref>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded">Go back</button>
                    </Link>
                </div>
            </div>
        </>
    );
}
