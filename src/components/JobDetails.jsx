import { useJob } from '../contexts/JobContext'; // Import the context

const JobDetails = () => {
  const { selectedJob } = useJob(); // Use the context

  // Check if selectedJob is not available
  if (!selectedJob) return <center><p className='align-middle'>Loading...</p></center>;

  // Log selectedJob for debugging purposes
  console.log(selectedJob);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      {/* Job Image */}
      {selectedJob.creatives?.[0]?.thumb_url && (
        <div className="w-full h-64 mb-6 rounded-lg overflow-hidden">
          <img 
            src={selectedJob.creatives[0].thumb_url} 
            alt="Job thumbnail" 
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Job Details */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedJob.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-lg text-gray-600"><strong>Location:</strong> {selectedJob.primary_details?.Place || 'N/A'}</p>
          <p className="text-lg text-gray-600"><strong>Salary:</strong> {selectedJob.primary_details?.Salary || 'N/A'}</p>
          <p className="text-lg text-gray-600"><strong>Job Type:</strong> {selectedJob.primary_details?.Job_Type || 'N/A'}</p>
        </div>
        <div>
          <p className="text-lg text-gray-600"><strong>Experience:</strong> {selectedJob.primary_details?.Experience || 'N/A'}</p>
          <p className="text-lg text-gray-600"><strong>Company:</strong> {selectedJob.company_name || 'N/A'}</p>
        </div>
      </div>

      <p className="text-md text-gray-600 mb-6"><strong>Description:</strong> {selectedJob.other_details || 'N/A'}</p>

      {/* Call to Action */}
      <div className="text-center">
        <a 
          href={selectedJob.custom_link || '#'} 
          className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 inline-block"
        >
          Call HR
        </a>
      </div>
    </div>
  );
};

export default JobDetails;

