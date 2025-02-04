
import Head from 'next/head';
import TimeAgo from 'react-timeago'
import { useRouter } from 'next/router';
import { listQuestionnaires } from "../../utils/questionnaire"
import { useEffect, useState } from 'react';
import { TemplatebackendQuestionnaire } from '~/internal/client';
import { MdOutlineAdd } from "react-icons/md";
import DataTable from '~/components/DataTable';
import NewQuestionnaireModal from '~/components/modals/NewQuestionnaireModal';

export default function Questionnaire() {
    // Routing
    const router = useRouter();

    // States
    const [questionnaireList, setQuestionnaireList] = useState<Array<TemplatebackendQuestionnaire>>([]);
    const [isNewQuestionnaireModalOpen, setIsNewQuestionnaireModalOpen] = useState(false)

    const getlistQuestionnaires = async (offset?: number, limit?: number) => {
        let result;
        if (!offset && !limit) {
            result = await listQuestionnaires();
        } else if (offset && limit) {
            result = await listQuestionnaires(
            );
        } else {
            console.log("ERROR You have to define both the offset and the limit") // TODO
            return;
        }
        if (result) {
            console.log(result)
            setQuestionnaireList(result);
        }
    }

    useEffect(() => {
        try {
            getlistQuestionnaires();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);

    // Event handlers
    const handleRowClick = (id: number | undefined) => {
        if(id) {
            router.push(`/admin/questionnaire/${id}`);
        }
    };

    return (
        <>
            <Head>
                <title>Questionnaires</title>
            </Head>
            <div className="flex flex-col items-end p-5 gap-5">
                <button
                    onClick={() => setIsNewQuestionnaireModalOpen(true)}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer"
                >
                    <MdOutlineAdd />
                    <p className='ml-2 text-sm'> New questionnaire</p>
                </button>

                {/* Dataset table */}
                {questionnaireList.length > 0 ? (
                    <DataTable 
                        data={questionnaireList}
                        columns={[
                            {name:"id", header:"ID"},
                            {name:"name", header:"Questionnaire Name"},
                            {name:"createdAt", header:"Created At"}, // NOT IMPLEMENTED : TIMEAGO 
                            {name:"updatedAt", header:"Last Modified"}, // NOT IMPLEMENTED : TIMEAGO 
                            {name:"lastVersion", header:"Last Version"},
                        ]}
                        onRowClick={(row) => handleRowClick(row.id)}
                    />
                ) : (
                    <div className="text-center text-gray-500 mt-20">No datasets yet</div>
                )}

                <NewQuestionnaireModal show={isNewQuestionnaireModalOpen} onClose={() => setIsNewQuestionnaireModalOpen(false)}/>
            </div>
        </>
    );
}
