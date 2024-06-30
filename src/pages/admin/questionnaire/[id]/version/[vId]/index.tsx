
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, Accordion } from 'flowbite-react';
import TimeAgo from 'react-timeago'
import { getQuestionnaire } from "../../../../../../utils/questionnaire"
import CounterInput from "../../../../../../components/CounterInput"
import { MdSave, MdOutlineAdd } from "react-icons/md";
import { HiPencilAlt, HiTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { TemplatebackendQuestionnaire, TemplatebackendQuestionnaireVersion, TemplatebackendQuestionnaireQuestion } from '~/internal/client';
import Link from 'next/link';

export default function Questionnaire() {
    const router = useRouter();
    const { id, vId } = router.query;
    const questionnaireId = Number(id);
    const versionId = Number(vId);

    interface Version extends TemplatebackendQuestionnaireVersion {
        tabs?: string[]
    }

    const [questionnaire, setQuestionnaire] = useState<TemplatebackendQuestionnaire>({});
    const [version, setVersion] = useState<Version>({});
    type Tab = {
        tabName: string;
        questions: TemplatebackendQuestionnaireQuestion[];
    };
    type Tabs = Tab[];
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


        // for (let tabName of Object.keys(tsMap)) {
        //     ts.push({
        //         tabName,
        //         questions: tsMap[tabName] || [],
        //     })
        // }
        // for (let tabName of v.tabs) {
        //     if (!tsMap[tabName]) {
        //         ts.push({
        //             tabName,
        //             questions: [],
        //         })
        //     }
        // }

        setTabs(ts);
    }

    useEffect(() => {
        if (!questionnaireId) {
            return
        }
        try {
            loadQuestionnaire();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, [id]);

    // Everything to remove a tab ans it's questions
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
    const removeQuestionConfirmation = (q: TemplatebackendQuestionnaireQuestion) => {
        setOpenRemoveQuestionModal(true);
        setQuestionToRemove(q)
    };
    const removeQuestion = () => {
        setOpenRemoveQuestionModal(false);

        version.questions = version.questions?.filter(q => q.id != questionToRemove?.id);
        processQuestionnaireVersion(version);
    }

    // Everything to edit a question
    const [openEditQuestionModal, setOpenEditQuestionModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<TemplatebackendQuestionnaireQuestion>();
    const editQuestion = (q: TemplatebackendQuestionnaireQuestion) => {
        setOpenEditQuestionModal(true);
        setQuestionToEdit({ ...q });
    };
    const handleInputChange = (updatedValue: any, fieldName: keyof TemplatebackendQuestionnaireQuestion) => {
        setQuestionToEdit((prevQuestion) => ({
            ...prevQuestion,
            [fieldName]: updatedValue
        }));
    };
    const saveEditedQuestion = () => {
        setOpenEditQuestionModal(false);

        const i = version.questions?.findIndex(q => q.id == questionToEdit?.id);
        if (version.questions && questionToEdit && i !== undefined) {
            version.questions[i] = questionToEdit;
        }

        processQuestionnaireVersion(version);
    }

    const [editAnswerText, setEditAnswerText] = useState("");
    const [editAnswerRiskLevel, setEditAnswerRiskLevel] = useState(0);
    const saveEditAnswer = (answerIndex: number) => {
        setQuestionToEdit(prevQuestion => {
            if (!prevQuestion || !prevQuestion.answers) return;

            prevQuestion.answers[answerIndex] = {
                text: editAnswerText,
                riskLevel: editAnswerRiskLevel,
            };

            return prevQuestion;
        })
    };

    const [addAnswerText, setAddAnswerText] = useState("");
    const [addAnswerRiskLevel, setAddAnswerRiskLevel] = useState(0);
    const addAnswer = () => {
        console.log("saving new question", addAnswerText, addAnswerRiskLevel);
        setQuestionToEdit(prevQuestion => {
            if (!prevQuestion) return;

            if (!prevQuestion.answers) {
                prevQuestion.answers = [];
            }
            prevQuestion.answers.push({
                text: addAnswerText,
                riskLevel: addAnswerRiskLevel,
            });

            console.log("question updated", prevQuestion);

            return prevQuestion;
        })
    };


    if (!questionnaire) {
        return (
            <div>
                <p>Questionnaire not found...</p>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{'Questionnaire ' + questionnaire.name}</title>
            </Head>
            <div className="flex flex-row items-end p-5">
                <Link href='/admin/new-questionnaire' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 ml-auto rounded cursor-pointer">
                    <MdSave />
                    <p className='ml-2 text-sm'> Save</p>
                </Link>
            </div>
            <div className="flex flex-col mb-8">
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
            <div className="flex flex-col mb-8">
                <ul className="flex items-stretch w-full">
                    {tabs.map((tab, n) => (
                        <li
                            key={tab.tabName}
                            className={`flex-grow text-center hover:bg-gray-500  hover:bg-opacity-20 py-2 px-0  cursor-pointer text-md text-gray-600 ${activeTab === n && 'border-b-2 border-gray-600 bg-gray-100'}`}
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
                <hr className="h-px bg-gray-500 border-0 " />

            </div>

            <div className="flex flex-col mb-8">
                <Table >
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

            <Modal show={openEditQuestionModal} size="5xl" onClose={() => setOpenEditQuestionModal(false)} popup>
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
                                        <Table.HeadCell>Questions</Table.HeadCell>
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
                                                                                value={answer?.text}
                                                                                onChange={(event) => setEditAnswerText(event.target.value)}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    <Table.Row >
                                                                        <Table.HeadCell>Risk level</Table.HeadCell>
                                                                        <Table.Cell>

                                                                            <CounterInput
                                                                                placeholder="10"
                                                                                initValue={answer.riskLevel || 0}
                                                                                onChange={(event) => setEditAnswerRiskLevel(event)}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                </Table.Body>
                                                            </Table>
                                                            <Button onClick={() => saveEditAnswer(n)}>
                                                                Save
                                                            </Button>
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

                        <hr />

                        <div className="flex justify-center gap-4 mt-5">
                            <Button color="success" onClick={() => saveEditedQuestion()}>
                                Save
                            </Button>
                            <Button color="gray" onClick={() => setOpenEditQuestionModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}
