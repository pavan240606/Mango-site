import { Card } from './ui/card';
import { Button } from './ui/button';
import { FileEdit, Search, ArrowRightLeft } from 'lucide-react';

export function HubSpotPartnerContent() {
  const features = [
    {
      icon: FileEdit,
      title: 'Bulk Content Editing',
      description: 'Pull pages, blogs, metadata, redirects, and HubDB into Google Sheets. Edit in bulk. Push changes back. Full audit trail on every change.',
    },
    {
      icon: Search,
      title: 'CMS Auditing',
      description: 'Scan your entire HubSpot portal. See every module, template, property, and language configuration in structured reports. Know exactly what you have before making changes.',
    },
    {
      icon: ArrowRightLeft,
      title: 'Migration Tooling',
      description: 'Moving to or from HubSpot? Smuves maps content types, handles field transformations, and automates entry creation at scale.',
    },
  ];

  const users = [
    {
      label: 'In-House Marketing Teams',
      description: 'Manage bulk content changes without developer support. Edit SEO fields, fix broken links, and update page properties across hundreds of pages at once.',
    },
    {
      label: 'HubSpot Solutions Partners',
      description: 'Run content audits for clients, deliver migration projects faster, and manage multi-portal environments from a single tool.',
    },
    {
      label: 'Content Operations Teams',
      description: 'Maintain content quality at scale with structured audit reports, bulk editing workflows, and change tracking.',
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {/* Banner Section */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">TECHNOLOGY PARTNER</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            HubSpot App Partner
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            Smuves helps HubSpot customers get more out of their CMS with bulk editing, content auditing, and migration tooling, all built directly into the HubSpot ecosystem.
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

        {/* Built for HubSpot Teams Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Built for HubSpot Teams</h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-5xl">
            Smuves is built for marketing teams, content operators, and agencies who manage large HubSpot CMS environments. Whether you are cleaning up metadata across hundreds of pages, restructuring blog content, or preparing for a platform migration, Smuves brings the visibility and control that HubSpot's native interface does not offer at scale. Available on the HubSpot App Marketplace.
          </p>
        </div>

        {/* Who Uses Smuves Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Who Uses Smuves</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {users.map((user, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{user.label}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{user.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">See Smuves in Action</h2>
          <p className="text-base text-gray-600 mb-6">
            Install from the HubSpot App Marketplace or request a walkthrough.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              View on Marketplace
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
