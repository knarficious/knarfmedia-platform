import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Tag } from "../../types/Tag";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getTagsPath = (page?: string | string[] | undefined) =>
  `/tags${typeof page === "string" ? `?page=${page}` : ""}`;
export const getTags = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Tag>>(getTagsPath(page));
const getPagePath = (path: string) => `/tags/page/${parsePage("tags", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: tags, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Tag>> | undefined
  >(getTagsPath(page), getTags(page));
  const collection = useMercure(tags, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Tag List</title>
        </Head>
      </div>
      <List tags={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
