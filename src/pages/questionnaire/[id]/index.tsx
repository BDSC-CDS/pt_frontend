"use client";

import Head from 'next/head';
import { useRouter } from 'next/router';

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
        <div className='bg-white text-[#306278]'>
            <div className="flex min-h-screen">
                <main className="ml-64 flex-1 flex flex-col items-center justify-center">
                    {project ? (
                        <p>Project name: {project.name}</p>
                    ) : (
                        <div>
                            <p>Loading or project not found...</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default QuestionnairePage;
