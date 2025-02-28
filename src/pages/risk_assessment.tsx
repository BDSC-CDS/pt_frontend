import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireQuestionReply } from '../internal/client/index';
import { listReplies } from "../utils/questionnaire";
import { useAuth } from '~/utils/authContext';
import DataTable from '~/components/DataTable';
import withAuth from '~/components/withAuth';
import Spinner from '~/components/ui/Spinner';
import { showToast } from '~/utils/showToast';
import ReplyShareModal from '~/components/modals/ReplyShareModal';
import { MdShare } from 'react-icons/md';

interface Reply {
    id?: number;
    questionnaireVersionId?: number;
    projectName?: string;
    replies?: Array<TemplatebackendQuestionnaireQuestionReply>;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    shared: boolean;
    sharedBy: JSX.Element;
}

function RiskAssessment() {
    const { userInfo } = useAuth();

    const router = useRouter();

    const [replies, setReplies] = useState<Array<Reply>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
    const [shareReplyId, setShareReplyId] = useState<number>(-1);

    const loadReplies = async () => {
        const replies = await listReplies();
        if (!replies) {
            return;
        }

        if (replies.length === 0) {
            router.push('/questionnaire/new');
        }

        const rep = replies.map(r=>{
            const shared = r.userId !== userInfo?.id;
            return {
                ...r,
                shared: shared,
                sharedBy: shared ? (<div className="flex items-center gap-2"><MdShare /> {r.userName}</div>) : <></>
            };
        })

        setReplies(rep);
    };

    const getColumns = () => {
        const cols = [
            {name:"id", header:"ID"},
            {name:"projectName", header:"Project Name"},
        ];

        if(replies.filter(r => r.shared).length > 0) {
            cols.push({name:"sharedBy", header:"Shared By"});
        }

        cols.push({name:"createdAt", header:"Created At"},)

        return cols
    };

    useEffect(() => {
        if(!userInfo) return;

        try {
            setIsLoading(true)
            loadReplies();
        } catch (error) {
            showToast("error", "Error listing the replies.")
        } finally {
            setIsLoading(false);
        }
    }, [userInfo]);

    // Event handlers
    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/questionnaire/${id}`);
        }
    };

    const handleShare = (id: number | undefined) => {
        if (id) {
            setShareReplyId(id);
            setIsShareModalOpen(true);
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

                {isLoading || replies.length === 0 ? (
                    <div className="flex justify-center items-center h-96">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Questionnaire replies table */}
                        <DataTable 
                            data={replies}
                            columns={getColumns()}
                            onRowClick={(row) => handleRowClick(row.id)}
                            rightIconActions={[
                                { Icon: MdShare, tooltip: "Share", callback: (row) => handleShare(row.id) },
                            ]}
                            addRow={{label: "New project", onRowClick: () => router.push('/questionnaire/new')}}
                        />

                        <ReplyShareModal show={isShareModalOpen} shareReplyId={shareReplyId} onClose={() => setIsShareModalOpen(false)} />      
                    </>
                )}
            </div>
            
        </>
    );
}

export default withAuth(RiskAssessment)