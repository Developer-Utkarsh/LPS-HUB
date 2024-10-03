'use client';

import { storage } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <iframe src={pdfUrl} className="w-full h-screen" title="PDF Viewer" />
  );
}