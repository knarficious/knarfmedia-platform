import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/publication/Form";
import { PagedCollection } from "../../../types/collection";
import { Publication } from "../../../types/Publication";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getPublication = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Publication>(`/publications/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: publication } = {} } = useQuery<
    FetchResponse<Publication> | undefined
  >(["publication", id], () => getPublication(id));

  if (!publication) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {publication && `Edit Publication ${publication["@id"]}`}
          </title>
        </Head>
      </div>
      <Form publication={publication} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["publication", id], () =>
    getPublication(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Publication>>("/publications");
  const paths = await getItemPaths(
    response,
    "publications",
    "/publications/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
