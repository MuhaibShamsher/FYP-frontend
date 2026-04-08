import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';


const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-right"
      closeButton={true}
      style={{ zIndex: 99999 }}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            'border border-orange-500/20 bg-orange-500/10 backdrop-blur-md text-orange-400 shadow-lg shadow-orange-500/10 rounded-xl flex items-center',
          title: 'text-orange-400 font-semibold',
          description: 'text-gray-300',
          actionButton:
            'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors',
          cancelButton: 'text-gray-400 hover:text-gray-200 transition-colors',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-orange-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-400" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-green-400" />,
        close: <XIcon className="size-4 text-gray-400 hover:text-gray-200" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
