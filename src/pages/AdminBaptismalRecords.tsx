import React, { useState, useEffect } from 'react';
import { Search, Trash2, AlertTriangle, Database, Users, RefreshCw, Shield, Eye, Loader2, Plus, X, Calendar, User as UserIcon, MapPin, Church, Edit, BarChart3 } from 'lucide-react';

export default function AdminBaptismalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [emptyRecordsCount, setEmptyRecordsCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    baptismName: '',
    surname: '',
    otherName: '',
    dateOfBirth: '',
    dateOfBaptism: '',
    placeOfBaptism: '',
    nameOfMinister: '',
    nameOfGodParents: '',
    solemnOrPrivate: '',
    fathersName: '',
    mothersName: '',
    homeTown: '',
    firstHolyCommunionDate: '',
    firstHolyCommunionPlace: '',
    confirmationDate: '',
    confirmationPlace: '',
    marriageDate: '',
    marriagePartnerName: '',
    marriagePlace: '',
    dateOfDeath: '',
    remarks: ''
  });

  const recordsPerPage = 50; // More records for admin view

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    checkEmptyRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: recordsPerPage.toString(),
        search: searchTerm
      });
      
      const response = await fetch(`/api/baptism-records?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      
      const data = await response.json();
      setRecords(data.records);
      setTotalRecords(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkEmptyRecords = async () => {
    try {
      const response = await fetch('/api/baptism-records?limit=1000');
      const data = await response.json();
      
      const emptyRecords = data.records.filter((record: any) => 
        !record.baptismName || record.baptismName === '' || 
        !record.surname || record.surname === ''
      );
      
      setEmptyRecordsCount(emptyRecords.length);
    } catch (err) {
      console.error('Error checking empty records:', err);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const deleteRecord = async (id: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/baptism-records?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
      
      const result = await response.json();
      console.log('Record deleted:', result);
      
      // Refresh records
      await fetchRecords();
      await checkEmptyRecords();
      
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAllEmptyRecords = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/baptism-records?deleteEmpty=true', {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete empty records');
      }
      
      const result = await response.json();
      console.log('Empty records deleted:', result);
      
      // Refresh records
      await fetchRecords();
      setEmptyRecordsCount(0);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete empty records');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const response = await fetch('/api/baptism-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create record');
      }
      
      const result = await response.json();
      console.log('Record created:', result);
      
      // Reset form and close
      setFormData({
        baptismName: '',
        surname: '',
        otherName: '',
        dateOfBirth: '',
        dateOfBaptism: '',
        placeOfBaptism: '',
        nameOfMinister: '',
        nameOfGodParents: '',
        solemnOrPrivate: '',
        fathersName: '',
        mothersName: '',
        homeTown: '',
        firstHolyCommunionDate: '',
        firstHolyCommunionPlace: '',
        confirmationDate: '',
        confirmationPlace: '',
        marriageDate: '',
        marriagePartnerName: '',
        marriagePlace: '',
        dateOfDeath: '',
        remarks: ''
      });
      setShowAddForm(false);
      
      // Refresh records
      await fetchRecords();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      baptismName: record.baptismName || '',
      surname: record.surname || '',
      otherName: record.otherName || '',
      dateOfBirth: record.dateOfBirth ? new Date(record.dateOfBirth).toISOString().split('T')[0] : '',
      dateOfBaptism: record.dateOfBaptism ? new Date(record.dateOfBaptism).toISOString().split('T')[0] : '',
      placeOfBaptism: record.placeOfBaptism || '',
      nameOfMinister: record.nameOfMinister || '',
      nameOfGodParents: record.nameOfGodParents || '',
      solemnOrPrivate: record.solemnOrPrivate || '',
      fathersName: record.fathersName || '',
      mothersName: record.mothersName || '',
      homeTown: record.homeTown || '',
      firstHolyCommunionDate: record.firstHolyCommunionDate ? new Date(record.firstHolyCommunionDate).toISOString().split('T')[0] : '',
      firstHolyCommunionPlace: record.firstHolyCommunionPlace || '',
      confirmationDate: record.confirmationDate ? new Date(record.confirmationDate).toISOString().split('T')[0] : '',
      confirmationPlace: record.confirmationPlace || '',
      marriageDate: record.marriageDate ? new Date(record.marriageDate).toISOString().split('T')[0] : '',
      marriagePartnerName: record.marriagePartnerName || '',
      marriagePlace: record.marriagePlace || '',
      dateOfDeath: record.dateOfDeath ? new Date(record.dateOfDeath).toISOString().split('T')[0] : '',
      remarks: record.remarks || ''
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const response = await fetch(`/api/baptism-records?id=${editingRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update record');
      }
      
      const result = await response.json();
      console.log('Record updated:', result);
      
      // Reset form and close
      setFormData({
        baptismName: '',
        surname: '',
        otherName: '',
        dateOfBirth: '',
        dateOfBaptism: '',
        placeOfBaptism: '',
        nameOfMinister: '',
        nameOfGodParents: '',
        solemnOrPrivate: '',
        fathersName: '',
        mothersName: '',
        homeTown: '',
        firstHolyCommunionDate: '',
        firstHolyCommunionPlace: '',
        confirmationDate: '',
        confirmationPlace: '',
        marriageDate: '',
        marriagePartnerName: '',
        marriagePlace: '',
        dateOfDeath: '',
        remarks: ''
      });
      setShowEditForm(false);
      setEditingRecord(null);
      
      // Refresh records
      await fetchRecords();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isEmptyRecord = (record: any) => {
    return !record.baptismName || record.baptismName === '' || 
           !record.surname || record.surname === '';
  };

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  if (loading && records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading admin panel...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Admin: Baptismal Records Management
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage and maintain parish baptismal records
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <a
              href="/admin/baptismal-records"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Database className="h-4 w-4" />
              Records Management
            </a>
            <a
              href="/admin/analytics"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Alert */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Administrative Access</h3>
              <p className="text-red-700 text-sm mt-1">
                This is an administrative interface. Deleting records is permanent and cannot be undone. 
                Please proceed with caution.
              </p>
            </div>
          </div>
        </div>

        {/* Empty Records Alert */}
        {emptyRecordsCount > 0 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900">Empty Records Detected</h3>
                  <p className="text-orange-700 text-sm mt-1">
                    Found {emptyRecordsCount} records with empty baptism names or surnames.
                  </p>
                </div>
              </div>
              <button
                onClick={deleteAllEmptyRecords}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all duration-200"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete All Empty
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by full name (e.g., GEORGENA NGOZICHUKWUKA ONU)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500 focus:border-transparent text-lg transition-all duration-200"
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="bg-green-50 px-2 py-1 rounded-full">
                  Enhanced search: First, Last, or Complete full name
                </span>
                <span className="bg-purple-50 px-2 py-1 rounded-full">
                  Also searches: Parents' names and S/No
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-md font-medium"
              >
                <Search className="h-5 w-5" />
                Search Records
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md font-medium"
              >
                <Plus className="h-5 w-5" />
                Add New Record
              </button>
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Clear
                </button>
              )}
              <button
                onClick={fetchRecords}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </button>
            </div>
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

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{records.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalRecords.toLocaleString()}</span> records
          </div>
          {searchTerm && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Filtered by: "{searchTerm}"
            </div>
          )}
        </div>

        {/* Records Table */}
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
                    Date of Baptism
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr 
                    key={record.id} 
                    className={`transition-all duration-200 ${
                      isEmptyRecord(record) 
                        ? 'bg-red-50 hover:bg-red-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${
                        isEmptyRecord(record)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {record.sNo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {record.baptismName || 'EMPTY'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.otherName && `${record.otherName} `}{record.surname || 'EMPTY'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.dateOfBaptism)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEmptyRecord(record) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3" />
                          Empty
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Users className="h-3 w-3" />
                          Complete
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                          title="View record details"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(record)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-200"
                          title="Edit record"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="font-medium">Edit</span>
                        </button>
                        {deleteConfirm === record.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteRecord(record.id)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 text-xs"
                            >
                              {actionLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                'Confirm'
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-200 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(record.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200"
                            title="Delete record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 && !loading && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-xl text-gray-500 font-medium">No records found</div>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="hidden sm:block text-sm text-gray-700">
              Page <span className="font-semibold text-red-600">{currentPage}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 text-sm"
                title="Previous page"
              >
                <span>×</span>
                <span className="font-medium hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 text-sm"
                title="Next page"
              >
                <span className="font-medium hidden sm:inline">Next</span>
                <span>{'>'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Record Details</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial Number:</span>
                        <span className="font-semibold">{selectedRecord.sNo || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Baptism Name:</span>
                        <span className="font-semibold">{selectedRecord.baptismName || 'EMPTY'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Surname:</span>
                        <span className="font-semibold">{selectedRecord.surname || 'EMPTY'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-semibold">{formatDate(selectedRecord.dateOfBirth)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Baptism Information</h3>
                    <div className="space-y-2 bg-blue-50 p-4 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Baptism:</span>
                        <span className="font-semibold">{formatDate(selectedRecord.dateOfBaptism)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Place of Baptism:</span>
                        <span className="font-semibold">{selectedRecord.placeOfBaptism || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minister:</span>
                        <span className="font-semibold">{selectedRecord.nameOfMinister || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Add New Baptismal Record
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all duration-200"
                title="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-green-600" />
                      Basic Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baptism Name *
                      </label>
                      <input
                        type="text"
                        name="baptismName"
                        value={formData.baptismName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter baptism name"
                        title="Baptism name (required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Surname *
                      </label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter surname"
                        title="Surname (required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Names
                      </label>
                      <input
                        type="text"
                        name="otherName"
                        value={formData.otherName}
                        onChange={handleInputChange}
                        placeholder="Enter other names (optional)"
                        title="Other names"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        title="Date of birth"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Town
                      </label>
                      <input
                        type="text"
                        name="homeTown"
                        value={formData.homeTown}
                        onChange={handleInputChange}
                        placeholder="Enter home town"
                        title="Home town"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Baptism Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Church className="h-5 w-5 text-green-600" />
                      Baptism Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Baptism
                      </label>
                      <input
                        type="date"
                        name="dateOfBaptism"
                        value={formData.dateOfBaptism}
                        onChange={handleInputChange}
                        title="Date of baptism"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Place of Baptism
                      </label>
                      <input
                        type="text"
                        name="placeOfBaptism"
                        value={formData.placeOfBaptism}
                        onChange={handleInputChange}
                        placeholder="Enter place of baptism"
                        title="Place of baptism"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="solemnOrPrivate"
                        value={formData.solemnOrPrivate}
                        onChange={handleInputChange}
                        title="Type of baptism"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="Solemn">Solemn</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minister
                      </label>
                      <input
                        type="text"
                        name="nameOfMinister"
                        value={formData.nameOfMinister}
                        onChange={handleInputChange}
                        placeholder="Enter minister name"
                        title="Name of minister"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        God Parents
                      </label>
                      <textarea
                        name="nameOfGodParents"
                        value={formData.nameOfGodParents}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Enter god parents names"
                        title="Names of god parents"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Parents Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Parents Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fathersName"
                        value={formData.fathersName}
                        onChange={handleInputChange}
                        placeholder="Enter father's name"
                        title="Father's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="mothersName"
                        value={formData.mothersName}
                        onChange={handleInputChange}
                        placeholder="Enter mother's name"
                        title="Mother's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Other Sacraments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Other Sacraments
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Holy Communion Date
                      </label>
                      <input
                        type="date"
                        name="firstHolyCommunionDate"
                        value={formData.firstHolyCommunionDate}
                        onChange={handleInputChange}
                        title="First Holy Communion date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Holy Communion Place
                      </label>
                      <input
                        type="text"
                        name="firstHolyCommunionPlace"
                        value={formData.firstHolyCommunionPlace}
                        onChange={handleInputChange}
                        placeholder="Enter First Holy Communion place"
                        title="First Holy Communion place"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmation Date
                      </label>
                      <input
                        type="date"
                        name="confirmationDate"
                        value={formData.confirmationDate}
                        onChange={handleInputChange}
                        title="Confirmation date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmation Place
                      </label>
                      <input
                        type="text"
                        name="confirmationPlace"
                        value={formData.confirmationPlace}
                        onChange={handleInputChange}
                        placeholder="Enter confirmation place"
                        title="Confirmation place"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Marriage Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Marriage Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marriage Date
                      </label>
                      <input
                        type="date"
                        name="marriageDate"
                        value={formData.marriageDate}
                        onChange={handleInputChange}
                        title="Marriage date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partner's Name
                      </label>
                      <input
                        type="text"
                        name="marriagePartnerName"
                        value={formData.marriagePartnerName}
                        onChange={handleInputChange}
                        placeholder="Enter partner's name"
                        title="Marriage partner's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marriage Place
                      </label>
                      <input
                        type="text"
                        name="marriagePlace"
                        value={formData.marriagePlace}
                        onChange={handleInputChange}
                        placeholder="Enter marriage place"
                        title="Marriage place"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Death
                      </label>
                      <input
                        type="date"
                        name="dateOfDeath"
                        value={formData.dateOfDeath}
                        onChange={handleInputChange}
                        title="Date of death"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks
                      </label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter any additional remarks"
                        title="Additional remarks"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-md font-medium"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                    Create Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditForm && editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Edit className="h-6 w-6" />
                Edit Baptismal Record - S/No: {editingRecord.sNo}
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all duration-200"
                title="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <form onSubmit={handleUpdate} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-yellow-600" />
                      Basic Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baptism Name *
                      </label>
                      <input
                        type="text"
                        name="baptismName"
                        value={formData.baptismName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter baptism name"
                        title="Baptism name (required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Surname *
                      </label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter surname"
                        title="Surname (required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Names
                      </label>
                      <input
                        type="text"
                        name="otherName"
                        value={formData.otherName}
                        onChange={handleInputChange}
                        placeholder="Enter other names (optional)"
                        title="Other names"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        title="Date of birth"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Town
                      </label>
                      <input
                        type="text"
                        name="homeTown"
                        value={formData.homeTown}
                        onChange={handleInputChange}
                        placeholder="Enter home town"
                        title="Home town"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Baptism Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Church className="h-5 w-5 text-yellow-600" />
                      Baptism Information
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Baptism
                      </label>
                      <input
                        type="date"
                        name="dateOfBaptism"
                        value={formData.dateOfBaptism}
                        onChange={handleInputChange}
                        title="Date of baptism"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Place of Baptism
                      </label>
                      <input
                        type="text"
                        name="placeOfBaptism"
                        value={formData.placeOfBaptism}
                        onChange={handleInputChange}
                        placeholder="Enter place of baptism"
                        title="Place of baptism"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="solemnOrPrivate"
                        value={formData.solemnOrPrivate}
                        onChange={handleInputChange}
                        title="Type of baptism"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="Solemn">Solemn</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minister
                      </label>
                      <input
                        type="text"
                        name="nameOfMinister"
                        value={formData.nameOfMinister}
                        onChange={handleInputChange}
                        placeholder="Enter minister name"
                        title="Name of minister"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        God Parents
                      </label>
                      <textarea
                        name="nameOfGodParents"
                        value={formData.nameOfGodParents}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Enter god parents names"
                        title="Names of god parents"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Parents Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Parents Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fathersName"
                        value={formData.fathersName}
                        onChange={handleInputChange}
                        placeholder="Enter father's name"
                        title="Father's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="mothersName"
                        value={formData.mothersName}
                        onChange={handleInputChange}
                        placeholder="Enter mother's name"
                        title="Mother's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Other Sacraments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-yellow-600" />
                      Other Sacraments
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Holy Communion Date
                      </label>
                      <input
                        type="date"
                        name="firstHolyCommunionDate"
                        value={formData.firstHolyCommunionDate}
                        onChange={handleInputChange}
                        title="First Holy Communion date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Holy Communion Place
                      </label>
                      <input
                        type="text"
                        name="firstHolyCommunionPlace"
                        value={formData.firstHolyCommunionPlace}
                        onChange={handleInputChange}
                        placeholder="Enter First Holy Communion place"
                        title="First Holy Communion place"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmation Date
                      </label>
                      <input
                        type="date"
                        name="confirmationDate"
                        value={formData.confirmationDate}
                        onChange={handleInputChange}
                        title="Confirmation date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmation Place
                      </label>
                      <input
                        type="text"
                        name="confirmationPlace"
                        value={formData.confirmationPlace}
                        onChange={handleInputChange}
                        placeholder="Enter confirmation place"
                        title="Confirmation place"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Marriage Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Marriage Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marriage Date
                      </label>
                      <input
                        type="date"
                        name="marriageDate"
                        value={formData.marriageDate}
                        onChange={handleInputChange}
                        title="Marriage date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partner's Name
                      </label>
                      <input
                        type="text"
                        name="marriagePartnerName"
                        value={formData.marriagePartnerName}
                        onChange={handleInputChange}
                        placeholder="Enter partner's name"
                        title="Marriage partner's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marriage Place
                      </label>
                      <input
                        type="text"
                        name="marriagePlace"
                        value={formData.marriagePlace}
                        onChange={handleInputChange}
                        placeholder="Enter marriage place"
                        title="Marriage place"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Death
                      </label>
                      <input
                        type="date"
                        name="dateOfDeath"
                        value={formData.dateOfDeath}
                        onChange={handleInputChange}
                        title="Date of death"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks
                      </label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter any additional remarks"
                        title="Additional remarks"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 transition-all duration-200 shadow-md font-medium"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Edit className="h-5 w-5" />
                    )}
                    Update Record
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingRecord(null);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
