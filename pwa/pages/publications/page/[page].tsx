import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getPublications,
  getPublicationsPath,
} from "../../../components/publication/PageList";
import { PagedCollection } from "../../../types/collection";
import { Publication } from "../../../types/Publication";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getPublicationsPath(page),
    getPublications(page)
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
  const paths = await getCollectionPaths(
    response,
    "publications",
    "/publications/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
