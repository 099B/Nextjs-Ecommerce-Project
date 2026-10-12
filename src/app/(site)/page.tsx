import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "yourtitle",
  description: "Welcome to yourtitle",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
