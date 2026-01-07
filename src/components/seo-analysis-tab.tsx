import { useEffect, useState } from "react";
import { getPageContent } from "../api/sitecore/getPageContent";
import { getAuthToken } from "../api/sitecore/getAuthToken";
import { getAllPagesBySite } from "../api/sitecore/getAllPagesBySite";
import { getCollections } from "../api/sitecore/getCollections";
import { getSites } from "../api/sitecore/getSites";
import { getPageStructure } from "../api/sitecore/getPageStructure";
import { fakeToken } from "../utils/utilities/token";

export function SeoAnalysisTab() {
  const [collections, setCollections] = useState<any>([]);
  const [pageContent, setPageContent] = useState<any>({});
  const [pages, setPages] = useState<any>([]);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    getSites({
      token: fakeToken,
    });
    getAllPagesBySite({
      siteName: "forma-lux",
      token: fakeToken,
    });
    getPageContent({
      language: "en-US",
      version: "1",
      environmentId: "dev",
      pageid: "16807766-6013-4944-9550-ebc3216ad248",
      site: "e120cd2f-d31e-4cf0-9934-5eb9935e7b4b",
      token: fakeToken,
    });
    getPageStructure({
      token: fakeToken,
      pageId: "16807766-6013-4944-9550-ebc3216ad248",
    });
  }, []);

  return (
    <div>
      <h3>SEO Analysis</h3>
      <p>
        Analyze your content for SEO best practices and get actionable insights
        to improve your search engine rankings. adasdasds
      </p>
    </div>
  );
}
