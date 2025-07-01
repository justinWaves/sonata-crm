'use client';
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, publicId: string) => void;
  onCancel?: () => void;
  currentImageUrl?: string;
  className?: string;
}

export default function ImageUpload({ 
  onImageUpload, 
  onCancel, 
  currentImageUrl,
  className = '' 
}: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use back camera
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setUploadedImage(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  const uploadToCloudinary = async (imageData: string): Promise<{ photoUrl: string; publicId: string }> => {
    // Convert data URL to base64
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }
    
    const mimeTypeMatch = imageData.split(',')[0]?.split(':')[1]?.split(';')[0];
    if (!mimeTypeMatch) {
      throw new Error('Could not determine image MIME type');
    }
    const mimeType = mimeTypeMatch;

    const response = await fetch('/api/upload/piano-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: base64Data,
        mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      photoUrl: result.photoUrl,
      publicId: result.publicId,
    };
  };

  // Set default crop to centered square when image loads
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Make a centered square crop
    const side = Math.min(width, height);
    const x = Math.round((width - side) / 2);
    const y = Math.round((height - side) / 2);
    const pixelCrop: PixelCrop = {
      unit: 'px',
      width: side,
      height: side,
      x,
      y,
    };
    setCrop(pixelCrop);
    setCompletedCrop(pixelCrop);
  }, []);

  const handleSave = async () => {
    if (!uploadedImage || !imgRef.current || !completedCrop) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create a canvas to apply the crop
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const image = imgRef.current;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // Convert canvas to data URL
      const croppedImageData = canvas.toDataURL('image/jpeg', 0.9);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(croppedImageData);
      
      onImageUpload(result.photoUrl, result.publicId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setError(null);
    onCancel?.();
  };

  if (uploadedImage) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Crop Photo</h3>
          <p className="text-sm text-gray-600">Adjust the crop to create a square thumbnail</p>
        </div>
        
        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            minWidth={100}
            minHeight={100}
          >
            <img
              ref={imgRef}
              src={uploadedImage}
              alt="Upload preview"
              className="max-w-full max-h-96 object-contain"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="flex justify-center space-x-3">
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Save Photo'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add Piano Photo</h3>
        <p className="text-sm text-gray-600">Upload a photo or take one with your camera</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <p className="text-gray-600">
              {isDragActive 
                ? 'Drop the image here...' 
                : 'Drag & drop an image here, or click to select'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Mobile Camera Button */}
      <div className="text-center block md:hidden">
        <button
          onClick={handleCameraCapture}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Take Photo
        </button>
      </div>

      {currentImageUrl && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Current photo:</p>
          <img 
            src={currentImageUrl} 
            alt="Current piano" 
            className="w-20 h-20 object-cover rounded-lg mx-auto border border-gray-200"
          />
        </div>
      )}

      {onCancel && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
} 