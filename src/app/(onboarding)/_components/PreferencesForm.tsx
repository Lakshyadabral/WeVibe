'use client';

import { useState } from 'react';

type Preferences = {
  preferredLocation: string;
  ageRange: { min: number; max: number };
  genderPreference: string;
  accommodationType: string;
  budget: { min: number; max: number };
  pets: { hasPets: boolean; type: string };
  habits: {
    sleepPattern: string;
    drinking: boolean;
    smoking: boolean;
  };
  cooking: string;
  communicationStyle: string;
  socialEnergyLevel: string;
};

type Props = {
  initialData: Preferences;
  onNext: (data: Preferences) => void;
};

const PreferencesForm = ({ initialData, onNext }: Props) => {
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.preferredLocation) newErrors.preferredLocation = 'Required';
    if (!form.communicationStyle) newErrors.communicationStyle = 'Required';
    if (!form.socialEnergyLevel) newErrors.socialEnergyLevel = 'Required';
    

    if (!form.ageRange.min || !form.ageRange.max || form.ageRange.min < 18) {
      newErrors['ageRange.min'] = 'Enter valid min age (18+)';
    }

    if (form.ageRange.max > 35) {
      newErrors['ageRange.max'] = 'Max age cannot exceed 35';
    }    

    if (form.ageRange.max < form.ageRange.min) {
      newErrors['ageRange.max'] = 'Max age must be greater than min';
    }

    if (!form.genderPreference) newErrors.genderPreference = 'Required';
    if (!form.accommodationType) newErrors.accommodationType = 'Required';

    if (!form.budget.min || !form.budget.max) {
      newErrors['budget.min'] = 'Both budget fields are required';
    }

    if (form.budget.max < form.budget.min) {
      newErrors['budget.max'] = 'Max must be ≥ Min';
    }

    if (form.pets.hasPets && !form.pets.type.trim()) {
      newErrors['pets.type'] = 'Enter pet type';
    }

    if (!form.habits.sleepPattern) newErrors['habits.sleepPattern'] = 'Required';
    if (!form.cooking) newErrors.cooking = 'Required';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onNext(form);
  };

  const getError = (field: string) => errors[field] && (
    <p className="text-red-500 text-sm">{errors[field]}</p>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-black dark:text-white">Your Preferences ✨</h2>

      {/* Preferred Location */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Preferred Location</label>
        <select name="preferredLocation" value={form.preferredLocation} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
          <option value="">Select...</option>
          <option value="Downtown">Downtown</option>
          <option value="Uptown">Uptown</option>
          <option value="Suburbs">Suburbs</option>
        </select>
        {getError('preferredLocation')}
      </div>

   {/* Communication Style */}
<div className="space-y-2">
  <label className="block font-medium text-body-sm text-dark dark:text-white">Communication Style</label>
  <select name="communicationStyle" value={form.communicationStyle} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none dark:border-dark-3 dark:bg-dark-2">
    <option value="">Select...</option>
    <option value="Direct">Direct</option>
    <option value="Reserved">Reserved</option>
    <option value="Balanced">Balanced</option>
    <option value="Expressive">Expressive</option>
    <option value="Laid-back">Laid-back</option>
  </select>
  {getError('communicationStyle')}
</div>
{/* Social Energy Level */}
<div className="space-y-2">
  <label className="block font-medium text-body-sm text-dark dark:text-white">Social Energy Level</label>
  <select name="socialEnergyLevel" value={form.socialEnergyLevel} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none dark:border-dark-3 dark:bg-dark-2">
    <option value="">Select...</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    <option value="Depends on mood">Depends on mood</option>
  </select>
  {getError('socialEnergyLevel')}
</div>

      {/* Age Range */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="block font-medium text-body-sm text-dark dark:text-white">Age Min</label>
          <input
            type="number"
            name="ageRange.min"
            value={form.ageRange.min}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
          />
          {getError('ageRange.min')}
        </div>
        <div className="flex-1 space-y-2">
          <label className="block font-medium text-body-sm text-dark dark:text-white">Age Max</label>
          <input
            type="number"
            name="ageRange.max"
            value={form.ageRange.max}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
          />
          {getError('ageRange.max')}
        </div>
      </div>

      {/* Gender Preference */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Gender Preference</label>
        <select name="genderPreference" value={form.genderPreference} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Any</option>
        </select>
        {getError('genderPreference')}
      </div>

      {/* Accommodation Type */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Accommodation Type</label>
        <select name="accommodationType" value={form.accommodationType} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
          <option value="">Select...</option>
          <option value="Sharing in an apartment">Sharing in an apartment</option>
          <option value="Private room">Private room</option>
          <option value="Basement">Basement</option>
        </select>
        {getError('accommodationType')}
      </div>

      {/* Budget */}
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="block font-medium text-body-sm text-dark dark:text-white">Budget Min</label>
          <input
            type="number"
            name="budget.min"
            value={form.budget.min}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
          />
          {getError('budget.min')}
        </div>
        <div className="flex-1 space-y-2">
          <label className="block font-medium text-body-sm text-dark dark:text-white">Budget Max</label>
          <input
            type="number"
            name="budget.max"
            value={form.budget.max}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
          />
          {getError('budget.max')}
        </div>
      </div>

      {/* Pets */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Do you have pets?</label>
        <div>
          <input type="checkbox" name="pets.hasPets" checked={form.pets.hasPets} onChange={handleChange} /> Yes
        </div>
        {form.pets.hasPets && (
          <>
            <input
              type="text"
              name="pets.type"
              placeholder="Pet type (e.g. dog, cat)"
              value={form.pets.type}
              onChange={handleChange}
              className="block w-full p-2 mt-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
            />
            {getError('pets.type')}
          </>
        )}
      </div>

      {/* Habits */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Sleep Pattern</label>
        <select name="habits.sleepPattern" value={form.habits.sleepPattern} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
          <option value="">Select...</option>
          <option value="Early Bird">Early Bird</option>
          <option value="Night Owl">Night Owl</option>
        </select>
        {getError('habits.sleepPattern')}
      </div>

      <div className="flex gap-4">
        <label className="block font-medium text-body-sm text-dark dark:text-white">
          <input type="checkbox" name="habits.drinking" checked={form.habits.drinking} onChange={handleChange} />
          <span className="ml-2">Drinks Alcohol</span>
        </label>
        <label className="block font-medium text-body-sm text-dark dark:text-white">
          <input className="rounded-lg border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" type="checkbox" name="habits.smoking" checked={form.habits.smoking} onChange={handleChange} />
          <span className="ml-2 ">Smokes</span>
        </label>
      </div>

      {/* Cooking */}
      <div className="space-y-2">
        <label className="block font-medium text-body-sm text-dark dark:text-white">Cooking Preference</label>
        <select name="cooking" value={form.cooking} onChange={handleChange} className="w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
          <option value="">Select...</option>
          <option value="Home-cooked">Home-cooked</option>
          <option value="Eat out">Eat out</option>
          <option value="Mixed">Mixed</option>
        </select>
        {getError('cooking')}
      </div>

      <button
        type="submit"
        className="w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
      >
        Finish Onboarding
      </button>
    </form>
  );
};

export default PreferencesForm;
