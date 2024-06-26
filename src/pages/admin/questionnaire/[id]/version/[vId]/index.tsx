
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import TimeAgo from 'react-timeago'
import { getQuestionnaire } from "../../../../../../utils/questionnaire"
import { MdSave } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import { TemplatebackendQuestionnaire, TemplatebackendQuestionnaireVersion, TemplatebackendQuestionnaireQuestion } from '~/internal/client';
import Link from 'next/link';

export default function Questionnaire() {
    const router = useRouter();
    const { id, vId } = router.query;
    const questionnaireId = Number(id);
    const versionId = Number(vId);

    const [questionnaire, setQuestionnaire] = useState<TemplatebackendQuestionnaire>({});
    const [version, setVersion] = useState<TemplatebackendQuestionnaireVersion>({});
    type Tabs = {
        tabName: string;
        questions: TemplatebackendQuestionnaireQuestion[];
    }[];
    const [tabs, setTabs] = useState<Tabs>([]);
    const [activeTab, setActiveTab] = useState<number>(0);

    const loadQuestionnaire = async () => {
        const result = await getQuestionnaire(questionnaireId);
        
        if (!result) {
            return
        }

        setQuestionnaire(result);
        const v = (result.versions || []).find(v => v.id == versionId);
        if (!v) {
            return
        }
        setVersion(v);

        const tsMap: {
            [key: string]: TemplatebackendQuestionnaireQuestion[];
          } = {};
        for (let question of v.questions || []){
            if (!question.tab) {
                continue
            }

            if (!tsMap[question.tab]){
                tsMap[question.tab] = [];
            }

            tsMap[question.tab]?.push(question);
        }
        console.log("tabs", Object.keys(tsMap))
        const ts: Tabs = [];
        for (let tabName of Object.keys(tsMap)) {
            ts.push({
                tabName,
                questions: tsMap[tabName] || [],
            })
        }
        setTabs(ts);
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
                <title>Questionnaire {questionnaire.name}</title>
            </Head>
            <div className="flex flex-row items-end p-5">
                <Link href='/admin/new-questionnaire' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 mr-5 ml-auto rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'> Save draft</p>
                </Link>

                <Link href='/admin/new-questionnaire' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'> Save</p>
                </Link>
            </div>
            <div className="flex flex-col mb-8">
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
                            <Table.HeadCell>Version</Table.HeadCell>
                            <Table.Cell>{version.version || ''}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
            <div className="flex flex-col mb-8">
                <ul className="flex items-stretch w-full">
                    {tabs.map((tab, n) => (
                        <li
                            key={tab.tabName}
                            //lg:px-11
                            className={`flex-grow text-center hover:bg-gray-500  hover:bg-opacity-20 py-2 px-0  cursor-pointer text-md text-gray-600 ${activeTab === n && 'border-b-2 border-gray-600 bg-gray-100'}`}
                            onClick={() => setActiveTab(n)}
                        >
                            <div className='flex items-center pl-2'>
                                <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                                    {n + 1}
                                </span>
                                <span>
                                    <h3 className="font-medium leading-tight pl-2">{tab.tabName}</h3>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
                <hr className="h-px bg-gray-500 border-0 " />

            </div>
            <div className="flex flex-col mb-8">
                <Table >
                    <Table.Head>
                        <Table.HeadCell>Question</Table.HeadCell>
                        <Table.HeadCell>Risk weight</Table.HeadCell>
                        <Table.HeadCell>Answer Type</Table.HeadCell>
                        <Table.HeadCell>Answers</Table.HeadCell>
                        <Table.HeadCell>Flag</Table.HeadCell>
                        <Table.HeadCell>Tooltip</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Action</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {((tabs[activeTab] || {}).questions || []).map((question) => (
                            <Table.Row key={question.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleRowClick(question.id || 0)}>
                                <Table.Cell>{question.question}</Table.Cell>
                                <Table.Cell>{question.riskWeight}</Table.Cell>
                                <Table.Cell>{question.answerType}</Table.Cell>
                                <Table.Cell className="whitespace-pre-line">{question.answers?.map(a=>"• " + a.text).join('\n')}</Table.Cell>
                                <Table.Cell>{question.flag}</Table.Cell>
                                <Table.Cell>{question.tooltip}</Table.Cell>
                                <Table.Cell>
                                    <a href="#" onClick={(e) => e.stopPropagation()}>
                                        <HiPencilAlt size={20} />
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        ))}

                    </Table.Body>
                </Table>
            </div>
            
        </>
    );
}
