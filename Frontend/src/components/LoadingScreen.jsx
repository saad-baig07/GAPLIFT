import "./loading-screen.scss";

const LoadingScreen = () => {
  return (
    <main className="loading-screen" aria-live="polite" aria-busy="true">
      <div className="loader" aria-hidden="true" />
    </main>
  );
};

export default LoadingScreen;
