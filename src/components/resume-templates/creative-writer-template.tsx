
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Feather, BookOpen, PenTool, Award, Languages, Trophy, Activity, Link as LinkIcon, Users, Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const CreativeWriterTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-900 p-10 w-full h-full font-['Lora',_serif] text-base">
      <header className="text-center mb-8">
        <div className="inline-block bg-primary/10 rounded-full p-2 mb-2">
            <Feather className="h-8 w-8 text-primary"/>
        </div>
        <h1 className="text-4xl font-bold">{fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mt-1">{experience[0]?.role || 'Creative Writer & Editor'}</p>
      </header>
      
      <main className="max-w-3xl mx-auto space-y-8">
        {summary && (
          <section>
            <p className="text-gray-700 leading-relaxed text-center italic">{summary}</p>
          </section>
        )}
        
        <div className="w-1/4 h-px bg-gray-300 mx-auto" />

        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-center tracking-wider flex items-center justify-center gap-2"><BookOpen/> Experience</h2>
            {experience.map((job) => {
              const location = [job.city, job.state].filter(Boolean).join(', ');
              return (
                <div key={job.id} className="mb-5">
                    <div className="text-center mb-1">
                        <h3 className="text-xl font-semibold">{job.role || 'Job Title'}</h3>
                        <p className="text-md italic text-gray-700">{job.company || 'Publisher / Company'}{location && `, ${location}`} &mdash; <span className="text-sm text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</span></p>
                    </div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-800">
                        {job.description}
                    </ReactMarkdown>
                </div>
              )
            })}
          </section>
        )}
        
        <div className="w-1/4 h-px bg-gray-300 mx-auto" />

        <div className="grid grid-cols-2 gap-8">
            {skills.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><PenTool /> Skills</h2>
                    <ul className="text-center space-y-1">
                        {skills.filter(skill => skill).map((skill, index) => (
                            <li key={index} className="text-gray-700">{skill}</li>
                        ))}
                    </ul>
                </section>
            )}
            {education.length > 0 && education[0]?.school && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-center tracking-wider">Education</h2>
                {education.map((edu) => {
                  const gradDate = edu.isStillEnrolled 
                    ? 'Enrolled' 
                    : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                  return (
                    <div key={edu.id} className="text-center">
                      <h3 className="text-xl font-semibold">{edu.school || 'University'}{edu.location && `, ${edu.location}`}</h3>
                      <p className="text-md italic text-gray-700">{edu.degree || 'Degree'}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</p>
                      <p className="text-sm text-gray-500">{gradDate || 'Date'}</p>
                    </div>
                  )
                })}
              </section>
            )}
            
            {awards.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><Trophy /> Awards</h2>
                {awards.map((award) => (
                  <div key={award.id} className="text-center mb-2">
                     <h3 className="text-xl font-semibold">{award.name || 'Award Name'}</h3>
                     <p className="text-md italic text-gray-700">{award.description} - {award.date || 'Date'}</p>
                  </div>
                ))}
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><Award /> Certifications</h2>
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-center mb-2">
                     <h3 className="text-xl font-semibold">{cert.name || 'Certification Name'}</h3>
                     <p className="text-md italic text-gray-700">{cert.issuer || 'Issuing Body'} - {cert.date || 'Date'}</p>
                  </div>
                ))}
              </section>
            )}

            {activities.length > 0 && (
              <section>
                  <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><Activity /> Activities</h2>
                  <ul className="text-center space-y-1">
                      {activities.map((activity, index) => (
                          <li key={index} className="text-gray-700">{activity}</li>
                      ))}
                  </ul>
              </section>
            )}

            {languages.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><Languages /> Languages</h2>
                <ul className="text-center space-y-1">
                  {languages.map((lang) => (
                    <li key={lang.id} className="text-gray-700">{lang.name}: <span className="italic">{lang.level}</span></li>
                  ))}
                </ul>
              </section>
            )}
        </div>

        {websites.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><LinkIcon /> Portfolio</h2>
            <div className="text-center space-x-4">
              {websites.map((site) => (
                <a key={site.id} href={site.url} className="text-primary hover:underline">{site.label || site.url}</a>
              ))}
            </div>
          </section>
        )}

        {customSections.map(section => (
          <section key={section.id}>
            <h2 className="text-2xl font-bold mb-4 text-center tracking-wider flex items-center justify-center gap-2"><Pencil/> {section.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-serif text-gray-800">
                {section.content}
            </ReactMarkdown>
          </section>
        ))}

        {showReferences && (
          <section>
            <h2 className="text-2xl font-bold mb-3 text-center tracking-wider flex items-center justify-center gap-2"><Users /> References</h2>
            <p className="text-center text-gray-700">Available upon request.</p>
          </section>
        )}
        
      </main>
      <footer className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
          {personalInfo.email} | {personalInfo.phone} | {fullAddress}
      </footer>
    </div>
  );
};
