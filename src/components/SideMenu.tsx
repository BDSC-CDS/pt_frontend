import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiDatabase, HiInbox, HiShoppingBag, HiPresentationChartBar, HiOutlineCog, HiLockClosed } from 'react-icons/hi';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { useAuth } from '~/utils/authContext';

export default function SideMenu() {
    const { isAdmin } = useAuth();

    return (
        <div className="fixed top-20 left-0 h-3/4 z-10">
            <Sidebar aria-label="Sidebar with content separator example" className="w-90 border rounded">
                <div>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="/" className="text-semibold">
                                <p className="font-bold text-lg"> Privacy Toolbox</p>
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup>
                            <Link href="/risk_assessment" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiPresentationChartBar size={'1.5em'} color='gray' />
                                <p className='ml-1'> Risk Assessment</p>
                            </Link>
                            <Link href="/dataset" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiDatabase size={'1.5em'} color='gray' />
                                <p className='ml-1'> Datasets</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiShoppingBag size={'1.5em'} color='gray' />
                                <p className='ml-1'> Synthetic Data Generation</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiArrowSmRight size={'1.5em'} color='gray' />
                                <p className='ml-1'> Text DeID</p>
                            </Link>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-10">
                            <Sidebar.Collapse className={`${!isAdmin ? "hidden" : ""}`} icon={HiOutlineCog} label="Admin">
                                <Link href="/admin/questionnaire" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                    <HiClipboardDocumentList size={'1.5em'} color='gray' />
                                    <p className='ml-1'> Questionnaires</p>
                                </Link>
                                <Link href="/audit-logging" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                    <HiLockClosed size={'1.5em'} color='gray' />
                                    <p className='ml-1'> Audit Log</p>
                                </Link>
                            </Sidebar.Collapse>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <HiInbox size={'1.5em'} color='gray' />
                                <p className='ml-1'> Documentation</p>
                            </Link>
                            <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                                <BiBuoy size={'1.5em'} color='gray' />
                                <p className='ml-1'> Settings</p>
                            </Link>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </div>
            </Sidebar>
        </div>
    )
};
