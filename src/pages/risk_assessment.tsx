import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply, TemplatebackendQuestionnaireQuestionReply } from '../internal/client/index';
import { listReplies } from "../utils/questionnaire";
import { useAuth } from '~/utils/authContext';
import DataTable from '~/components/DataTable';
import withAuth from '~/components/withAuth';
import Spinner from '~/components/ui/Spinner';
import { showToast } from '~/utils/showToast';
import { HiShare } from "react-icons/hi";

interface Reply {
    id?: number;
    questionnaireVersionId?: number;
    projectName?: string;
    replies?: Array<TemplatebackendQuestionnaireQuestionReply>;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;

    shared: boolean;
    status: JSX.Element;
}

function RiskAssessment() {
    const { isLoggedIn, userInfo } = useAuth();

    const router = useRouter();

    const [replies, setReplies] = useState<Array<Reply>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadReplies = async () => {
        const replies = await listReplies();
        if (!replies) {
            return;
        }

        if (replies.length === 0) {
            router.push('/questionnaire/new');
        }

        const rep = replies.map(r=>{
            const shared = r.userId == userInfo?.id;
            console.log(shared, r.userId, userInfo)
            return {
                ...r,
                shared: shared,
                status: shared ? <HiShare /> : <></> 
            };
        })

        setReplies(rep);
        setIsLoading(false)
    };

    useEffect(() => {
        try {
            setIsLoading(true)
            loadReplies();
        } catch (error) {
            showToast("error", "Error listing the replies.")
        } finally {
            setIsLoading(false);
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
                        <DataTable 
                            data={replies}
                            columns={[
                                {name:"id", header:"ID"},
                                {name:"projectName", header:"Project Name"},
                                // {name:"projectStatus", header:"Status"}, // NOT IMPLEMENTED
                                {name:"status", header:"Status"},
                                {name:"createdAt", header:"Created At"},
                            ]}
                            onRowClick={(row) => handleRowClick(row.id)}
                            actions={undefined} // NOT IMPLEMENTED: DELETE REPLY
                            addRow={{label: "New project", onRowClick: () => router.push('/questionnaire/new')}}
                        />               
                    </>
                )}
            </div>
            
        </>
    );
}

export default withAuth(RiskAssessment)