import { createContext, use } from 'react';

export const ReviewCountsContext = createContext({ counts: null, reload: () => {} });

export const useReviewCounts = () => use(ReviewCountsContext);
