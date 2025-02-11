import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { HiDatabase, HiInbox, HiPresentationChartBar, HiOutlineCog, HiLockClosed  } from 'react-icons/hi';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { useAuth } from '~/utils/authContext';
import type { CustomFlowbiteTheme } from "flowbite-react";
import {
    BiCalculator,
    BiLayer,
    BiSolidReport,
    BiSolidRuler,
    BiSolidDetail,
} from "react-icons/bi";

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
                            <p className='ml-1'> Qualitative Risk Assessment</p>
                        </Link>
                            <Link href="/risk_assessment_arx" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <BiCalculator />
                            <p className='ml-1'> Formal Risk Assessment</p>
                        </Link>
                    </Sidebar.ItemGroup> 

                    <Sidebar.ItemGroup>
                        <Link href="/rule-based-deid" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <BiSolidRuler />
                            <p className='ml-1'> Rule-Based de-identification</p>
                        </Link>
                            <Link href="/deidentification-notebook" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <BiSolidReport />
                            <p className='ml-1'> Formal de-identification</p>
                        </Link>
                        <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded opacity-50'>
                            <BiLayer />
                            <p className='ml-1'> Synthetic Data</p>
                        </Link>
                        <Link href="#" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded opacity-50'>
                            <BiSolidDetail />
                            <p className='ml-1'> Text de-identification</p>
                        </Link>
                    </Sidebar.ItemGroup> 

                    <Sidebar.ItemGroup>
                        <Link href="/documentation" passHref className='flex items-center ml-2 hover:bg-gray-100 hover:rounded'>
                            <HiInbox />
                            <p className='ml-1'>Documentation</p>
                        </Link>
                    </Sidebar.ItemGroup>
                    
                    { isAdmin && (
                        <Sidebar.ItemGroup>
                            <Sidebar.Collapse icon={HiOutlineCog} theme={customTheme.collapse} label="Admin">
                                <Link href="/admin/questionnaire" passHref className='flex items-center ml-10 hover:bg-gray-100 hover:rounded'>
                                    <HiClipboardDocumentList />
                                    <p className='ml-1'>Questionnaires</p>
                                </Link>
                                <Link href="/audit-logging" passHref className='flex items-center ml-10 hover:bg-gray-100 hover:rounded'>
                                    <HiLockClosed />
                                    <p className='ml-1'>Audit Log</p>
                                </Link>
                            </Sidebar.Collapse>
                        </Sidebar.ItemGroup> 
                    )}
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
};
