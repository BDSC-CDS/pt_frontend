import { Tooltip } from "flowbite-react";
import { FaCircleInfo } from "react-icons/fa6";
import { Listbox } from "@headlessui/react";
import { Question } from "~/utils/questions";
import { HiChevronUpDown } from "react-icons/hi2";

interface QuestionnaireTabProps {
    tabQuestions: Question[] | undefined;
    setSelectedAnswer: (question: Question, answerId: string) => void;
    getSelectedAnswer: (question: Question) => string | undefined;
    isQuestionAnswered: (question: Question) => boolean;
}

export default function QuestionnaireTab({
    tabQuestions,
    setSelectedAnswer,
    getSelectedAnswer,
    isQuestionAnswered,
}: QuestionnaireTabProps) {
    return (
        <div>
            {tabQuestions &&
                tabQuestions.map((question) => (
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

                            {/* Custom Dropdown with Headless UI */}
                            <div className="flex w-full max-w-xs flex-col">
                                <Listbox
                                    value={getSelectedAnswer(question)}
                                    onChange={(value) => setSelectedAnswer(question, value)}
                                >
                                    <div className="relative">
                                        <Listbox.Button
                                            className={`w-full appearance-none rounded-lg border bg-gray-50 p-2.5 pr-10 text-left text-sm focus:border-blue-500 focus:ring-blue-500
                      ${question.prefilledBy
                                                    ? "border-blue-400"
                                                    : isQuestionAnswered(question)
                                                        ? "border-green-400"
                                                        : "border-red-400"
                                                }`}
                                        >
                                            <span className="block whitespace-normal break-words">
                                                {question.answers.find(
                                                    (a) => a.answerId === getSelectedAnswer(question),
                                                )?.answerDescription || "Select an option"}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <HiChevronUpDown
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>

                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {question.answers.map((answer) => (
                                                <Listbox.Option
                                                    key={answer.answerId}
                                                    value={answer.answerId}
                                                    className={({ active }) =>
                                                        `cursor-pointer select-none px-4 py-2 ${active
                                                            ? "bg-blue-100 text-blue-900"
                                                            : "text-gray-900"
                                                        }`
                                                    }
                                                >
                                                    <span className="block whitespace-normal break-words">
                                                        {answer.answerDescription}
                                                    </span>
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </div>
                                </Listbox>

                                {/* Prefilled message */}
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
        </div>
    );
}
