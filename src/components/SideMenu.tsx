import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { BiBuoy } from 'react-icons/bi';
import { HiDatabase, HiInbox, HiPresentationChartBar, HiOutlineCog, HiLockClosed, HiShieldCheck  } from 'react-icons/hi';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { useAuth } from '~/utils/authContext';
import type { CustomFlowbiteTheme } from "flowbite-react";

export default function SideMenu() {
    const { isAdmin } = useAuth();

    const customTheme: CustomFlowbiteTheme["sidebar"] = {
        collapse: {
            "icon": {
                "base": "h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            },
        },
    };


    return (
        <div className="w-72 sticky bg-gray-50">
            <Sidebar aria-label="Sidebar" className="w-full border-r overflow-hidden">
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Link href="/dataset" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiDatabase />
                            <p className='ml-1'> My Datasets</p>
                        </Link>
                    </Sidebar.ItemGroup> 

                    <Sidebar.ItemGroup>
                        <Link href="/risk_assessment" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiPresentationChartBar />
                            <p className='ml-1'> Qualitative Assessment</p>
                        </Link>
                            <Link href="/risk_assessment_arx" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiPresentationChartBar />
                            <p className='ml-1'> Quantitative Assessment</p>
                        </Link>
                    </Sidebar.ItemGroup> 

                    <Sidebar.ItemGroup>
                        <Link href="/rule-based-deid" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiShieldCheck />
                            <p className='ml-1'> Rule-Based de-identification</p>
                        </Link>
                            <Link href="/formal_deid" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiShieldCheck />
                            <p className='ml-1'> Formal de-identification</p>
                        </Link>
                        <Link href="/" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiShieldCheck />
                            <p className='ml-1'> Synthetic Data</p>
                        </Link>
                    </Sidebar.ItemGroup> 

                    <Sidebar.ItemGroup>
                        <Sidebar.Collapse className={`${!isAdmin ? "hidden" : ""}`} icon={HiOutlineCog} theme={customTheme.collapse} label="Admin">
                            <Link href="/admin/questionnaire" passHref className='flex items-center ml-10 hover:bg-gray-100 hover:rounded'>
                                <HiClipboardDocumentList />
                                <p className='ml-1'>Questionnaires</p>
                            </Link>
                            <Link href="/audit-logging" passHref className='flex items-center ml-10 hover:bg-gray-100 hover:rounded'>
                                <HiLockClosed />
                                <p className='ml-1'>Audit Log</p>
                            </Link>
                        </Sidebar.Collapse>
                        <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiInbox />
                            <p className='ml-1'>Documentation</p>
                        </Link>
                        <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <BiBuoy />
                            <p className='ml-1'>Settings</p>
                        </Link>
                    </Sidebar.ItemGroup> 
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
};
