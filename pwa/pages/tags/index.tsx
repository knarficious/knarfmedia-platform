import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, getTags, getTagsPath } from "../../components/tag/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTagsPath(), getTags());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
