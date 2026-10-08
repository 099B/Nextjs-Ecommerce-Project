import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "aziziphone",
  description: "Welcome to aziziphone",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
