// Simple audio file test utility with comprehensive debugging
export const testAudioFile = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`🧪 [AudioTest] Testing audio file: ${url}`);
    const audio = new Audio();
    
    // Set audio properties for testing
    audio.preload = 'auto';
    audio.volume = 1.0;
    audio.muted = false;
    
    // Test if file can be loaded and played
    audio.addEventListener('canplaythrough', async () => {
      console.log(`✅ [AudioTest] Audio ready for playback: ${url}`);
      console.log(`📊 [AudioTest] Duration: ${audio.duration}s, Ready state: ${audio.readyState}`);
      
      try {
        // Attempt to play the audio
        await audio.play();
        console.log(`🔊 [AudioTest] Playback started successfully: ${url}`);
        
        // Stop after a brief moment to avoid full playback during test
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          console.log(`⏹️ [AudioTest] Stopped test playback for: ${url}`);
          resolve(true);
        }, 500);
        
      } catch (playError) {
        console.error(`❌ [AudioTest] Play failed: ${url}`, playError);
        if (playError.name === 'NotAllowedError') {
          console.log(`🚫 [AudioTest] Autoplay blocked (requires user interaction): ${url}`);
        }
        resolve(false);
      }
    });
    
    audio.addEventListener('loadeddata', () => {
      console.log(`📥 [AudioTest] Data loaded: ${url}`);
    });
    
    audio.addEventListener('error', (e) => {
      const error = audio.error;
      console.error(`❌ [AudioTest] Audio error: ${url}`, {
        code: error?.code,
        message: error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
      resolve(false);
    });
    
    // Set source and start loading
    audio.src = url;
    audio.load();
    
    // Timeout after 5 seconds
    setTimeout(() => {
      console.warn(`⏰ [AudioTest] Test timeout: ${url}`);
      audio.pause();
      resolve(false);
    }, 5000);
  });
};

// Test all custom voice files at once
export const testAllCustomVoices = async (): Promise<void> => {
  console.log('🎵 [AudioTest] Testing all custom voice files...');
  
  const testFiles = [
    '/custom-voices/welcome-message.mp3',
    '/custom-voices/contact-form.wav', 
    '/custom-voices/congratulations-message.wav',
    '/custom-voices/question-1.wav'
  ];
  
  for (const file of testFiles) {
    const result = await testAudioFile(file);
    console.log(`${result ? '✅' : '❌'} [AudioTest] ${file}: ${result ? 'PASS' : 'FAIL'}`);
  }
  
  console.log('🏁 [AudioTest] All tests completed');
};