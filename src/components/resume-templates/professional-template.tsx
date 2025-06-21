
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans flex text-xs">
        <aside className="w-1/3 bg-slate-800 text-white p-6 flex flex-col space-y-8">
            <section>
                <h1 className="text-3xl font-bold tracking-tight">{fullName || 'Your Name'}</h1>
                <h2 className="text-md text-slate-300 mt-1">{experience[0]?.role || 'Your Title'}</h2>
            </section>

            <section>
                 <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Contact</h3>
                 <div className="space-y-2 text-slate-200">
                    {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /><span>{personalInfo.email}</span></div>}
                    {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /><span>{personalInfo.phone}</span></div>}
                    {fullAddress && <div className="flex items-center gap-2"><MapPin size={14} /><span>{fullAddress}</span></div>}
                </div>
            </section>

            {education.length > 0 && education[0]?.school && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Education</h3>
                    <div className="space-y-3">
                        {education.map((edu) => (
                          <div key={edu.id}>
                             <h4 className="font-bold text-white">{edu.school || 'School Name'}</h4>
                             <p className="text-slate-300">{edu.degree || 'Degree'}</p>
                             <p className="text-xs text-slate-400">{edu.dates || 'Dates'}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}

            {skills.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Skills</h3>
                    <ul className="flex flex-wrap gap-1.5">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="bg-slate-600 text-slate-100 text-[11px] font-medium px-2 py-1 rounded">{skill}</li>
                        ))}
                    </ul>
                </section>
            )}
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b-2 border-slate-300 mb-3"><User size={18}/> Profile</h2>
                <p className="text-slate-600 leading-relaxed">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b-2 border-slate-300 mb-3"><Briefcase size={18}/>Experience</h2>
                <div className="space-y-4">
                  {experience.map((job) => (
                    <div key={job.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold text-slate-900">{job.role || 'Job Title'}</h3>
                        <p className="text-xs text-slate-500 font-medium">{job.dates || 'Dates'}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{job.company || 'Company Name'}</p>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none text-slate-600">
                          {job.description}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              </section>
            )}
        </main>
    </div>
  );
};
