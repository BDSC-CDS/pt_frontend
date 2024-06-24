
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '~/utils/authContext';

export default function Questionnaire() {
    const { isLoggedIn } = useAuth();

    const router = useRouter();


    return (
        <>
            <Head>
                <title>Questionnaires</title>
            </Head>

        </>
    );
}
