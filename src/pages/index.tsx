// Importing necessary modules and components.
import Head from "next/head";
import apiClientIndex from '../utils/apiClientIndex';
import { useState } from "react";
import { TemplatebackendCreateHelloReply } from "~/internal/client";
import { BiCalculator, BiMessageSquareDetail, BiLayer } from 'react-icons/bi';
import { IconContext } from "react-icons";
import Link from "next/link";

/**
 * Home component that represents the main page of the application.
 */
export default function Home() {
  // State variables to store API response and authentication token.
  const [response, setResponse] = useState<TemplatebackendCreateHelloReply>();
  const [token, setToken] = useState<string | null>(null);

  /**
   * Function to fetch data from the API and handle responses.
   */
  const fetchHello = async () => {
    try {
      // Get the authentication token if available.
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
      }
      // Check if a token exists and perform actions accordingly.
      if (token) {
        // Handle authenticated user actions here.
      } else {
        // Handle actions for unauthenticated users.
      }
      // Make an API call to retrieve data and update the response state.
      const response = await apiClientIndex.indexServiceGetHello();
      setResponse(response);
    } catch (error) {
      console.error("Error fetching hello: ", error);
    }
  };

  // JSX rendering of the component.
  return (
    <div className=' bg-white'>

      {/* Head section for metadata and title */}
      <Head>
        <title>Frontend template</title>
        <meta name="description" content="A frontend template based on the T3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header component */}
      {/* <Header /> */}
      <div className="flex min-h-screen">

        <main className="ml-64 mt-10 flex-1 flex flex-col items-center justify-center text-[#306278]">

          <div className="text-center">
            <div className="flex justify-center">

              <h2 className="mb-4 text-4xl font-extrabold w-3/4 ">
                Welcome to the SPHN RDeID platform!          </h2>
            </div>
            <div className="flex justify-center">

              <p className="  mb-8 text-md w-3/4 center">
                Our mission is to advance the field of biomedical data research by harnessing the expertise of the SPHN DeID task force and translating their recommendations into a dynamic, adaptable platform. Our goal is to revolutionize the process of risk assessment and de-identification for biomedical datasets, streamlining it for research purposes.

                In pursuit of this objective, we are committed to developing an automated de-identification tool that not only ensures transparency but also provides a clear understanding of risk levels. This innovation promises to be a valuable asset for researchers, regulatory authorities, and Data Protection Officers (DPOs) alike.

                Join us on this exciting journey towards enhanced biomedical data privacy and research efficiency.
              </p>
            </div>
            <div className="flex flex-wrap justify-center mt-10">
              {/* Button to link to T3 information */}
              <Link
                href="/risk_assess" passHref
                className=" flex flex-col justify-center items-center  rounded-lg bg-gray-500 bg-opacity-20 py-2 px-6 text-lg mx-2 font-medium hover:bg-opacity-30 cursor-pointer w-2/12 h-40"
              >
                <IconContext.Provider value={{ size: "2em" }}>
                  <div>
                    <BiCalculator />
                  </div>
                </IconContext.Provider>
                <p className="mt-2"> Risk Assessment</p>
              </Link>
              <a
                href="https://create.t3.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-center items-center rounded-lg bg-gray-500 bg-opacity-20 py-2 px-6 text-lg mx-2 font-medium hover:bg-opacity-30 cursor-pointer w-2/12"
              >
                <IconContext.Provider value={{ size: "2em" }}>
                  <div>
                    <BiMessageSquareDetail />
                  </div>
                </IconContext.Provider>
                <p className="mt-2"> Text DeID</p>
              </a>
              <a
                href="https://create.t3.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-center items-center  rounded-lg bg-gray-500 bg-opacity-20 py-2 px-6 text-lg mx-2 font-medium hover:bg-opacity-30 cursor-pointer w-2/12"
              >
                <IconContext.Provider value={{ size: "2em" }}>
                  <div>
                    <BiLayer />
                  </div>
                </IconContext.Provider>
                <p className="mt-2"> Synthetic Data Generation</p>
              </a>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
