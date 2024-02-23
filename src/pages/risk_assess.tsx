
import { Table } from 'flowbite-react';
import Head from 'next/head';
import SideMenu from '~/components/SideMenu';

export default function RiskAssess() {
    return (
        <div className='bg-white text-[#306278]'>
            <Head>
                <title>Risk assessment</title>
            </Head>
            <div className="flex min-h-screen">
                <SideMenu />

                <main className="ml-64 flex-1 flex flex-col items-center justify-center">

                    <div className="overflow-x-auto w-3/4 outline outline-offset-2 outline-gray-300 rounded">
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
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {'Project 1'}
                                    </Table.Cell>
                                    <Table.Cell>01.01.2024</Table.Cell>
                                    <Table.Cell>18.02.2024</Table.Cell>
                                    <Table.Cell>Finished</Table.Cell>
                                    <Table.Cell>
                                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                            Edit
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Project 2
                                    </Table.Cell>
                                    <Table.Cell>05.12.2023</Table.Cell>
                                    <Table.Cell>01.03.2024</Table.Cell>
                                    <Table.Cell>In progress</Table.Cell>
                                    <Table.Cell>
                                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                            Edit
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Project 3
                                    </Table.Cell>
                                    <Table.Cell>23.01.2024</Table.Cell>
                                    <Table.Cell>04.02.2024</Table.Cell>
                                    <Table.Cell>In progress</Table.Cell>
                                    <Table.Cell>
                                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                            Edit
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    </Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    </Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    </Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    </Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    </Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                </Table.Row>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    </Table.Cell>
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                    <Table.Cell />
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </main>
            </div>
        </div>
    );
}
