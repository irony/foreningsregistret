import React from "react";
import { Link } from "react-router-dom";
import { Search, Database, MapPin, Users } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Svenska Föreningsregister
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sök och utforska föreningar från hela Sverige genom vår samlade
          databas av kommunala föreningsregister.
        </p>
        <Link
          to="/foreningar"
          className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
        >
          <Search size={20} />
          <span>Börja söka</span>
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="card text-center">
          <Database className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Samlad data</h3>
          <p className="text-gray-600">
            Tillgång till föreningsregister från multiple kommuner i ett enda
            API
          </p>
        </div>

        <div className="card text-center">
          <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Avancerad sök</h3>
          <p className="text-gray-600">
            Sök efter namn, ort, kategori eller organisationsnummer
          </p>
        </div>

        <div className="card text-center">
          <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Geografisk filtrering</h3>
          <p className="text-gray-600">
            Filtrera resultat baserat på kommun och län
          </p>
        </div>

        <div className="card text-center">
          <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Standardiserat</h3>
          <p className="text-gray-600">
            Allt data är standardiserat och validerat med Zod-scheman
          </p>
        </div>
      </section>

      {/* Statistics placeholder */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6">Statistik</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
            <div className="text-gray-600">Totalt antal föreningar</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
            <div className="text-gray-600">Antal kommuner</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
            <div className="text-gray-600">Kategorier</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
