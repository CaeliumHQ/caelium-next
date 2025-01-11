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
            name: incomingCall.caller.name,
            image: incomingCall.caller.avatar_url,
            chat_id: incomingCall.chat_id,
            callType: incomingCall.type,
          }}
        />
      )}
    </div>
  );
};

export default Signals;
