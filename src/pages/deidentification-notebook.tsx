
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '~/utils/authContext';
import DatasetSelector from '~/components/DatasetSelector';
import withAuth from '~/components/withAuth';

function DeidentificationNotebook() {
    const { isLoggedIn } = useAuth();

    const router = useRouter();

    const handle = async (id: number | undefined) => {
        if (id) {
            router.push(`/deidentification-notebook/${id}`);
        }
    };

    return (
        <>
            <Head>
                <title>Formal de-identification</title>
            </Head>
            {!isLoggedIn && (
                <p className='m-8'> Please log in to consult your datasets.</p>
            )}
            {isLoggedIn && (
                <div className="flex flex-col p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Formal De-identification</h1>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <p>
                            On this page will be able to formally deidentify your dataset by using a Jupyter notbook preloaded with your dataset and a library to deidentify using ARX.
                        </p>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-bold">Please select a dataset to start</p>
                    </div>

                    <DatasetSelector
                        actions={[
                            { name: "De-identify", callback: (id) => handle(id) },
                        ]}
                        preview
                    />
                </div>
            )}
        </>
    );
}

export default withAuth(DeidentificationNotebook)