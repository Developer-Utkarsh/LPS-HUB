import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ResourceListPage from './ResourceListPage';

export default async function SubjectSelectionPage({ params }: { params: { classId: string, resourceType: string } }) {
  const { classId, resourceType } = params;

  if (resourceType === 'daily_diary') {
    return <ResourceListPage params={{ classId, resourceType, subject: '' }} />;
  }

  const subjects = await fetchSubjects(classId, resourceType);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Class {classId} - {resourceType.replace('_', ' ')} Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link key={subject} href={`/classes/${classId}/${resourceType}/${subject}`} passHref>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex items-center justify-center h-32">
                <CardTitle>{subject}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function fetchSubjects(classId: string, resourceType: string) {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SUBJECTS_COLLECTION_ID!,
        [Query.equal('class', classId), Query.equal('type', resourceType)]
      );
      return response.documents.map(doc => doc.name);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  }