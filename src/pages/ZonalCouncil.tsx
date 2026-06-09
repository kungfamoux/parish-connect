import React, { useState, useEffect } from 'react';
import { Search, Users, Church, Loader2, User, MapPin, Filter, Crown, BookOpen, Heart, Music, Shield, Star, Award, Phone } from 'lucide-react';

export default function ZonalCouncil() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Anti-screenshot protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleBeforePrint = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeprint', handleBeforePrint);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/zonal-council');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Get unique zones
  const zones = ['all', ...Array.from(new Set(members.map(m => m.zone).filter(Boolean)))].sort();

  // Get unique groups
  const groups = ['all', ...Array.from(new Set(members.map(m => m.groupName).filter(Boolean)))].sort();

  // Filter members
  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      member.name?.toLowerCase().includes(searchLower) ||
      member.position?.toLowerCase().includes(searchLower) ||
      member.phone?.toLowerCase().includes(searchLower) ||
      member.zone?.toLowerCase().includes(searchLower) ||
      member.groupName?.toLowerCase().includes(searchLower)
    );
    
    const matchesZone = selectedZone === 'all' || member.zone === selectedZone;
    const matchesGroup = selectedGroup === 'all' || member.groupName === selectedGroup;
    
    return matchesSearch && matchesZone && matchesGroup;
  });

  // Group members by zone and group
  const groupedMembers = filteredMembers.reduce((acc, member) => {
    const zone = member.zone || 'Societies';
    const group = member.groupName || 'Other';
    
    if (!acc[zone]) acc[zone] = {};
    if (!acc[zone][group]) acc[zone][group] = [];
    
    acc[zone][group].push(member);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Zonal Council
              </h1>
              <p className="mt-2 text-lg text-gray-600 flex items-center gap-2">
                <Church className="h-5 w-5 text-blue-600" />
                2026 Election Results - St. Mary Parish Trans Ekulu Enugu
              </p>
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
                placeholder="Search by name, position, phone, zone, or group..."
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
              </button>
              
              <div className="text-sm text-gray-600">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                {/* Zone Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {zones.map(zone => (
                      <option key={zone} value={zone}>
                        {zone === 'all' ? 'All Zones' : zone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Group Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {groups.map(group => (
                      <option key={group} value={group}>
                        {group === 'all' ? 'All Groups' : group}
                      </option>
                    ))}
                  </select>
                </div>
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
            <div className="text-xl text-gray-500 font-medium">Loading Zonal Council Members</div>
            <p className="text-gray-400 mt-2">Please wait...</p>
          </div>
        )}

        {/* Members Display */}
        {!loading && !error && (
          <div className="space-y-8">
            {Object.entries(groupedMembers).map(([zone, groups]) => (
              <div key={zone} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    {zone}
                  </h2>
                </div>
                
                {Object.entries(groups).map(([groupName, groupMembers]) => (
                  <div key={groupName} className="border-b border-gray-200 last:border-b-0">
                    <div className="bg-gray-50 px-6 py-3">
                      <h3 className="text-lg font-semibold text-gray-800">{groupName}</h3>
                    </div>
                    
                    {/* Desktop View */}
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">S/No</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Position</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {groupMembers.map((member) => (
                              <tr 
                                key={member.id} 
                                className="hover:bg-blue-50 transition-all duration-200"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                    {member.sNo || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {member.isVacant ? (
                                      <span className="text-gray-400 italic">Vacant</span>
                                    ) : (
                                      member.name || 'N/A'
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {member.position || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {member.phone ? (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {member.phone}
                                    </div>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                      <div className="divide-y divide-gray-200">
                        {groupMembers.map((member) => (
                          <div key={member.id} className="p-4 hover:bg-blue-50 transition-all duration-200">
                            <div className="flex items-start gap-3">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex-shrink-0">
                                {member.sNo || 'N/A'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-sm">
                                  {member.isVacant ? (
                                    <span className="text-gray-400 italic">Vacant</span>
                                  ) : (
                                    member.name || 'N/A'
                                  )}
                                </div>
                                <div className="text-sm text-gray-900 mt-1">{member.position || 'N/A'}</div>
                                {member.phone && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                    <Phone className="h-3 w-3" />
                                    {member.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <div className="text-xl text-gray-500 font-medium">No members found</div>
                <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
