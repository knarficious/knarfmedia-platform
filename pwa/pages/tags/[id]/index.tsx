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

import { Show } from "../../../components/tag/Show";
import { PagedCollection } from "../../../types/collection";
import { Tag } from "../../../types/Tag";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getTag = async (id: string | string[] | undefined) =>
  id ? await fetch<Tag>(`/tags/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: tag, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Tag> | undefined>(["tag", id], () => getTag(id));
  const tagData = useMercure(tag, hubURL);

  if (!tagData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Tag ${tagData["@id"]}`}</title>
        </Head>
      </div>
      <Show tag={tagData} text={text} />
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
  const paths = await getItemPaths(response, "tags", "/tags/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
