'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storage, databases } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Loader2, Upload } from 'lucide-react';

const subjectsByClassAndType = {
  '9-10': {
    copy_work: ['Maths', 'English', 'Economics', 'Civics', 'History', 'Geography', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Information Technology'],
    lps_textbook: ['Math Vol 1', 'Math Vol 2', 'English Vol 1', 'English Vol 2', 'SST Vol 1', 'SST Vol 2', 'Science Vol 1', 'Hindi Vol 1'],
  },
  '11-12': {
    copy_work: ['Maths', 'Bio', 'English', 'Information Practices', 'Physical Education', 'Library Science', 'Physics', 'Chemistry'],
    lps_textbook: ['English Vol 1', 'English Vol 2'],
  },
};

const allSubjects = Array.from(new Set(Object.values(subjectsByClassAndType).flatMap(typeObj => Object.values(typeObj).flat())));

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    title: '',
    type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [subjects, setSubjects] = useState<string[]>(allSubjects);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let availableSubjects = allSubjects;

    if (formData.class) {
      const classGroup = ['9', '10'].includes(formData.class) ? '9-10' : '11-12';
      availableSubjects = Object.values(subjectsByClassAndType[classGroup as '9-10' | '11-12']).flat();
    }

    if (formData.type) {
      availableSubjects = Object.values(subjectsByClassAndType).flatMap(typeObj => typeObj[formData.type as 'copy_work' | 'lps_textbook'] || []);
    }

    if (formData.class && formData.type) {
      const classGroup = ['9', '10'].includes(formData.class) ? '9-10' : '11-12';
      availableSubjects = subjectsByClassAndType[classGroup as '9-10' | '11-12'][formData.type as 'copy_work' | 'lps_textbook'] || [];
    }

    setSubjects(availableSubjects);
  }, [formData.class, formData.type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.class || !formData.type || (!formData.subject && formData.type !== 'daily_diary') || !formData.title) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // Upload file
      const uploadResponse = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
        ID.unique(),
        file
      );

      console.log("File upload response:", uploadResponse);

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const documentId = ID.unique();

      // Create database document
      const documentResponse = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
        documentId,
        {
          ...formData,
          fileId: uploadResponse.$id,
          slug,
          subject: formData.type === 'daily_diary' ? 'diary' : formData.subject,
          date: formData.type === 'daily_diary' ? formData.date : new Date().toISOString(),
        }
      );

      console.log("Document creation response:", documentResponse);

      toast({ title: "Success", description: "Resource uploaded successfully" });
      setFile(null);
      setFormData({
        class: '',
        subject: '',
        title: '',
        type: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error uploading resource:', error);
      if (error instanceof Error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto text-left sm:max-w-lg w-full ">
      <h1 className="text-3xl font-bold mb-4 tracking-tighter">Upload Resources</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full mx-auto">
        <div>
          <Label htmlFor="class">Class</Label>
          <Select name="class" onValueChange={(value) => handleSelectChange('class', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {[9, 10, 11, 12].map((classNum) => (
                <SelectItem key={classNum} value={classNum.toString()}>{classNum}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select name="type" onValueChange={(value) => handleSelectChange('type', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily_diary">Daily Diary</SelectItem>
              <SelectItem value="lps_textbook">LPS Textbook</SelectItem>
              <SelectItem value="copy_work">Copy Work</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.type !== 'daily_diary' && (
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select name="subject" onValueChange={(value) => handleSelectChange('subject', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {formData.type === 'daily_diary' && (
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          </div>
        )}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input type="text" name="title" onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="file">PDF File</Label>
          <Input type="file" accept=".pdf" onChange={handleFileChange} required />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
