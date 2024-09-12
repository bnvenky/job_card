import { useEffect, useState } from 'react';
import { useJob } from '../contexts/JobContext'; // Import the context

const Bookmarks = () => {
  const { bookmarkedJobs, setBookmarkedJobs } = useJob(); // Use the context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedJobs = () => {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
      
      if (savedBookmarks.length === 0) {
        setIsLoading(false);
        return;
      }

      setBookmarkedJobs(savedBookmarks);
      setIsLoading(false);
    };

    fetchBookmarkedJobs();
  }, [setBookmarkedJobs]);

  // Function to remove a bookmark
  const handleRemoveBookmark = (jobId) => {
    const updatedBookmarks = bookmarkedJobs.filter(job => job.id !== jobId);
    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bookmarked Jobs</h2>
      {bookmarkedJobs.length === 0 && (
        <p className="text-gray-500 text-center">No jobs bookmarked yet</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedJobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 shadow-lg relative bg-white hover:shadow-xl transition duration-500 ease-in-out">
            {/* Job Image */}
            {job.creatives && job.creatives[0]?.thumb_url && (
              <div className="mb-4 w-full h-40 rounded-lg overflow-hidden">
                <img
                  src={job.creatives[0].thumb_url}
                  alt="Job thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Job Details */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
            <p className="text-gray-700"><strong>Location:</strong> {job.primary_details?.Place || 'N/A'}</p>
            <p className="text-gray-700"><strong>Salary:</strong> {job.primary_details?.Salary || 'N/A'}</p>
            <p className="text-gray-700 mb-4"><strong>Phone:</strong> {job.whatsapp_no || 'N/A'}</p>

            {/* Remove Button */}
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105"
              onClick={() => handleRemoveBookmark(job.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
