
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BusinessInfo } from '../types';

interface BusinessInfoFormProps {
    onClose: () => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ onClose }) => {
    const { businessInfo, updateBusinessInfo } = useAppContext();
    const [formData, setFormData] = useState<BusinessInfo>(businessInfo);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData({ ...formData, logo: event.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBusinessInfo(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Logo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-primary hover:file:bg-blue-100"
                />
                {formData.logo && <img src={formData.logo} alt="Logo Preview" className="mt-2 h-20 w-auto object-contain border p-1 rounded" />}
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Save</button>
            </div>
        </form>
    );
};

export default BusinessInfoForm;