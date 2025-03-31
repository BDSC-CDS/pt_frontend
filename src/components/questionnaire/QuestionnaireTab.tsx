import { Tooltip } from "flowbite-react";
import { FaCircleInfo } from "react-icons/fa6";
import { Question } from "~/utils/questions";
import QuestionnaireSelectInput from "./QuestionnaireSelectInput";

interface QuestionnaireTabProps {
    tabQuestions: Question[] | undefined;
    setSelectedAnswer: (question: Question, answerId: string) => void;
}

export default function QuestionnaireTab({
    tabQuestions,
    setSelectedAnswer
}: QuestionnaireTabProps) {
    return (
        <>
            {tabQuestions && tabQuestions.map((question) => (
                <div key={question.questionId} className="my-4 flex flex-col">
                    <form>
                        {/* Question & Tooltip */}
                        <div className="flex items-center justify-between gap-4">
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                {question.questionDescription}
                            </label>

                            {question.tooltip && (
                                <Tooltip
                                    style="light"
                                    arrow={false}
                                    placement="right"
                                    className="text-sm"
                                    content={
                                        <div className="text-wrap w-80 text-gray-800">
                                            {question.tooltip}
                                        </div>
                                    }
                                >
                                    <div className="p-1">
                                        <FaCircleInfo className="cursor-pointer text-gray-300 group-hover:text-gray-400" />
                                    </div>
                                </Tooltip>
                            )}
                        </div>

                        <div className="flex w-full flex-col">
                            <QuestionnaireSelectInput 
                                question={question}
                                onSelect={(answerId) => {
                                    setSelectedAnswer(question, answerId);
                                }} 
                            />
                            {question.prefilledBy && (
                                <div className="m-1 text-[0.625rem] font-medium text-gray-500">
                                    Prefilled by answer "
                                    {question.prefilledBy.answerDescription}" to question "
                                    {question.prefilledBy.questionDescription} (
                                    {question.prefilledBy.questionTab})"
                                </div>
                            )}
                        </div>
                    </form>

                    {/* High-risk warning */}
                    {question.highRiskAnswerSelected && (
                        <div className="mt-2 flex items-center text-sm font-medium text-red-500">
                            <svg
                                className="mr-2 inline h-5 w-5 text-red-500"
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
        </>
    );
}
