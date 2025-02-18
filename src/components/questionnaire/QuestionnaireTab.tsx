import React from 'react';
import { FaCircleInfo } from "react-icons/fa6";
import { Question } from '~/utils/questions';

interface QuestionnaireTabProps {
    tabQuestions: Question[] | undefined;
    setSelectedAnswer: (question: Question, answerId: string) => void;
    getSelectedAnswer: (question: Question) => string | undefined;
    isQuestionAnswered: (question: Question) => boolean;
}

export default function QuestionnaireTab({ tabQuestions, setSelectedAnswer, getSelectedAnswer, isQuestionAnswered }: QuestionnaireTabProps) {
    return (
        <div>
            {tabQuestions && tabQuestions.map((question) => (
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
                            className={`bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-xs p-2.5 ${question.disabled ? "border-gray-200 text-gray-400 cursor-not-allowed" : isQuestionAnswered(question) ? "border-green-400" : "border-red-400"
                                }`}
                            value={getSelectedAnswer(question)}
                            onChange={(e) => setSelectedAnswer(question, e.target.value)}
                            disabled={question.disabled}
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