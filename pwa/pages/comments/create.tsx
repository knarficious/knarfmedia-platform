import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/comment/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Comment</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
