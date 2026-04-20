import React, { useState, useEffect } from 'react';
import { Search, Users, Church, Loader2, User, MapPin } from 'lucide-react';

export default function PastoralCouncil() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Anti-screenshot protection
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable print
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    // Disable screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Static pastoral council members data
  const staticMembers = [
    { id: 1, sNo: 1, name: "Very Rev. Msgr. A. Anijielo", zone: null, position: "Parish Priest Chairman" },
    { id: 2, sNo: 2, name: "Rev. Fr. Chinoso Odoh", zone: null, position: "Vicar Member" },
    { id: 3, sNo: 3, name: "Dr Ifendu Ohabuike", zone: null, position: "DDL Member" },
    { id: 4, sNo: 4, name: "Mr Paul Agu", zone: "Zone 12", position: "1st Vice Chairman" },
    { id: 5, sNo: 5, name: "Chief (Sir) O.O. Apiakason", zone: "Zone 1", position: "2nd Vice Chairman" },
    { id: 6, sNo: 6, name: "Dr Ifeanyi Ugwu", zone: "Zone 8", position: "Secretary" },
    { id: 7, sNo: 7, name: "Mrs Rose Ozodiegwu", zone: "Zone 7", position: "Asst. Secretary" },
    { id: 8, sNo: 8, name: "Chief Mrs. J. I. Obi", zone: "Zone 11", position: "Fin. Secretary" },
    { id: 9, sNo: 9, name: "Amb. Paulinus Eze", zone: "Zone 3", position: "Treasurer" },
    { id: 10, sNo: 10, name: "Mr Emmanuel Chime", zone: "Zone 13", position: "P.R.O" }
  ];

  useEffect(() => {
    // Set static data immediately
    setMembers(staticMembers);
    setLoading(false);
  }, []);

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchLower) ||
      member.position?.toLowerCase().includes(searchLower) ||
      member.zone?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Parish Pastoral Council
                </h1>
                <p className="mt-2 text-lg text-gray-600 flex items-center gap-2">
                  <Church className="h-5 w-5 text-blue-600" />
                  St. Mary Parish Trans Ekulu Enugu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, position, or zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-600">!</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <div className="text-xl text-gray-500 font-medium">Loading Pastoral Council Members</div>
            <p className="text-gray-400 mt-2">Please wait...</p>
          </div>
        )}

        {/* Members Display */}
        {!loading && !error && (
          <div className="space-y-4">
            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          S/No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Zone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map((member) => (
                        <tr 
                          key={member.id} 
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              {member.sNo || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {member.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {member.zone || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.position || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-16">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-xl text-gray-500 font-medium">No members found</div>
                    <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {member.sNo || 'N/A'}
                          </span>
                          <div className="font-semibold text-gray-900">
                            {member.name || 'N/A'}
                          </div>
                        </div>
                        {member.zone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <MapPin className="h-3 w-3" />
                            {member.zone}
                          </div>
                        )}
                        <div className="text-sm text-gray-900 font-medium">
                          {member.position || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-xl text-gray-500 font-medium">No members found</div>
                  <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
