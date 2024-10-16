type BackgroundJob = () => Promise<void>;

export function startBackgroundJob(job: BackgroundJob) {
  // Start the job asynchronously
  setTimeout(async () => {
    try {
      await job();
    } catch (error) {
      console.error("Error in background job:", error);
    }
  });
}
