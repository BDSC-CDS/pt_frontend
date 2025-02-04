
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, Accordion, ToggleSwitch, Alert } from 'flowbite-react';
import TimeAgo from 'react-timeago'
import { getQuestionnaire, createQuestionnaireVersion } from "../../../../../../utils/questionnaire"
import CounterInput from "../../../../../../components/CounterInput"
import { MdSave, MdOutlineAdd } from "react-icons/md";
import { HiPencilAlt, HiTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { TemplatebackendQuestionnaire, TemplatebackendQuestionnaireVersion, TemplatebackendQuestionnaireQuestion, TemplatebackendQuestionnaireQuestionAnswerToJSON, TemplatebackendQuestionnaireQuestionAnswer } from '~/internal/client';
import cloneDeep from "lodash/cloneDeep";


interface Version extends TemplatebackendQuestionnaireVersion {
    tabs?: string[]
}

type Tab = {
    tabName: string;
    questions: TemplatebackendQuestionnaireQuestion[];
};

type Tabs = Tab[];

export default function QuestionnaireVersion() {

    // Routing
    const router = useRouter();
    const { id, vId } = router.query;
    const questionnaireId = Number(id);
    const versionId = vId;

    // Questionnaire States
    const [questionnaire, setQuestionnaire] = useState<TemplatebackendQuestionnaire>({});
    const [version, setVersion] = useState<Version>({});
    const [tabs, setTabs] = useState<Tabs>([]);
    const [activeTab, setActiveTab] = useState<number>(0);

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

    const processQuestionnaireVersion = (v: Version) => {
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
        if (!questionnaireId ) {
            return
        }
        try {
            loadQuestionnaire();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, [id]);

    // Everything to save
    const [openSaveModal, setOpenSaveModal] = useState(false);
    const [openSaveAlert, setOpenSaveAlert] = useState(false);
    const [saveName, setSaveName] = useState("");
    const [savePublish, setSavePublish] = useState(false);
    const save = async () => {
        setOpenSaveModal(false);

        const versionToSave = {
            ...version,
            version: saveName,
            published: savePublish,
            createdAt: new Date()
        }

        try {
            const id = await createQuestionnaireVersion(questionnaireId, versionToSave);
            if (id) {
                setOpenSaveAlert(true);
            } else {
                alert("Error creating the questionnaire version.")
            }
        } catch (error) {
            alert("Error creating the questionnaire version: " + error)
        }


    }

    // Everything to remove a tab and it's questions
    const [openRemoveTabModal, setOpenRemoveTabModal] = useState(false);
    const [tabToRemove, setTabToRemove] = useState<Tab>();
    const removeTabConfirmation = (n: number) => {
        setOpenRemoveTabModal(true);
        setTabToRemove(tabs[n])
    };
    const removeTab = () => {
        setOpenRemoveTabModal(false);

        version.questions = version.questions?.filter(q => q.tab != tabToRemove?.tabName);
        version.tabs = (version.tabs || []).filter(t => t != tabToRemove?.tabName)
        processQuestionnaireVersion(version);
    }

    // Everything to add a tab
    const [openCreateTabModal, setOpenCreateTabModal] = useState(false);
    const [createTabName, setCreateTabName] = useState('');
    const handleCreateTabNameChange = (name: string) => {
        setCreateTabName(name);
    };
    const createTab = () => {
        if (version.tabs) {
            version.tabs.push(createTabName);
        }

        setOpenCreateTabModal(false)

        // version.questions = version.questions?.filter(q => q.tab != tabToRemove?.tabName);
        processQuestionnaireVersion(version);
    }

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
    }

    // Everything to edit a question
    const [openEditQuestionModal, setOpenEditQuestionModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<TemplatebackendQuestionnaireQuestion>();
    const editQuestion = (question: TemplatebackendQuestionnaireQuestion) => {
        setOpenEditQuestionModal(false)
        setQuestionToEdit(cloneDeep(question))
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

        const i = version.questions?.findIndex(q => q.id == questionToEdit?.id);
        if (version.questions && questionToEdit && i !== undefined) {
            version.questions[i] = questionToEdit;
        }

        processQuestionnaireVersion(version);
    }

    const [addAnswerText, setAddAnswerText] = useState("");
    const [addAnswerRiskLevel, setAddAnswerRiskLevel] = useState(0);
    const [addAnswerHighRisk, setAddAnswerHighRisk] = useState(false);
    const addAnswer = () => {
        console.log("saving new answer", addAnswerText, addAnswerRiskLevel);

        // Create a new answer object
        const newAnswer = {
            text: addAnswerText,
            riskLevel: addAnswerRiskLevel,
            highRisk: addAnswerHighRisk,
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
    const [rulePrefillModalQuestion, setRulePrefillModalQuestion] = useState<TemplatebackendQuestionnaireQuestion>();
    const [rulePrefillFilter, setRulePrefillFilter] = useState("");

    const addRulePrefil = (answer: TemplatebackendQuestionnaireQuestionAnswer) => {
        // console.log("rule prefill answerId", answerID);
        setRulePrefillModalAnswer(answer);
        setAddRulePrefillModal(true);
    }

    return (
        <>
            <Head>
                <title>{'Questionnaire ' + questionnaire.name}</title>
            </Head>

            <Alert className={(openSaveAlert ? "" : "hidden") + " mt-5"} color="success" onDismiss={() => setOpenSaveAlert(false)}>
                <span className="font-bold">Version {saveName} </span>successfuly saved!
            </Alert>
            <div className="flex flex-row items-end p-5">
                <span onClick={() => setOpenSaveModal(true)} className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 ml-auto rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'> Save</p>
                </span>
            </div>

            <div className="flex flex-col mb-5">
                <Table >
                    <Table.Body className="divide-y">
                        <Table.Row >
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.Cell>{questionnaire.name}</Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.Cell><TimeAgo date={questionnaire.createdAt || ''} /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.HeadCell>Last modified</Table.HeadCell>
                            <Table.Cell><TimeAgo date={questionnaire.updatedAt || ''} /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.HeadCell>Version</Table.HeadCell>
                            <Table.Cell>{version.version || ''}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>

            <div className="flex flex-col w-full">
                <div className="overflow-auto pb-3 mb-2">
                    <ul className="flex flex-row">
                        {tabs.map((tab, n) => (
                            <li
                                key={tab.tabName}
                                className={`flex-grow text-center hover:bg-gray-500  hover:bg-opacity-20 py-2 px-0  cursor-pointer text-md text-gray-600 ${activeTab === n && 'border-b-2 border-gray-400 bg-gray-100'}`}
                                onClick={() => setActiveTab(n)}
                            >
                                <div className='flex items-center pl-2'>
                                    <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded-full shrink-0 ">
                                        {n + 1}
                                    </span>
                                    <span>
                                        <h3 className="font-medium leading-tight pl-2 pr-2">{tab.tabName}</h3>
                                    </span>
                                    <span className="p-2 hover:bg-gray-500  hover:bg-opacity-20" onClick={() => removeTabConfirmation(n)}>
                                        <HiTrash />
                                    </span>
                                </div>
                            </li>
                        ))}
                        <li
                            className={`flex-grow text-center py-2 px-0`}
                        >
                            <Button color="gray" size="xs" onClick={() => setOpenCreateTabModal(true)}>
                                <MdOutlineAdd />
                                New Tab
                            </Button>

                        </li>
                    </ul>
                </div>


                <Table className="border">
                    <Table.Head>
                        <Table.HeadCell>Question</Table.HeadCell>
                        <Table.HeadCell>Risk weight</Table.HeadCell>
                        <Table.HeadCell>Answer Type</Table.HeadCell>
                        <Table.HeadCell>Answers</Table.HeadCell>
                        <Table.HeadCell>Flag</Table.HeadCell>
                        <Table.HeadCell>Tooltip</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Action</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {((tabs[activeTab] || {}).questions || []).map((question) => (
                            <Table.Row key={question.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{question.question}</Table.Cell>
                                <Table.Cell>{question.riskWeight}</Table.Cell>
                                <Table.Cell>{question.answerType}</Table.Cell>
                                <Table.Cell className="whitespace-pre-line">{question.answers?.map(a => "• " + a.text).join('\n')}</Table.Cell>
                                <Table.Cell>{question.flag}</Table.Cell>
                                <Table.Cell>{question.tooltip}</Table.Cell>
                                <Table.Cell>
                                    <div className="flex flex-row">
                                        <span className="hover:bg-gray-500  hover:bg-opacity-20 cursor-pointer" onClick={() => editQuestion(question)}>
                                            <HiPencilAlt size={20} />
                                        </span>
                                        <span className="hover:bg-gray-500  hover:bg-opacity-20 cursor-pointer" onClick={() => removeQuestionConfirmation(question)}>
                                            <HiTrash size={20} />
                                        </span>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}

                    </Table.Body>
                </Table>
            </div>


            {/* SAVE MODAL */}
            <Modal show={openSaveModal} size="md" onClose={() => setOpenSaveModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className="flex flex-col mb-8">
                            <TextInput
                                placeholder="Version"
                                required
                                // value={"12"}
                                onChange={(event) => { setSaveName(event.target.value) }}
                            />
                        </div>

                        <hr />
                        <div className="flex flex-col mb-8">
                            <ToggleSwitch checked={savePublish} label="Publish version" onChange={setSavePublish} />
                        </div>

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
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenRemoveTabModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* CREATE TAB MODAL */}
            <Modal show={openCreateTabModal} size="md" onClose={() => setOpenCreateTabModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className="flex flex-col mb-8">
                            <TextInput
                                placeholder="Tab name"
                                required
                                onChange={(event) => handleCreateTabNameChange(event.target.value)}
                            />
                        </div>

                        <hr />

                        <div className="flex justify-center gap-4 mt-5">
                            <Button color="success" onClick={() => createTab()}>
                                Save
                            </Button>
                            <Button color="gray" onClick={() => setOpenCreateTabModal(false)}>
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
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenRemoveQuestionModal(false)}>
                                No, cancel
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
                                                placeholder="Question text?"
                                                required
                                                value={questionToEdit?.question}
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
                                                value={questionToEdit?.tooltip}
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
                                                                                value={{ ...questionToEdit }?.answers?.[n]?.text || ""}

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

                                                                            {(answer.rulePrefills || []).map((rulePrefill, n) => (

                                                                                <div className="w-48 text-sm font-medium bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                                    <div className="w-full px-4 py-2">

                                                                                        {rulePrefill.answerId}
                                                                                    </div>
                                                                                </div>
                                                                            )).concat(
                                                                                // <div className="w-48 text-sm font-medium bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                                                //     <div className="w-full px-4 py-2">
                                                                                //         <MdOutlineAdd className='inline' /> Add rule prefill
                                                                                //     </div>
                                                                                // </div>
                                                                                <Button color="gray" onClick={() => addRulePrefil(answer)}>
                                                                                    <MdOutlineAdd className='inline' /> Add rule prefill
                                                                                </Button>
                                                                            )}


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
                                                            <Button color="success" onClick={() => addAnswer()}>
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
                    <Button color="success" onClick={() => saveEditedQuestion()}>
                        Edit
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
                            <Accordion.Title>
                                Select a question
                            </Accordion.Title>
                            <Accordion.Content>
                                <TextInput
                                    placeholder="Filter questions"
                                    onChange={(event) => { setRulePrefillFilter(event.target.value) }}
                                />
                                <Table hoverable>
                                    <Table.Body className="divide-y">
                                        <Table.Row >
                                            <Table.Cell>Tab</Table.Cell>
                                            <Table.Cell>Question</Table.Cell>
                                        </Table.Row>
                                        {(version.questions || [])
                                            .filter(question =>
                                                JSON.stringify(question).toLowerCase().includes(rulePrefillFilter)
                                            )
                                            .map((question, n) => (
                                                <Table.Row onClick={() => { setRulePrefillModalQuestion(question) }}>
                                                    <Table.Cell>{question.tab}</Table.Cell>
                                                    <Table.Cell>{question.question}</Table.Cell>
                                                </Table.Row>
                                            ))}
                                    </Table.Body>
                                </Table>
                            </Accordion.Content>
                        </Accordion.Panel>
                        <Accordion.Panel>
                            <Accordion.Title>
                                Select the answer that it will automatically select.
                            </Accordion.Title>
                            <Accordion.Content>
                                <div className="text-center">
                                    <div className="flex flex-col mb-8">
                                        <div className='flex justify-left p-4'>
                                            <Table >
                                                <Table.Body className="divide-y">
                                                    <Table.Row >
                                                        <Table.Cell>Answer</Table.Cell>
                                                        <Table.Cell></Table.Cell>
                                                    </Table.Row>
                                                    {(rulePrefillModalQuestion?.answers || []).map((answer) => (
                                                        <Table.Row >
                                                            <Table.Cell>{answer.text}</Table.Cell>
                                                            <Table.Cell>
                                                                <Button color="blue" onClick={() => {/*TODO*/ }}>
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
                    <Button color="success" onClick={() => {/*TODO*/ }}>
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
