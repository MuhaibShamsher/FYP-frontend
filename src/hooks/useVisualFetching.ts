import { useState } from 'react';

interface UseVisualFetchingProps {
  minVisibleTime?: number;
}

export default function useVisualFetching({
  minVisibleTime = 400,
}: UseVisualFetchingProps = {}) {
  const [isVisualFetching, setIsVisualFetching] = useState(false);

  const startVisualFetching = () => {
    setIsVisualFetching(true);
  };

  const stopVisualFetching = () => {
    setIsVisualFetching(false);
  };

  const handleFetchingChange = (isFetching: boolean) => {
    if (isFetching) {
      startVisualFetching();
    } else {
      // Stop fetching, wait before removing the visual state to prevent flickering on fast responses
      setTimeout(() => {
        stopVisualFetching();
      }, minVisibleTime);
    }
  };

  return {
    isVisualFetching,
    handleFetchingChange,
  };
}
