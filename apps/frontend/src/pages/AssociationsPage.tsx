import React, { useState } from 'react'
import { Search, Filter, Building } from 'lucide-react'

const AssociationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMunicipality, setSelectedMunicipality] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Mock data - kommer att ersättas med riktiga API-anrop
  const mockAssociations = [
    {
      id: '1',
      name: 'Idrottsföreningen Example',
      organizationNumber: '123456-7890',
      municipality: 'Stockholm',
      category: 'Idrott',
      description: 'En lokal idrottsförening',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sök föreningar
        </h1>
        <p className="text-gray-600">
          Sök bland föreningar från svenska kommunala register
        </p>
      </div>

      {/* Search filters */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sökord
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Sök efter namn, organisationsnummer..."
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kommune
            </label>
            <select
              value={selectedMunicipality}
              onChange={e => setSelectedMunicipality(e.target.value)}
              className="input"
            >
              <option value="">Alla kommuner</option>
              <option value="stockholm">Stockholm</option>
              <option value="goteborg">Göteborg</option>
              <option value="malmo">Malmö</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">Alla kategorier</option>
              <option value="idrott">Idrott</option>
              <option value="kultur">Kultur</option>
              <option value="social">Social</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="btn-primary">
            <Filter size={16} className="mr-2" />
            Filtrera
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Resultat ({mockAssociations.length} föreningar)
          </h2>
        </div>

        {mockAssociations.length === 0 ? (
          <div className="card text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Inga föreningar hittades
            </h3>
            <p className="text-gray-600">
              Prova att justera dina sökfilter eller söktermer.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {mockAssociations.map(association => (
              <div
                key={association.id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {association.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {association.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Org.nr: {association.organizationNumber}</span>
                      <span>Kommun: {association.municipality}</span>
                      <span>Kategori: {association.category}</span>
                    </div>
                  </div>
                  <button className="btn-secondary ml-4">Visa detaljer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssociationsPage
