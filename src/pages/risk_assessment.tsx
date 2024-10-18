import { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'flowbite-react';
import Head from 'next/head';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply } from '../internal/client/index';
import { listReplies, deleteReply } from "../utils/questionnaire";
import { useAuth } from '~/utils/authContext';

export default function RiskAssessment() {
    const [replies, setReplies] = useState<Array<TemplatebackendQuestionnaireReply>>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isDropdownAbove, setIsDropdownAbove] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState<number | null>(null);
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    const loadReplies = async () => {
        const replies = await listReplies();

        if (!replies) {
            return;
        }

        if (replies.length === 0) {
            router.push('/questionnaire/new');
        }

        setReplies(replies);
    };

    useEffect(() => {
        try {
            loadReplies();
        } catch (error) {
            alert("Error listing the replies");
        }
    }, []);

    const handleMenuOpen = (id: number | undefined, index: number) => {
        if (id) {
            // Show dropdown above if in the bottom 20% of the list
            if (replies.length - index <= 3) {
                setIsDropdownAbove(true);
            } else {
                setIsDropdownAbove(false);
            }
            setOpenMenuId(id);
        }
    };

    const handleMenuClose = () => {
        setOpenMenuId(null);
    };

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/questionnaire/${id}`);
        }
    };

    const handleDelete = (id: number | null) => {
        if (id) {
            setReplyToDelete(id);
            setIsDeleteModalOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (replyToDelete !== null) {
            await deleteReply(replyToDelete);
            setIsDeleteModalOpen(false);
            loadReplies();
        }
    };

    return (
        <>
            <Head>
                <title>Risk Assessment</title>
            </Head>
            {!isLoggedIn && (
                <p className='m-8'> Please log in to consult your risk assessments.</p>
            )}
            {isLoggedIn && (
                <div className="flex flex-col p-8">
                    {/* Spacing between title and button matches the Dataset page */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Risk Assessment</h1>
                        <button
                            onClick={() => router.push('/questionnaire/new')}
                            className="text-white bg-[#306278] hover:bg-[#255362] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                        >
                            <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Project
                        </button>
                    </div>

                    {/* Consistent table styling with Dataset page */}
                    <div className="mt-4 overflow-x-auto w-full border border-gray-200 rounded-lg">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Name</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Date created</Table.HeadCell>
                                <Table.HeadCell>
                                    <span className="sr-only">Edit</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {replies?.map((reply, index) => (
                                    <Table.Row key={reply.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleRowClick(reply.id || 0)}>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {reply.projectName}
                                        </Table.Cell>
                                        <Table.Cell>Finished</Table.Cell>
                                        <Table.Cell><TimeAgo date={reply.createdAt || ''} /></Table.Cell>
                                        <Table.Cell className="flex justify-start items-center" onMouseLeave={handleMenuClose}>
                                            <a onMouseEnter={() => handleMenuOpen(reply.id, index)} className="text-gray-900 hover:text-blue-500">
                                                <MdMoreHoriz size={20} />
                                            </a>
                                            {openMenuId === reply.id && (
                                                <div className="dropdown-menu relative">
                                                    <ul className={`absolute ${isDropdownAbove ? '-top-14' : 'mt-4'
                                                        } w-35 bg-white rounded-md shadow-lg z-10`}>
                                                        <li className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                            onClick={() => router.push(`/transform/${reply.id}`)}>Transform</li>
                                                        <li className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                            onClick={() => handleDelete(reply.id)}>Delete</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    {/* Delete confirmation modal */}
                    <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                        <Modal.Header>Confirm Deletion</Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete this reply?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={confirmDelete}>Yes, delete</Button>
                            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </>
    );
}
