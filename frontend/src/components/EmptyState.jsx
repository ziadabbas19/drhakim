import { Icon } from './Icon.jsx';

export const EmptyState = ({ message = 'لا توجد بيانات لعرضها حاليًا' }) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
    <span className="grid size-12 place-items-center rounded-full bg-white text-slate-400 shadow-sm">
      <Icon name="inbox" className="size-6" />
    </span>
    <p className="font-semibold text-slate-600">{message}</p>
  </div>
);
