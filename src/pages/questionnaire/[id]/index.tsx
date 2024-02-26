"use client";

import Head from 'next/head';
import { useRouter } from 'next/router';
import { Tabs } from 'flowbite';
import type { TabsOptions, TabsInterface, TabItem } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import TabsComponent from '../../../components/Tabs';

const QuestionnairePage = () => {
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const questId = Number(id);

    // const projectData = fetchProjectData(projectId); // This is a placeholder. You'll need to implement data fetching.
    const projectData = [
        { id: 1, name: 'Project 1', description: 'Description of Project 1', dateCreated: '2024-01-01', status: 'Active' },
        { id: 2, name: 'Project 2', description: 'Description of Project 2', dateCreated: '2024-02-01', status: 'Completed' },
    ];
    const project = projectData.find(project => project.id === questId)



    return (
        <>
            {project ? (
                <div className='p-5'>
                    <TabsComponent />

                    {/* <ol className="ml-80 mt-20 items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                        <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse text-sm">
                            <span className="flex items-center justify-center w-6 h-6 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                                1
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Basic info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                2
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Company info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                3
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Payment info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                4
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Payment info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                5
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Payment info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                6
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Payment info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                7
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Payment info</h3>
                            </span>
                        </li>
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                8
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Payment info</h3>
                            </span>
                        </li>
                    </ol> */}


                </div>
            ) : (
                <div>
                    <p>Loading or project not found...</p>
                </div>
            )}
        </>
    );
};

export default QuestionnairePage;
