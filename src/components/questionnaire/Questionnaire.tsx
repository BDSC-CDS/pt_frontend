import { ReactNode, useEffect, useState } from 'react';
import { Question, Questions, questionsFromApi } from '../../utils/questions';
import { TemplatebackendQuestionnaireQuestionReply, TemplatebackendQuestionnaireReply, TemplatebackendQuestionnaireVersion } from '../../internal/client/index';
import dynamic from "next/dynamic";
import { MdSave, MdOutlineWarningAmber, MdShare } from "react-icons/md";
import ReplySaveModal from '../modals/ReplySaveModal';
import QuestionnaireTab from './QuestionnaireTab';
import QuestionnaireReportTab from './QuestionnaireReportTab';
import { showToast } from '~/utils/showToast';
import { Pagination, Tooltip } from 'flowbite-react';
import ReplyShareModal from '../modals/ReplyShareModal';
import { createReply } from '~/utils/questionnaire';
import { useRouter } from 'next/router';

const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

interface QuestionnaireProps {
    questionnaireVersion: TemplatebackendQuestionnaireVersion;
    questionnaireReply?: TemplatebackendQuestionnaireReply;
}

type Tabs = {
    id: string,
    title: string,
    content: ReactNode,
}[]

/**
 * The questionnaire component used for qualitative risk assessment.
 */
export default function Questionnaire({ questionnaireVersion, questionnaireReply }: QuestionnaireProps) {
    const router = useRouter()

    const [questions, setQuestions] = useState<Questions>(questionsFromApi(questionnaireVersion));

    const [activeTab, setActiveTab] = useState<string>('1');
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

        let maxRisk = 0;
        let minRisk = 0;
        allQuestions.forEach(q => {
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
    
    // Function to set the selected answer for a question
    const setSelectedAnswer = (question: Question, answerId: string) => {
        // First clean up
        const previousAnswerId = question.answers.find(a => a.selected)?.answerId;
        const previousAnswer = question.answers.find(a => a.answerId === previousAnswerId);
        if (previousAnswer) {
            previousAnswer.selected = false;
            question.highRiskAnswerSelected = false;

            if (previousAnswer.rulePrefills) {
                previousAnswer.rulePrefills.forEach(rp => {
                    const q = Object.keys(questions)
                                .map(tab => questions[tab]?.find(q => q.questionId == rp.questionId))
                                .find(q => q !== undefined);
                    if (q) {
                        q.prefilledBy = undefined;
                        q.highRiskAnswerSelected = false;
                        q.answers.forEach(a => a.selected = false);
                    }
                });
            }
        }
        
        // Then set the new answer
        const newAnswer = question.answers.find(a => a.answerId === answerId);
        if(newAnswer) {
            newAnswer.selected = true;
            question.highRiskAnswerSelected = newAnswer.highRisk;

            let isPrefilled = false;

            // Apply rulePrefills for the new answer
            if (newAnswer.rulePrefills) {
                newAnswer.rulePrefills.forEach(rp => {
                    const q = Object.keys(questions)
                                .map(tab => questions[tab]?.find(q => q.questionId == rp.questionId))
                                .find(q => q !== undefined);
                    if (q) {
                        q.prefilledBy = {
                            questionTab: question.tab,
                            questionDescription: question.questionDescription,
                            answerDescription: newAnswer.answerDescription
                        }
                        setSelectedAnswer(q, rp.answerId);
                        isPrefilled = true;
                    }
                });
            }

            if(isPrefilled){
                showToast("info", "Some answers were prefilled.");
            }
        }

        console.log("New questions state", questions);

        computeCurrentRisk();
        computeCurrentReport();
    };

    const saveReply = async (saveName: string, isShare: boolean=false) => {
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
            questionnaireVersionId: questionnaireVersion.id,
            projectName: saveName,
            replies: replies,
        }

        try {
            const id = await createReply(replyToSave);
            if(!id) {
                throw "Error saving reply."
            }
            showToast("success", "Successfully saved.")
            if(!isShare){
                router.push("/risk_assessment")
            }
        } catch (error) {
            showToast("error", String(error))
        }
    };

    const handleSave = async () => {
        if(questionnaireReply && questionnaireReply.projectName){
            saveReply(questionnaireReply.projectName)
        } else {
            setOpenSaveModal(true)
        }
    }

    const handleShare = async () => {
        if(questionnaireReply && questionnaireReply.projectName){
            saveReply(questionnaireReply.projectName, true)
            setIsShareModalOpen(true)
        }
    }

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
            q.answers.forEach(a => {
                if (a.selected) {
                    cRisk += a.riskLevel * q.riskWeight;
                }
            });
        });

        // Ensure cRisk is at least the minimum risk
        cRisk = Math.max(cRisk, minRisk);

        const riskRange = (maxRisk || 1) - (minRisk);
        const cRiskPc = (cRisk - minRisk) / riskRange;

        // we set the maxium to 80%, as only high risk answers make the user go in the red.
        const displayCRiskPc = cRiskPc;

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
        content: <QuestionnaireReportTab replyName={questionnaireReply?.projectName} questions={questions} reportData={reportData} currentRisk={currentRisk}/>
    }]);

    useEffect(() => {
        // Populate the questionnaire with the reply data
        if (questionnaireReply) {
            const allQuestions: { [key: string]: Question } = {};
            Object.keys(questions).map((tab) => {
                const tabQuestions = questions[tab];
                if (!tabQuestions) return;
                tabQuestions.forEach(q => { allQuestions[q.questionId] = q; });
            });
            questionnaireReply.replies?.forEach(r => {
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
                                prefilledQuestion.prefilledBy = {
                                    questionTab: q.tab,
                                    questionDescription: q.questionDescription,
                                    answerDescription: a.answerDescription
                                }
                            }
                        });
                    }
                }
            });
        }
        computeCurrentRisk();
        computeCurrentReport();
    }, []);

    return (
        <div className="flex flex-col h-full gap-2">
            <div className="flex justify-end gap-2">
                {questionnaireReply && questionnaireReply.id && (
                    <span onClick={handleShare} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                        <MdShare />
                        <p className='ml-2 text-sm'>Share</p>
                    </span>
                )}
                <span onClick={handleSave} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'>Save</p>
                </span>
            </div>

            {/* Share reply modal */}
            {questionnaireReply && questionnaireReply.id && (
                <ReplyShareModal show={isShareModalOpen} shareReplyId={questionnaireReply?.id} onClose={() => setIsShareModalOpen(false)} />
            )}

            {/* Save reply modal */}
            <ReplySaveModal show={openSaveModal} onSave={saveReply} onClose={() => setOpenSaveModal(false)}/>
                  
            {/* All Questionnaire Tabs */}
            <div id="all-tabs" className="flex flex-col flex-grow">
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

                <div className="flex flex-col flex-grow items-center justify-between py-5 px-5 border rounded-b-lg shadow-lg">
                    <div className="w-full flex justify-between">
                        {/* Tabs content */}
                        <div className="w-1/2">
                            {tabs.find((tab) => tab.id === activeTab)?.content}
                        </div>
                        

                        {activeTab !== String(tabs.length) && (
                            <div className='w-1/4 text-black flex flex-col items-center justify-start'>
                                <h1 className='text-md font-semibold'>
                                    <div className="flex items-center">
                                        Current score

                                        <Tooltip 
                                            style="light"
                                            arrow={false}
                                            placement="left"
                                            className="p-0 m-0"
                                            content={(
                                                <div className="inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm  dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">Risk details</h3>
                                                    </div>
                                                    <div className="px-3 py-2">
                                                        Current risk: {currentRisk} <p className='text-xs text-gray-400 inline-block'>({(currentRiskPc * 100).toFixed(2) + "%"})</p><br />
                                                        Max. possible risk: {maxRisk}<br />
                                                        Min. possible risk: {minRisk} <br />
                                                        <p className='text-xs text-gray-400'>Note that some questions have negative risk so the minimum could be less but is clamped</p>
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            <span className="ml-3 inline-flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0">
                                                ?
                                            </span>
                                        </Tooltip>
                                    </div>
                                    
                                    <div className="mt-2">
                                        {
                                            reportData.totalHighRiskAnswers > 0
                                                ? <span style={{ color: '#e76f51' }}>High Risk</span> // Red
                                                : currentRisk > 45
                                                    ? <span style={{ color: '#e9c46a' }}>Medium Risk</span> // Yellow
                                                    : <span style={{ color: '#2a9d8f' }}>Low to Medium Risk</span> // Green
                                        }
                                    </div>
                                </h1>

                                {/* currentRisk {currentRisk}<br />
                        currentRiskPc {currentRiskPc}<br />
                        maxRisk {maxRisk}<br />
                        minRisk {minRisk}<br /> */}
                                <GaugeChart id="gauge-chart2"
                                    nrOfLevels={3}
                                    arcsLength={[0.43, 0.46, 0.1]}
                                    // cornerRadius={0}
                                    colors={['#2a9d8f', '#e9c46a', '#e76f51']}
                                    percent={reportData.totalHighRiskAnswers > 0 ? 99 : currentDisplayRiskPc}
                                    formatTextValue={value=>""}
                                    /*textColor={
                                        reportData.totalHighRiskAnswers > 0
                                            ? '#e76f51' // Red
                                            : currentRisk > 45
                                            ? '#e9c46a' // Orange
                                            : '#2a9d8f' // Green
                                    }*/
                                    
                                    animate={false} />

                                {(reportData.totalHighRiskAnswers > 0) && (
                                    <div className="flex items-center">
                                        <MdOutlineWarningAmber size={70} color='#e76f51' className="inline-block" />
                                        <div className="inline-block items-center text-red-700">You've selected a <br />high-risk answer</div>
                                    </div>
                                )}
                            </div>
                        )}
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