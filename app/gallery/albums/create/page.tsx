'use client';
import { useState } from 'react';

const CreateAlbum = () => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const toggleSelectImage = (image: number) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(image) ? prevSelected.filter((i) => i !== image) : [...prevSelected, image],
    );
  };

  const images = [
    'https://images.unsplash.com/photo-1715351190944-a32bc9a900ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1715586041798-9583f0642747?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1715624849529-3f99fafffee5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1NHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714572877812-7b416fbd4314?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714715362537-4aa538a6f0ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1715639732762-cf660da518c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714715362537-4aa538a6f0ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1715639732762-cf660da518c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714715362537-4aa538a6f0ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1715639732762-cf660da518c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <div className='p-4'>
      <div className='flex justify-center items-center'>
        <input type={'text'} placeholder='Title' className='border-b bg-neutral-950 outline-none text-6xl w-4/5 font-bold mb-4 p-1' />
        <button type='submit' className='bg-blue-600 mx-10 w-20 rounded-lg text-center h-10'>
          Save
        </button>
      </div>
      <div className='flex items-center justify-center sm:mt-16'>
        <div className='bg-neutral-900 h-96 w-1/2 rounded-lg p-4'>
          <div className='h-min grid grid-cols-4 md:grid-cols-6 gap-4 overflow-auto rounded-lg'>
            {images.map((image, i) => (
              <img
                key={i}
                className={`md:h-24 w-24 h-24 object-cover rounded-lg cursor-pointer ${selectedImages.includes(i) ? 'border-4 rounded-lg border-blue-500 object-cover' : ''}`}
                src={image}
                alt={`image-${i}`}
                onClick={() => toggleSelectImage(i)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='flex w-1/2 justify-between mt-2 px-2'>
          <p className='p-2'>{`selected images: ${selectedImages.length}`}</p>
          {selectedImages.length != 0 ? (
            <button
              onClick={() => {
                setSelectedImages([]);
              }}
              className='px-4 py-1.5 bg-neutral-800 hover:border border-neutral-500 rounded-lg flex items-center justify-center'
            >
              <span className='fa-solid fa-xmark mr-2'></span>
              <span>Clear</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreateAlbum;
