import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NotificationPromptProps {
  onEnable: () => void;
  onClose: () => void;
}

const NotificationPrompt: React.FC<NotificationPromptProps> = ({ onEnable, onClose }) => {
  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enable Notifications</AlertDialogTitle>
        </AlertDialogHeader>
        <p>
          Stay connected and never miss a message! By enabling notifications, you&apos;ll receive instant alerts whenever someone sends
          you a message, even when you&apos;re not actively using the app.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onEnable}>Enable</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NotificationPrompt;
