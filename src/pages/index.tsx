// Importing necessary modules and components.
import Head from "next/head";
import apiClientIndex from '../utils/apiClientIndex';
import { useState } from "react";
import { TemplatebackendCreateHelloReply } from "~/internal/client";
import { BiCalculator, BiMessageSquareDetail, BiLayer } from 'react-icons/bi';
import { IconContext } from "react-icons";
import Link from "next/link";
import { GrDocumentLocked } from "react-icons/gr";

/**
 * Home component that represents the main page of the application.
 */
export default function Home() {

  // JSX rendering of the component.
  return (
    <>
      <Head>
        <title>Frontend template</title>
        <meta name="description" content="A frontend template based on the T3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-left mt-5 mr-40 ml-[120px]">

        <h2 className=" mt-2 text-3xl font-bold">
          Welcome to the SPHN Privacy Toolbox platform!
        </h2>

        <div className="flex items-center ">

          <p className="  mb-8 text-md w-1/2">
            Our mission is to advance the field of biomedical data research by harnessing the expertise of the SPHN DeID task force and translating their recommendations into a dynamic, adaptable platform. Our goal is to revolutionize the process of risk assessment and de-identification for biomedical datasets, streamlining it for research purposes.

            In pursuit of this objective, we are committed to developing an automated de-identification tool that not only ensures transparency but also provides a clear understanding of risk levels. This innovation promises to be a valuable asset for researchers, regulatory authorities, and Data Protection Officers (DPOs) alike.

            Join us on this exciting journey towards enhanced biomedical data privacy and research efficiency.
          </p>
          <IconContext.Provider value={{ size: "8em" }}>
            <div className="ml-20">
              <GrDocumentLocked />
            </div>
          </IconContext.Provider>
        </div>
        <div className="flex flex-wrap justify-left text-center">
          {/* Button to link to T3 information */}
          <Link
            href="/risk_assessment" passHref
            className=" flex flex-col justify-center items-center  rounded-lg bg-[#A1C6D9] py-2 px-6 text-lg mx-2 font-medium hover:bg-opacity-50 cursor-pointer w-3/12 h-40"
          >
            <IconContext.Provider value={{ size: "3em" }}>
              <div>
                <BiCalculator />
              </div>
            </IconContext.Provider>
            <p className="mt-2 text-base"> Risk Assessment</p>
          </Link>
          <a
            href="https://create.t3.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-center items-center  rounded-lg bg-[#A1C6D9] py-2 px-6 text-lg mx-2 font-medium hover:bg-opacity-50 cursor-pointer w-3/12 h-40"
          >
            <IconContext.Provider value={{ size: "3em" }}>
              <div>
                <BiMessageSquareDetail />
              </div>
            </IconContext.Provider>
            <p className="mt-2 text-base"> Text DeID</p>
          </a>
          <a
            href="https://create.t3.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-center items-center  rounded-lg bg-[#A1C6D9] py-2 px-6 text-lg mx-2 font-medium hover:bg-opacity-50 cursor-pointer w-3/12 h-40"
          >
            <IconContext.Provider value={{ size: "3em" }}>
              <div>
                <BiLayer />
              </div>
            </IconContext.Provider>
            <p className="mt-2 text-base"> Synthetic Data Generation</p>
          </a>
        </div>
      </div>
    </>
  );
}
