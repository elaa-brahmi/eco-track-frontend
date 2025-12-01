"use client";

import dynamic from "next/dynamic";

const BinsMap = dynamic(() => import("./interactiveMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default BinsMap;
