import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Comment } from "../../types/Comment";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getCommentsPath = (page?: string | string[] | undefined) =>
  `/comments${typeof page === "string" ? `?page=${page}` : ""}`;
export const getComments = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Comment>>(getCommentsPath(page));
const getPagePath = (path: string) =>
  `/comments/page/${parsePage("comments", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: comments, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Comment>> | undefined
  >(getCommentsPath(page), getComments(page));
  const collection = useMercure(comments, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Comment List</title>
        </Head>
      </div>
      <List comments={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
