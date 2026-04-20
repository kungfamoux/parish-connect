import React, { useState, useEffect } from 'react';
import { Search, Users, Church, Loader2, User, MapPin, Filter, Crown, BookOpen, Heart, Music, Shield, Star, Award } from 'lucide-react';

export default function PastoralCouncil() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
    { id: 2, sNo: 2, name: "Rev. Fr. Daniel Onah", zone: null, position: "Vicar Member" },
    { id: 3, sNo: 3, name: "Dr Ifendu Ohabuike", zone: null, position: "DDL Member" },
    { id: 4, sNo: 4, name: "Mr Paul Agu", zone: "Zone 12", position: "1st Vice Chairman" },
    { id: 5, sNo: 5, name: "Chief (Sir) O.O. Apiakason", zone: "Zone 1", position: "2nd Vice Chairman" },
    { id: 6, sNo: 6, name: "Dr Ifeanyi Ugwu", zone: "Zone 8", position: "Secretary" },
    { id: 7, sNo: 7, name: "Mrs Rose Ozodiegwu", zone: "Zone 7", position: "Asst. Secretary" },
    { id: 8, sNo: 8, name: "Chief Mrs. J. I. Obi", zone: "Zone 11", position: "Fin. Secretary" },
    { id: 9, sNo: 9, name: "Amb. Paulinus Eze", zone: "Zone 3", position: "Treasurer" },
    { id: 10, sNo: 10, name: "Mr Emmanuel Chime", zone: "Zone 13", position: "P.R.O" },
    { id: 11, sNo: 11, name: "Mr. Emmanuel Igwesi", zone: "Zone 9", position: "Provost I" },
    { id: 12, sNo: 12, name: "Mr. Lawrence Utobo", zone: "Zone 11", position: "Provost II" },
    { id: 13, sNo: 13, name: "Comrade Augustine Nwonyi", zone: "Zone 5", position: "Catechist" },
    { id: 14, sNo: 14, name: "Comrade Chumaife Nze", zone: null, position: "CMO Chairman" },
    { id: 15, sNo: 15, name: "Dr. J. C. Eze", zone: null, position: "CMO Secretary" },
    { id: 16, sNo: 16, name: "Sis. Mrs. Aziude J. A.", zone: null, position: "CWO Chairlady" },
    { id: 17, sNo: 17, name: "Chinyere Onyishi", zone: null, position: "CWO Secretary" },
    { id: 18, sNo: 18, name: "Okoknwo Uchenna", zone: null, position: "CYMO President" },
    { id: 19, sNo: 19, name: "Eloka Obi-alinze", zone: null, position: "CYMO Secretary" },
    { id: 20, sNo: 20, name: "Emezi Chikaosolu", zone: "Zone 2", position: "CYWO President" },
    { id: 21, sNo: 21, name: "Aneke Makuo", zone: null, position: "CYWO Secretary" },
    { id: 22, sNo: 22, name: "Moses Omah", zone: "Zone 1", position: "Chairman" },
    { id: 23, sNo: 23, name: "Mrs. C. Onyejide", zone: "Zone 1", position: "Secretary" },
    { id: 24, sNo: 24, name: "Okeh Nicodemus O.", zone: "Zone 2", position: "Chairman" },
    { id: 25, sNo: 25, name: "Mrs. Onyia Chinyere", zone: "Zone 2", position: "Secretary" },
    { id: 26, sNo: 26, name: "Mentus Okafor", zone: "Zone 3", position: "Chairman" },
    { id: 27, sNo: 27, name: "Okeakpu Eunice", zone: "Zone 3", position: "Secretary" },
    { id: 28, sNo: 28, name: "Sir Bon Chukwukelu", zone: "Zone 4", position: "Chairman" },
    { id: 29, sNo: 29, name: "Eunice Biereenu-Nnabugwu", zone: "Zone 4", position: "Secretary" },
    { id: 30, sNo: 30, name: "Amb. Damian Ocheoha", zone: "Zone 5", position: "Chairman" },
    { id: 31, sNo: 31, name: "Mrs. Ngozi Ezeji", zone: "Zone 5", position: "Secretary" },
    { id: 32, sNo: 32, name: "Hon. Sir Nelson Amechi", zone: "Zone 6", position: "Chairman" },
    { id: 33, sNo: 33, name: "Mbaeze Phina", zone: "Zone 6", position: "Secretary" },
    { id: 34, sNo: 34, name: "Ndubuisi Chinwe (Mrs)", zone: "Zone 7", position: "Chairman" },
    { id: 35, sNo: 35, name: "Mrs. Ebunonu Nneka", zone: "Zone 7", position: "Secretary" },
    { id: 36, sNo: 36, name: "Mr. Ezejogu Toochukwu B.", zone: "Zone 8", position: "Chairman" },
    { id: 37, sNo: 37, name: "Mrs. Bernadete Mgbafulu", zone: "Zone 8", position: "Secretary" },
    { id: 38, sNo: 38, name: "Udeh Ikechukwu", zone: "Zone 9", position: "Chairman" },
    { id: 39, sNo: 39, name: "Mrs. Uche Onwuzu", zone: "Zone 9", position: "Secretary" },
    { id: 40, sNo: 40, name: "Sir Tony Uwandu", zone: "Zone 10", position: "Chairman" },
    { id: 41, sNo: 41, name: "Prince Onah Jude", zone: "Zone 10", position: "Secretary" },
    { id: 42, sNo: 42, name: "Aniagu Afam", zone: "Zone 11", position: "Chairman" },
    { id: 43, sNo: 43, name: "Mrs. Ursula Okorie", zone: "Zone 11", position: "Secretary" },
    { id: 44, sNo: 44, name: "Sir. Matthias Akwukwuegbu", zone: "Zone 12", position: "Chairman" },
    { id: 45, sNo: 45, name: "Dr. Nzewigbo Bernadette", zone: "Zone 12", position: "Secretary" },
    { id: 46, sNo: 46, name: "Lambert U. Ogbenna", zone: "Zone 13", position: "Chairman" },
    { id: 47, sNo: 47, name: "Dr. V. C. Odumejemba", zone: "Zone 13", position: "Secretary" },
    { id: 48, sNo: 48, name: "Onyeador Obinna", zone: "Zone 14", position: "Chairman" },
    { id: 49, sNo: 49, name: "Chielo Ogechukwu", zone: "Zone 14", position: "Secretary" },
    { id: 50, sNo: 50, name: "Peter Opara", zone: null, position: "Min. of Hosp. Chairman" },
    { id: 51, sNo: 51, name: "Bro. Izu Chinze", zone: null, position: "Alter Knight President" },
    { id: 52, sNo: 52, name: "Nkwo Ngozi", zone: null, position: "Evangelization President" },
    { id: 53, sNo: 53, name: "Grace Ukah", zone: null, position: "Evangelization Secretary" },
    { id: 54, sNo: 54, name: "Bro. Solomon Onyekwelu", zone: null, position: "CCRN Co-Ordinator" },
    { id: 55, sNo: 55, name: "Ukwuani Fabian", zone: null, position: "MOD President" },
    { id: 56, sNo: 56, name: "Ugada Martin O.", zone: null, position: "Choir Director" },
    { id: 57, sNo: 57, name: "Theresa Nze (Mrs)", zone: null, position: "Finance Member" },
    { id: 58, sNo: 58, name: "Mrs. Lucy Ejinaka", zone: null, position: "Finance Member" },
    { id: 59, sNo: 59, name: "Anochili Nancy", zone: null, position: "Min. of Hosp." },
    { id: 60, sNo: 60, name: "Ursla Okorie", zone: null, position: "Pre.Bld Server" },
    { id: 61, sNo: 61, name: "Esomaria Ogbuagu", zone: null, position: "Legion of Mary" },
    { id: 62, sNo: 62, name: "Chief Pius N. Eze", zone: null, position: "Lay Reader President" },
    { id: 63, sNo: 63, name: "Eke Charity", zone: null, position: "MFLC Rep" },
    { id: 64, sNo: 64, name: "Umezulike C.", zone: null, position: "Secretary" },
    { id: 65, sNo: 65, name: "Ifeyinwa Edeh", zone: null, position: "M/P Help Secretary" },
    { id: 66, sNo: 66, name: "Lolo Vera Chukwuobasi", zone: null, position: "Finance Member" }
  ];

  useEffect(() => {
    // Set static data immediately
    setMembers(staticMembers);
    setLoading(false);
  }, []);

  // Get category for member
  const getMemberCategory = (member: any) => {
    const position = member.position?.toLowerCase() || '';
    const name = member.name?.toLowerCase() || '';
    
    // Clergy
    if (name.includes('rev.') || name.includes('msgr.') || name.includes('fr.') || name.includes('very rev.')) {
      return 'clergy';
    }
    
    // Leadership positions
    if (position.includes('chairman') || position.includes('chairlady') || position.includes('president') || position.includes('co-ordinator')) {
      return 'leadership';
    }
    
    // Finance
    if (position.includes('secretary') || position.includes('treasurer') || position.includes('finance')) {
      return 'finance';
    }
    
    // Ministries
    if (position.includes('min.') || position.includes('choir') || position.includes('music') || position.includes('evangelization') || position.includes('legion') || position.includes('cmo') || position.includes('cwo') || position.includes('cymo') || position.includes('cywo')) {
      return 'ministries';
    }
    
    // Zone representatives
    if (member.zone && member.zone.includes('Zone')) {
      return 'zones';
    }
    
    return 'other';
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clergy': return <Crown className="h-4 w-4" />;
      case 'leadership': return <Star className="h-4 w-4" />;
      case 'finance': return <Award className="h-4 w-4" />;
      case 'ministries': return <Heart className="h-4 w-4" />;
      case 'zones': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  // Filter members based on search and category
  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const category = getMemberCategory(member);
    
    const matchesSearch = (
      member.name?.toLowerCase().includes(searchLower) ||
      member.position?.toLowerCase().includes(searchLower) ||
      member.zone?.toLowerCase().includes(searchLower)
    );
    
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get category statistics
  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {
      all: members.length,
      clergy: 0,
      leadership: 0,
      finance: 0,
      ministries: 0,
      zones: 0,
      other: 0
    };
    
    members.forEach(member => {
      const category = getMemberCategory(member);
      stats[category]++;
    });
    
    return stats;
  };

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
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
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

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
                <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                  {selectedCategory === 'all' ? 'All' : selectedCategory}
                </span>
              </button>
              
              <div className="text-sm text-gray-600">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
                {[
                  { id: 'all', label: 'All Members', icon: Users },
                  { id: 'clergy', label: 'Clergy', icon: Crown },
                  { id: 'leadership', label: 'Leadership', icon: Star },
                  { id: 'finance', label: 'Finance', icon: Award },
                  { id: 'ministries', label: 'Ministries', icon: Heart },
                  { id: 'zones', label: 'Zone Reps', icon: MapPin },
                  { id: 'other', label: 'Other', icon: Users }
                ].map(category => {
                  const stats = getCategoryStats();
                  const Icon = category.icon;
                  const count = stats[category.id];
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{category.label}</div>
                        <div className="text-xs opacity-75">{count} members</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map((member) => {
                        const category = getMemberCategory(member);
                        return (
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
                              <div className="font-medium">{member.position || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                category === 'clergy' ? 'bg-purple-100 text-purple-800' :
                                category === 'leadership' ? 'bg-yellow-100 text-yellow-800' :
                                category === 'finance' ? 'bg-green-100 text-green-800' :
                                category === 'ministries' ? 'bg-pink-100 text-pink-800' :
                                category === 'zones' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {getCategoryIcon(category)}
                                <span className="capitalize">{category}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
                {filteredMembers.map((member) => {
                  const category = getMemberCategory(member);
                  return (
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
                            <div className="font-semibold text-gray-900 text-sm">
                              {member.name || 'N/A'}
                            </div>
                          </div>
                          {member.zone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                              <MapPin className="h-3 w-3" />
                              {member.zone}
                            </div>
                          )}
                          <div className="text-sm text-gray-900 font-medium mb-2">
                            {member.position || 'N/A'}
                          </div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            category === 'clergy' ? 'bg-purple-100 text-purple-800' :
                            category === 'leadership' ? 'bg-yellow-100 text-yellow-800' :
                            category === 'finance' ? 'bg-green-100 text-green-800' :
                            category === 'ministries' ? 'bg-pink-100 text-pink-800' :
                            category === 'zones' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getCategoryIcon(category)}
                            <span className="capitalize">{category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
