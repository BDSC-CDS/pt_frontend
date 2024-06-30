
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import TimeAgo from 'react-timeago'
import { getQuestionnaire } from "../../../../utils/questionnaire"
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { TemplatebackendQuestionnaire } from '~/internal/client';
import { HiPencilAlt, HiCheck } from "react-icons/hi";
import Link from 'next/link';

export default function Questionnaire() {
    const router = useRouter();
    const { id } = router.query;
    const questionnaireId = Number(id);
    console.log("qid", questionnaireId);

    const [questionnaire, setQuestionnaire] = useState<TemplatebackendQuestionnaire>({});

    const loadQuestionnaire = async () => {
        const result = await getQuestionnaire(questionnaireId);
        
        if (!result) {
            return
        }
        
        setQuestionnaire(result);
    }

    useEffect(() => {
        if (!questionnaireId) {
            return
        }
        try {
            loadQuestionnaire();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, [id]);


    const handleRowClick = (vId: number) => {
        router.push(`/admin/questionnaire/${id}/version/${vId}`);
    };

    if (!questionnaire) {
        return (
            <div>
                <p>Questionnaire not found...</p>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{'Questionnaire ' + questionnaire.name}</title>
            </Head>
            <div className="flex flex-col items-end p-5">
                <Link href='/admin/new-questionnaire' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdOutlineAdd size={30} />
                    <p className='ml-2 text-sm'> New version</p>
                </Link>
            </div>
            <div className="flex flex-col">
                <Table >
                    <Table.Body className="divide-y">
                        <Table.Row >
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.Cell>{questionnaire.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.Cell><TimeAgo date={questionnaire.createdAt || ''} /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.HeadCell>Last modified</Table.HeadCell>
                            <Table.Cell><TimeAgo date={questionnaire.updatedAt || ''} /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.HeadCell>Versions</Table.HeadCell>
                            <Table.Cell className="p-0">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>Version</Table.HeadCell>
                                        <Table.HeadCell>Date created</Table.HeadCell>
                                        <Table.HeadCell>Published</Table.HeadCell>
                                        <Table.HeadCell></Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {(questionnaire.versions || []).map((version) => (
                                            <Table.Row key={version.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleRowClick(version.id || 0)}>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {version.version}
                                                </Table.Cell>
                                                <Table.Cell><TimeAgo date={version.createdAt || ''} /></Table.Cell>
                                                <Table.Cell>{version.published?(<HiCheck/>):(<></>)}</Table.Cell>
                                                <Table.Cell className="flex flex-col items-end">
                                                    <a href="#" onClick={(e) => e.stopPropagation()}>
                                                        <HiPencilAlt size={20} />
                                                    </a>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        </>
    );
}
