const DateGroups = () => {
  interface DateObject {
    day: number;
    monthYear: string;
  }

  interface DateGroups {
    title: string;
    dates: DateObject[];
  }

  const groups: DateGroups[] = [
    {
      title: 'Random Dates 1',
      dates: [
        { day: 29, monthYear: 'May 2022' },
        { day: 8, monthYear: 'June 2022' },
        { day: 11, monthYear: 'May 2023' },
        { day: 20, monthYear: 'October 2023' },
        { day: 21, monthYear: 'October 2023' },
        { day: 29, monthYear: 'January 2024' },
        { day: 7, monthYear: 'May 2024' },
      ],
    },
    {
      title: 'Random Dates 2',
      dates: [
        { day: 22, monthYear: 'September 2023' },
        { day: 24, monthYear: 'October 2023' },
        { day: 26, monthYear: 'November 2023' },
        { day: 28, monthYear: 'December 2023' },
        { day: 24, monthYear: 'January 2024' },
        { day: 22, monthYear: 'February 2024' },
        { day: 20, monthYear: 'March 2024' },
        { day: 18, monthYear: 'April 2024' },
        { day: 15, monthYear: 'May 2024' },
      ],
    },
  ];

  return (
    <div className='p-4 flex flex-col gap-4'>
      {groups.map((group, i) => (
        <div key={i} className='p-4 bg-neutral-900 rounded-3xl'>
          <p className='text-4xl p-2 mb-5 border-b'>{group.title}</p>
          <div className='grid grid-cols-2 items-center md:grid-cols-8 gap-4 mx-auto'>
            {group.dates.map((date, i) => (
              <div key={i} className='h-40 w-40 bg-neutral-800 rounded-lg flex flex-col items-center justify-center'>
                <p className='text-6xl'>{date.day}</p> <p className='text-xl'>{date.monthYear}</p>
              </div>
            ))}
            <div className='h-40 w-40 bg-neutral-800 rounded-lg flex flex-col items-center justify-center'>
              <i className='fa-solid fa-arrow-up-right-from-square text-3xl p-4 text-center text-neutral-500' />
              <p className='text-neutral-400 text-xl'>view more</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DateGroups;
