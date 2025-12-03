'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function ImportCareersPage() {
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
        throw new Error('JSON must be an array of careers');
      }

      if (json.length > 0) {
        setPreview({
          totalCareers: json.length,
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
      const careers = JSON.parse(text);

      const response = await fetch('/api/admin/careers/bulk-import-careers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ careers })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to import careers';
        const details = result.details ? '\n\nDetails:\n' + result.details.join('\n') : '';
        throw new Error(errorMessage + details);
      }

      if (result.errors && result.errors.length > 0) {
        alert(`Imported ${result.imported} of ${result.total} careers.\n\nErrors:\n${result.errors.join('\n')}`);
      } else {
        alert(`Successfully imported ${result.imported} careers!`);
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Import Careers</h2>
          <p className="text-sm sm:text-base text-[#64748B]">Upload a JSON file to import careers for majors</p>
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
            <pre className="text-xs sm:text-sm text-[#64748B] overflow-x-auto bg-white p-3 sm:p-4 rounded-lg max-h-96">
{`[
  {
    "major_slug": "computer-science",
    "name": "Software Engineer",
    "slug": "software-engineer",
    "brief_description": "Design and develop software applications and systems",
    "responsibilities": [
      "Design and develop software systems",
      "Write clean, maintainable code",
      "Collaborate with cross-functional teams",
      "Review code and provide feedback"
    ],
    "hard_skills": ["Python", "JavaScript", "SQL", "Git", "System Design"],
    "soft_skills": ["Problem Solving", "Communication", "Teamwork"],
    "education_required": "Bachelor's degree in Computer Science or related field",
    "certifications": ["AWS Certified", "Google Cloud Professional"],
    "salary_entry": 65000,
    "salary_average": 95000,
    "salary_high": 150000,
    "salary_growth": "Salaries typically grow 5-8% annually",
    "high_paying_regions": ["San Francisco", "New York", "Seattle"],
    "high_paying_industries": ["Tech", "Finance", "Healthcare"],
    "growth_outlook": "Much faster than average (22% over 10 years)",
    "advancement_paths": ["Senior Engineer", "Tech Lead", "CTO"],
    "typical_day": "Start with a team standup meeting to discuss progress...",
    "real_tasks": [
      "Review and merge pull requests",
      "Debug production issues",
      "Design new API endpoints",
      "Write unit tests"
    ]
  }
]`}
            </pre>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3">
                File Preview: {preview.totalCareers} careers found
              </h3>
              <div className="text-sm text-green-700">
                <p className="font-semibold mb-1">First Career:</p>
                <p className="mb-1"><strong>Name:</strong> {preview.sample.name}</p>
                <p className="mb-1"><strong>Major:</strong> {preview.sample.major_slug}</p>
                {preview.sample.salary_average && (
                  <p className="mb-1"><strong>Avg Salary:</strong> ${preview.sample.salary_average.toLocaleString()}</p>
                )}
                <p className="text-xs mt-2">{preview.sample.brief_description}</p>
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
              {importing ? 'Importing...' : 'Import Careers'}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-4 space-y-2">
            <p className="text-xs sm:text-sm text-blue-700">
              <strong>Tip:</strong> Make sure the major_slug matches an existing major. Import majors first!
            </p>
            <p className="text-xs sm:text-sm text-blue-700">
              <strong>Pro tip:</strong> Use Claude or ChatGPT to generate comprehensive career data.
              Ask it to create detailed career profiles with all fields filled in.
            </p>
          </div>

          {/* Field Descriptions */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 sm:p-6 mt-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-3">Field Descriptions</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#64748B]">
              <div><strong>major_slug:</strong> The slug of the major (required)</div>
              <div><strong>name:</strong> Career title (required)</div>
              <div><strong>slug:</strong> URL-friendly identifier (required)</div>
              <div><strong>brief_description:</strong> Short overview</div>
              <div><strong>responsibilities:</strong> Array of job duties</div>
              <div><strong>hard_skills:</strong> Technical skills array</div>
              <div><strong>soft_skills:</strong> Interpersonal skills array</div>
              <div><strong>education_required:</strong> Typical education needed</div>
              <div><strong>certifications:</strong> Relevant certifications</div>
              <div><strong>salary_entry:</strong> Entry-level salary (USD)</div>
              <div><strong>salary_average:</strong> Average salary (USD)</div>
              <div><strong>salary_high:</strong> Senior-level salary (USD)</div>
              <div><strong>salary_growth:</strong> Salary growth description</div>
              <div><strong>high_paying_regions:</strong> Top paying locations</div>
              <div><strong>high_paying_industries:</strong> Top paying sectors</div>
              <div><strong>growth_outlook:</strong> Job market outlook</div>
              <div><strong>advancement_paths:</strong> Career progression</div>
              <div><strong>typical_day:</strong> Daily work description</div>
              <div><strong>real_tasks:</strong> Actual tasks performed</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
