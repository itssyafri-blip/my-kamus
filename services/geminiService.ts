import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  if (!text.trim()) return "";

  const ai = getAiClient();
  const prompt = `You are a professional translator for a dictionary app. Translate the following text strictly from ${sourceLang} to ${targetLang}. 
  Output only the translated text. Do not include any notes, explanations, or quotes around the output.
  
  Text to translate: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Gagal menerjemahkan. Periksa koneksi internet Anda.");
  }
};

// Helper to safely decode Base64
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Robust PCM Audio Decoder
const decodeAudioData = (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): AudioBuffer => {
  // Ensure we are reading the buffer correctly aligned
  // Create a copy to guarantee byte alignment if needed, although usually Uint8Array is aligned.
  // Using the buffer directly with offset and length is the safest way.
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.length / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize 16-bit integer to float range [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const playTextToSpeech = async (
  text: string, 
  speed: number = 1.0
): Promise<void> => {
  if (!text.trim()) return;

  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' is a clear female voice
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("Tidak ada data suara yang diterima dari server.");
    }

    // Initialize AudioContext safely
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass({ sampleRate: 24000 });

    // IMPORTANT: Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Decode audio
    const audioBytes = decode(base64Audio);
    const audioBuffer = decodeAudioData(audioBytes, ctx);

    // Create Nodes
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = speed; // Apply speed (Dasar/Mahir)

    // PROFESSIONAL AUDIO CHAIN: Source -> Gain -> Compressor -> Destination
    const gainNode = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();

    // 1. Gain Boost: Make it loud but clear
    gainNode.gain.value = 2.0; 

    // 2. Compressor: "Broadcast" style to prevent clipping and keep voice prominent
    compressor.threshold.value = -20;  // Start compressing early
    compressor.knee.value = 30;        // Soft knee
    compressor.ratio.value = 12;       // High compression ratio
    compressor.attack.value = 0.003;   // Fast attack
    compressor.release.value = 0.25;   // Moderate release

    // Connect Graph
    source.connect(gainNode);
    gainNode.connect(compressor);
    compressor.connect(ctx.destination);

    // Start Playback
    source.start(0);

    // Return promise that resolves when audio ends
    return new Promise((resolve) => {
      source.onended = () => {
        // Close context to free resources
        setTimeout(() => {
            try {
                ctx.close();
            } catch(e) { /* ignore */ }
            resolve();
        }, 100);
      };
    });

  } catch (error) {
    console.error("TTS Error:", error);
    // Re-throw with a user-friendly message
    throw new Error("Gagal memutar suara. Pastikan koneksi internet lancar.");
  }
};