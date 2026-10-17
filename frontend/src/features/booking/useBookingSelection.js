import { useCallback, useState } from 'react';

const STEPS = ['clinic', 'date', 'time'];
const EMPTY_SELECTION = { clinic: null, date: null, time: null };

export const useBookingSelection = () => {
  const [selection, setSelection] = useState(EMPTY_SELECTION);

  const select = useCallback(
    (step, value) =>
      setSelection((current) => {
        const stepIndex = STEPS.indexOf(step);
        return Object.fromEntries(
          STEPS.map((name, index) => [name, index < stepIndex ? current[name] : index === stepIndex ? value : null]),
        );
      }),
    [],
  );

  const reset = useCallback(() => setSelection(EMPTY_SELECTION), []);

  const pendingStep = STEPS.findIndex((step) => !selection[step]);
  const currentStep = pendingStep === -1 ? STEPS.length : pendingStep;
  const statusOf = (stepIndex) => (stepIndex < currentStep ? 'done' : stepIndex === currentStep ? 'current' : 'upcoming');

  return { selection, select, reset, statusOf };
};
