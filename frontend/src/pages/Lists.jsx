import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import './Lists.css';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lists');
      setLists(response.data.lists || []);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error('Invalid file format. Please upload .csv, .xlsx, or .xls file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post('/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'File uploaded successfully');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchLists();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to upload file';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const getAgentColor = (index) => {
    const colors = ['#1a237e', '#2e7d32', '#e53935', '#f57c00', '#7b1fa2'];
    return colors[index % colors.length];
  };

  return (
    <div className="lists-container">
      <div className="upload-section">
        <h3 className="section-title">Upload Contact List</h3>

        <div
          className={`dropzone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          {selectedFile ? (
            <div className="file-selected">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <button
                className="remove-file-btn"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <p className="dropzone-text">Drag & drop your file here</p>
              <p className="dropzone-or">or</p>
              <button
                className="browse-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>

        <p className="upload-note">
          Accepted formats: .csv, .xlsx, .xls • Max size: 10MB
        </p>

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload & Distribute'}
        </button>
      </div>

      <div className="lists-section">
        <h3 className="section-title">Distributed Lists</h3>

        {loading ? (
          <div className="loading-state">Loading lists...</div>
        ) : lists.length === 0 ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <h4>No lists uploaded yet</h4>
            <p>Upload a CSV or Excel file to distribute contacts among agents</p>
          </div>
        ) : (
          <div className="lists-grid">
            {lists.map((list, index) => (
              <div
                key={list._id}
                className="list-card"
                style={{ borderLeftColor: getAgentColor(index) }}
              >
                <div className="list-card-header">
                  <div>
                    <h4 className="agent-name">{list.agentName}</h4>
                    <p className="agent-email">{list.agentEmail}</p>
                  </div>
                  <div
                    className="contact-badge"
                    style={{ backgroundColor: `${getAgentColor(index)}20`, color: getAgentColor(index) }}
                  >
                    {list.items.length} contacts
                  </div>
                </div>

                <div className="list-table-wrapper">
                  <table className="list-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Phone</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.items.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td>{itemIndex + 1}</td>
                          <td>{item.firstName}</td>
                          <td>{item.phone}</td>
                          <td>{item.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;
