import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle } from 'lucide-react';
import { fetchCompanyById, updateCompany } from '@/store/companySlice';
import Header from '@/components/shared/Header';
import { toast } from 'react-toastify';

const EditCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { user } = useSelector((state) => state.authSlice);
  const { currentCompany, loading, error } = useSelector((state) => state.companySlice);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user && user.role !== 'recruiter') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyById(companyId));
    }
  }, [dispatch, companyId]);

  useEffect(() => {
    if (currentCompany) {
      setFormData({
        name: currentCompany.name || '',
        description: currentCompany.description || '',
        website: currentCompany.website || '',
        location: currentCompany.location ? currentCompany.location.join(', ') : '',
      });
    }
  }, [currentCompany]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];

      if (!acceptedImageTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          logo: 'Please select an image file (JPEG, PNG, GIF, SVG, or WebP)'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          logo: 'Logo must be less than 5MB'
        }));
        return;
      }

      setLogoFile(file);
      setFormErrors((prev) => ({
        ...prev,
        logo: ''
      }));
    }
  };


  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const updateData = new FormData();
    updateData.append('name', formData.name);
    if (formData.description) updateData.append('description', formData.description);
    if (formData.website) updateData.append('website', formData.website);

    if (formData.location) {
      const locationArray = formData.location.split(',').map(loc => loc.trim());
      updateData.append('location', JSON.stringify(locationArray));
    }

    if (logoFile) {
      updateData.append('file', logoFile);
    }

    dispatch(updateCompany({ companyId, updateData })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Updated company successfully!");
        navigate("/");
      } else {
        setFormErrors((prev) => ({
          ...prev,
          submit: data?.payload || 'Failed to update company. Please try again.',
        }));
        toast.error(data?.payload || "Failed to update company. Please try again.");
      }
    });
    setIsSubmitting(false);

  };

  if (loading && !currentCompany) {
    return <div className="text-center py-10">Loading company data...</div>;
  }

  return (
    <div className="mt-18">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Edit Company</h1>
          <Button
            variant="outline"
            className='cursor-pointer'
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{formErrors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? "border-red-300" : ""}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Company Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="www.example.com"
            />
          </div>

          <div>
            <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Locations
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="New York, San Francisco, London"
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple locations with commas</p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Company Logo
            </Label>

            <div className="flex items-center space-x-6">
              {currentCompany?.logo && (
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentCompany.logo} alt="Current company logo" />
                </Avatar>
              )}

              <div>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {logoFile ? `Selected: ${logoFile.name}` : 'Max file size: 5MB'}
                </p>
                {formErrors.logo && <p className="mt-1 text-sm text-red-600">{formErrors.logo}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <Button
              type="submit"
              className="cursor-pointer hover:bg-gray-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompany;