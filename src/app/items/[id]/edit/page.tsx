import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { expireOldItems } from "@/lib/item-expiry";
import EditItemForm from "./EditItemForm";

type EditItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditItemPage({
  params,
}: EditItemPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Expire reports whose 7-day lifetime has passed
  await expireOldItems();

  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: {
      id,
    },
  });

  if (!item) {
    notFound();
  }

  // Only the owner can edit an active report
  if (item.ownerId !== user.id || item.status !== "ACTIVE") {
    redirect(`/items/${item.id}`);
  }

  // Format date as YYYY-MM-DD for the date input
  const itemDate = new Date(item.itemDate);

  const formattedDate = [
    itemDate.getFullYear(),
    String(itemDate.getMonth() + 1).padStart(2, "0"),
    String(itemDate.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#0a0a0c] font-sans text-[#f4f4f5] antialiased selection:bg-white selection:text-[#0a0a0c] flex flex-col justify-between px-3.5 py-3 sm:px-6 sm:py-5">

      {/* Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[180px] w-[260px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[70px] sm:-top-32 sm:h-[300px] sm:w-[680px]"
      />

      {/* Background Precision Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_25%,#000_35%,transparent_100%)]"
      />

      {/* Header Navbar */}
      <header className="mx-auto w-full max-w-2xl shrink-0">
        <div className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#111114]/80 px-3.5 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl">

          {/* Back */}
          <Link
            href={`/items/${item.id}`}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 transition-colors hover:text-white"
          >
            <span>&larr;</span>
            <span>Back to Report</span>
          </Link>

          {/* Brand */}
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-bold tracking-tight text-white hover:opacity-85 transition-opacity"
          >
            NITRiTrack
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col justify-start">

        {/* Page Header */}
        <div className="mt-4 mb-3.5 px-0.5 flex items-center justify-between">
          <div>
            <p className="mb-1 text-[9px] font-mono font-bold uppercase tracking-widest text-blue-400">
              REPORT MANAGEMENT
            </p>

            <h1 className="text-xl sm:text-2xl font-black tracking-[-0.035em] text-white">
              Edit Report
            </h1>
          </div>

          {/* Category */}
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 rounded-lg">
            {item.category}
          </span>
        </div>

        {/* Edit Form Component */}
        <EditItemForm
          itemId={item.id}
          type={item.type}
          category={item.category}
          title={item.title}
          description={item.description ?? ""}
          location={item.location}
          itemDate={formattedDate}
          imageUrl={item.imageUrl ?? ""}
        />
      </div>

      {/* Footer */}
      <footer className="mt-4 w-full shrink-0 py-2 text-center text-[10px] font-mono tracking-wide text-zinc-500">
        © 2026 NITRiTrack. Built for NIT Rourkela.
      </footer>
    </main>
  );
}
