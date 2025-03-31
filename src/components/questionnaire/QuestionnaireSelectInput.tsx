import React, { useState } from 'react';
import { Dropdown } from 'flowbite-react';
import { HiChevronUpDown } from 'react-icons/hi2';
import { Question } from '~/utils/questions';

interface QuestionnaireSelectInputProps {
    question: Question;
    onSelect: (answerId: string) => void;
}

/**
 * A custom select input form component used in the questionnaire.
 */
function QuestionnaireSelectInput({question, onSelect}: QuestionnaireSelectInputProps) {
    const [selected, setSelected] = useState<string | null>(question.answers.find(answer => answer.selected)?.answerDescription || null);

    const handleSelect = (answerId: string | null) => {
        setSelected(question.answers.find(answer => answer.answerId === answerId)?.answerDescription || null);
        if(answerId) {
            onSelect(answerId);
        }
        question.prefilledBy = undefined; // Reset prefilledBy when a new answer is selected
    };

    return (
        <div className="relative">
            <div className={`px-2 py-2 border rounded-lg bg-gray-50
                ${question.prefilledBy
                    ? "border-blue-400"
                    : selected
                        ? "border-green-400"
                        : "border-red-400"
                }`}
            >
                <Dropdown
                    label={selected || 'Select an option'}
                    className="w-full rounded-lg"
                    renderTrigger={() => (
                        <div className="flex items-center justify-between cursor-pointer text-sm">
                            <span className="select-none w-11/12">
                                {selected || 'Select an option'}
                            </span>
                            <HiChevronUpDown size={20} className="text-gray-400"/>
                        </div> 
                    )}
                >
                    <div
                        className=""
                    >
                        {selected && (
                            <Dropdown.Item
                                className="text-sm text-gray-400"
                                onClick={() => handleSelect(null)}
                            >
                                Select an option
                            </Dropdown.Item>
                        )}
                        {question.answers.map((answer) => (
                            <Dropdown.Item
                                key={answer.answerId}
                                className="text-sm text-left"
                                onClick={() => handleSelect(answer.answerId)}
                            >
                                {answer.answerDescription}
                            </Dropdown.Item>
                        ))}
                    </div>
                </Dropdown>
            </div>
            
        </div>
    );
}

export default QuestionnaireSelectInput;