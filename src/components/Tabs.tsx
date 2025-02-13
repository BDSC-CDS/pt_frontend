import { useEffect, useState } from 'react';
import { Question, Questions } from '../utils/questions';
import { TemplatebackendQuestionnaireReply, TemplatebackendQuestionnaireQuestionReply } from '../internal/client/index';
import { createReply } from "../utils/questionnaire"
import dynamic from "next/dynamic";
import { MdSave, MdOutlineWarningAmber } from "react-icons/md";
import { FaFilePdf, FaCircleInfo } from "react-icons/fa6";
import { GrDocumentConfig } from "react-icons/gr";
import { Button, Modal, TextInput } from 'flowbite-react';
import jsPDF from 'jspdf';
import { showToast } from '~/utils/showToast';
import { useRouter } from 'next/router';

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
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<string>('1');

    const setSelectedAnswer = (question: Question, answerId: string) => {
        question.answers.forEach(a => {
            a.selected = false;
            if (a.answerId == answerId) {
                a.selected = true;
                question.highRiskAnswerSelected = a.highRisk;
            }
        });

        computeCurrentRisk();
        computeCurrentReport();
        computeHighRiskCount()
    }

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
            if (a) {
                a.selected = true;
                if(a.highRisk){
                    q.highRiskAnswerSelected = true
                }
            }
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

    const isQuestionAnswered = (question: Question) => {
        for (let answer of question.answers) {
            if (answer.selected) {
                return true;
            }
        }
        return false;
    };
    
    const computeHighRiskCount = () => {
        let totalHighRiskAnswers = 0;
        
        Object.keys(questions).forEach((tab) => {
            questions[tab]?.forEach((question) => {
                // Count answers with highRisk = false
                const isHighRiskSelected = question.answers.some((answer) => answer.selected && answer.highRisk);
                if (isHighRiskSelected) {
                    totalHighRiskAnswers += 1;
                }
            });
        });
        
        setTotalHighRiskAnswers(totalHighRiskAnswers);

        // uncomment to make score goes to 100% in case of any high risk answers selected
        // if (totalHighRiskAnswers > 0) {
        //     setCurrentRiskPc(1);
        //     setCurrentDisplayRiskPc(1);
        // } 
    };

    const [totalHighRiskAnswers, setTotalHighRiskAnswers] = useState(0);

    const getQuestionsForTab = (tab: string) => {
        return (
            <div>
                {questions[tab]?.map((question) => (
                    <div key={question.questionId} className="flex flex-col my-4">
                        <form className="w-1/2">
                            {/* Form question & Tooltip */}
                            <div className="flex justify-between gap-4 items-center">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    {question.questionDescription}
                                </label>
                                {question.tooltip && (
                                    <div className="group relative flex">
                                        <div className="p-1">
                                            <FaCircleInfo className="text-gray-300 group-hover:text-gray-400 cursor-pointer" />
                                        </div>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute z-10 left-full hidden w-80 bg-white rounded-lg border border-gray-200 p-3 text-sm text-gray-700 shadow-lg group-hover:block">
                                            <div className="font-sans leading-relaxed text-gray-800 text-justify">
                                                {question.tooltip}
                                            </div>
                                            </div>
                                        </div>
                                )}
                               
                            </div>
                            
                            {/* Form select dropdown */}
                            <select
                                id={question.questionId}
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-xs p-2.5 ${isQuestionAnswered(question) ? "border-green-400" : "border-red-400"
                                    }`}
                                value={getSelectedAnswer(question)}
                                onChange={(e) => setSelectedAnswer(question, e.target.value)}
                            >
                                <option>Select an option</option>
                                {question.answers.map((answer) => (
                                    <option key={answer.answerId} value={answer.answerId}>
                                        {answer.answerDescription}
                                    </option>
                                ))}
                            </select>
                        </form>

                        {/* Warning Message for High-Risk Answer */}
                        {question.highRiskAnswerSelected && (
                            <div className="mt-2 text-red-500 text-sm font-medium flex items-center">
                                <svg
                                    className="inline w-5 h-5 text-red-500 mr-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                You've selected a high-risk answer!
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

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
    const [currentDisplayRiskPc, setCurrentDisplayRiskPc] = useState(0);
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
            const riskLevels = q.answers.map(a => a.riskLevel);
            const maxRiskLevel = Math.max(...riskLevels) * q.riskWeight;
            let selectedRisk;
            
            q.answers.forEach(a => {
                if (a.selected) {
                    cRisk += a.riskLevel * q.riskWeight;
                    selectedRisk = a.riskLevel * q.riskWeight;
                }
            });
            console.log("max", maxRiskLevel, selectedRisk);
        });

        console.log("cRisk bef", cRisk);
        cRisk = Math.max(cRisk, 0);

        // const riskRange = (maxRisk || 1) - (minRisk || 0);
        // const cRiskPc = ((cRisk - (minRisk || 0)) / riskRange);
        const riskRange = maxRisk || 1;
        const cRiskPc = cRisk / riskRange;

        // we set the maxium to 80%, as only high risk answers make the user go in the red.
        // const displayCRiskPc = cRiskPc * 0.8;
        const displayCRiskPc = cRiskPc;

        console.log("cRisk", cRisk);
        console.log("maxRisk", maxRisk);
        console.log("cRiskPc",cRiskPc);
        console.log("displayCRiskPc",displayCRiskPc);

        setCurrentRisk(cRisk);
        setCurrentRiskPc(cRiskPc);
        setCurrentDisplayRiskPc(displayCRiskPc);
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

    const isTabCompleted = (tab: string) => {
        return reportData.sectionsCompleted.includes(tab);
    }

    const [exportInProgress, setExportInProgress] = useState(false);

    const exportPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4'); // A4 page size
        const margin = 10; // Margin in mm
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const headerHeight = 20; // Header height in mm
        let cursorY = margin + headerHeight; // Starting Y position for text

        // Function to add the header with logo on the left (only on the first page)
        const addHeader = async (firstPage = false) => {
            if (!firstPage) return;

            pdf.setFillColor("#306278");
            pdf.rect(0, 0, pageWidth, headerHeight, "F");

            // Fetch the logo as Base64
            const response = await fetch("/sphn-logo-white.png"); // Keep the existing path
            const blob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    const base64Logo = reader.result as string;
                    const logoWidth = 15;
                    const logoHeight = 10;
                    pdf.addImage(
                        base64Logo,
                        "PNG",
                        margin, // Left align the logo
                        (headerHeight - logoHeight) / 2, // Center vertically within the header
                        logoWidth,
                        logoHeight
                    );

                    // Add the title "Privacy Toolbox" next to the logo
                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(14);
                    pdf.setTextColor("#FFFFFF");
                    pdf.text("Privacy Toolbox", margin + logoWidth + 5, headerHeight / 1.5);

                    resolve(null);
                };
            });
        };

        // Function to add footer with title and page number
        const addFooter = (pageNumber: number) => {
            pdf.setFont("helvetica", "italic");
            pdf.setFontSize(10);
            pdf.setTextColor("#000000");
            pdf.text(`Privacy Toolbox Questionnaire Report - Project: ${saveName}`, margin, pageHeight - 10);
            pdf.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
        };

        let pageNumber = 1;

        // Add header to the first page
        await addHeader(true);
        addFooter(pageNumber);

        // Step 1: Add Summary
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");

        const summaryTab = tabs.find((tab) => tab.title === "Results");
        if (summaryTab) {
            pdf.setFont("helvetica", "bold");
            pdf.text("Summary", margin, cursorY);
            cursorY += 10;

            const summaryContent = [
                `Project Title: ${saveName}`,
                `Total Questions Answered: ${reportData.totalQuestionsAnswered}`,
                `Sections Completed: ${reportData.sectionsCompleted.join(", ")}`,
                `Missing Data Sections: ${reportData.missingDataSections.length > 0
                    ? reportData.missingDataSections.join(", ")
                    : "None"
                }`,
                `Overall Completion Rate: ${reportData.overallCompletionRate}`,
                `Current Risk Score: ${(currentRiskPc * 100).toFixed(2)}%`,
                `Total High Risk Answers: ${totalHighRiskAnswers}`,
            ];

            summaryContent.forEach((line) => {
                const wrappedLines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
                pdf.text(wrappedLines, margin, cursorY);
                cursorY += wrappedLines.length * 6;
            });

            cursorY += 10;
        }

        // Step 2: Add Questions and Answers
        tabs.forEach((tab) => {
            if (tab.title === "Results") return; // Skip the summary tab

            // Page break check
            if (cursorY + 10 > pageHeight - margin) {
                pdf.addPage();
                cursorY = margin + headerHeight;
                pageNumber++;
                addFooter(pageNumber);
            }

            // Tab Title: Bold, Size 14
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.text(`Tab: ${tab.title}`, margin, cursorY);
            cursorY += 10;

            // Questions and Answers
            const tabQuestions = questions[tab.title] || [];
            tabQuestions.forEach((question, questionIndex) => {
                // Page break check
                if (cursorY + 15 > pageHeight - margin) {
                    pdf.addPage();
                    cursorY = margin + headerHeight;
                    pageNumber++;
                    addFooter(pageNumber);
                }

                // Question: Normal, Size 12
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                const questionText = `${questionIndex + 1}. ${question.questionDescription}`;
                const questionLines = pdf.splitTextToSize(questionText, pageWidth - 2 * margin);
                pdf.text(questionLines, margin, cursorY);
                cursorY += questionLines.length * 6;

                // Answer: Italic, Size 12
                pdf.setFont("helvetica", "italic");
                const selectedAnswer = question.answers.find((a) => a.selected);
                const answerText = selectedAnswer
                    ? `Answer: ${selectedAnswer.answerDescription}`
                    : "Answer: Not Answered";
                const answerLines = pdf.splitTextToSize(answerText, pageWidth - 2 * margin);
                pdf.text(answerLines, margin + 10, cursorY);
                cursorY += answerLines.length * 6 + 5;
            });

            // Add spacing between tabs
            cursorY += 5;
        });


        // Save the PDF
        pdf.save("questions-and-answers-with-summary-and-header.pdf");
    };



    const exportConfig = () => {
        const txt = `{
  "hasDateShift": true,
  "dateShiftLowrange": -30,
  "dateShiftHighrange": 30
}`
        const element = document.createElement("a");
        const file = new Blob([txt], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = "connector-config.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const report_tab =
        <div key="report" className="p-4 bg-white shadow rounded-lg">
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
            <div className="mb-2">
                <strong>Current Risk (%):</strong> {(currentRiskPc * 100).toFixed(2) + "%"}
            </div>
            <div className="mb-2 text-red-500">
                <strong>High-Risk Answers:</strong> {totalHighRiskAnswers}
            </div>
            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Top 5 questions significantly impacting the Risk Assessment</h3>
            <div>
                {(() => {
                    // Gather all questions into a single array with their tab
                    let allQuestions: { tab: string; question: Question; risk: number }[] = [];
                    Object.keys(questions).forEach((tab) => {
                        questions[tab]?.forEach((question) => {
                            const selectedAnswer = question.answers.find((answer) => answer.selected);
                            if (selectedAnswer) {
                                const risk = selectedAnswer.riskLevel * question.riskWeight;
                                allQuestions.push({ tab, question, risk });
                            }
                        });
                    });

                    // Sort questions by risk descending and take the top 5
                    const topQuestions = allQuestions
                        .sort((a, b) => b.risk - a.risk)
                        .slice(0, 5);

                    // Render top 5 high-risk questions with their tabs
                    return topQuestions.map(({ tab, question, risk }, index) => (
                        <div key={question.questionId} className="mb-4">
                            <p className="text-sm">
                                <strong>{index + 1}. {question.questionDescription}</strong> (Tab: {tab})
                            </p>
                            <p className="text-xs text-gray-500">
                                Risk: {risk.toFixed(2)} | Selected Answer: {question.answers.find((a) => a.selected)?.answerDescription || 'Not Answered'}
                            </p>
                        </div>
                    ));
                })()}
            </div>
            <div className="flex flex-row mt-4">
                <span onClick={() => exportPDF()} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <FaFilePdf />
                    <p className='ml-2 text-sm'> Export PDF</p>
                </span>
                <span onClick={() => exportConfig()} className="flex items-center ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <GrDocumentConfig />
                    <p className='ml-2 text-sm'> Export connector configuration</p>
                </span>
            </div>
        </div>;

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

        try {
            const id = await createReply(replyToSave);
            if(!id) {
                throw "Error creating the new version."
            }
            showToast("success", "New reply successfully saved.")
            router.push("/risk_assessment")
        } catch (error) {
            showToast("error", String(error))
        }
    }

    return (
        <>
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
            <div id="all-tabs">
                {activeTab !== '8' && (
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
                            formatTextValue={value=>currentRisk + ""}
                            textColor='black'
                            animate={false}
                        />

                        {(totalHighRiskAnswers > 0) && (
                            <div className="flex items-center">
                                <MdOutlineWarningAmber size={70} color='#EA4228' className="inline-block"/>
                                <div className="inline-block items-center text-red-700" >You've selected a <br/>high-risk answer</div>
                            </div>
                        )}
                    </div>
                )}
                {/* <TabsComponent questions={questions} /> */}

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

                <div className="py-5 px-3 border rounded-b-lg shadow-lg">
                    {/* {
                        exportInProgress ?
                            tabs.map(t => t?.content) :
                            tabs.find((tab) => tab.id === activeTab)?.content
                    } */}
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
