import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Book, Calendar, BookOpen, ArrowLeft } from 'lucide-react';

const resourceTypes = [
  { type: 'copy_work', label: 'Copy Work', icon: Book },
  { type: 'daily_diary', label: 'Daily Diary', icon: Calendar },
  { type: 'lps_textbook', label: 'LPS Textbook', icon: BookOpen },
];

export default function ClassResourcesPage({ params }: { params: { classId: string } }) {
  const { classId } = params;

  return (
    <div className="container mx-auto py-8">
      <Link href="/classes" className="flex items-center text-blue-500 hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Classes
      </Link>
      <h1 className="text-3xl font-bold mb-4">Class {classId} Resources</h1>
      <h2 className="text-xl font-semibold mb-6">Select a resource type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resourceTypes.map((resourceType) => (
          <Link key={resourceType.type} href={`/classes/${classId}/${resourceType.type}`} passHref>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardHeader className="flex flex-col items-center">
                <resourceType.icon className="h-16 w-16 mb-2 text-blue-500" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-center">{resourceType.label}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}