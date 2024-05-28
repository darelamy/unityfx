import React from "react";
import { Metadata, NextPage } from "next";
import { PageTitle } from "@/components/PageTitle";
import { SearchPageContent } from "@/src/app/search/SearchPageContent";
import authOptions from "@/utils/auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Поиск",
  icons: {
    icon: "/favicons/search-page.svg",
  },
};

const SearchPage: NextPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <main className="mb-10">
      <div className="container">
        <PageTitle title="Поиск" />
        <SearchPageContent authUser={session?.user} />
      </div>
    </main>
  );
};

export default SearchPage;
