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

import { Form } from "../../../components/tag/Form";
import { PagedCollection } from "../../../types/collection";
import { Tag } from "../../../types/Tag";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getTag = async (id: string | string[] | undefined) =>
  id ? await fetch<Tag>(`/tags/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: tag } = {} } = useQuery<FetchResponse<Tag> | undefined>(
    ["tag", id],
    () => getTag(id)
  );

  if (!tag) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{tag && `Edit Tag ${tag["@id"]}`}</title>
        </Head>
      </div>
      <Form tag={tag} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["tag", id], () => getTag(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Tag>>("/tags");
  const paths = await getItemPaths(response, "tags", "/tags/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
