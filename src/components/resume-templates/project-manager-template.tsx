
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, GanttChartSquare, CheckSquare, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const ProjectManagerTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, activities, awards, websites, customSections, showReferences } = data;
  const fullName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ');
  const fullAddress = [personalInfo.streetAddress, personalInfo.city, personalInfo.state, personalInfo.zipCode].filter(Boolean).join(', ');

  const formatDateRange = (startDate: Date | null, endDate: Date | null, isCurrent: boolean) => {
    if (!startDate) return 'Dates';
    const start = format(startDate, 'MMM yyyy');
    if (isCurrent) return `${start} - Present`;
    if (endDate) return `${start} - ${format(endDate, 'MMM yyyy')}`;
    return start;
  };

  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans flex text-sm">
        <aside className="w-1/3 bg-gray-50 p-6 flex flex-col space-y-6">
            <header>
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">{fullName || 'Your Name'}</h1>
                <h2 className="text-lg text-primary font-semibold mt-1">{experience[0]?.role || 'Project Manager'}</h2>
            </header>
            <section>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Contact</h3>
                 <div className="space-y-1.5 text-gray-600 text-xs">
                    {personalInfo.email && <p className="flex items-center gap-2"><Mail size={14}/> {personalInfo.email}</p>}
                    {personalInfo.phone && <p className="flex items-center gap-2"><Phone size={14}/> {personalInfo.phone}</p>}
                    {fullAddress && <p className="flex items-center gap-2"><MapPin size={14}/> {fullAddress}</p>}
                    {websites.map(site => (
                        <p key={site.id} className="flex items-center gap-2"><LinkIcon size={14}/> <a href={site.url} className="text-primary hover:underline">{site.label || site.url}</a></p>
                    ))}
                </div>
            </section>
            {skills.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Core Competencies</h3>
                    <ul className="space-y-1.5 text-xs">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="flex items-center gap-2"><CheckSquare size={14} className="text-primary"/>{skill}</li>
                        ))}
                    </ul>
                </section>
            )}
            {education.length > 0 && education[0]?.school && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Education</h3>
                    {education.map((edu) => {
                       const gradDate = edu.isStillEnrolled 
                        ? 'Enrolled' 
                        : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                      return (
                        <div key={edu.id} className="text-xs">
                            <h4 className="font-bold">{edu.school || 'School Name'}</h4>
                            <p className="text-gray-700">{edu.degree || 'Degree'}</p>
                            <p className="text-gray-500">{gradDate || 'Date'}</p>
                        </div>
                      )
                    })}
                </section>
            )}
            {languages.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Languages</h3>
                    <ul className="space-y-1.5 text-xs">
                        {languages.map(lang => (
                             <li key={lang.id} className="flex items-center gap-2"><Globe size={14} className="text-primary"/>{lang.name} ({lang.level})</li>
                        ))}
                    </ul>
                </section>
            )}
            {activities.length > 0 && (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Activities</h3>
                    <ul className="space-y-1.5 text-xs">
                        {activities.map((activity, index) => (
                             <li key={index} className="flex items-center gap-2"><Activity size={14} className="text-primary"/>{activity}</li>
                        ))}
                    </ul>
                </section>
            )}
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-2">Career Summary</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3 flex items-center gap-2"><GanttChartSquare size={20}/>Project Experience</h2>
                <div className="space-y-4">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-bold text-gray-900">{job.role || 'Job Title'}</h3>
                          <p className="text-xs text-gray-500 font-medium">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                            {job.description}
                        </ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {awards.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3 flex items-center gap-2"><Trophy size={20}/>Awards</h2>
                    <div className="space-y-3">
                        {awards.map((award) => (
                          <div key={award.id}>
                             <h3 className="text-base font-bold text-gray-900">{award.name || 'Award Name'} - <span className="font-normal text-sm text-gray-600">{award.date || 'Date'}</span></h3>
                             <p className="text-gray-700">{award.description}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}

            {certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3 flex items-center gap-2"><Award size={20}/>Certifications</h2>
                    <div className="space-y-3">
                        {certifications.map((cert) => (
                          <div key={cert.id}>
                             <h3 className="text-base font-bold text-gray-900">{cert.name || 'Certification Name'}</h3>
                             <p className="text-sm font-semibold text-gray-700">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}

            {customSections.map(section => (
                <section key={section.id} className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3 flex items-center gap-2"><Pencil size={20}/>{section.title}</h2>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                        {section.content}
                    </ReactMarkdown>
                </section>
            ))}

            {showReferences && (
                <section>
                    <h2 className="text-xl font-bold text-gray-800 pb-1 border-b-2 border-gray-200 mb-3 flex items-center gap-2"><Users size={20}/>References</h2>
                    <p className="text-gray-600">Available upon request.</p>
                </section>
            )}
        </main>
    </div>
  );
};
