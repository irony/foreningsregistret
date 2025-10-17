import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";

const AssociationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - kommer att ersättas med riktigt API-anrop
  const mockAssociation = {
    id: id,
    name: "Idrottsföreningen Example",
    organizationNumber: "123456-7890",
    description:
      "En lokal idrottsförening som bedriver verksamhet för barn och ungdomar i området. Vi erbjuder träning i flera olika sporter och har ett starkt fokus på gemenskap och personlig utveckling.",
    website: "https://example.se",
    email: "info@example.se",
    phone: "08-123 456 78",
    address: {
      street: "Idrottsgatan 1",
      postalCode: "123 45",
      city: "Stockholm",
      country: "Sverige",
    },
    category: "Idrott",
    subCategory: "Fotboll",
    municipality: "Stockholm",
    county: "Stockholms län",
    isActive: true,
    registrationDate: "2010-01-15T00:00:00Z",
    lastUpdated: "2024-01-10T00:00:00Z",
    contacts: [
      {
        name: "Anna Andersson",
        role: "Ordförande",
        email: "anna.andersson@example.se",
        phone: "070-123 456 78",
      },
      {
        name: "Erik Eriksson",
        role: "Kassör",
        email: "erik.eriksson@example.se",
        phone: "070-987 654 32",
      },
    ],
  };

  if (!mockAssociation) {
    return (
      <div className="card text-center py-12">
        <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Förening hittades inte
        </h3>
        <p className="text-gray-600 mb-4">
          Föreningen du letar efter kunde inte hittas i vårt register.
        </p>
        <Link to="/foreningar" className="btn-primary">
          Tillbaka till sök
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/foreningar"
          className="btn-secondary inline-flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Tillbaka till sök</span>
        </Link>
      </div>

      <div className="card">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockAssociation.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Org.nr: {mockAssociation.organizationNumber}</span>
                <span>Kommun: {mockAssociation.municipality}</span>
                <span>Län: {mockAssociation.county}</span>
                {mockAssociation.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktiv
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">Om föreningen</h2>
              <p className="text-gray-600">{mockAssociation.description}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Kategorier</h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {mockAssociation.category}
                </span>
                {mockAssociation.subCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {mockAssociation.subCategory}
                  </span>
                )}
              </div>
            </section>

            {mockAssociation.contacts &&
              mockAssociation.contacts.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-3">
                    Kontaktpersoner
                  </h2>
                  <div className="space-y-3">
                    {mockAssociation.contacts.map((contact, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-primary-500 pl-4"
                      >
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-600">
                          {contact.role}
                        </div>
                        <div className="mt-1 space-y-1">
                          {contact.email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail size={14} />
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-primary-600 hover:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone size={14} />
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-primary-600 hover:underline"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">Kontaktuppgifter</h2>
              <div className="space-y-3">
                {mockAssociation.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="text-gray-400" size={20} />
                    <a
                      href={mockAssociation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {mockAssociation.website}
                    </a>
                  </div>
                )}

                {mockAssociation.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="text-gray-400" size={20} />
                    <a
                      href={`mailto:${mockAssociation.email}`}
                      className="text-primary-600 hover:underline"
                    >
                      {mockAssociation.email}
                    </a>
                  </div>
                )}

                {mockAssociation.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={20} />
                    <a
                      href={`tel:${mockAssociation.phone}`}
                      className="text-primary-600 hover:underline"
                    >
                      {mockAssociation.phone}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {mockAssociation.address && (
              <section>
                <h2 className="text-lg font-semibold mb-3">Adress</h2>
                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-400 mt-1" size={20} />
                  <div>
                    <div>{mockAssociation.address.street}</div>
                    <div>
                      {mockAssociation.address.postalCode}{" "}
                      {mockAssociation.address.city}
                    </div>
                    <div>{mockAssociation.address.country}</div>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold mb-3">Metadata</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registrerad:</span>
                  <span>
                    {new Date(
                      mockAssociation.registrationDate!,
                    ).toLocaleDateString("sv-SE")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Senast uppdaterad:</span>
                  <span>
                    {new Date(mockAssociation.lastUpdated!).toLocaleDateString(
                      "sv-SE",
                    )}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationDetailPage;
