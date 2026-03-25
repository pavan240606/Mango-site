import { Card } from './ui/card';
import { Button } from './ui/button';
import { Code, Layers, Search } from 'lucide-react';

export function ContentStackPartnerContent() {
  const features = [
    {
      icon: Code,
      title: 'Migration Engineering',
      description: 'We handle the hardest part of replatforming: mapping your existing content model to ContentStack\'s architecture, transforming data, and automating entry creation at scale.',
    },
    {
      icon: Layers,
      title: 'Content Architecture Design',
      description: 'Global fields, content types, modular blocks, reference structures, localization strategy. We design the entire ContentStack environment before any content moves.',
    },
    {
      icon: Search,
      title: 'Discovery and Auditing',
      description: 'Before migration starts, we audit your source platform and deliver a complete inventory of content types, components, languages, and assets with transformation rules documented.',
    },
  ];

  const reasons = [
    {
      label: 'Tooling-First Approach',
      description: 'We use proprietary software to automate the repeatable parts of migration and focus human expertise on the architectural decisions that require it.',
    },
    {
      label: 'Discovery Before Migration',
      description: 'Every engagement starts with a complete audit of your source platform. No migration code is written until the content architecture is fully understood and approved.',
    },
    {
      label: 'Enterprise Scale',
      description: 'Our first ContentStack engagement involved 31,000+ entries across 57 content types and 11 languages. We are built for complexity.',
    },
    {
      label: 'Certified Team',
      description: 'Our team holds ContentStack certifications across development and partner sales. We are a Preferred Partner in the ContentStack ecosystem.',
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Banner Section */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">PREFERRED PARTNER</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            ContentStack Preferred Partner
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            Smuves helps organizations migrate to ContentStack with full content architecture mapping, automated entry creation, and zero guesswork.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="p-6 border border-gray-200 bg-white">
                <div className="flex flex-col items-start">
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-base text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Migration Paths Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Migration Paths We Support</h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-5xl">
            Smuves currently supports migrations from HubSpot, WordPress, and Drupal to ContentStack. We specialize in high-volume, multi-language migrations for organizations with complex content models. Whether it is a lift-and-shift replatform or a full content architecture redesign, our tooling and methodology are built to handle enterprise-scale content operations.
          </p>
        </div>

        {/* Why Organizations Choose Smuves Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Organizations Choose Smuves for ContentStack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{reason.label}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Study Teaser Section */}
        <div className="mb-12">
          <Card className="p-8 border border-gray-200 bg-white">
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">CASE STUDY</p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Remote.com: HubSpot to ContentStack</h2>
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              We mapped 31,000+ entries across 57 content types, 166 modules, and 11 languages, and delivered a complete content architecture and migration blueprint.
            </p>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Read the Full Case Study
            </Button>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Planning a Migration to ContentStack?</h2>
          <p className="text-base text-gray-600 mb-6">
            Start with a discovery engagement. We will map your content, design the architecture, and give you a clear plan before anything moves.
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
}
