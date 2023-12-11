import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getTags,
  getTagsPath,
} from "../../../components/tag/PageList";
import { PagedCollection } from "../../../types/collection";
import { Tag } from "../../../types/Tag";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTagsPath(page), getTags(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Tag>>("/tags");
  const paths = await getCollectionPaths(response, "tags", "/tags/page/[page]");

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
