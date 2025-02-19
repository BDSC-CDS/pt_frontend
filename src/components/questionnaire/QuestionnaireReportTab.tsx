import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { FaFilePdf } from "react-icons/fa6";
import { GrDocumentConfig } from 'react-icons/gr';
import { Question, Questions } from '~/utils/questions';

interface QuestionnaireReportTabProps {
    replyName: string | undefined;
    questions: Questions;
    currentRiskPc: number;
    reportData: {
        totalHighRiskAnswers: number;
        totalQuestionsAnswered: number;
        sectionsCompleted: string[];
        missingDataSections: string[];
        overallCompletionRate: string;
    }
}

export default function QuestionnaireReportTab({ replyName, questions, currentRiskPc, reportData}: QuestionnaireReportTabProps) {
    const [exportInProgress, setExportInProgress] = useState(false);

    const handleExportPDF = async () => {
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
            pdf.text(`Privacy Toolbox Questionnaire Report - Project: ${ replyName || ""}`, margin, pageHeight - 10);
            pdf.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
        };

        let pageNumber = 1;

        // Add header to the first page
        await addHeader(true);
        addFooter(pageNumber);

        // Step 1: Add Summary
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");


        pdf.setFont("helvetica", "bold");
        pdf.text("Summary", margin, cursorY);
        cursorY += 10;

        const summaryContent = [
            `Project Title: ${replyName || ""}`,
            `Total Questions Answered: ${reportData.totalQuestionsAnswered}`,
            `Sections Completed: ${reportData.sectionsCompleted.join(", ")}`,
            `Missing Data Sections: ${reportData.missingDataSections.length > 0
                ? reportData.missingDataSections.join(", ")
                : "None"}`,
            `Overall Completion Rate: ${reportData.overallCompletionRate}`,
            `Current Risk Score: ${(currentRiskPc * 100).toFixed(2)}%`,
            `Total High Risk Answers: ${reportData.totalHighRiskAnswers}`,
        ];

        summaryContent.forEach((line) => {
            const wrappedLines = pdf.splitTextToSize(line, pageWidth - 2 * margin);
            pdf.text(wrappedLines, margin, cursorY);
            cursorY += wrappedLines.length * 6;
        });

        cursorY += 10;

        // Step 2: Add Questions and Answers
        Object.keys(questions).forEach((tab) => {
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
            pdf.text(`Tab: ${tab}`, margin, cursorY);
            cursorY += 10;

            // Questions and Answers
            const tabQuestions = questions[tab] || [];
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
    }

    const handleExportSPHNConfig = async () => {
        const txt = 
            `{
                "hasDateShift": true,
                "dateShiftLowrange": -30,
                "dateShiftHighrange": 30
            }`;
        const element = document.createElement("a");
        const file = new Blob([txt], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = "connector-config.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    
    return (
        <div key="report" className="p-4 rounded-lg">
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
                <strong>High-Risk Answers:</strong> {reportData.totalHighRiskAnswers}
            </div>
            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Top 5 questions significantly impacting the Risk Assessment</h3>
            <div>
                {(() => {
                    // Gather all questions into a single array with their tab
                    let allQuestions: { tab: string; question: Question; risk: number; }[] = [];
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
                    if (topQuestions.length === 0) {
                        return <p>No high-risk questions found.</p>;
                    }
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
            <hr className="my-4" />
            <div className="flex flex-row justify-center mt-4">
                <span onClick={() => handleExportPDF()} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <FaFilePdf />
                    <p className='ml-2 text-sm'>Export PDF</p>
                </span>
                <span onClick={() => handleExportSPHNConfig()} className="flex items-center ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <GrDocumentConfig />
                    <p className='ml-2 text-sm'>Export connector configuration</p>
                </span>
            </div>
        </div>
    );
};