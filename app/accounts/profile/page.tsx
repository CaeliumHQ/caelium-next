'use client';
import Loader from '@/components/Loader';
import AuthContext from '@/contexts/AuthContext';
import useAxios from '@/hooks/useAxios';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { FiEdit2, FiLogOut, FiShare2, FiUser } from 'react-icons/fi';

const Profile = () => {
  const api = useAxios();
  const { user, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [birthdate, setBirthdate] = useState(user?.birthdate);
  const [location, setLocation] = useState(user?.location);
  const [gender, setGender] = useState(user?.gender);
  const [editable, setEditable] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(user?.avatar);
  let [newData, setNewData] = useState({});

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setBirthdate(user?.birthdate);
    setLocation(user?.location);
    setGender(user?.gender);
    setAvatarSrc(user?.avatar);
  }, [user]);

  const fields: { name: string; value: string; placeholder?: string; type?: string; fieldName: string; options?: string[] }[] = [
    { name: 'Name', value: name, fieldName: 'name' },

    { name: 'Email', value: email, placeholder: 'Add your E-mail here', fieldName: 'email' },
    { name: 'Date of Birth', value: birthdate, placeholder: 'Add your age here', type: 'date', fieldName: 'birthdate' },
    { name: 'Location', value: location, placeholder: 'Mark your location', fieldName: 'location' },
    {
      name: 'Gender',
      value: gender,
      placeholder: 'Choose Gender',
      fieldName: 'gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
    },
  ];

  const handleInputChange = (fieldName: string, stateName: string, value: any) => {
    setErrors({ ...errors, [fieldName]: null });
    setNewData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    switch (stateName) {
      case 'Name':
        setName(value);
        break;
      case 'Email':
        setEmail(value);
        break;
      case 'Date of Birth':
        setBirthdate(value);
        break;
      case 'Location':
        setLocation(value);
        break;
      case 'Gender':
        setGender(value);
        break;
      default:
        break;
    }
  };

  const updateProfile = () => {
    api
      .patch(`/api/auth/update/${user.id}/`, newData)
      .then(() => {
        setAlert(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
          setEditable(true);
        }
      });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarSrc(URL.createObjectURL(file));
    try {
      await api.patch(`/api/auth/update/${user.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlert(true);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  return user ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='container mx-auto px-4 py-8'
    >
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 mb-6 text-sm text-center text-green-800 rounded-xl bg-green-50 dark:bg-neutral-800/50 dark:text-green-400'
          role='alert'
        >
          <span className='font-medium'>Profile updated successfully.</span>
        </motion.div>
      )}

      <div className='max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8'>
        <div className='relative flex flex-col items-center mb-8'>
          <div className='relative'>
            {avatarSrc ? (
              <img className='h-32 w-32 rounded-full border object-cover' src={avatarSrc} alt={user.name} />
            ) : (
              <div className='h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center'>
                <FiUser className='w-16 h-16 text-violet-500' />
              </div>
            )}
            <button
              onClick={handleEditAvatarClick}
              className='absolute bottom-0 right-0 bg-violet-500 p-2 rounded-full text-white hover:bg-violet-600 transition-colors'
            >
              <FiEdit2 className='w-4 h-4' />
            </button>
            <input type='file' ref={fileInputRef} className='hidden' onChange={handleFileChange} />
          </div>
          <h1 className='text-2xl font-semibold mt-4 dark:text-white'>{user?.name}</h1>
          
          <div className='flex gap-3 mt-4'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (editable) {
                  updateProfile();
                  setEditable(false);
                } else {
                  setEditable(true);
                }
              }}
              className={`px-6 py-2 rounded-xl flex items-center gap-2 ${
                editable 
                  ? 'bg-gradient-to-br from-violet-500 to-purple-500 text-white' 
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-white'
              }`}
            >
              <FiEdit2 className='w-4 h-4' />
              {editable ? 'Save' : 'Edit'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              data-copy-to-clipboard-target='shareLink'
              className='px-6 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-xl flex items-center gap-2'
            >
              <FiShare2 className='w-4 h-4' />
              Share
            </motion.button>
          </div>
        </div>

        <div className='space-y-6'>
          {fields.map((field, i) => (
            <div key={i}>
              {field.type !== 'select' ? (
                <div className='space-y-2'>
                  <label className='text-sm text-neutral-500 dark:text-neutral-400'>{field.name}</label>
                  <input
                    type={field.type || 'text'}
                    className='w-full p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border-0'
                    value={field.value || ''}
                    placeholder={field.placeholder}
                    disabled={!editable}
                    onChange={(e) => handleInputChange(field.fieldName, field.name, e.target.value)}
                  />
                </div>
              ) : (
                <div className='space-y-2'>
                  <label className='text-sm text-neutral-500 dark:text-neutral-400'>{field.name}</label>
                  <select
                    value={field.value || 'Other'}
                    className='w-full p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border-0'
                    disabled={!editable}
                    onChange={(e) => handleInputChange(field.fieldName, field.name, e.target.value)}
                  >
                    <option disabled>{field.name}</option>
                    {field.options?.map((option, i) => <option key={i}>{option}</option>)}
                  </select>
                </div>
              )}
              {errors[field.fieldName as keyof typeof errors] && (
                <p className='text-sm text-red-500 mt-1'>
                  {(errors[field.fieldName as keyof typeof errors] as string[])[0]}
                </p>
              )}
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={logoutUser}
          className='w-full mt-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 justify-center'
        >
          <FiLogOut className='w-5 h-5' />
          Logout
        </motion.button>
      </div>
    </motion.div>
  ) : (
    <div className='flex h-screen items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Profile;
