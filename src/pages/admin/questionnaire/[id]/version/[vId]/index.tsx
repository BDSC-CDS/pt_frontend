
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, Accordion, ToggleSwitch, Textarea } from 'flowbite-react';
import TimeAgo from 'react-timeago'
import { getQuestionnaire } from "../../../../../../utils/questionnaire"
import CounterInput from "../../../../../../components/CounterInput"
import { MdSave, MdOutlineAdd, MdDragIndicator } from "react-icons/md";
import { HiPencilAlt, HiTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { TemplatebackendQuestionnaire, TemplatebackendQuestionnaireVersion, TemplatebackendQuestionnaireQuestion, TemplatebackendQuestionnaireQuestionAnswer } from '~/internal/client';
import cloneDeep from "lodash/cloneDeep";
import NewQuestionnaireVersionModal from '~/components/modals/admin/NewQuestionnaireVersionModal';
import useUnsavedChangesWarning from '~/hooks/useUnsavedChangesWarning';
import withAdmin from '~/components/withAdmin';
import { showToast } from '~/utils/showToast';
import { v4 as uuid } from 'uuid';


interface Version extends TemplatebackendQuestionnaireVersion {
    tabs?: string[]
}

type Tab = {
    tabName: string;
    questions: TemplatebackendQuestionnaireQuestion[];
};

type Tabs = Tab[];

/**
 * Admin questionnaire version page.
 */
function QuestionnaireVersion() {

    // Routing
    const router = useRouter();
    const { id, vId } = router.query;
    const questionnaireId = Number(id);
    const versionId = vId;

    // Enable unsaved changes warning
    const [isDirty, setIsDirty] = useState(false);
    useUnsavedChangesWarning(isDirty)
    useUnsavedChangesWarning(isDirty)

    // Questionnaire States
    const [questionnaire, setQuestionnaire] = useState<TemplatebackendQuestionnaire>({});
    const [version, setVersion] = useState<Version>({});
    const [tabs, setTabs] = useState<Tabs>([]);
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null)
    const [draggedOverTabIndex, setDraggedOverTabIndex] = useState<number | null>(null)
    const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<number | null>(null)
    const [draggedOverQuestionIndex, setDraggedOverQuestionIndex] = useState<number | null>(null)

    // Tabs drag and drop handlers
    const handleDragTabStart = (index: number) => {
        setDraggedTabIndex(index)
    };

    const handleDragTabOver = (event: React.DragEvent<HTMLLIElement>, index: number) => {
        event.preventDefault()
        setDraggedOverTabIndex(index)
    };

    const handleDropTab = (index: number) => {
        if (draggedTabIndex === null || draggedTabIndex === index){
            return
        }

        const updatedTabs = [...tabs]
        const movedTab = updatedTabs.splice(draggedTabIndex, 1)[0]
        if(!movedTab){
            return
        }

        // Insert at new position
        updatedTabs.splice(index, 0, movedTab)

        // Set the tabs and version
        setTabs(updatedTabs);
        version.tabs = updatedTabs.map(tab => tab.tabName)
        version.questions = updatedTabs.flatMap(tab => tab.questions)
        processQuestionnaireVersion(version)
        setActiveTabIndex(index)
        setDraggedTabIndex(null)
        setDraggedOverTabIndex(null)
        setIsDirty(true)
    };

    // Questions drag and drop handlers
    const handleDragQuestionStart = (index: number) => {
        setDraggedQuestionIndex(index)
    };

    const handleDragQuestionOver = (event: React.DragEvent<HTMLTableRowElement>, index: number) => {
        event.preventDefault()
        setDraggedOverQuestionIndex(index)
    };

    const handleDropQuestion = (index: number) => {
        if (draggedQuestionIndex === null || draggedQuestionIndex === index){
            return
        }

        if(activeTabIndex && tabs && tabs[activeTabIndex]){
            const updatedQuestions = [...tabs?.[activeTabIndex]?.questions ?? []]
            const movedQuestion = updatedQuestions.splice(draggedQuestionIndex, 1)[0]
            if(!movedQuestion){
                return
            }

            // Insert at new position
            updatedQuestions.splice(index, 0, movedQuestion)
            version.questions = tabs.flatMap(tab => tab.questions)
            processQuestionnaireVersion(version)
            setDraggedQuestionIndex(null)
            setDraggedOverQuestionIndex(null)
            setIsDirty(true)
        }
    };

    // Load questionnaire and all its versions
    const loadQuestionnaire = async () => {
        const result = await getQuestionnaire(questionnaireId);
        if (!result) {
            return
        }

        setQuestionnaire(result);
        const v = (result.versions || []).find(v => v.id == versionId);
        if (!v) {
            return
        }

        processQuestionnaireVersion(v);
    }

    // Process 
    const processQuestionnaireVersion = (v: Version) => {
        // fix pointers on uuid
        for (let question of v.questions || []) {
            question.tmpUUID = uuid();
            question.answers?.forEach(a => {
                a.tmpUUID = uuid();
            });
        }
        for (let question of v.questions || []) {
            question.answers?.forEach(a => {
                a.rulePrefills?.forEach(r => {
                    const question = v.questions?.find(q => q.id == r.questionId);
                    r.tmpQuestionUUID = question?.tmpUUID;

                    const answer = question?.answers?.find(a => a.id == r.answerId);
                    r.tmpAnswerUUID = answer?.tmpUUID;
                });
            });
        }

        if (!v.tabs) {
            const tabMap: any = {};
            v.questions?.forEach(q => {
                if (!q.tab) return;
                tabMap[q.tab] = true;
            });
            v.tabs = Object.keys(tabMap);
        }

        setVersion(v);

        const ts: Tabs = [];
        for (let tabName of v.tabs) {
            ts.push({
                tabName,
                questions: [],
            })
        }

        for (let question of v.questions || []) {
            if (!question.tab) {
                continue
            }

            const t = ts.find(t => t.tabName == question.tab);
            if (!t) {
                continue
            }

            t.questions.push(question);
        }

        setTabs(ts);
    }

    useEffect(() => {
        if (!questionnaireId) {
            return
        } try {
            loadQuestionnaire();
        } catch (error) {
            showToast("error", "Error listing questionnaire versions.")
        }
    }, [questionnaireId]);

    // Save questionnaire version modal
    const [openSaveModal, setOpenSaveModal] = useState(false);

    // Everything to add a tab
    const [openCreateTabModal, setOpenCreateTabModal] = useState(false);
    const [createTabName, setCreateTabName] = useState('');
    const createTab = () => {
        if (!version.tabs) {
            version.tabs = []
        }

        version.tabs.push(createTabName);
        setActiveTabIndex(version.tabs?.length-1)
        setOpenCreateTabModal(false)
        
        // version.questions = version.questions?.filter(q => q.tab != tabToRemove?.tabName);
        processQuestionnaireVersion(version);
        setIsDirty(true)
    }

    // Everything to edit a tab name
    const [openEditTabModal, setOpenEditTabModal] = useState(false);
    const [tabToEdit, setTabToEdit] = useState<Tab>();
    const [editedTabName, setEditedTabName] = useState<string>('');
    const handleEditTab = (n: number) => {
        if(tabs && tabs[n]){
            setOpenEditTabModal(true);
            setTabToEdit(tabs[n]);
            setEditedTabName(tabs[n]?.tabName || "");
        }
    };
    const editTabName = () => {
        setOpenEditTabModal(false);
        version.questions = version.questions?.map(q => {
            if(q.tab == tabToEdit?.tabName){
                q.tab = editedTabName;
            }
            return q;
        });
        version.tabs = (version.tabs || []).map(t => t == tabToEdit?.tabName ? editedTabName : t)
        processQuestionnaireVersion(version);
        setIsDirty(true)
    };

    // Everything to remove a tab and it's questions
    const [openRemoveTabModal, setOpenRemoveTabModal] = useState(false);
    const [tabToRemove, setTabToRemove] = useState<Tab>();
    const handleRemoveTab = (n: number) => {
        setOpenRemoveTabModal(true);
        setTabToRemove(tabs[n])
    };
    const removeTab = () => {
        setOpenRemoveTabModal(false);

        version.questions = version.questions?.filter(q => q.tab != tabToRemove?.tabName);
        version.tabs = (version.tabs || []).filter(t => t != tabToRemove?.tabName)
        processQuestionnaireVersion(version);
        setIsDirty(true)
    };

    // Everything to remove a question
    const [openRemoveQuestionModal, setOpenRemoveQuestionModal] = useState(false);
    const [questionToRemove, setQuestionToRemove] = useState<TemplatebackendQuestionnaireQuestion>();
    const removeQuestionConfirmation = (question: TemplatebackendQuestionnaireQuestion) => {
        setOpenRemoveQuestionModal(true);
        setQuestionToRemove(question)
    };
    const removeQuestion = () => {
        setOpenRemoveQuestionModal(false);

        version.questions = version.questions?.filter(q => q.id !== questionToRemove?.id);

        processQuestionnaireVersion(version);
        setIsDirty(true);
    };

    // Everything to create a new question
    const createNewQuestion = () => {
        editQuestion({
            id:( questionToEdit?.id || 0) + 1, 
            tmpUUID: uuid(),
            tab: tabs[activeTabIndex]?.tabName,
        });
    };

    // Everything to edit a question
    const [openEditQuestionModal, setOpenEditQuestionModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<TemplatebackendQuestionnaireQuestion>();
    const editQuestion = (question: TemplatebackendQuestionnaireQuestion) => {
        setOpenEditQuestionModal(false);
        setQuestionToEdit(cloneDeep(question));
        setOpenEditQuestionModal(true);
    };

    const handleInputChange = (updatedValue: any, fieldName: keyof TemplatebackendQuestionnaireQuestion) => {
        setQuestionToEdit((prevQuestion) => ({
            ...prevQuestion,
            [fieldName]: updatedValue
        }));
    };

    const handleAnswerInputChange = (index: number, updatedValue: any, fieldName: keyof TemplatebackendQuestionnaireQuestionAnswer) => {
        const updatedAnswers = questionToEdit?.answers || []
        updatedAnswers[index] = {
            ...updatedAnswers[index],
            [fieldName]: updatedValue
        }

        handleInputChange(updatedAnswers, "answers")
    }

    const saveEditedQuestion = () => {
        setOpenEditQuestionModal(false);

        if(!version.questions){
            version.questions = []
        }

        const i = version.questions?.findIndex(q => q.id == questionToEdit?.id);
        if (questionToEdit) {
            if(i !== undefined && i !== -1){
                version.questions[i] = questionToEdit;
            } else {
                version.questions.push(questionToEdit)
            }
        }

        processQuestionnaireVersion(version);
        setIsDirty(true)
    }

    const [addAnswerText, setAddAnswerText] = useState("");
    const [addAnswerRiskLevel, setAddAnswerRiskLevel] = useState(0);
    const [addAnswerHighRisk, setAddAnswerHighRisk] = useState(false);
    const addAnswer = () => {
        // Create a new answer object
        const newAnswer = {
            text: addAnswerText,
            riskLevel: addAnswerRiskLevel,
            highRisk: addAnswerHighRisk,
            tmpUUID: uuid(),
        };

        setAddAnswerText("")
        setAddAnswerRiskLevel(0)
        setAddAnswerHighRisk(false)

        // Reopen modal with new question
        editQuestion({ ...questionToEdit, answers: [...(questionToEdit?.answers || []), newAnswer] })
    };

    if (!questionnaire) {
        return (
            <div>
                <p>Questionnaire not found...</p>
            </div>
        )
    }

    const [openAddRulePrefillModal, setAddRulePrefillModal] = useState(false);
    const [rulePrefillModalAnswer, setRulePrefillModalAnswer] = useState<TemplatebackendQuestionnaireQuestionAnswer>();
    const [rulePrefillModalAnswerIndex, setRulePrefillModalAnswerIndex] = useState<number>();
    const [rulePrefillModalQuestion, setRulePrefillModalQuestion] = useState<TemplatebackendQuestionnaireQuestion>();
    const [rulePrefillModalQuestionAnswer, setRulePrefillModalQuestionAnswer] = useState<TemplatebackendQuestionnaireQuestionAnswer>();
    const [rulePrefillFilter, setRulePrefillFilter] = useState("");

    const addRulePrefil = (answer: TemplatebackendQuestionnaireQuestionAnswer, n: number) => {
        // console.log("rule prefill answerId", answerID);
        setRulePrefillModalAnswer(answer);
        setRulePrefillModalAnswerIndex(n);
        setAddRulePrefillModal(true);
    }

    const saveRulePrefill = () => {
        rulePrefillModalAnswer?.rulePrefills?.push({
            answerId: rulePrefillModalQuestionAnswer?.id,
            answerText: rulePrefillModalQuestionAnswer?.text,
            questionId: rulePrefillModalQuestion?.id
        });

        handleAnswerInputChange(rulePrefillModalAnswerIndex || 0, rulePrefillModalAnswer?.rulePrefills, "rulePrefills");

        setAddRulePrefillModal(false);
        setRulePrefillModalAnswer(undefined);
        setRulePrefillModalAnswerIndex(undefined);
        setRulePrefillModalQuestion(undefined);
        setRulePrefillModalQuestionAnswer(undefined);
        setRulePrefillFilter("");
    }

    const removeRulePrefill = ( answer: TemplatebackendQuestionnaireQuestionAnswer, answerIndex: number, rulePrefillIndex: number) => {
        console.log("remove rule prefill", answer, answerIndex, rulePrefillIndex);
        answer.rulePrefills?.splice(rulePrefillIndex, 1);
        console.log("remove rule prefill after", answer.rulePrefills);
        handleAnswerInputChange(answerIndex, answer.rulePrefills, "rulePrefills");
    }

    return (
        <>
            <Head>
                <title>{'Questionnaire ' + questionnaire.name}</title>
            </Head>

            <div className="flex flex-row items-end p-5">
                <span onClick={() => setOpenSaveModal(true)} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 ml-auto rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'> Save</p>
                </span>
            </div>

            <div className="flex flex-col mb-5">
                <Table>
                    <Table.Body className="divide-y">
                        <Table.Row key="questionnaireName">
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.Cell>{questionnaire.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row key="creationDate">
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.Cell><TimeAgo date={questionnaire.createdAt || ''} /></Table.Cell>
                        </Table.Row>
                        <Table.Row key="modificationDate">
                            <Table.HeadCell>Last modified</Table.HeadCell>
                            <Table.Cell><TimeAgo date={questionnaire.updatedAt || ''} /></Table.Cell>
                        </Table.Row>
                        <Table.Row key="questionnaireVersion">
                            <Table.HeadCell>Version</Table.HeadCell>
                            <Table.Cell>{version.version || ''}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>

            <div className="flex flex-col w-full">
                <div className="overflow-auto border rounded-t-lg shadow">
                    <ul className="flex flex-row justify-between h-full">
                        {tabs.map((tab, n) => (
                            <li
                                key={`tab${n}`}
                                draggable={true}
                                onDragStart={() => handleDragTabStart(n)}
                                onDragOver={(e) => handleDragTabOver(e, n)}
                                onDrop={() => handleDropTab(n)}
                                className={`flex-grow text-left hover:bg-gray-100 pt-3 pb-4 cursor-pointer text-md text-gray-600 
                                    ${activeTabIndex === n && ' border-t-2 border-gray-400 bg-gray-50'}
                                    ${draggedOverTabIndex === n && draggedTabIndex !== n && 'bg-blue-50'}
                                `}
                                onClick={() => setActiveTabIndex(n)}
                            >
                                <div className="flex items-center px-2 justify-between h-full">
                                    <div className="pr-3">
                                        <MdDragIndicator className="cursor-grab" />
                                    </div>

                                    <div className="flex items-center">
                                        <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                                            {n + 1}
                                        </span>
                                        <h3 className="font-medium leading-tight pl-2 pr-2">{tab.tabName}</h3>
                                    </div>

                                    <div className="flex flex-row">
                                        <span className="p-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg cursor-pointer" onClick={() => handleEditTab(n)}>
                                            <HiPencilAlt />
                                        </span>
                                        <span className="p-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg cursor-pointer" onClick={() => handleRemoveTab(n)}>
                                            <HiTrash />
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <button className="px-2 pt-3 pb-4 hover:bg-gray-100 cursor-pointer flex items-center gap-1" onClick={() => setOpenCreateTabModal(true)}>
                            <MdOutlineAdd size={25}/>
                            <span className="text-left">New tab</span>
                        </button>
                    </ul>
                </div>
                
                <div className="overflow-auto border rounded-t-none rounded-b-lg shadow">
                    {tabs.length > 0 && (
                        <Table className="" hoverable>
                            <Table.Head className='rounded-t-none'>
                                <Table.HeadCell className="w-0 p-0"/>
                                <Table.HeadCell>Question</Table.HeadCell>
                                <Table.HeadCell>Risk weight</Table.HeadCell>
                                <Table.HeadCell>Answer Type</Table.HeadCell>
                                <Table.HeadCell>Answers</Table.HeadCell>
                                {/* <Table.HeadCell>Flag</Table.HeadCell> */}
                                <Table.HeadCell>Tooltip</Table.HeadCell>
                                <Table.HeadCell/>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {((tabs[activeTabIndex] || {}).questions || []).map((question, i) => (
                                    <Table.Row 
                                        onClick={() => editQuestion(question)} 
                                        key={`question-${i}`} 
                                        className={`bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 cursor-pointer ${draggedOverQuestionIndex === i && draggedQuestionIndex !== i && 'bg-blue-50'}`}
                                        draggable={true}
                                        onDragStart={() => handleDragQuestionStart(i)}
                                        onDragOver={(e) => handleDragQuestionOver(e, i)}
                                        onDrop={() => handleDropQuestion(i)}
                                    >
                                        <Table.Cell className="w-1 p-2"><MdDragIndicator className="cursor-grab" size={16}/></Table.Cell>
                                        <Table.Cell>{question.question}</Table.Cell>
                                        <Table.Cell>{question.riskWeight}</Table.Cell>
                                        <Table.Cell>{question.answerType}</Table.Cell>
                                        <Table.Cell className="whitespace-pre-line">{question.answers?.map(a => "• " + a.text).join('\n')}</Table.Cell>
                                        {/* <Table.Cell>{question.flag}</Table.Cell> */}
                                        <Table.Cell>{question.tooltip}</Table.Cell>
                                        <Table.Cell className="w-1 p-2">
                                            <div className="flex flex-row">
                                                <span className="p-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg cursor-pointer" onClick={() => editQuestion(question)}>
                                                    <HiPencilAlt size={16}/>
                                                </span>
                                                <span className="p-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg cursor-pointer" onClick={(e) => {e.stopPropagation(); removeQuestionConfirmation(question)}}>
                                                    <HiTrash size={16}/>
                                                </span>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )).concat(
                                    <Table.Row key="newQuestion" className="">
                                        <Table.Cell colSpan={8} className="hover:bg-gray-50 cursor-pointer" onClick={() => createNewQuestion()}>
                                            <div className="flex justify-center items-center text-sm gap-2">
                                                <MdOutlineAdd size={20}/>
                                                <span>New question</span>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}

                            </Table.Body>
                        </Table>
                    )}
                </div>
                
                
            </div>


            {/* SAVE NEW VERSION MODAL */}
            <NewQuestionnaireVersionModal show={openSaveModal}  questionnaireId={questionnaireId} questionnaireVersion={version} onSave={() => setIsDirty(false)} onClose={() => setOpenSaveModal(false)}/>

            {/* CREATE TAB MODAL */}
            <Modal show={openCreateTabModal} size="xl" onClose={() => setOpenCreateTabModal(false)} popup>
                <Modal.Header>
                    <p>Create new tab</p>
                </Modal.Header>
                <Modal.Body className="flex flex-col py-5 px-10">
                    <TextInput
                        placeholder="Name"
                        required
                        onChange={(event) => setCreateTabName(event.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer className="p-2 flex justify-center gap-4">
                    <Button onClick={() => createTab()}>
                        Create
                    </Button>
                    <Button color="gray" onClick={() => setOpenCreateTabModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* EDIT TAB MODAL */}
            <Modal show={openEditTabModal} size="xl" onClose={() => setOpenEditTabModal(false)} popup>
                <Modal.Header>
                    <p>Rename tab</p>
                </Modal.Header>
                <Modal.Body className="flex flex-col py-5 px-10">
                    <TextInput
                        value={editedTabName}
                        placeholder="Name"
                        required
                        onChange={(event) => setEditedTabName(event.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer className="p-2 flex justify-center gap-4">
                    <Button onClick={() => editTabName()}>
                        Edit
                    </Button>
                    <Button color="gray" onClick={() => setOpenEditTabModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* REMOVE TAB MODAL */}
            <Modal show={openRemoveTabModal} size="md" onClose={() => setOpenRemoveTabModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete the tab <b>{tabToRemove?.tabName} </b>
                            and the <b>{tabToRemove?.questions.length} question(s)</b> it contains?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => removeTab()}>
                                Yes
                            </Button>
                            <Button color="gray" onClick={() => setOpenRemoveTabModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* REMOVE QUESTION MODAL */}
            <Modal show={openRemoveQuestionModal} size="md" onClose={() => setOpenRemoveQuestionModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete the question <b>{questionToRemove?.question} </b>?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => removeQuestion()}>
                                Yes
                            </Button>
                            <Button color="gray" onClick={() => setOpenRemoveQuestionModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* EDIT QUESTION MODAL */}
            <Modal show={openEditQuestionModal} size="4xl" onClose={() => setOpenEditQuestionModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className="flex flex-col mb-8">
                            <Table >
                                <Table.Body className="divide-y">
                                    <Table.Row >
                                        <Table.HeadCell>Question</Table.HeadCell>
                                        <Table.Cell>
                                            <TextInput
                                                id="question"
                                                name="question"
                                                placeholder="Text"
                                                required
                                                value={questionToEdit?.question || ""}
                                                onChange={(event) => handleInputChange(event.target.value, 'question')}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.HeadCell>Tooltip</Table.HeadCell>
                                        <Table.Cell>
                                            <TextInput
                                                id="tooltip"
                                                name="tooltip"
                                                placeholder="Tooltip"
                                                required
                                                value={questionToEdit?.tooltip || ""}
                                                onChange={(event) => handleInputChange(event.target.value, 'tooltip')}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row >
                                        <Table.HeadCell>Risk weight</Table.HeadCell>
                                        <Table.Cell>

                                            <CounterInput
                                                placeholder="10"
                                                initValue={questionToEdit?.riskWeight || 0}
                                                onChange={(event) => handleInputChange(event, 'riskWeight')}
                                            />
                                        </Table.Cell>
                                    </Table.Row>

                                    <Table.Row >
                                        <Table.HeadCell>Answers</Table.HeadCell>
                                        <Table.Cell>
                                            <Accordion collapseAll>
                                                {(questionToEdit?.answers || []).map((answer, n) => (
                                                    <Accordion.Panel key={n}>
                                                        <Accordion.Title>{answer.text}</Accordion.Title>
                                                        <Accordion.Content>
                                                            <Table >
                                                                <Table.Body className="divide-y">
                                                                    <Table.Row >
                                                                        <Table.HeadCell>Answer</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <TextInput
                                                                                id={"text-" + { n }}
                                                                                name={"text-" + { n }}
                                                                                placeholder="Answer"
                                                                                required
                                                                                value={questionToEdit?.answers?.[n]?.text}
                                                                                onChange={(event) => handleAnswerInputChange(n, event.target.value, "text")}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>Risk level</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <CounterInput
                                                                                placeholder="10"
                                                                                initValue={questionToEdit?.answers?.[n]?.riskLevel || 0}
                                                                                onChange={(value) => handleAnswerInputChange(n, value, "riskLevel")}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>High risk</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <ToggleSwitch
                                                                                checked={questionToEdit?.answers?.[n]?.highRisk || false}
                                                                                onChange={(value) => handleAnswerInputChange(n, value, "highRisk")}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>Rule Prefills</Table.HeadCell>
                                                                        <Table.Cell>

                                                                            {(answer.rulePrefills || []).map((rulePrefill, m) => (
                                                                                    <>
                                                                                    <Button.Group className="w-72">
                                                                                        <Button color="gray" disabled={true}>{version.questions?.find(q => q.id == rulePrefill.questionId)?.question}</Button>
                                                                                        <Button color="gray" disabled={true}>{rulePrefill.answerText}</Button>
                                                                                        <Button color="gray"><HiTrash size={20} className='cursor-pointer inline-block' onClick={() => removeRulePrefill(answer, n, m)}/></Button>
                                                                                    </Button.Group>
                                                                                    <br/>
                                                                                    </>
                                                                                //<div className="w-48 text-sm font-medium bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                                //</div>
                                                                            )).concat(
                                                                                // <div className="w-48 text-sm font-medium bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                                //     <div className="w-full px-4 py-2">
                                                                                //         <MdOutlineAdd className='inline' /> Add rule prefill
                                                                                //     </div>
                                                                                // </div>
                                                                                <Button color="gray" onClick={() => addRulePrefil(answer, n)}>
                                                                                    <MdOutlineAdd className='inline' /> Add rule prefill
                                                                                </Button>
                                                                            )}


                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>SPHN JSON config</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <Textarea
                                                                                id={"sphn-" + { n }}
                                                                                name={"sphn-" + { n }}
                                                                                placeholder="SPHN JSON config"
                                                                                value={questionToEdit?.answers?.[n]?.jSONConfiguration || ""}
                                                                                onChange={(event) => handleAnswerInputChange(n, event.target.value, "jSONConfiguration")}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                </Table.Body>
                                                            </Table>
                                                        </Accordion.Content>
                                                    </Accordion.Panel>
                                                )).concat(
                                                    <Accordion.Panel key={"newtab"}>
                                                        <Accordion.Title><MdOutlineAdd className='inline' /><b> Add answer</b></Accordion.Title>
                                                        <Accordion.Content>
                                                            <Table >
                                                                <Table.Body className="divide-y">
                                                                    <Table.Row >
                                                                        <Table.HeadCell>Answer</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <TextInput
                                                                                id="text"
                                                                                name="text"
                                                                                placeholder="Answer"
                                                                                required
                                                                                value={addAnswerText}
                                                                                onChange={(event) => setAddAnswerText(event.target.value)}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>Risk level</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <CounterInput
                                                                                placeholder="10"
                                                                                initValue={0}
                                                                                onChange={(event) => setAddAnswerRiskLevel(event)}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>High risk</Table.HeadCell>
                                                                        <Table.Cell>
                                                                            <ToggleSwitch
                                                                                checked={addAnswerHighRisk}
                                                                                onChange={value => setAddAnswerHighRisk(value)}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                </Table.Body>
                                                            </Table>
                                                            <Button onClick={() => addAnswer()}>
                                                                Add
                                                            </Button>
                                                        </Accordion.Content>
                                                    </Accordion.Panel>
                                                )}
                                            </Accordion>
                                        </Table.Cell>
                                    </Table.Row>

                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-center gap-4 border-t-2 bg-gray-50">
                    <Button onClick={() => saveEditedQuestion()}>
                        Save
                    </Button>
                    <Button color="gray" onClick={() => setOpenEditQuestionModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ADD RULE PREFILL MODAL */}
            <Modal show={openAddRulePrefillModal} size="4xl" onClose={() => setAddRulePrefillModal(false)} popup>
                <Modal.Header className="flex justify-center gap-4 border-t-2 bg-gray-50">
                    <div className="flex flex-col p-8 font-medium">
                        When the user select the answer "{rulePrefillModalAnswer?.text}", which question should be prefilled?
                    </div>
                </Modal.Header >
                <Modal.Body>
                    <Accordion collapseAll>
                        <Accordion.Panel>
                            <Accordion.Title id="accordion-title">
                                Select a question
                            </Accordion.Title>
                            <Accordion.Content>
                                <TextInput
                                    placeholder="Filter questions"
                                    onChange={(event) => { setRulePrefillFilter(event.target.value) }}
                                />
                                <Table hoverable>
                                    <Table.Head className="border">
                                        <Table.HeadCell>Tab</Table.HeadCell>
                                        <Table.HeadCell>Question</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y border">
                                        {(version.questions || [])
                                            .filter(question =>
                                                JSON.stringify(question).toLowerCase().includes(rulePrefillFilter)
                                            )
                                            .map((question, n) => (
                                                <Table.Row key={`resultQuestion${n}`} className="cursor-pointer" onClick={() => { 
                                                    setRulePrefillModalQuestion(question);
                                                    // get title and click
                                                    document.getElementById("accordion-title")?.click();
                                                    document.getElementById("accordion-answer-title")?.click();
                                                }}>
                                                    <Table.Cell>{question.tab}</Table.Cell>
                                                    <Table.Cell>{question.question}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                    </Table.Body>
                                </Table>
                            </Accordion.Content>
                        </Accordion.Panel>
                        <Accordion.Panel>
                            <Accordion.Title id="accordion-answer-title">
                                Select the answer that it will automatically select.
                            </Accordion.Title>
                            <Accordion.Content>
                                <div className="text-center">
                                    <div className="flex flex-col">
                                        <div className='flex justify-left'>
                                            <Table >
                                                <Table.Head className="border">
                                                    <Table.HeadCell colSpan={2}>Answer</Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body className="divide-y">
                                                    {(rulePrefillModalQuestion?.answers || []).map((answer, n) => (
                                                        <Table.Row key={`resultAnswer${n}`}>
                                                            <Table.Cell>{answer.text}</Table.Cell>
                                                            <Table.Cell>
                                                                <Button color="gray" onClick={() => {
                                                                    setRulePrefillModalQuestionAnswer(answer);
                                                                    document.getElementById("accordion-answer-title")?.click();
                                                                  }}>
                                                                    Select
                                                                </Button>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion>
                </Modal.Body>
                <Modal.Footer className="flex justify-center gap-4 border-t-2 bg-gray-50">
                    <Button onClick={() => {
                        saveRulePrefill();
                     }}>
                        Add
                    </Button>
                    <Button color="gray" onClick={() => setAddRulePrefillModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default withAdmin(QuestionnaireVersion)