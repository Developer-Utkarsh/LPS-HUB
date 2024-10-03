'use client';

import { storage } from '@/lib/appwrite';
import { useEffect, useState } from 'react';

export default function PDFViewer({ params }: { params: { fileId: string } }) {
  const { fileId } = params;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = storage.getFileView(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!, fileId);
        setPdfUrl(url.href);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdfUrl();
  }, [fileId]);

  if (!pdfUrl) {
    return <div>Loading PDF...</div>;
  }

  return (
    <div className="w-full h-screen">
      <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
    </div>
  );
}