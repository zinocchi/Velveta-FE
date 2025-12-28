import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="pt-20 overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
