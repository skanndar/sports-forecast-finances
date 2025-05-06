
import React from 'react';
import { Badge } from './badge';

interface MissingTranslationProps {
  translationKey: string;
}

const MissingTranslation: React.FC<MissingTranslationProps> = ({ translationKey }) => {
  return (
    <Badge variant="destructive" className="font-mono text-xs">
      Missing translation: {translationKey}
    </Badge>
  );
};

export default MissingTranslation;
