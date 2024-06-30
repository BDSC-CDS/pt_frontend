import { useEffect, useState } from 'react';
import { Question, Questions } from '../utils/questions';
import { TemplatebackendQuestionnaireReply, TemplatebackendQuestionnaireQuestionReply } from '../internal/client/index';
import { createReply } from "../utils/questionnaire"
import dynamic from "next/dynamic";
import { MdSave } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { GrDocumentConfig } from "react-icons/gr";
import { Button, Modal, TextInput, ToggleSwitch, Alert } from 'flowbite-react';
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

interface TabsComponentProps {
    questions: Questions;
    questionnaireVersionId?: number;
    reply?: TemplatebackendQuestionnaireReply;
}

type Tabs = {
    id: string,
    title: string,
    content: any,
}[]


const TabsComponent: React.FC<TabsComponentProps> = ({ questions, questionnaireVersionId, reply }) => {
    const [activeTab, setActiveTab] = useState<string>('1');

    console.log("tab", questionnaireVersionId, reply);

    if (reply) {
        interface QuestionMap {
            [key: string]: Question;
        }
        let allQuestions: QuestionMap = {};
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            tabQuestions.forEach(q => { allQuestions[q.questionId] = q; })
        })
        reply.replies?.forEach(r => {
            if (!r.questionnaireQuestionId) return;
            const q = allQuestions[r.questionnaireQuestionId];
            if (!q) return;
            const a = q.answers.find(a => a.answerId == r.answer)
            if (a) a.selected = true;
        })
    }

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

    const getSelectedAnswer = (question: Question) => {
        for (let answer of question.answers) {
            if (answer.selected) {
                return answer.answerId
            }
        }
    };

    const setSelectedAnswer = (question: Question, answerId: string) => {
        question.answers.forEach(a => {
            a.selected = false;
            if (a.answerId == answerId) {
                a.selected = true;
            }
        });

        computeCurrentRisk();
        computeCurrentReport();
    }

    const getQuestionsForTab = (tab: string) => {
        // <div className={tab != activeTab ? "hidden" : ""}>
        return (
            <div>
                {
                    questions[tab]?.map((question) => (
                        <div className='flex items-center'>
                            <form className="w-1/2 my-4" key={question.questionId}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    {question.questionDescription}
                                </label>
                                <select
                                    id={question.questionId}
                                    className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-xs p-2.5"
                                    value={getSelectedAnswer(question)}
                                    onChange={e => setSelectedAnswer(question, e.target.value)}
                                >
                                    <option selected>Select an option</option>
                                    {question.answers.map((answer) => (
                                        <option key={answer.answerId} value={answer.answerId} className='w-1/2'>
                                            {answer.answerDescription}
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
                }
            </div>
        );
    }


    const getRiskBounds = () => {
        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            allQuestions = allQuestions.concat(tabQuestions);
        })

        // console.log("allQuestions", allQuestions.map(q => q.riskWeight))

        let maxRisk = 0;
        let minRisk = 0;
        allQuestions?.forEach(q => {
            const riskLevels = q.answers.map(a => a.riskLevel);
            const maxRiskLevel = Math.max(...riskLevels);
            const minRiskLevel = Math.min(...riskLevels);
            // console.log("q risk", q.riskWeight, maxRiskLevel, minRiskLevel);
            maxRisk += q.riskWeight * maxRiskLevel;
            minRisk += q.riskWeight * minRiskLevel;
        });
        return [maxRisk, minRisk];
    }



    const [currentRisk, setCurrentRisk] = useState(0);
    const [currentRiskPc, setCurrentRiskPc] = useState(0);
    const [maxRisk, minRisk] = getRiskBounds();

    const computeCurrentRisk = () => {
        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            allQuestions = allQuestions.concat(tabQuestions);
        })

        let cRisk = 0;
        allQuestions?.forEach(q => {
            q.answers.forEach(a => {
                if (a.selected) {
                    cRisk += a.riskLevel * q.riskWeight;
                }
            });
        });

        const riskRange = (maxRisk || 1) - (minRisk || 0);
        const cRiskPc = ((cRisk - (minRisk || 0)) / riskRange);

        setCurrentRisk(cRisk);
        setCurrentRiskPc(cRiskPc);
    }

    useEffect(() => {
        computeCurrentRisk();
        computeCurrentReport();
    }, [])

    const [riskPopoverDisplayed, setRiskPopoverDisplayed] = useState(false)

    const [reportData, setReportData] = useState({
        totalQuestionsAnswered: 42,
        sectionsCompleted: ['Basic Info', 'Structured Data', 'Multimedia', 'IT Infrastructure'],
        missingDataSections: ['Genomic Variables', 'Data Users'],
        overallCompletionRate: '86%',
    });

    const computeCurrentReport = () => {
        const sectionsCompleted: string[] = [];
        const sectionsMissing: string[] = [];

        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;

            let sectionCompleted = true;
            tabQuestions.forEach(q => {
                const answered = !!q.answers.find(a => a.selected);
                if (!answered) {
                    sectionCompleted = false;
                }
            });
            if (sectionCompleted) {
                sectionsCompleted.push(tab);
            } else {
                sectionsMissing.push(tab);
            }

            allQuestions = allQuestions.concat(tabQuestions);
        });

        let numAnswered = 0;

        allQuestions?.forEach(q => {
            const answered = !!q.answers.find(a => a.selected);
            if (answered) {
                numAnswered++;
            }
        });

        const completionRate = numAnswered / allQuestions.length;

        setReportData({
            totalQuestionsAnswered: numAnswered,
            sectionsCompleted: sectionsCompleted,
            missingDataSections: sectionsMissing,
            overallCompletionRate: (completionRate * 100).toFixed(2) + "%",
        });

    }

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
            <div className="flex flex-row">
                <span onClick={() => exportPDF()} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <FaFilePdf />
                    <p className='ml-2 text-sm'> Export PDF</p>
                </span>
                <span onClick={() => exportConfig()} className="flex items-center ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                <GrDocumentConfig />
                    <p className='ml-2 text-sm'> Export connector configuration</p>
                </span>
            </div>
        </div>

    const tabs: Tabs = Object.keys(questions).map((tab, n) => ({
        id: (n + 1).toString(),
        title: tab,
        content: getQuestionsForTab(tab),
    })).concat([{
        id: '8',
        title: 'Results',
        content: report_tab,
    }])

    // Everything to save
    const [openSaveModal, setOpenSaveModal] = useState(false);
    const [openSaveAlert, setOpenSaveAlert] = useState(false);
    const [saveName, setSaveName] = useState("");
    const save = async () => {
        setOpenSaveModal(false);

        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            allQuestions = allQuestions.concat(tabQuestions);
        })

        const allAnsweredQuestions = allQuestions.filter(q => q.answers?.find(a => a.selected));
        const replies: Array<TemplatebackendQuestionnaireQuestionReply> = allAnsweredQuestions.map(q => {
            const reply: TemplatebackendQuestionnaireQuestionReply = {
                questionnaireQuestionId: Number(q.questionId),
                answer: q.answers.find(a => a.selected)?.answerId
            };
            return reply;
        })

        const replyToSave: TemplatebackendQuestionnaireReply = {
            questionnaireVersionId: reply?.questionnaireVersionId ? reply.questionnaireVersionId : questionnaireVersionId,
            projectName: saveName,
            replies: replies,
        }

        const id = await createReply(replyToSave);

        setOpenSaveAlert(true);
    }

    return (
        <>
            <Alert className={(openSaveAlert ? "" : "hidden") + " mt-5"} color="success" onDismiss={() => setOpenSaveAlert(false)}>
                <span className="font-bold">Version {saveName} </span>successfuly saved!
            </Alert>
            <div className="flex flex-row items-end p-5">
                <span onClick={() => setOpenSaveModal(true)} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 ml-auto rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'> Save</p>
                </span>
            </div>
            <Modal show={openSaveModal} size="md" onClose={() => setOpenSaveModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className="flex flex-col mb-8">
                            <TextInput
                                placeholder="Project name"
                                required
                                // value={"12"}
                                onChange={(event) => { setSaveName(event.target.value) }}
                            />
                        </div>

                        <hr />
                        {/* <div className="flex flex-col mb-8">
                            <ToggleSwitch checked={savePublish} label="Publish version" onChange={setSavePublish} />
                        </div> */}

                        <hr />

                        <div className="flex justify-center gap-4">
                            <Button color="success" onClick={() => save()}>
                                Save
                            </Button>
                            <Button color="gray" onClick={() => setOpenSaveModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className='p-5'>
                <div className='fixed top-56 right-44 h-3/4 w-1/6  text-black flex flex-col items-center justify-start'>
                    <h1 className='mt-4 text-md font-semibold flex flex-row'>
                        Current score
                        <button
                            onMouseEnter={() => setRiskPopoverDisplayed(true)}
                            onMouseLeave={() => setRiskPopoverDisplayed(false)}
                            className="ml-3 flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                            ?
                        </button>
                    </h1>
                    <div id="popover-default" className={`${riskPopoverDisplayed || "hidden"} mt-5 mb-5 inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm  dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800`}>
                        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Risk details</h3>
                        </div>
                        <div className="px-3 py-2">
                            Current risk {currentRisk}<br />
                            Current risk (%) {(currentRiskPc * 100).toFixed(2) + "%"}<br />
                            Max. possible risk {maxRisk}<br />
                            Min. possible risk {minRisk}<br />
                        </div>
                        <div data-popper-arrow></div>
                    </div>

                    {/* currentRisk {currentRisk}<br />
                    currentRiskPc {currentRiskPc}<br />
                    maxRisk {maxRisk}<br />
                    minRisk {minRisk}<br /> */}
                    <GaugeChart id="gauge-chart2"
                        nrOfLevels={20}
                        cornerRadius={0}
                        percent={currentRiskPc}
                        textColor='black'
                        animate={false}
                    />
                </div>

                {/* <TabsComponent questions={questions} /> */}

                <ul className="flex items-stretch w-full">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
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
                    {/* {tabs.map(tab => tab.content)} */}
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
            </div>

        </>

    );
};

export default TabsComponent;
