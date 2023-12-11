import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/Collection";
import { Publication } from "../../types/Publication";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPublicationsPath = (page?: string | string[] | undefined) =>
  `/publications${typeof page === "string" ? `?page=${page}` : ""}`;
export const getPublications =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Publication>>(getPublicationsPath(page));
const getPagePath = (path: string) =>
  `/publications/page/${parsePage("publications", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: publications, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Publication>> | undefined
  >(getPublicationsPath(page), getPublications(page));
  const collection = useMercure(publications, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Publication List</title>
        </Head>
      </div>
      <List publications={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
