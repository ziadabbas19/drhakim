import { Link } from 'react-router';
import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { Button } from '../../components/Button.jsx';
import { Section } from '../../components/Section.jsx';
import { PATHS } from '../../config/navigation.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useLoadMore } from '../../hooks/useLoadMore.js';
import { useScrollToHash } from '../../hooks/useScrollToHash.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { ReviewCard } from './ReviewCard.jsx';
import { AddReviewButton } from './ReviewFormModal.jsx';
import { ReviewsSummary, useReviewsStructuredData } from './ReviewsSummary.jsx';

const HOME_REVIEW_COUNT = 3;
const REVIEWS_PAGE_SIZE = 6;
export const REVIEWS_SECTION_ID = 'reviews';

// Up to three per row, centered, so one or two reviews do not sit off to one side.
const ReviewGrid = ({ reviews }) => (
  <Stagger
    className="flex flex-wrap justify-center gap-5"
    itemClassName="w-full md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
  >
    {reviews.map((review) => (
      <ReviewCard key={review.id} review={review} />
    ))}
  </Stagger>
);

// Shared frame: the summary, the reviews (or a friendly empty state), and the actions below them.
const ReviewsFrame = ({ title, summary, reviews, actions }) => {
  const { t } = useI18n();

  return (
    <Section
      id={REVIEWS_SECTION_ID}
      tone="brand"
      eyebrow={t('reviews.eyebrow')}
      title={title}
      description={t('reviews.description')}
      centered
    >
      <div className="space-y-8">
        <ReviewsSummary summary={summary.data} />
        <AsyncContent
          {...reviews}
          onRetry={reviews.reload}
          emptyMessage={t('reviews.empty')}
          emptyAction={<AddReviewButton />}
        >
          {(items) => (
            <>
              <ReviewGrid reviews={items} />
              <div className="mt-8 flex flex-wrap justify-center gap-3">{actions(items)}</div>
            </>
          )}
        </AsyncContent>
      </div>
    </Section>
  );
};

// Home page: the featured reviews, or the latest ones when none are featured.
export const ReviewHighlights = () => {
  const { t } = useI18n();
  const highlights = useFetch(() => publicApi.reviews.highlights(HOME_REVIEW_COUNT), []);
  const summary = useFetch(publicApi.reviews.summary, []);
  useReviewsStructuredData(summary.data, highlights.data);

  return (
    <ReviewsFrame
      title={t('reviews.title')}
      summary={summary}
      reviews={highlights}
      actions={(items) => (
        <>
          <AddReviewButton />
          {summary.data?.count > items.length && (
            <Button as={Link} to={`${PATHS.about}#${REVIEWS_SECTION_ID}`} variant="secondary" icon="arrowForward">
              {t('reviews.seeAll')}
            </Button>
          )}
        </>
      )}
    />
  );
};

// About page: every approved review, a page at a time.
export const AllReviews = () => {
  const { t } = useI18n();
  const reviews = useLoadMore(publicApi.reviews.list, { pageSize: REVIEWS_PAGE_SIZE });
  const summary = useFetch(publicApi.reviews.summary, []);
  useReviewsStructuredData(summary.data, reviews.data);
  useScrollToHash(REVIEWS_SECTION_ID, reviews.data !== null);

  return (
    <ReviewsFrame
      title={t('reviews.allTitle')}
      summary={summary}
      reviews={reviews}
      actions={() => (
        <>
          {reviews.hasMore && (
            <Button variant="secondary" icon="plus" isLoading={reviews.isLoading} onClick={reviews.loadMore}>
              {t('reviews.loadMore')}
            </Button>
          )}
          <AddReviewButton />
        </>
      )}
    />
  );
};
