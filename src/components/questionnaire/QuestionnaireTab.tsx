import { Tooltip } from 'flowbite-react';
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
                    <form className="">
                        {/* Form question & Tooltip */}
                        <div className="flex justify-between gap-4 items-center">
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                {question.questionDescription}
                            </label>
                            {/* Question tooltip */}
                            {question.tooltip && (
                                <Tooltip style="light" 
                                    arrow={false} 
                                    placement="right" 
                                    className="text-sm"
                                    content={(
                                        <div className="w-80 text-gray-800 text-wrap">
                                            {question.tooltip}
                                        </div>
                                    )}
                                >
                                    <div className="p-1">
                                        <FaCircleInfo className="text-gray-300 group-hover:text-gray-400 cursor-pointer" />
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                        
                        {/* Form select dropdown */}
                        <div className="flex flex-col">
                            <select
                                id={question.questionId}
                                className={`bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-xs p-2.5 ${question.prefilledBy ? "border-blue-400" : isQuestionAnswered(question) ? "border-green-400" : "border-red-400"
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

                            {/* Answer prefilled by message */}
                            {question.prefilledBy && (
                                <div className="m-1 text-gray-500 text-[0.625rem] font-medium">
                                    Prefilled by answer "{question.prefilledBy.answerDescription}" (Tab {question.prefilledBy.questionTab} Q{question.prefilledBy.questionId})
                                </div>
                            )}
                        </div>
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