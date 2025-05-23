'use client';

import { useState } from 'react';
import ProfileImageCropper from './ProfileImageCropper';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  onImageUpload: (url: string) => void;
};

const WelcomeUpload = ({ onImageUpload }: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setUploadedUrl(null);
      setCroppedBlob(null);
      setError(null);
    }
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob);
  };

  const handleUpload = async () => {
    if (!croppedBlob) {
      setError('Please crop your image first.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      const imageUrl = await uploadToCloudinary(croppedFile);

      if (imageUrl) {
        setUploadedUrl(imageUrl);
        onImageUpload(imageUrl);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Something went wrong during upload.');
    }

    setUploading(false);
  };

  return (
    <div className="w-full max-w-xl rounded-lg bg-dark py-12 flex-wrap flex justify-center">

      <Link className="mb-10 inline-block" href="/">
        <Image
          className="hidden dark:block"
          src={"/images/logo/logo.svg"}
          alt="Logo"
          width={176}
          height={32}
        />
        <Image
          className="dark:hidden"
          src={"/images/logo/logo-dark.svg"}
          alt="Logo"
          width={176}
          height={32}
        />
      </Link>
      <h2 className="mb-1 text-2xl font-bold text-black dark:text-white text-center">
        Welcome to Roommate Finder 🎉
      </h2>
      <p className="mb-5 text-center text-gray-500 dark:text-gray-300">
        Upload and crop your profile photo to get started.
      </p>

      {!selectedImage && (
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full cursor-pointer rounded-full border border-primary bg-transparent p-3 text-sm text-body-color file:mr-5 file:rounded-full file:bg-primary file:px-5 file:py-2 file:text-body-color hover:file:cursor-pointer"
          />
        </div>
      )}

      {selectedImage && !uploadedUrl && (
        <>
          <ProfileImageCropper imageSrc={selectedImage} onCropComplete={handleCropComplete} />

          {croppedBlob && (
            <div className="mt-5">
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="w-full rounded bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          )}
        </>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {uploadedUrl && (
        <div className="mt-6 space-y-3 text-center">
          <img
            src={uploadedUrl}
            alt="Uploaded Profile"
            className="mx-auto h-32 w-32 rounded-full border shadow"
          />
          <p className="text-green-600">✅ Uploaded successfully!</p>
        </div>
      )}
    </div>
  );
};

export default WelcomeUpload;
