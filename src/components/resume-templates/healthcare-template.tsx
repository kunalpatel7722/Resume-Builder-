
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, HeartPulse } from 'lucide-react';

export const HealthcareTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-800 p-8 w-full h-full font-sans text-sm">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{fullName || 'Your Name'}</h1>
        <h2 className="text-lg text-primary mt-1">{experience[0]?.role || 'Healthcare Professional'}</h2>
        <div className="text-xs text-gray-600 mt-3 flex justify-center items-center gap-4">
          <span>{fullAddress}</span>
          <span>&bull;</span>
          <span>{personalInfo.phone}</span>
          <span>&bull;</span>
          <span>{personalInfo.email}</span>
        </div>
      </header>

      <div className="w-full h-px bg-gray-200 mb-6" />

      <main className="space-y-6">
        {summary && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider text-primary mb-2">Professional Profile</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
          </section>
        )}

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider text-primary mb-3">Clinical Experience</h3>
            {experience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-md font-semibold text-gray-800">{job.role || 'Job Title'}</h4>
                  <p className="text-xs text-gray-500">{job.dates || 'Dates'}</p>
                </div>
                <p className="text-sm font-medium text-gray-600">{job.company || 'Company Name'}</p>
                <ul className="mt-2 text-gray-700 space-y-1 text-sm list-disc list-outside pl-5">
                  {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                    <li key={i}>{desc.replace(/^•\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && education[0]?.school && (
          <section>
            <h3 className="text-md font-bold uppercase tracking-wider text-primary mb-3">Education & Certifications</h3>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                 <h4 className="text-md font-semibold">{edu.degree || 'Degree'}</h4>
                 <p className="text-sm text-gray-600">{edu.school || 'School Name'} | {edu.dates || 'Dates'}</p>
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
           <section>
            <h3 className="text-md font-bold uppercase tracking-wider text-primary mb-2">Skills</h3>
            <p className="text-gray-700 text-sm">{skills.filter(skill => skill).join(' | ')}</p>
           </section>
        )}
      </main>
    </div>
  );
};
