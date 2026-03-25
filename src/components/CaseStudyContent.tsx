import { Card } from './ui/card';

export function CaseStudyContent() {
  const stats = [
    { number: '1500+', label: 'Entries Across the Portal' },
    { number: '57', label: 'Content Types Mapped' },
    { number: '166', label: 'Modules Audited' },
    { number: '11', label: 'Active Languages' },
    { number: '42%', label: 'Automatable via Smuves' },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Top Banner Section */}
        <div className="mb-8">
          {/* Label and Heading */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">CASE STUDY</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              How Smuves Mapped 1500 Entries Across 57 Content Types for Remote.com's Enterprise Migration
            </h1>
            <p className="text-lg text-gray-600">
              Migration Discovery and Content Architecture | HubSpot CMS to ContentStack
            </p>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 border border-gray-200 bg-white">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600 leading-tight">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (65% = 2 cols out of 3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: The Client */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Client</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Remote is an all-in-one HR and payroll platform that helps companies hire, manage, and pay teams across the globe. Their website operates in 11 languages, with content spanning marketing pages, a high-volume blog, product documentation, pricing, and resource hubs. The entire digital presence was built on HubSpot CMS.
              </p>
            </div>

            {/* Section 2: The Challenge */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Challenge</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Remote decided to move their website from HubSpot to ContentStack, a headless CMS better suited for their multi-language, composable content strategy. The problem was that nobody could tell them what the journey would actually involve. After years of building on HubSpot, the site had accumulated 31,000+ entries across 57 content types, 166 modules, 48 database tables, and 11 active languages. Components had been duplicated across teams. Similar modules existed in multiple slightly different versions. Over 20 stakeholders each owned different pieces. Previous scoping attempts had stalled because the complexity was too large to estimate without doing the actual work of understanding what existed.
              </p>
            </div>

            {/* Section 3: The Approach */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">The Approach</h2>
              
              {/* Subsection 1 */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Understanding the Full Picture</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Using proprietary audit tooling, Smuves scanned the entire portal and produced a structured inventory of every content type, reusable component, template, language configuration, and connected database table. The audit mapped relationships between components and pages, surfacing overlaps and redundancies that years of organic growth had obscured.
                </p>
              </div>

              {/* Subsection 2 */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Cleaning Up Before Moving Out</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  The team reviewed all 166 modules with Remote's stakeholders and classified each one. Some were migrated as-is. Others were retired with documented replacements. The most complex group were modules that needed to be consolidated. For example, five different accordion components and five different banner components had accumulated over time. The discovery process identified overlaps, compared structures, and designed a single consolidated version for each in the new platform.
                </p>
              </div>

              {/* Subsection 3 */}
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Designing the New Architecture</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  With a clear picture of what was worth keeping, the team designed how everything would live in ContentStack. This meant defining reusable field groups, setting up relational structures between content types, extracting shared elements like color schemes and call-to-action patterns into standalone components, and building an SEO framework applied consistently across all 57 content types. The localization strategy required particular care, mapping which content types had full, partial, or no language coverage.
                </p>
              </div>

              {/* Subsection 4 */}
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Documenting Every Transformation</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Before any migration script could be written, every rule was documented and approved. The team produced comprehensive transformation rules covering how data would change as it moved between platforms. The goal was to handle 90% of the thinking internally and present Remote's team with a clear framework where they only needed to confirm or correct the remaining 10%.
                </p>
              </div>
            </div>

            {/* Section 4: The Outcome */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Outcome</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                When the discovery phase wrapped, Remote's team had complete visibility into their content architecture and a verified plan for how every piece would translate to the new platform. 42% of the total migration was identified as automatable through Smuves, meaning roughly 4,200 pages could be processed without manual intervention. A team of 20+ stakeholders could see exactly what the migration would involve, how their content would be restructured, and what decisions still needed their input.
              </p>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar (35% = 1 col out of 3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 border border-gray-200 bg-white">
                {/* Quote Block */}
                <div className="border-l-4 border-teal-600 pl-4 mb-6">
                  <p className="text-lg italic text-gray-900 leading-relaxed mb-4">
                    "Smuves gave us something no one else could: a complete map of our content architecture before a single line of migration code was written."
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    Remote.com Migration Stakeholder
                  </p>
                </div>

                {/* Details List */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Client</p>
                    <p className="text-base text-gray-900">Remote.com</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Industry</p>
                    <p className="text-base text-gray-900">Global HR & Payroll</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Migration</p>
                    <p className="text-base text-gray-900">HubSpot to ContentStack</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Engagement</p>
                    <p className="text-base text-gray-900">Discovery & Architecture</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}