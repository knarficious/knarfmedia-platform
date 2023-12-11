import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getComments,
  getCommentsPath,
} from "../../../components/comment/PageList";
import { PagedCollection } from "../../../types/Collection";
import { Comment } from "../../../types/Comment";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getCommentsPath(page), getComments(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Comment>>("/comments");
  const paths = await getCollectionPaths(
    response,
    "comments",
    "/comments/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
