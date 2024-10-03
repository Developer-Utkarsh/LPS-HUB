import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SubjectPage({
  params,
}: {
  params: { classId: string; resourceType: string; subject: string };
}) {
  const { classId, resourceType, subject: encodedSubject } = params;
  const subject = encodedSubject.replace(/-/g, " ");

  try {
    const documents = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      [
        Query.equal("class", classId),
        Query.equal("type", resourceType),
        Query.equal("subject", subject),
      ],
    );

    console.log(documents, classId, resourceType, subject);

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">
          Class {classId} - {resourceType.replace("_", " ")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.documents.map((doc) => (
            <Card
              key={doc.$id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{doc.subject}</p>
                <Link
                  href={`/classes/${classId}/${resourceType}/${subject.replace(/ /g, "-")}/${doc.title.replace(/[\s.\/]/g, "-").toLowerCase()}`}
                  passHref
                >
                  <Button>View Resource</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return <div>Error loading resources. Please try again later.</div>;
  }
}
