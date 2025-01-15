'use client';
import useAxios from '@/hooks/useAxios';
import { ChangeEvent, useState } from 'react';

const ImageUpload = () => {
  const api = useAxios();
  const [selectedFiles, setSelectedFiles] = useState<File[] | []>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
    console.log(files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await api.post('YOUR_UPLOAD_URL', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  return (
    <div className='flex flex-col md:h-[calc(100dvh-5rem)] h-[calc(100dvh-9rem)] items-center justify-center'>
      <div className='flex items-center justify-center w-1/2'>
        <label
          htmlFor='dropzone-file'
          className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-neutral-900 hover:bg-gray-100 dark:border-neutral-700 dark:hover:border-gray-500 dark:hover:bg-neutral-800'
        >
          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
            <i className='fa-solid fa-cloud-arrow-up text-3xl mb-4 text-gray-400'></i>
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Click to upload</span> or drag and drop
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Image files or a zip file of images</p>
          </div>
          <input id='dropzone-file' type='file' className='hidden' multiple onChange={handleFileChange} />
        </label>
      </div>
      <div className='flex w-1/2 justify-between mt-2 px-2'>
        <p className='p-2'>{`Selected files: ${selectedFiles.length}`}</p>
        {selectedFiles.length != 0 ? (
          <div className='flex justify-end items-center gap-2'>
            <button
              onClick={() => {
                setSelectedFiles([]);
              }}
              className='px-4 py-1.5 bg-neutral-800 hover:border border-neutral-500 rounded-lg flex items-center justify-center'
            >
              <span className='fa-solid fa-xmark mr-2'></span>
              <span>Clear</span>
            </button>
            <button
              onClick={handleUpload}
              className='px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center'
            >
              <span className='material-symbols-outlined'>upload</span>
              <span>Upload</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImageUpload;
