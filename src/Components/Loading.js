function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-blue-600">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
