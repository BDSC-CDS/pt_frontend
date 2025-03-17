
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '~/utils/authContext';
import DatasetSelector from '~/components/DatasetSelector';
import withAuth from '~/components/withAuth';

function RuleBasedDeid() {
    const { isLoggedIn } = useAuth();

    const router = useRouter();

    const handleRowClick = async (id: number | undefined) => {
        if (id) {
            router.push(`/rule-based-deid/${id}`);
        }
    };

    return (
        <>
            <Head>
                <title>Rule-Based De-identification</title>
            </Head>
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Rule-Based De-identification</h1>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p>
                        On this page you can transform a dataset by applying various rules such as date shifting, replying identifiers etc...
                    </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold">Please select a dataset to start</p>
                </div>

                <DatasetSelector
                    onRowClick={handleRowClick}
                    preview
                    download
                />
            </div>
        </>
    );
}

export default withAuth(RuleBasedDeid)