"use client";

import { databases, storage } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResourcePage({
  params,
}: {
  params: {
    classId: string;
    resourceType: string;
    subject: string;
    slug: string;
  };
}) {
  const { classId, resourceType, subject: encodedSubject, slug } = params;
  const subject = encodedSubject.replace(/-/g, " ");

  const [resource, setResource] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  console.log(subject);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
          [
            Query.equal("class", classId),
            Query.equal("type", resourceType),
            Query.equal("subject", subject),
            Query.equal("title", slug.replace(/-/g, " ")),
          ],
        );
        if (response.documents.length > 0) {
          setResource(response.documents[0]);
          const url = storage.getFileView(
            process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
            response.documents[0].fileId,
          );
          setPdfUrl(url.href);
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      }
    };

    fetchResource();
  }, [classId, resourceType, subject, slug]);

  console.log(resource);

  if (!resource) {
    return <div>Loading resource...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Link
        href={`/classes/${classId}/${resourceType}/${subject}`}
        className="flex items-center text-blue-500 hover:underline mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {subject} resources
      </Link>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{resource.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Subject:</strong> {resource.subject}
          </p>
          <p>
            <strong>Type:</strong> {resourceType.replace("_", " ")}
          </p>
          <p>
            <strong>Description:</strong> {resource.description}
          </p>
          {resource.date && (
            <p>
              <strong>Date:</strong>{" "}
              {new Date(resource.date).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4 mb-8">
        <Button
          onClick={() =>
            window.open(`/resource-pdf/${resource.fileId}`, "_blank")
          }
        >
          <FileText className="mr-2 h-4 w-4" />
          View PDF
        </Button>
        <Button onClick={() => window.open(pdfUrl!, "_blank")}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="w-full h-[100vh]">
        <iframe
          src={pdfUrl!}
          className="w-full h-full"
          title={resource.title}
        />
      </div>
    </div>
  );
}
