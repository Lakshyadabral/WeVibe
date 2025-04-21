'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PencilSquareIcon } from '@/assets/icons';

type Preferences = {
  communicationStyle: string;
  socialEnergyLevel: string;
  minAge: number;
  maxAge: number;
  genderPreference: string;
  occupation: string;
  preferredLocation: string;
  hasPets: boolean;
  petType?: string;
  minBudget: number;
  maxBudget: number;
  accommodationType: string;
  sleepPattern: string;
  drinking: boolean;
  smoking: boolean;
  cooking: string;
};

const PreferencePage = () => {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Preferences | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchPreferences = async () => {
      try {
        const res = await fetch(`/api/preferences/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setPreferences(data);
          setFormState(data);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setFormState((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !formState) return;

    try {
      const res = await fetch(`/api/preferences/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
        setIsEditing(false);
        alert('Preferences updated!');
      } else {
        alert('Failed to update preferences.');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Something went wrong.');
    }
  };

  const getError = (field: string) => errors[field] && (
    <p className="text-red-500 text-sm">{errors[field]}</p>
  );

  if (!session) {
    return <p className="text-center mt-10 text-lg">Please log in to view your preferences.</p>;
  }

  if (!preferences) {
    return <p className="text-center mt-10 text-lg">Loading your preferences...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-left text-dark dark:text-white mb-6">Your Preferences</h1>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-dark dark:text-white">

          <div>
            <label>Preferred Location:</label>
            <select 
              name="preferredLocation" 
              value={formState?.preferredLocation || ''}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary"
            >
              <option value="">Select...</option>
              <option value="Downtown">Downtown</option>
              <option value="Uptown">Uptown</option>
              <option value="Suburbs">Suburbs</option>
            </select>
            {getError('preferredLocation')}
          </div>

          <div>

  <label>Communication Style:</label>
  <select
    name="communicationStyle"
    value={formState?.communicationStyle || ''}
    onChange={handleInputChange}
    className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
  >
    <option value="">Select...</option>
    <option value="Direct">Direct</option>
    <option value="Reserved">Reserved</option>
    <option value="Balanced">Balanced</option>
    <option value="Laid-back">Laid-back</option>
    <option value="Expressive">Expressive</option>
  </select>
</div>

<div>
  <label>Social Energy Level:</label>
  <select
    name="socialEnergyLevel"
    value={formState?.socialEnergyLevel || ''}
    onChange={handleInputChange}
    className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
  >
    <option value="">Select...</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    <option value="Depends on mood">Depends on mood</option>
  </select>
</div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label>Age Min:</label>
              <input type="number" name="minAge" value={formState?.minAge || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" />
            </div>
            <div className="flex-1">
              <label>Age Max:</label>
              <input type="number" name="maxAge" value={formState?.maxAge || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" />
            </div>
          </div>

          <div>
            <label>Gender Preference:</label>
            <select name="genderPreference" value={formState?.genderPreference || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label>Occupation:</label>
            <input type="text" name="occupation" value={formState?.occupation || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" />
          </div>

          <div>
            <label>Accommodation Type:</label>
            <select name="accommodationType" value={formState?.accommodationType || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
              <option value="">Select...</option>
              <option value="Sharing in an apartment">Sharing in an apartment</option>
              <option value="Private room">Private room</option>
              <option value="Basement">Basement</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label>Budget Min:</label>
              <input type="number" name="minBudget" value={formState?.minBudget || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" />
            </div>
            <div className="flex-1">
              <label>Budget Max:</label>
              <input type="number" name="maxBudget" value={formState?.maxBudget || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" />
            </div>
          </div>

          <div>
            <label className='pr-2'>Do you have pets?</label>
            <input type="checkbox" name="hasPets" checked={formState?.hasPets || false} onChange={handleInputChange} />
            {formState?.hasPets && (
              <input type="text" name="petType" placeholder="Pet type" value={formState?.petType || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary" />
            )}
          </div>

          <div>
            <label>Sleep Pattern:</label>
            <select name="sleepPattern" value={formState?.sleepPattern || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
              <option value="">Select...</option>
              <option value="Early Bird">Early Bird</option>
              <option value="Night Owl">Night Owl</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label>
              <input type="checkbox" name="drinking" checked={formState?.drinking || false} onChange={handleInputChange} />
              <span className="ml-2">Drinks Alcohol</span>
            </label>
            <label>
              <input type="checkbox" name="smoking" checked={formState?.smoking || false} onChange={handleInputChange} />
              <span className="ml-2">Smokes</span>
            </label>
          </div>

          <div>
            <label>Cooking Preference:</label>
            <select name="cooking" value={formState?.cooking || ''} onChange={handleInputChange} className="mt-1 w-full p-2 rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary">
              <option value="">Select...</option>
              <option value="Home-cooked">Home-cooked</option>
              <option value="Eat out">Eat out</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div className='flex gap-2'>
            <button type="submit" className="w-full rounded bg-primary px-4 py-2 text-white">Save Preferences</button>
            <button type="button" onClick={() => setIsEditing(false)} className="w-full rounded bg-gray-400 px-4 py-2 text-white">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="w-full bg-white dark:bg-dark-2 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row justify-between gap-6 mb-5 hover:shadow-xl transition-all duration-500 relative">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-white">
            <div className="flex flex-col gap-2">
              <div><span className="font-semibold">Preferred Location:</span> {preferences.preferredLocation}</div>
              <div><span className="font-semibold">Communication Style:</span> {preferences.communicationStyle}</div>
              <div><span className="font-semibold">Social Energy Level:</span> {preferences.socialEnergyLevel}</div>
              <div><span className="font-semibold">Age Range:</span> {preferences.minAge} - {preferences.maxAge}</div>
              <div><span className="font-semibold">Gender Preference:</span> {preferences.genderPreference}</div>
              <div><span className="font-semibold">Occupation:</span> {preferences.occupation}</div>
              <div><span className="font-semibold">Budget:</span> ${preferences.minBudget} - ${preferences.maxBudget}</div>
            </div>

            <div className="flex flex-col gap-2">
              <div><span className="font-semibold">Accommodation Type:</span> {preferences.accommodationType}</div>
              <div><span className="font-semibold">Pets:</span> {preferences.hasPets ? preferences.petType : 'No'}</div>
              <div><span className="font-semibold">Sleep Pattern:</span> {preferences.sleepPattern}</div>
              <div><span className="font-semibold">Drinks Alcohol:</span> {preferences.drinking ? 'Yes' : 'No'}</div>
              <div><span className="font-semibold">Smokes:</span> {preferences.smoking ? 'Yes' : 'No'}</div>
              <div><span className="font-semibold">Cooking Preference:</span> {preferences.cooking}</div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 md:static md:self-start bg-primary text-white p-2 w-10 h-10 rounded-full hover:scale-105 transition-transform"
            aria-label="Edit Preferences"
          >
            <PencilSquareIcon className="w-6 h-6" />
          </button>

        </div>
      )}
    </div>
  );
};

export default PreferencePage;