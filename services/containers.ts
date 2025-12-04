import { BinData } from "@/types/BinData";

export const createBin = async (data: BinData): Promise<any> => {
  const res = await fetch("/api/proxy/api/containers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create bin");
  }

  return res.json();
};
export const fetchBins = async (): Promise<BinData[]> => {
  const res = await fetch("/api/proxy/api/containers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch bins");
  }
  return res.json();

};
export const getLocationByContainerId = async (containerId: string): Promise<any> => {
  const res = await fetch(`/api/proxy/api/containers/location/${containerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch container location");
  }
  return res.json();
}