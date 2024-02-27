"use client";

import { useRouter } from 'next/router';
import TabsComponent from '../../../components/Tabs';
import dynamic from "next/dynamic";
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

const QuestionnairePage = () => {
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const questId = Number(id);

    // const projectData = fetchProjectData(projectId); // This is a placeholder. You'll need to implement data fetching.
    const projectData = [
        { id: 1, name: 'Project 1', description: 'Description of Project 1', dateCreated: '2024-01-01', status: 'Active' },
        { id: 2, name: 'Project 2', description: 'Description of Project 2', dateCreated: '2024-02-01', status: 'Completed' },
        { id: 3, name: 'Project 3', description: 'Description of Project 3', dateCreated: '2024-02-01', status: 'Completed' },
    ];
    const project = projectData.find(project => project.id === questId)



    return (
        <>
            {project ? (
                <div className='p-5'>
                    <div className='absolute top-36 right-44 h-3/4 w-1/6  text-black flex flex-col items-center justify-start'>
                        <h1 className='mb-10 mt-4 text-md font-semibold'>Current score</h1>
                        <GaugeChart id="gauge-chart2"
                            nrOfLevels={20}
                            percent={0.86}
                            textColor='black'
                            animate={false}
                        />
                    </div>

                    <TabsComponent />
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
