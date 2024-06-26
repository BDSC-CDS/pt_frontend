
import Head from 'next/head';
import TimeAgo from 'react-timeago'
import { useRouter } from 'next/router';
import { Table } from 'flowbite-react';
import { listQuestionnaires } from "../../utils/questionnaire"
import { useEffect, useState } from 'react';
import { TemplatebackendQuestionnaire } from '~/internal/client';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import Link from 'next/link';

export default function Questionnaire() {
    const router = useRouter();

    const [questionnaires, setQuestionnaires] = useState<Array<TemplatebackendQuestionnaire>>([]);

    const getlistQuestionnaires = async (offset?: number, limit?: number) => {
        let result;
        if (!offset && !limit) {
            result = await listQuestionnaires();
        } else if (offset && limit) {
            result = await listQuestionnaires(
            );
        } else {
            console.log("ERROR You have to define both the offset and the limit") // TODO
            return;
        }
        if (result) {
            console.log(result)
            setQuestionnaires(result);
        }
    }

    useEffect(() => {
        try {
            getlistQuestionnaires();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);

    const handleRowClick = (id: number) => {
        router.push(`/admin/questionnaire/${id}`);
    };

    return (
        <>
            <Head>
                <title>Questionnaires</title>
            </Head>
            <div className="flex flex-col items-end p-5">
                <Link href='/admin/new-questionnaire' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdOutlineAdd size={30} />
                    <p className='ml-2 text-sm'> New questionnaire</p>
                </Link>
                <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Questionnaire name</Table.HeadCell>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>Last modified</Table.HeadCell>
                            <Table.HeadCell>Last version</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {questionnaires.map((questionnaire) => (
                                <Table.Row key={questionnaire.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRowClick(questionnaire.id || 0)}>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {questionnaire.name}
                                    </Table.Cell>
                                    <Table.Cell><TimeAgo date={questionnaire.createdAt || ''} /></Table.Cell>
                                    <Table.Cell><TimeAgo date={questionnaire.updatedAt || ''} /></Table.Cell>
                                    <Table.Cell>{questionnaire.lastVersion}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </>
    );
}
