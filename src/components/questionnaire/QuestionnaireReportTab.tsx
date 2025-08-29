import React, { useState } from 'react';
import { FaFilePdf } from "react-icons/fa6";
import { GrDocumentConfig } from 'react-icons/gr';
import { PDFReportService } from '~/utils/pdfReport';
import { Question, Questions } from '~/utils/questions';
import { showToast } from '~/utils/showToast';


interface QuestionnaireReportTabProps {
    replyName: string | undefined;
    questions: Questions;
    currentRisk: number;
    reportData: {
        totalHighRiskAnswers: number;
        totalQuestionsAnswered: number;
        sectionsCompleted: string[];
        missingDataSections: string[];
        overallCompletionRate: string;
    }
}

export default function QuestionnaireReportTab({ replyName, questions, currentRisk, reportData}: QuestionnaireReportTabProps) {
    const riskLabel = currentRisk > 45
        ? { text: "Medium Risk", color: "#e9c46a" } // Yellow
        : { text: "Low to Medium Risk", color: "#2a9d8f" }; // Green
    
    // Handler for exporting PDF report
    const handleExportPDF = async () => {
        try {
            const pdfReportService = new PDFReportService();
            await pdfReportService.generateReport(
                replyName || "Unknown Project",
                questions,
                currentRisk,
                reportData,
                riskLabel
            );
        } catch (error) {
            console.error('Error generating PDF report:', error);
            showToast("error", "Error generating PDF report: " + error)
        }
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
                <strong>Risk Score:</strong> {currentRisk}
            </div>
            <div className="mb-2">
                <strong>Risk Level:</strong> {riskLabel.text}
            </div>
            <div className="mb-2 text-red-500">
                <strong>High-Risk Answers:</strong> {reportData.totalHighRiskAnswers}
            </div>

            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-2">High-risk answers selected</h3>
            <div>
                {(() => {
                    // Gather all questions into a single array with their tab
                    let allQuestions: { tab: string; question: Question; risk: number; }[] = [];
                    Object.keys(questions).forEach((tab) => {
                        questions[tab]?.forEach((question) => {
                            const selectedAnswer = question.answers.find((answer) => answer.selected && answer.highRisk);
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
                            <p className="text-xs text-red-500">
                                Selected Answer: {question.answers.find((a) => a.selected)?.answerDescription || 'Not Answered'}
                            </p>
                        </div>
                    ));
                })()}
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
                    <p className='ml-2 text-sm'>Download PDF</p>
                </span>
                <span onClick={() => handleExportSPHNConfig()} className="flex items-center ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <GrDocumentConfig />
                    <p className='ml-2 text-sm'>Download connector configuration</p>
                </span>
            </div>
        </div>
    );
};