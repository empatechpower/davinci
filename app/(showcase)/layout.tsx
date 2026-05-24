import DavinciNav from "@/components/layout/DavinciNav";
import Footer from "@/components/layout/Footer";

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DavinciNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
