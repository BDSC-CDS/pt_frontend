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
    // Routing
    const router = useRouter();

    // States
    const [replies, setReplies] = useState<Array<TemplatebackendQuestionnaireReply>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Qualitative Risk Assessment</h1>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Questionnaire replies table */}
                        {replies.length > 0 ? (
                            <DataTable 
                                data={replies}
                                columns={[
                                    {name:"id", header:"ID"},
                                    {name:"projectName", header:"Project Name"},
                                    // {name:"projectStatus", header:"Status"}, // NOT IMPLEMENTED
                                    {name:"createdAt", header:"Created At"},
                                ]}
                                onRowClick={(row) => handleRowClick(row.id)}
                                actions={undefined} // NOT IMPLEMENTED: DELETE REPLY
                                addRow={{label: "New project", onRowClick: () => router.push('/questionnaire/new')}}
                            />
                        ) : (
                            <div className="text-center text-gray-500 mt-20">No questionnaire replies yet.</div>
                        )}            
                    </>
                )}
            </div>
            
        </>
    );
}

export default withAuth(RiskAssessment)