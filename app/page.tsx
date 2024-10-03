import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Lightbulb, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-black">
      <h1 className="text-6xl max-sm:text-4xl max-sm:mb-2  tracking-tighter font-semibold mb-4 flex flex-col items-center">
        <GraduationCap className="mr-4 h-24 w-24 -mb-2 max-sm:mb-0 max-sm:h-12 max-sm:w-12" />
        Welcome to LPS Hub
      </h1>
      <p className="text-xl mb-10 max-sm:mb-8 font-thin flex max-sm:flex-col items-center text-neutral-800 tracking-tight max-sm:text-base">
        <Lightbulb className="mr-2 h-6 w-6 max-sm:hidden" />
        Access educational materials for classes 9-12 {"  "}
        <span className="inline-block px-2"> just for LPS</span>
      </p>
      <Link href="/classes">
        <Button
          size="lg"
          className="text-xl px-8 py-8 font-semibold tracking-tight bg-black text-white  hover:bg-zinc-800 transition-all hover:scale-105"
        >
          <BookOpen className="mr-4 h-6 w-6" />
          Browse Classes
        </Button>
      </Link>
    </div>
  );
}
