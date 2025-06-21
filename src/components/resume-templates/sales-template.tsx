
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, DollarSign, Target } from 'lucide-react';

export const SalesTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-800 p-8 w-full h-full font-sans text-sm">
      <header className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{fullName || 'Your Name'}</h1>
          <h2 className="text-lg font-semibold text-primary">{experience[0]?.role || 'Sales Professional'}</h2>
        </div>
        <div className="text-right text-xs space-y-1 text-gray-600">
            {personalInfo.email && <div className="flex items-center justify-end gap-2"><Mail size={12} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center justify-end gap-2"><Phone size={12} /><span>{personalInfo.phone}</span></div>}
            {fullAddress && <div className="flex items-center justify-end gap-2"><MapPin size={12} /><span>{fullAddress}</span></div>}
        </div>
      </header>

      <main className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {summary && (
            <section>
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2"><Target size={16} /> Professional Summary</h3>
              <p className="text-gray-600 leading-relaxed">{summary}</p>
            </section>
          )}
          {experience.length > 0 && experience[0]?.role && (
            <section>
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2"><Briefcase size={16} /> Sales Experience</h3>
              {experience.map((job) => (
                <div key={job.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h4>
                    <p className="text-xs text-gray-500">{job.dates || 'Dates'}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">{job.company || 'Company Name'}</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1 text-sm">
                    {job.description.split('\n').filter(line => line.trim() !== '').map((desc, i) => (
                      <li key={i}>{desc.replace(/^•\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="col-span-1 space-y-6">
           <section>
                <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2"><Star size={16} /> Skills</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                    {skills.filter(skill => skill).map((skill, index) => (
                        <li key={index} className="flex items-center gap-2">
                           <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                           <span>{skill}</span>
                        </li>
                    ))}
                </ul>
           </section>
           {education.length > 0 && education[0]?.school && (
            <section>
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2"><GraduationCap size={16} /> Education</h3>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                   <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                   <p className="text-sm font-semibold text-primary">{edu.school || 'School Name'}</p>
                   <p className="text-xs text-gray-500">{edu.dates || 'Dates'}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
