import { useNavbar } from '@/contexts/NavContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NavBar = () => {
  let { ctaButton, navLinks, dropDown } = useNavbar();
  return (
    <motion.nav initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='fixed w-full z-20 top-0 start-0 md:px-6 md:py-4'>
      <div className='max-w-screen-xl mx-auto flex items-center justify-between bg-white dark:bg-neutral-900 md:rounded-2xl shadow-sm px-6 py-3'>
        <Link href='/' className='flex items-center space-x-3'>
          <img className='pointer-events-none dark:invert' src='/logos/written-dark.png' alt='caelium' width={120} height={0} />
        </Link>

        <div className='flex items-center gap-6'>
          <div className='hidden md:flex items-center gap-6'>
            {navLinks?.map((button, index) => (
              <Link
                key={index}
                href={button.url}
                className={`text-sm font-medium transition-colors ${
                  button.active
                    ? 'text-violet-500'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {button.name}
              </Link>
            ))}
            {dropDown && (
              <div className='relative'>
                <button
                  id='dropdownNavbarLink'
                  data-dropdown-toggle='dropdownNavbar'
                  className='flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                >
                  {dropDown.name}
                  <i className='fa-solid fa-chevron-down text-xs'></i>
                </button>
                <div
                  id='dropdownNavbar'
                  className='z-10 hidden absolute top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-lg'
                >
                  <ul className='py-2'>
                    {dropDown.options.map((option, index) => (
                      <li key={index}>
                        <a
                          href={option.url}
                          className='block px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700'
                        >
                          {option.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {ctaButton?.name !== 'Get Started' && ctaButton && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={ctaButton?.url}
                className='bg-gradient-to-br from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium'
              >
                {ctaButton.name}
              </Link>
            </motion.div>
          )}

          <button
            data-collapse-toggle='navbar-sticky'
            type='button'
            className='md:hidden p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            aria-controls='navbar-sticky'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <i className='fa-solid fa-bars text-xl'></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className='hidden absolute top-full left-0 right-0 mt-4 mx-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg md:hidden'
          id='navbar-sticky'
        >
          <ul className='py-4'>
            {navLinks?.map((button, index) => (
              <li key={index}>
                <Link
                  href={button.url}
                  className={`block px-6 py-2 text-sm font-medium ${
                    button.active
                      ? 'text-violet-500'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {button.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
