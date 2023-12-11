import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/tag/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Tag</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
