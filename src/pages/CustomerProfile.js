import React, { useState, useEffect } from 'react';
import { Edit2, User, X } from 'lucide-react';
import '../styles/customerProfile.css';

const CustomerProfile = ({ customerID }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (customerID && isOpen) {
      fetchCustomerProfile();
    }
  }, [customerID, isOpen]);

  const fetchCustomerProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customer-details/${customerID}`);
      const data = await response.json();
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/update-customer/${customerID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/delete-customer/${customerID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <button 
        className="profile-button" 
        onClick={() => setIsOpen(true)}
        title="Profile"
      >
        <User size={16} />
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
            
            {profile && (
              <>
                <h2 className="modal-title">Customer Profile</h2>
                
                {isEditing ? (
                  <div className="profile-form">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        className="form-input"
                        name="FirstName"
                        value={editedProfile.FirstName || ''}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-input"
                        name="Email"
                        value={editedProfile.Email || ''}
                        onChange={handleChange}
                        type="email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-input"
                        name="Phone"
                        value={editedProfile.Phone || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="button-group">
                      <button className="button cancel-button" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button className="button save-button" onClick={handleSave}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                    <div className="profile-info">
                    <div className="info-group">
                      <span className="info-label">Name</span>
                      <span className="info-value">{`${profile.FirstName} ${profile.LastName}`}</span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profile.Email}</span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{profile.Phone}</span>
                    </div>
                    <div className="button-group">
                      <button className="button edit-button" onClick={handleEdit}>
                        <Edit2 size={16} />
                        Edit Profile
                      </button>
                      <button className="button delete-button" onClick={handleDelete}>
                        <X size={16} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerProfile;