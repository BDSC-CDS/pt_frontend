import { ReactNode, useEffect, useState } from 'react';
import { Question, Questions } from '../../utils/questions';
import { TemplatebackendQuestionnaireReply } from '../../internal/client/index';
import dynamic from "next/dynamic";
import { MdSave, MdOutlineWarningAmber, MdShare } from "react-icons/md";
import ReplySaveModal from '../modals/ReplySaveModal';
import QuestionnaireTab from './QuestionnaireTab';
import QuestionnaireReportTab from './QuestionnaireReportTab';
import { showToast } from '~/utils/showToast';
import { Pagination } from 'flowbite-react';
import ReplyShareModal from '../modals/ReplyShareModal';

const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

interface QuestionnaireProps {
    questions: Questions;
    questionnaireVersionId?: number;
    reply?: TemplatebackendQuestionnaireReply;
}

type Tabs = {
    id: string,
    title: string,
    content: ReactNode,
}[]

/**
 * The questionnaire component used for qualitative risk assessment.
 */
export default function Questionnaire({ questions, questionnaireVersionId, reply }: QuestionnaireProps) {
    const [activeTab, setActiveTab] = useState<string>('1');
    const [riskPopoverDisplayed, setRiskPopoverDisplayed] = useState(false);
    const [openSaveModal, setOpenSaveModal] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [reportData, setReportData] = useState({
        totalQuestionsAnswered: 0,
        totalHighRiskAnswers: 0,
        sectionsCompleted: [] as string[],
        missingDataSections: [] as string[],
        overallCompletionRate: "",
    });
    const [currentRisk, setCurrentRisk] = useState(0);
    const [currentRiskPc, setCurrentRiskPc] = useState(0);
    const [currentDisplayRiskPc, setCurrentDisplayRiskPc] = useState(0);
    const computeRiskBounds = (questions: Questions): [number, number] => {
        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            allQuestions = allQuestions.concat(tabQuestions);
        });

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
    };
    const [maxRisk, minRisk] =  computeRiskBounds(questions);

    // Populate the questionnaire with the reply data
    if (reply) {
        const allQuestions: { [key: string]: Question } = {};
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            tabQuestions.forEach(q => { allQuestions[q.questionId] = q; });
        });
        reply.replies?.forEach(r => {
            if (!r.questionnaireQuestionId) return;
            const q = allQuestions[r.questionnaireQuestionId];
            if (!q) return;
            const a = q.answers.find(a => a.answerId === r.answer);
            if (a) {
                a.selected = true;
                if (a.highRisk) {
                    q.highRiskAnswerSelected = true;
                }
                if (a.rulePrefills && a.rulePrefills.length > 0) {
                    a.rulePrefills.forEach(rp => {
                        const prefilledQuestion = Object.keys(questions)
                            .map(tab => questions[tab]?.find(q => q.questionId == rp.questionId))
                            .find(q => q !== undefined);
                        if (prefilledQuestion) {
                            prefilledQuestion.prefilled = true;
                        }
                    });
                }
            }
        });
    }
    
    // Function to set the selected answer for a question
    const setSelectedAnswer = (question: Question, answerId: string) => {
        question.answers.forEach(a => {
            if (a.selected && a.rulePrefills) {
                a.rulePrefills.forEach(rp => {
                    const q = Object.keys(questions)
                                .map(tab => questions[tab]?.find(q => q.questionId == rp.questionId))
                                .find(q => q !== undefined);
                    if (q) {
                        q.prefilled = false;
                        q.answers.forEach(a => a.selected = false);
                    }
                });
            }
                    
            a.selected = false;
            
            if (a.answerId == answerId) {
                a.selected = true;
                question.highRiskAnswerSelected = a.highRisk;

                if (a.rulePrefills && a.rulePrefills.length > 0) {
                    a.rulePrefills.forEach(rp => {
                        const q = Object.keys(questions)
                                    .map(tab => questions[tab]?.find(q => q.questionId == rp.questionId))
                                    .find(q => q !== undefined);
                        if (q) {
                            q.prefilled = true;
                            setSelectedAnswer(q, rp.answerId);
                        }
                    });
                    
                    showToast("info", "Some answers were prefilled.");
                }
            }
        });

        computeCurrentRisk();
        computeCurrentReport();
    };

    const getSelectedAnswer = (question: Question) => {
        for (let answer of question.answers) {
            if (answer.selected) {
                return answer.answerId;
            }
        }
    };

    const isQuestionAnswered = (question: Question) => {
        for (let answer of question.answers) {
            if (answer.selected) {
                return true;
            }
        }
        return false;
    };

    const computeCurrentRisk = () => {
        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            allQuestions = allQuestions.concat(tabQuestions);
        });

        let cRisk = 0;
        allQuestions?.forEach(q => {
            const riskLevels = q.answers.map(a => a.riskLevel);
            const maxRiskLevel = Math.max(...riskLevels) * q.riskWeight;
            let selectedRisk;

            q.answers.forEach(a => {
                if (a.selected) {
                    cRisk += a.riskLevel * q.riskWeight;
                    selectedRisk = a.riskLevel * q.riskWeight;
                }
            });
            // console.log("max", maxRiskLevel, selectedRisk);
        });

        // console.log("cRisk bef", cRisk);
        cRisk = Math.max(cRisk, 0);

        // const riskRange = (maxRisk || 1) - (minRisk || 0);
        // const cRiskPc = ((cRisk - (minRisk || 0)) / riskRange);
        const riskRange = maxRisk || 1;
        const cRiskPc = cRisk / riskRange;

        // we set the maxium to 80%, as only high risk answers make the user go in the red.
        // const displayCRiskPc = cRiskPc * 0.8;
        const displayCRiskPc = cRiskPc;

        // console.log("cRisk", cRisk);
        // console.log("maxRisk", maxRisk);
        // console.log("cRiskPc", cRiskPc);
        // console.log("displayCRiskPc", displayCRiskPc);

        setCurrentRisk(cRisk);
        setCurrentRiskPc(cRiskPc);
        setCurrentDisplayRiskPc(displayCRiskPc);

        // uncomment to make score goes to 100% in case of any high risk answers selected
        // if (totalHighRiskAnswers > 0) {
        //     setCurrentRiskPc(1);
        //     setCurrentDisplayRiskPc(1);
        // } 
    };

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
        let numHighRisk = 0;
        allQuestions?.forEach(q => {
            const answered = q.answers.find(a => a.selected);
            if (answered) {
                numAnswered++;
                if (q.highRiskAnswerSelected) {
                    numHighRisk++;
                }
            }
        });

        const completionRate = numAnswered / allQuestions.length;

        setReportData({
            totalHighRiskAnswers: numHighRisk,
            totalQuestionsAnswered: numAnswered,
            sectionsCompleted: sectionsCompleted,
            missingDataSections: sectionsMissing,
            overallCompletionRate: (completionRate * 100).toFixed(2)+"%",
        });
    };

    // Construct the tabs for the questionnaire
    const tabs: Tabs = Object.keys(questions).map((tab, n) => ({
        id: (n + 1).toString(),
        title: tab,
        content: <QuestionnaireTab
                    tabQuestions={questions[tab]}
                    setSelectedAnswer={setSelectedAnswer}
                    getSelectedAnswer={getSelectedAnswer}
                    isQuestionAnswered={isQuestionAnswered} 
                />
    })).concat([{
        id: String(Object.keys(questions).length + 1),
        title: 'Results',
        content: <QuestionnaireReportTab replyName={reply?.projectName} questions={questions} reportData={reportData} currentRiskPc={currentRiskPc}/>
    }]);

    useEffect(() => {
        computeCurrentRisk();
        computeCurrentReport();
    }, []);

    return (
        <div className="flex flex-col h-full gap-2">
            <div className="flex justify-end gap-2">
                {reply && reply.id && (
                    <span onClick={() => setIsShareModalOpen(true)} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                        <MdShare />
                        <p className='ml-2 text-sm'>Share</p>
                    </span>
                )}
                <span onClick={() => setOpenSaveModal(true)} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'>Save</p>
                </span>
            </div>

            {/* Share reply modal */}
            {reply && reply.id && (
                <ReplyShareModal show={isShareModalOpen} shareReplyId={reply?.id} onClose={() => setIsShareModalOpen(false)} />
            )}

            {/* Save reply modal */}
            <ReplySaveModal show={openSaveModal} questions={questions} questionnaireVersionId={reply?.questionnaireVersionId || questionnaireVersionId} onClose={() => setOpenSaveModal(false)}/>
                  
            {/* All Questionnaire Tabs */}
            <div id="all-tabs" className="flex flex-col flex-grow">
                {activeTab !== String(tabs.length) && (
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
                                Current risk: {currentRisk} <p className='text-xs text-gray-400 inline-block'>({(currentRiskPc * 100).toFixed(2) + "%"})</p><br />
                                Max. possible risk: {maxRisk}<br />
                                Min. possible risk: 0 <br />
                                <p className='text-xs text-gray-400'>Note that some questions have negative risk so the minimum could be less but is clamped</p>
                            </div>
                            <div data-popper-arrow></div>
                        </div>

                        {/* currentRisk {currentRisk}<br />
                currentRiskPc {currentRiskPc}<br />
                maxRisk {maxRisk}<br />
                minRisk {minRisk}<br /> */}
                        <GaugeChart id="gauge-chart2"
                            nrOfLevels={30}
                            // arcsLength={[0.4, 0.4, 0.2]}
                            // cornerRadius={0}
                            // colors={['#5BE12C', '#F5CD19', '#EA4228']}
                            percent={currentDisplayRiskPc}
                            // formatTextValue={value=>value+"%"}
                            formatTextValue={value => currentRisk + ""}
                            textColor='black'
                            animate={false} />

                        {(reportData.totalHighRiskAnswers > 0) && (
                            <div className="flex items-center">
                                <MdOutlineWarningAmber size={70} color='#EA4228' className="inline-block" />
                                <div className="inline-block items-center text-red-700">You've selected a <br />high-risk answer</div>
                            </div>
                        )}
                    </div>
                )}

                <div className="overflow-auto border rounded-t-lg scroll-mt-2">
                    <ul className="flex w-full">
                        {tabs.map((tab, n) => (
                            <li
                                key={`tab${n}`}
                                className={`flex-grow text-center hover:bg-gray-100 pt-3 pb-2 cursor-pointer text-md text-gray-600 
                                    ${activeTab === tab.id && 'border-t-2 border-gray-400 bg-gray-50'}
                                `}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <div className="flex items-center px-2 justify-between">
                                    <div className="flex items-center">
                                        <a className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                                            {n + 1}
                                        </a>
                                        <h3 className="font-medium leading-tight pl-2 pr-2">{tab.title}</h3>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col flex-grow items-center justify-between py-5 px-3 border rounded-b-lg shadow-lg">
                    <div className="w-full">
                        {tabs.find((tab) => tab.id === activeTab)?.content}
                    </div>
                    <Pagination 
                        layout="navigation"
                        currentPage={Number(activeTab)}
                        totalPages={tabs.length}
                        onPageChange={(page) => setActiveTab(String(page))}
                        showIcons
                    />
                </div>
            </div>

        </div>
    );
}