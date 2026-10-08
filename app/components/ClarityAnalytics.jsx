'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityAnalytics() {
  useEffect(() => {
    try {
      Clarity.init('yuppdlr6rl');
    } catch (error) {
      console.error('Failed to initialize Microsoft Clarity:', error);
    }
  }, []);

  return null;
}
