// A new key mounts a new page, which fades in (see .page-enter in styles/motion.css).
export const PageTransition = ({ transitionKey, children }) => (
  <div key={transitionKey} className="page-enter">
    {children}
  </div>
);
