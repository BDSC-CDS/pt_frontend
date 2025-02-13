import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply } from '../internal/client/index';
import { listReplies } from "../utils/questionnaire";
import { useAuth } from '~/utils/authContext';
import DataTable from '~/components/DataTable';
import withAuth from '~/components/withAuth';
import Spinner from '~/components/ui/Spinner';
import { showToast } from '~/utils/showToast';

function RiskAssessment() {
    // Authentication
    const { isLoggedIn } = useAuth();

    // Routing
    const router = useRouter();

    // States
    const [replies, setReplies] = useState<Array<TemplatebackendQuestionnaireReply>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loadReplies = async () => {
        setIsLoading(true)
        const replies = await listReplies();
        if (!replies) {
            return;
        }

        if (replies.length === 0) {
            router.push('/questionnaire/new');
        }

        setReplies(replies);
        setIsLoading(false)
    };

    useEffect(() => {
        try {
            loadReplies();
        } catch (error) {
            showToast("error", "Error listing the replies.")
        }
    }, []);

    // Event handlers
    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/questionnaire/${id}`);
        }
    };    

    return (
        <>
            <Head>
                <title>Qualitative Risk Assessment</title>
            </Head>
            {isLoading ? (<Spinner/> ): (
                <div className="flex flex-col p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Qualitative Risk Assessment</h1>
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

                    {/* Questionnaire replies table */}
                    {replies.length > 0 ? (
                        <DataTable 
                            data={replies}
                            columns={[
                                {name:"id", header:"ID"},
                                {name:"projectName", header:"Project Name"},
                                {name:"projectStatus", header:"Status"}, // NOT IMPLEMENTED
                                {name:"createdAt", header:"Created At"},
                            ]}
                            onRowClick={(row) => handleRowClick(row.id)}
                            actions={undefined} // NOT IMPLEMENTED: DELETE REPLY
                        />
                    ) : (
                        <div className="text-center text-gray-500 mt-20">No questionnaire replies yet.</div>
                    )}
                </div>
            )}
        </>
    );
}

export default withAuth(RiskAssessment)