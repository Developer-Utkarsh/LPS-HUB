import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ResourceListPage({ params }: { params: { classId: string, resourceType: string, subject: string } }) {
  const { classId, resourceType, subject } = params;

  const resources = await fetchResources(classId, resourceType, subject);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Class {classId} - {resourceType.replace('_', ' ')} 
        {subject && ` - ${subject}`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.$id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{resource.description}</p>
              <Link href={`/classes/${classId}/${resourceType}/${subject}/${resource.title.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-')}`} passHref>
                <Button className="w-full">View Resource</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function fetchResources(classId: string, resourceType: string, subject: string) {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      [
        Query.equal('class', classId),
        Query.equal('type', resourceType),
        Query.equal('subject', subject)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}