import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../contexts/JobContext'; // Import the context

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedJob, bookmarkedJobs, setBookmarkedJobs } = useJob(); // Use the context

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
        console.log('Fetched Jobs Data:', response.data);

        if (response.data && Array.isArray(response.data.results)) {
          setJobs(prevJobs => {
            const combinedJobs = [...prevJobs, ...response.data.results];
            const uniqueJobs = Array.from(new Set(combinedJobs.map(job => job.id))).map(id =>
              combinedJobs.find(job => job.id === id)
            );
            return uniqueJobs;
          });
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [page]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
    navigate(`/jobs/${job.id}`);
  };

  const handleBookmark = (job) => {
    const updatedBookmarks = [...bookmarkedJobs, job];
    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
  };

  const isBookmarked = (job) => {
    return bookmarkedJobs.some(bookmarkedJob => bookmarkedJob.id === job.id);
  };

  return (
    <div className="p-4 overflow-y-auto h-screen" ref={containerRef}>
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {jobs.length === 0 && !isLoading && !error && <p>No jobs available</p>}
      
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {jobs
          .filter(job => job.title && job.primary_details?.Place && job.primary_details?.Salary && job.whatsapp_no) // Ensure required fields exist
          .map((job) => (
            <div
              key={job.id}
              className="border bg-white rounded-lg p-2 shadow-md cursor-pointer transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl hover:bg-gradient-to-r from-blue-500 to-green-400 flex flex-col"
              onClick={() => handleJobClick(job)}
            >
              {job.creatives[0]?.thumb_url && (
                <div className="mt-4 w-full h-32 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={job.creatives[0].thumb_url} 
                    alt="Job thumbnail" 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 text-black">{job.title}</h2>
                <p className="text-black mb-1">Location: {job.primary_details?.Place}</p>
                <p className="text-black mb-1">Salary: {job.primary_details?.Salary}</p>
                <p className="text-black mb-2">Phone: {job.whatsapp_no}</p>
                <button 
                  className={`px-4 py-2 rounded transition duration-300 transform hover:scale-105 ${
                    isBookmarked(job) 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-yellow-400 text-black hover:bg-yellow-500'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isBookmarked(job)) {
                      handleBookmark(job);
                    }
                  }}
                  disabled={isBookmarked(job)}
                >
                  {isBookmarked(job) ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;




