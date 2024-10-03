import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Book, GraduationCap } from 'lucide-react';

const classes = [9, 10, 11, 12];

export default function ClassesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
        <GraduationCap className="mr-4 h-12 w-12" />
        Select a Class
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {classes.map((classNum) => (
          <Link key={classNum} href={`/classes/${classNum}`} passHref>
            <Button className="w-full h-32 text-2xl flex flex-col items-center justify-center transition-all hover:scale-105">
              <Book className="mb-2 h-8 w-8" />
              Class {classNum}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}