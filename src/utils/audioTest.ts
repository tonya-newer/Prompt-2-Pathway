// Simple audio file test utility
export const testAudioFile = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    
    // Test if file can be loaded and played
    audio.addEventListener('canplaythrough', () => {
      console.log(`✅ Audio test SUCCESS: ${url}`);
      resolve(true);
    });
    
    audio.addEventListener('error', (e) => {
      console.error(`❌ Audio test FAILED: ${url}`, e);
      resolve(false);
    });
    
    // No cache busting - test the exact URL that will be used
    audio.src = url;
    audio.load();
    
    // Timeout after 3 seconds
    setTimeout(() => {
      console.warn(`⏰ Audio test TIMEOUT: ${url}`);
      resolve(false);
    }, 3000);
  });
};