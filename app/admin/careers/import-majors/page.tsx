'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function ImportMajorsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setPreview(null);

    try {
      const text = await selectedFile.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        throw new Error('JSON must be an array of majors');
      }

      if (json.length > 0) {
        setPreview({
          totalMajors: json.length,
          sample: json[0]
        });
      }
    } catch (err: any) {
      setError(`Invalid JSON file: ${err.message}`);
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      const majors = JSON.parse(text);

      const response = await fetch('/api/admin/careers/bulk-import-majors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ majors })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to import majors';
        const details = result.details ? '\n\nDetails:\n' + result.details.join('\n') : '';
        throw new Error(errorMessage + details);
      }

      if (result.errors && result.errors.length > 0) {
        alert(`Imported ${result.imported} of ${result.total} majors.\n\nErrors:\n${result.errors.join('\n')}`);
      } else {
        alert(`Successfully imported ${result.imported} majors!`);
      }
      router.push('/admin/careers');
    } catch (err: any) {
      setError(err.message);
      setImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Import Majors</h2>
          <p className="text-sm sm:text-base text-[#64748B]">Upload a JSON file to import majors into career categories</p>
        </div>

        <div className="card p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={importing}
              className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A] disabled:bg-gray-100"
            />
          </div>

          {/* Format Example */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-3">Expected JSON Format</h3>
            <pre className="text-xs sm:text-sm text-[#64748B] overflow-x-auto bg-white p-3 sm:p-4 rounded-lg">
{`[
  {
    "category_slug": "technology-engineering",
    "name": "Computer Science",
    "slug": "computer-science",
    "description": "Study of computation, algorithms, and information systems"
  },
  {
    "category_slug": "technology-engineering",
    "name": "Electrical Engineering",
    "slug": "electrical-engineering",
    "description": "Design and application of electrical systems"
  },
  {
    "category_slug": "healthcare-medicine",
    "name": "Medicine",
    "slug": "medicine",
    "description": "Diagnosis, treatment, and prevention of disease"
  }
]`}
            </pre>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3">
                File Preview: {preview.totalMajors} majors found
              </h3>
              <div className="text-sm text-green-700">
                <p className="font-semibold mb-1">First Major:</p>
                <p className="mb-1"><strong>Name:</strong> {preview.sample.name}</p>
                <p className="mb-1"><strong>Category:</strong> {preview.sample.category_slug}</p>
                <p className="text-xs">{preview.sample.description}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 whitespace-pre-wrap">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/careers')}
              disabled={importing}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#FF6B4A] transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1 gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {importing ? 'Importing...' : 'Import Majors'}
            </button>
          </div>

          {/* Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-4">
            <p className="text-xs sm:text-sm text-blue-700">
              <strong>Tip:</strong> Make sure the category_slug matches one of the existing categories.
              You can generate this JSON using Claude or ChatGPT by asking it to create majors for each category.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
