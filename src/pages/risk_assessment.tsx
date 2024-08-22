
import { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import Head from 'next/head';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import Link from 'next/link';
import TimeAgo from 'react-timeago'
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply } from '../internal/client/index';
import { listReplies } from "../utils/questionnaire"

export default function RiskAssessment() {
    const [replies, setReplies] = useState<Array<TemplatebackendQuestionnaireReply>>();

    const router = useRouter();

    const loadReplies = async () => {
        const replies = await listReplies()

        if (!replies) {
            return
        }

        if (replies.length == 0) {
            router.push('/questionnaire/new');
        }

        console.log("reeeplies", replies);


        setReplies(replies);
    }

    useEffect(() => {
        try {
            loadReplies();
        } catch (error) {
            alert("Error listing the replies")
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
                <title>Risk assessment</title>
            </Head>
            <div className="flex flex-col items-end p-5">
                <Link href='/questionnaire/new' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdOutlineAdd size={30} />
                    <p className='ml-2 text-sm'> New project</p>
                </Link>
                <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Project name</Table.HeadCell>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>Last modified</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
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
                                    <Table.Cell><TimeAgo date={reply.createdAt || ''} /></Table.Cell>
                                    <Table.Cell><TimeAgo date={reply.updatedAt || ''} /></Table.Cell>
                                    <Table.Cell>{(reply.replies?.length || 0 + 1)} question(s) answered</Table.Cell>
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
