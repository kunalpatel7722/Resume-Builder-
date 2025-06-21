
import React from 'react';
import type { ResumeData } from '@/components/resume-builder';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, HardDrive, TerminalSquare, Award, Globe, Trophy, Activity, Link as LinkIcon, Pencil, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import rehypeRaw from 'rehype-raw';

export const ItProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
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
    <div className="bg-white text-gray-800 p-8 w-full h-full font-['Source_Code_Pro',_monospace] text-sm">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-primary">{`> ${fullName || 'YOUR_NAME'}`}</h1>
        <h2 className="text-lg text-gray-700">{experience[0]?.role || 'IT Professional'}</h2>
      </header>
      
      <div className="flex justify-between items-center text-xs bg-gray-100 p-2 rounded-md mb-6">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            <span>{fullAddress}</span>
      </div>

      <main className="space-y-6">
        {summary && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-2"><TerminalSquare size={16} /> PROFILE_SUMMARY.md</h3>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded">{summary}</p>
          </section>
        )}
        
        {experience.length > 0 && experience[0]?.role && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Briefcase size={16}/> EXPERIENCE.log</h3>
            <div className="space-y-4">
              {experience.map((job) => {
                const location = [job.city, job.state].filter(Boolean).join(', ');
                return (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-md font-bold text-gray-800">{job.role || 'Job Title'} @ {job.company || 'Company'}{location && ` - ${location}`}</h4>
                      <p className="text-xs text-gray-500">{formatDateRange(job.startDate, job.endDate, job.isCurrentJob)}</p>
                    </div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none prose-code text-gray-600">
                        {job.description}
                    </ReactMarkdown>
                  </div>
                )
              })}
            </div>
          </section>
        )}
        
        {certifications.length > 0 && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Award size={16}/> CERTIFICATIONS.json</h3>
             <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-gray-700">
                     <p><span className="font-bold">{`"${cert.name || 'Cert Name'}"`}</span>, // from: ${cert.issuer || 'Issuer'}, date: ${cert.date || 'Date'}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {awards.length > 0 && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Trophy size={16}/> AWARDS.json</h3>
             <div className="space-y-2">
                {awards.map((award) => (
                  <div key={award.id} className="text-gray-700">
                     <p><span className="font-bold">{`"${award.name || 'Award Name'}"`}</span>, // date: ${award.date || 'Date'}</p>
                     <p className="pl-4">{`// ${award.description}`}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
            {skills.length > 0 && (
            <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Star size={16}/> SKILLS.sh</h3>
                <div className="flex flex-wrap gap-2">
                    {skills.filter(skill => skill).map((skill, index) => (
                        <span key={index} className="bg-primary/10 text-primary-focus text-xs font-medium px-2 py-1 rounded">{skill}</span>
                    ))}
                </div>
            </section>
            )}

            {education.length > 0 && education[0]?.school && (
                <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><GraduationCap size={16}/> EDUCATION.cfg</h3>
                {education.map((edu) => {
                  const gradDate = edu.isStillEnrolled 
                    ? 'Enrolled' 
                    : [edu.graduationMonth, edu.graduationYear].filter(Boolean).join(' ');
                  return (
                    <div key={edu.id} className="mb-2">
                      <h4 className="text-md font-bold text-gray-800">{edu.degree || 'Degree'}</h4>
                      <p className="text-sm text-gray-600">{edu.school || 'School Name'} ({gradDate || 'Date'})</p>
                    </div>
                  )
                })}
                </section>
            )}
        </div>

         {activities.length > 0 && (
            <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Activity size={16}/> HOBBIES.txt</h3>
                <p className="text-gray-600">
                    {activities.filter(a => a).join(', ')}
                </p>
            </section>
         )}

         {languages.length > 0 && (
            <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Globe size={16}/> LANGUAGES.txt</h3>
                <p className="text-gray-600">
                    {languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}
                </p>
            </section>
         )}

         {websites.length > 0 && (
            <section>
                <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><LinkIcon size={16}/> LINKS.url</h3>
                <div className="flex flex-col space-y-1">
                    {websites.map(site => (
                      <a key={site.id} href={site.url} className="text-primary hover:underline">{site.label || site.url}</a>
                    ))}
                </div>
            </section>
         )}
         
         {customSections.map(section => (
            <section key={section.id}>
              <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Pencil size={16}/> {section.title}.md</h3>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="prose prose-sm max-w-none text-gray-600">
                  {section.content}
              </ReactMarkdown>
            </section>
         ))}

         {showReferences && (
          <section>
            <h3 className="text-md font-bold text-primary flex items-center gap-2 mb-3"><Users size={16}/> REFERENCES.md</h3>
            <p className="text-gray-600">Available upon request.</p>
          </section>
        )}
      </main>
    </div>
  );
};
