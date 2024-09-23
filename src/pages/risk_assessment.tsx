import { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import Head from 'next/head';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply } from '../internal/client/index';
import { listReplies } from "../utils/questionnaire";

export default function RiskAssessment() {
    const [replies, setReplies] = useState<Array<TemplatebackendQuestionnaireReply>>([]);
    const router = useRouter();

    const loadReplies = async () => {
        const replies = await listReplies();

        if (!replies) {
            return;
        }

        if (replies.length === 0) {
            router.push('/questionnaire/new');
        }

        setReplies(replies);
    };

    useEffect(() => {
        try {
            loadReplies();
        } catch (error) {
            alert("Error listing the replies");
        }
    }, []);

    // const projects = [
    //     { id: 1, name: 'Project 1', dateCreated: '01.01.2024', lastModified: '18.02.2024', status: 'Finished' },
    //     { id: 2, name: 'Project 2', dateCreated: '05.12.2023', lastModified: '01.03.2024', status: 'In progress' },
    //     { id: 3, name: 'Project 3', dateCreated: '23.01.2024', lastModified: '31.01.2024', status: 'In progress' },
    //     // Add more projects as needed
    // ];

    const handleRowClick = (id: number) => {
        router.push(`/questionnaire/${id}`);
    };

    return (
        <>
            <Head>
                <title>Risk Assessment</title>
            </Head>
            <div className="flex flex-col p-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Risk Assessment</h1>
                    <div className="flex space-x-4">
                    <Link href='/questionnaire/new' passHref>
                            <button
                                onClick={() => router.push('/questionnaire/new')}
                                className="text-white bg-[#306278] hover:bg-[#255362] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                            >
                                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                New project
                            </button>
                            </Link>
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {replies?.map((reply) => (
                                <Table.Row key={reply.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRowClick(reply.id || 0)}>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {reply.projectName}
                                    </Table.Cell>
                                    <Table.Cell>Finished</Table.Cell>
                                    <Table.Cell><TimeAgo date={reply.createdAt || ''} /></Table.Cell>
                                    <Table.Cell>
                                        <a href="#" onClick={(e) => e.stopPropagation()}>
                                            <MdMoreHoriz size={20} />
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </>
    );
}
