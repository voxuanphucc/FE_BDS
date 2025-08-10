import React, { ReactNode } from 'react';
import { BoxIcon } from 'lucide-react';
interface FormSectionProps {
  icon: typeof BoxIcon;
  title: string;
  children: ReactNode;
}
const FormSection: React.FC<FormSectionProps> = ({
  icon: Icon,
  title,
  children
}) => {
  return <div className="mb-12">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>;
};
export default FormSection;