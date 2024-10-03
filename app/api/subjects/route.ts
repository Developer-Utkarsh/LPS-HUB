import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const classId = searchParams.get('classId');
  const type = searchParams.get('type');

  if (!classId || !type) {
    return NextResponse.json({ error: 'Missing classId or type' }, { status: 400 });
  }

  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SUBJECTS_COLLECTION_ID!,
      [Query.equal('class', classId), Query.equal('type', type)]
    );
    return NextResponse.json(response.documents.map(doc => doc.name));
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 });
  }
}