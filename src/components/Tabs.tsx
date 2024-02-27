import { useState } from 'react';
import { questions } from '../utils/questions';

const TabsComponent = () => {
    const [activeTab, setActiveTab] = useState<string>('1');

    // Function to go to the previous tab
    const goToPreviousTab = () => {
        const currentTabIndex = Number(activeTab);
        if (currentTabIndex > 1) {
            setActiveTab(String(currentTabIndex - 1));
        }
    };

    // Function to go to the next tab
    const goToNextTab = () => {
        const currentTabIndex = Number(activeTab);
        if (currentTabIndex < tabs.length) {
            setActiveTab(String(currentTabIndex + 1));
        }
    };
    const getQuestionsForTab = (tab: string) => {
        return (
            <div>
                {
                    questions[tab]?.map((question) => (
                        <div className='flex items-center'>
                            <form className="w-1/2 my-4" key={question.question_id}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    {question.question_description}
                                </label>
                                <select
                                    id={question.question_id}
                                    className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-xs p-2.5"
                                >
                                    {/* Default option */}
                                    <option selected>Select an option</option>
                                    {question.answers.map((answer) => (
                                        <option key={answer.answer_id} value={answer.answer_id} className='w-1/2'>
                                            {answer.answer_description}
                                        </option>
                                    ))}
                                </select>
                            </form>
                            <div className="relative group cursor-pointer ml-6 mt-6">
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-400 text-white rounded-full text-sm font-bold">?</span>
                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                    <span className="relative z-10 p-2 w-40 text-xs leading-none text-white whitespace-no-wrap bg-gray-700 shadow-lg rounded-md">This is a tooltip.</span>
                                    <div className="w-3 h-3 -mt-2 -ml-20 rotate-45 bg-gray-700"></div>
                                </div>
                            </div>
                        </div>
                    ))
                }</div>);
    }

    const structured_data_questions = getQuestionsForTab("Structured data");
    const multimedia_questions = getQuestionsForTab("Multimedia variables");
    const dicom_questions = getQuestionsForTab("DICOM attributes (DICOM attributes listed in the confidentiality list (http://dicom.nema.org/medical/dicom/current/output/chtml/part15/chapter_E.html) will be removed unless they are listed under DCM-06");
    const genomic_questions = getQuestionsForTab("Genomic variables");
    const other_variables_questions = getQuestionsForTab("Other variables");
    const jurisdiction_questions = getQuestionsForTab("Jurisdiction");
    const contracts_policies_questions = getQuestionsForTab("Contracts and policies");
    const cohort_questions = getQuestionsForTab("Cohort characteristics");
    const data_users_questions = getQuestionsForTab("Data users");
    const it_infra_security_questions = getQuestionsForTab("IT Infrastructure and security");

    const reportData = {
        totalQuestionsAnswered: 42,
        sectionsCompleted: ['Basic Info', 'Structured Data', 'Multimedia', 'IT Infrastructure'],
        missingDataSections: ['Genomic Variables', 'Data Users'],
        overallCompletionRate: '86%',
    };

    const report_tab =
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Survey Results Summary</h2>
            <div className="mb-2">
                <strong>Total Questions Answered:</strong> {reportData.totalQuestionsAnswered}
            </div>
            <div className="mb-2">
                <strong>Sections Completed:</strong> {reportData.sectionsCompleted.join(', ')}
            </div>
            <div className="mb-2">
                <strong>Missing Data Sections:</strong> {reportData.missingDataSections.join(', ') || 'None'}
            </div>
            <div className="mb-2">
                <strong>Overall Completion Rate:</strong> {reportData.overallCompletionRate}
            </div>
        </div>

    const tabs = [
        {
            id: '1',
            title: 'Basic Info',
            content: cohort_questions,
        },
        {
            id: '2',
            title: 'Structured Data',
            content: structured_data_questions,
        },
        {
            id: '3',
            title: 'Multimedia',
            content: multimedia_questions,
        },
        {
            id: '4',
            title: 'Dataset',
            content:
                <div>
                    {genomic_questions}
                    {other_variables_questions}
                </div>,

        },
        {
            id: '5',
            title: 'IT',
            content: it_infra_security_questions,
        },
        {
            id: '6',
            title: 'Contextual',
            content: data_users_questions,
        },
        {
            id: '7',
            title: 'Administrative',
            content:
                <div>
                    {jurisdiction_questions}
                    {contracts_policies_questions}
                </div>,
        },
        {
            id: '8',
            title: 'Results',
            content: report_tab,
        },
    ];

    return (
        <>
            <ul className="flex items-stretch w-full">
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        //lg:px-11
                        className={`flex-grow text-center  py-2 px-0  cursor-pointer text-md text-gray-600 ${activeTab === tab.id && 'border-b-2 border-gray-600 bg-gray-100'}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <div className='flex items-center pl-2'>
                            <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                                {tab.id}
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight pl-2">{tab.title}</h3>
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
            <hr className="h-px bg-gray-500 border-0 " />

            <div className="p-10">
                {tabs.find((tab) => tab.id === activeTab)?.content}
                <div className="flex items-center mt-4">
                    <button
                        onClick={goToPreviousTab}
                        disabled={activeTab === '1'}
                        className="w-1/6 mx-1 px-4 py-2 text-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        Previous
                    </button>
                    <button
                        onClick={goToNextTab}
                        disabled={activeTab === '8'}
                        className="w-1/6 mx-1 px-4 py-2 text-center bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>

        </>

    );
};

export default TabsComponent;
