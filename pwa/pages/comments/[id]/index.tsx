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

import { Show } from "../../../components/comment/Show";
import { PagedCollection } from "../../../types/collection";
import { Comment } from "../../../types/Comment";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getComment = async (id: string | string[] | undefined) =>
  id ? await fetch<Comment>(`/comments/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: comment, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Comment> | undefined>(["comment", id], () =>
      getComment(id)
    );
  const commentData = useMercure(comment, hubURL);

  if (!commentData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Comment ${commentData["@id"]}`}</title>
        </Head>
      </div>
      <Show comment={commentData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["comment", id], () => getComment(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Comment>>("/comments");
  const paths = await getItemPaths(response, "comments", "/comments/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
