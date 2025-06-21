
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, User, Star, Briefcase, GraduationCap, Award, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications } = data;
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
        <aside className="w-1/3 bg-gray-100 p-6 text-gray-700 flex flex-col">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center ring-4 ring-primary/20">
                    <User className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName || 'Your Name'}</h1>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-md font-semibold uppercase tracking-wider border-b-2 border-primary pb-1 mb-3 flex items-center gap-2"><Mail size={16} />Contact</h2>
                    <div className="space-y-2 text-xs">
                        {personalInfo.email && <div className="flex items-start gap-2"><Phone size={14} className="text-primary mt-0.5"/><span>{personalInfo.email}</span></div>}
                        {personalInfo.phone && <div className="flex items-start gap-2"><Mail size={14} className="text-primary mt-0.5"/><span>{personalInfo.phone}</span></div>}
                        {fullAddress && <div className="flex items-start gap-2"><MapPin size={14} className="text-primary mt-0.5"/><span>{fullAddress}</span></div>}
                    </div>
                </section>

                {skills.length > 0 && (
                    <section>
                        <h2 className="text-md font-semibold uppercase tracking-wider border-b-2 border-primary pb-1 mb-3 flex items-center gap-2"><Star size={16} />Skills</h2>
                        <ul className="flex flex-wrap gap-1.5">
                            {skills.filter(skill => skill).map((skill, index) => (
                                <li key={index} className="bg-primary/10 text-primary-focus text-xs font-medium px-2 py-1 rounded-full">{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}
                
                {languages.length > 0 && (
                    <section>
                        <h2 className="text-md font-semibold uppercase tracking-wider border-b-2 border-primary pb-1 mb-3 flex items-center gap-2"><Globe size={16} />Languages</h2>
                        <ul className="space-y-1 text-xs">
                           {languages.map(lang => (
                             <li key={lang.id}>{lang.name} <span className="text-gray-500">({lang.level})</span></li>
                           ))}
                        </ul>
                    </section>
                )}

            </div>
        </aside>

        <main className="w-2/3 p-8">
            {summary && (
              <section className="mb-8">
                <h2 className="text-xl font-bold uppercase tracking-wide text-primary mb-3">Summary</h2>
                <p className="text-gray-600 leading-relaxed border-l-4 border-primary/20 pl-4">{summary}</p>
              </section>
            )}

            {experience.length > 0 && experience[0]?.role && (
              <section className="mb-8">
                <h2 className="text-xl font-bold uppercase tracking-wide text-primary mb-4 flex items-center gap-2"><Briefcase size={20}/>Work Experience</h2>
                <div className="space-y-4">
                  {experience.map((job) => {
                    const location = [job.city, job.state].filter(Boolean).join(', ');
                    return (
                      <div key={job.id} className="relative pl-5">
                        <div className="absolute left-0 top-1 h-full w-0.5 bg-gray-200"></div>
                        <div className="absolute left-[-4px] top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-white"></div>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-md font-bold text-gray-800">{job.role || 'Job Title'}</h3>
                          <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 italic">{job.company || 'Company Name'}{location && ` - ${location}`}</p>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                            {job.description}
                        </ReactMarkdown>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {education.length > 0 && education[0]?.school && (
              <section className="mb-8">
                <h2 className="text-xl font-bold uppercase tracking-wide text-primary mb-4 flex items-center gap-2"><GraduationCap size={20}/>Education</h2>
                 <div className="space-y-2">
                    {education.map((edu) => {
                       const gradDate = edu.isStillEnrolled 
                        ? 'Enrolled' 
                        : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                      return (
                        <div key={edu.id} className="mb-2">
                           <div className="flex justify-between items-baseline">
                              <h3 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h3>
                              <p className="text-xs text-gray-500">{gradDate || 'Date'}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-600 italic">{edu.school || 'School Name'}{edu.location && `, ${edu.location}`}</p>
                        </div>
                      )
                    })}
                 </div>
              </section>
            )}

            {certifications.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold uppercase tracking-wide text-primary mb-4 flex items-center gap-2"><Award size={20}/>Certifications</h2>
                    <div className="space-y-2">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="mb-2">
                             <h3 className="text-md font-bold text-gray-800">{cert.name || 'Certification Name'}</h3>
                             <p className="text-sm font-semibold text-gray-600 italic">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
                          </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    </div>
  );
};
