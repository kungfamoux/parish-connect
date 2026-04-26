import React from 'react';
import { Church, X } from 'lucide-react';

interface BaptismRecordModalProps {
  selectedRecord: any | null;
  setSelectedRecord: (record: any | null) => void;
  isDarkMode: boolean;
  formatDate: (date: Date | null) => string;
}

export default function BaptismRecordModal({ 
  selectedRecord, 
  setSelectedRecord, 
  isDarkMode, 
  formatDate 
}: BaptismRecordModalProps) {
  if (!selectedRecord) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
        {/* Simple Header */}
        <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Church className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Baptism Record</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>S/No: {selectedRecord.sNo || 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRecord(null)}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-1`}
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Person's Name */}
            <div className={`text-center mb-6 pb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedRecord.baptismName} {selectedRecord.surname}
              </h3>
              {selectedRecord.otherName && (
                <p className={isDarkMode ? 'text-gray-400 mt-1' : 'text-gray-600 mt-1'}>{selectedRecord.otherName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className={`font-medium text-sm uppercase tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>Personal Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(selectedRecord.dateOfBirth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Home Town:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.homeTown || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Baptism Information */}
              <div className="space-y-4">
                <h4 className={`font-medium text-sm uppercase tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>Baptism Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Baptism:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(selectedRecord.dateOfBaptism)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Place of Baptism:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.placeOfBaptism || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.solemnOrPrivate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minister:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.nameOfMinister || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>God Parents:</span>
                    <span className={`font-medium text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.nameOfGodParents || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Parents Information */}
              <div className="space-y-4">
                <h4 className={`font-medium text-sm uppercase tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>Parents Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Father's Name:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.fathersName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mother's Name:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.mothersName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Other Sacraments */}
              <div className="space-y-4">
                <h4 className={`font-medium text-sm uppercase tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>Other Sacraments</h4>
                <div className="space-y-3">
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>First Holy Communion:</p>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {selectedRecord.firstHolyCommunionDate ? 
                        `${formatDate(selectedRecord.firstHolyCommunionDate)}${selectedRecord.firstHolyCommunionPlace ? ` at ${selectedRecord.firstHolyCommunionPlace}` : ''}` : 
                        'Not recorded'
                      }
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confirmation:</p>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {selectedRecord.confirmationDate ? 
                        `${formatDate(selectedRecord.confirmationDate)}${selectedRecord.confirmationPlace ? ` at ${selectedRecord.confirmationPlace}` : ''}` : 
                        'Not recorded'
                      }
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Marriage:</p>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {selectedRecord.marriageDate ? 
                        `${formatDate(selectedRecord.marriageDate)}${selectedRecord.marriagePartnerName ? ` to ${selectedRecord.marriagePartnerName}` : ''}${selectedRecord.marriagePlace ? ` at ${selectedRecord.marriagePlace}` : ''}` : 
                        'Not recorded'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedRecord.dateOfDeath || selectedRecord.remarks) && (
                <div className={`md:col-span-2 space-y-4 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h4 className={`font-medium text-sm uppercase tracking-wide ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>Additional Information</h4>
                  <div className="space-y-3">
                    {selectedRecord.dateOfDeath && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Death:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{formatDate(selectedRecord.dateOfDeath)}</span>
                      </div>
                    )}
                    {selectedRecord.remarks && (
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remarks:</p>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{selectedRecord.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
