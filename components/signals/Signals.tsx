import { useServices } from '@/contexts/ServiceContext';
import { IncomingCallAlert } from './IncomingCallAlert';

const Signals = () => {
  const { incomingCall } = useServices();
  return (
    <div>
      {incomingCall && (
        <IncomingCallAlert
          isOpen={incomingCall !== null}
          caller={{
            name: 'Jerit Baiju',
            image: 'http://192.168.43.73:8000/media/avatars/24UBC234ojBsCkQQG0dudLfZ.jpg',
            callType: 'audio',
          }}
        />
      )}
    </div>
  );
};

export default Signals;
