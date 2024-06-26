
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '~/utils/authContext';
import { Table } from 'flowbite-react';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import Link from 'next/link';

export default function QuestionnaireVersion() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { id, vId } = router.query; // Get the dynamic part of the URL
    const questionnaireId = Number(id);

    const questionnaires = [
        { 
            id: 1, 
            name: 'Use case assesment and risk evaluation', 
            dateCreated: '01.01.2024', 
            lastModified: '18.02.2024', 
            lastVersion: 'v1.4.0',
            versions: [{
                id: 1,
                name: "v1.4.0",
                dateCreated: '18.02.2024',
            }, {
                id: 2,
                name: "v1.3.1",
                dateCreated: '18.02.2024', 
            }, {
                id: 3,
                name: "v1.3.0",
                dateCreated: '18.02.2024',
            }] 
        },
    ];

    const questionnaire = questionnaires[questionnaireId-1];

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
                <title>Questionnaire {questionnaire.name}</title>
            </Head>
            <div className="flex flex-row p-5 mt-6">
                <h1 className="flex text-2xl font-bold">Questionnaire version</h1>
                <Link href='/admin/new-questionnaire' passHref className="ml-auto flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
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
                                <Table.Cell>{questionnaire.dateCreated}</Table.Cell>
                            </Table.Row>
                            <Table.Row >
                                <Table.HeadCell>Last modified</Table.HeadCell>
                                <Table.Cell>{questionnaire.lastModified}</Table.Cell>
                            </Table.Row>
                            <Table.Row >
                                <Table.HeadCell>Last version</Table.HeadCell>
                                <Table.Cell>{questionnaire.lastVersion}</Table.Cell>
                            </Table.Row>
                            <Table.Row >
                                <Table.HeadCell>Versions</Table.HeadCell>
                                <Table.Cell className="p-0">
                                    <Table hoverable>
                                        <Table.Head>
                                            <Table.HeadCell>Version</Table.HeadCell>
                                            <Table.HeadCell>Date created</Table.HeadCell>
                                            <Table.HeadCell></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            {questionnaire.versions.map((version) => (
                                                <Table.Row key={version.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleRowClick(version.id)}>
                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        {version.name}
                                                    </Table.Cell>
                                                    <Table.Cell>{version.dateCreated}</Table.Cell>
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

                {/* <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Version</Table.HeadCell>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell></Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {questionnaire.versions.map((version) => (
                                <Table.Row key={version.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRowClick(version.id)}>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {version.name}
                                    </Table.Cell>
                                    <Table.Cell>{version.dateCreated}</Table.Cell>
                                    <Table.Cell className="flex flex-col items-end">
                                        <a href="#" onClick={(e) => e.stopPropagation()}>
                                            <HiPencilAlt size={20} />
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div> */}
            </div>
        </>
    );
}
