import axiosClient from "@/src/config/axiosClient";
import { getSitesType } from "@/src/types/types";

export const getSites = async ({
  token,
}: getSitesType) => {
  try {
    const resp = await axiosClient.get(
      `https://edge-platform.sitecorecloud.io/stream/ai-agent-api/api/v1/sites`,
      {
        method: "GET",
        headers: {
          'x-sc-job-id': 'job-1234',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(resp.data);
  } catch (error) {
    console.log(error);
  }
};
