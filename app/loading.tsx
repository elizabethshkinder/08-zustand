import css from './Home.module.css';

export default function Loading() {
  return (
    <div className={css.container}>
      <p className={css.content}>Loading, please wait...</p>
    </div>
  );
};

