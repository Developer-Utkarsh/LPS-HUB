import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ResourceListPage from "@/components/ResourceListPage";
import { ArrowLeft } from "lucide-react";

export default async function SubjectSelectionPage({
  params,
}: {
  params: { classId: string; resourceType: string };
}) {
  const { classId, resourceType } = params;

  if (resourceType === "daily_diary") {
    return <ResourceListPage params={{ classId, resourceType, subject: "" }} />;
  }

  const subjects = await fetchSubjects(classId, resourceType);

  return (
    <div className="container mx-auto py-8">
      <Link
        href={`/classes/${classId}`}
        className="flex items-center text-blue-500 hover:underline mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Class {classId} Resources
      </Link>
      <h1 className="text-3xl font-bold mb-4">
        Class {classId} - {resourceType.replace("_", " ")}
      </h1>
      <h2 className="text-xl font-semibold mb-6">Select a subject</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link
            key={subject}
            href={`/classes/${classId}/${resourceType}/${subject.replace(/ /g, "-")}`}
            passHref
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
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
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      [Query.equal("class", classId), Query.equal("type", resourceType)],
    );

    // Extract unique subjects from the documents
    const uniqueSubjects = Array.from(
      new Set(response.documents.map((doc) => doc.subject)),
    );

    return uniqueSubjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}
