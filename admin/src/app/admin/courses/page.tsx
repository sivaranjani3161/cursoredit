'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import DataTable, { Column } from '@/components/common/DataTable';
import CourseForm from '@/components/courses/CourseForm';
import { toast } from 'react-hot-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setFormLoading(true);
      const url = selectedCourse 
        ? `${BACKEND_URL}/api/courses/${selectedCourse.id}`
        : `${BACKEND_URL}/api/courses`;
      
      const method = selectedCourse ? 'PUT' : 'POST';
      
      // Ensure createdBy is set for new courses
      if (!selectedCourse) {
        formData.createdBy = (session?.user as any)?.id || 1;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(selectedCourse ? 'Course updated' : 'Course created');
        setIsFormOpen(false);
        setSelectedCourse(null);
        fetchCourses();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (course: any) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/courses/${course.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Course deleted');
        fetchCourses();
      } else {
        toast.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = async (course: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/courses/${course.id}`);
      if (res.ok) {
        const fullData = await res.json();
        setSelectedCourse(fullData);
        setIsFormOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Course Title',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
            {item.title[0]}
          </div>
          <span className="font-semibold text-gray-900">{item.title}</span>
        </div>
      ),
    },
    {
      header: 'Slug',
      accessor: 'slug',
      className: 'font-mono text-xs text-gray-400',
    },
    {
      header: 'Status',
      accessor: (item) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            item.isActive
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}
        >
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Created At',
      accessor: (item) => new Date(item.createdAt).toLocaleDateString(),
      className: 'text-gray-400 text-xs',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <DataTable
        title="Courses"
        icon={BookOpen}
        module="courses"
        data={courses}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search courses by title..."
        onAdd={() => {
          setSelectedCourse(null);
          setIsFormOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <CourseForm
          initialData={selectedCourse}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedCourse(null);
          }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
