import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera as IconCamera, RefreshCcw, Delete, RectangleHorizontal, Check, Volume2, Copy, CheckCircle, ScanFace, X, ChevronUp, ChevronDown, Loader2, Power, AlertCircle } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // Import Theme

// --- CONFIG ---
const VIDEO_CONSTRAINTS = {
  width: 480,
  height: 360,
  facingMode: "user"
};

const LABELS = ['1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const REQUIRED_HOLD_DURATION = 1500; // 1 second hold
const DETECTION_CONFIDENCE_THRESHOLD = 85;
const DISPLAY_CONFIDENCE_THRESHOLD = 60;
const VALIDATION_DELAY = 1500;
const STORAGE_KEY = 'signbuddy_session_state';

const Terjemah = () => {
  const { isDarkMode } = useTheme(); // Gunakan Theme Context

  // UI state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  
  const [finalSentence, setFinalSentence] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).finalSentence : [];
    } catch { return []; }
  });

  // -- Language State --
  const [language, setLanguage] = useState(() => {
     try {
       const saved = sessionStorage.getItem(STORAGE_KEY);
       return saved ? (JSON.parse(saved).language || 'id') : 'id';
     } catch { return 'id'; }
  });
  
  const [currentWord, setCurrentWord] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).currentWord : "";
    } catch { return ""; }
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [shakeIndex, setShakeIndex] = useState(null); 

  // AI state
  const [model, setModel] = useState(null);
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [dictionarySet, setDictionarySet] = useState(new Set());
  const [isDictLoading, setIsDictLoading] = useState(true);

  // refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  
  const isMounted = useRef(true);

  // utils & throttling refs
  const lastPrediction = useRef("");
  const detectionStartTime = useRef(0); // Time based tracking
  const lastProcessedTime = useRef(0);

  // guide state
  const [activeGuide, setActiveGuide] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const alphabet = [
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
  ];

  // Input helper
  const handleLetterInput = useCallback((letter) => setCurrentWord(prev => prev + letter), []);

  useEffect(() => {
    const stateToSave = {
      finalSentence,
      currentWord,
      language
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [finalSentence, currentWord, language]);


  // --- CLEANUP EFFECT ---
  // --- CLEANUP EFFECT ---
  useEffect(() => {
    isMounted.current = true;
    const currentWebcam = webcamRef.current;
    
    return () => {
      isMounted.current = false;
      setIsCameraActive(false);  
      
      if (currentWebcam && currentWebcam.video && currentWebcam.video.srcObject) {
        const tracks = currentWebcam.video.srcObject.getTracks();
        tracks.forEach(track => track.stop()); 
      }

      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, []);

  const preProcessLandmark = (landmarks, flip = false) => {
    let tempLandmarks = [];
    let baseX = landmarks[0].x;
    let baseY = landmarks[0].y;
    let baseZ = landmarks[0].z;

    let processedPoints = [];

    let maxVal = 0;

    landmarks.forEach(lm => {
      let x = lm.x - baseX;
      let y = lm.y - baseY;
      let z = lm.z - baseZ;

      processedPoints.push({x, y, z});

      maxVal = Math.max(maxVal, Math.abs(x), Math.abs(y), Math.abs(z));
    });

    if (maxVal === 0) maxVal = 1;

    processedPoints.forEach(p => {
      let normX = p.x / maxVal;
      let normY = p.y / maxVal;
      let normZ = p.z / maxVal;

      if (flip) {
        normX = normX * -1;
      }

      tempLandmarks.push(normX, normY, normZ);
    });
    
    return tempLandmarks;
  };

  // --- MEDIAPIPE HANDLER ---
  const onResults = useCallback(async (results) => {
    if (!isMounted.current) return;

    const canvas = canvasRef.current;
    
    // Safety check just in case webcamRef is null/undefined while closing
    if (!webcamRef.current || !webcamRef.current.video) return;
    const video = webcamRef.current.video;
    
    if (!canvas || !video) return;

    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const ctx = canvas.getContext('2d'); 
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const handedness = results.multiHandedness && results.multiHandedness.length > 0 ? results.multiHandedness[0] : null; // { index, score, label: "Left"|"Right" }

      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#38BDF8', lineWidth: 4 });
      drawLandmarks(ctx, landmarks, { color: '#0369A1', lineWidth: 2, radius: 4 });

      if (model) {
        // Wrap tensor operations in a try-finally block for safety
        let tensorsToDispose = [];
        try {
          // OPTIMIZATION: Determine "Standard" hand (Right) based on detection
          // If detected "Left", we flip it to look like "Right" for the model.
          // If detected "Right", we use as is.
          const isLeftHand = handedness && handedness.label === 'Left';
          const shouldFlip = isLeftHand; 

          const resultTensor = tf.tidy(() => {
            // 1. Siapkan 1 Versi Data (Normalized)
            const dataInput = preProcessLandmark(landmarks, shouldFlip);
  
            // 2. Bikin Tensor
            const tensorInput = tf.tensor2d([dataInput]);
  
            // 3. Prediksi (Single Pass)
            return model.predict(tensorInput);
          });
          
          // Track for disposal
          tensorsToDispose.push(resultTensor);

          // 4. Ambil Data secara ASYNC
          const resultData = await resultTensor.data();
          
          // 5. Analisa
          const maxConfidence = Math.max(...resultData);
          const maxIndex = resultData.indexOf(maxConfidence);
          
          const predictedLabel = LABELS[maxIndex];
          const confidence = Math.round(maxConfidence * 100);

          if (!isMounted.current) return;

          // LOGIC: Confidence & Validation
          const now = Date.now();
          
          // Visual Feedback (Low Threshold)
          if (confidence > DISPLAY_CONFIDENCE_THRESHOLD) {
            setDetectedLetter(prev => prev === predictedLabel ? prev : predictedLabel);
            setAiConfidence(confidence);
          } else {
            setDetectedLetter(null);
            setHoldProgress(0);
             detectionStartTime.current = 0; // Reset
            return;
          }

          // Strict Validation (High Threshold + Consistent Time)
          if (confidence >= DETECTION_CONFIDENCE_THRESHOLD) {
            if (predictedLabel === lastPrediction.current) {
              // If same label, check time
              if (detectionStartTime.current === 0) {
                detectionStartTime.current = now;
              }
              
              const elapsed = now - detectionStartTime.current;
              const progress = Math.min((elapsed / REQUIRED_HOLD_DURATION) * 100, 100);
              setHoldProgress(progress);

              if (elapsed >= REQUIRED_HOLD_DURATION) {
                handleLetterInput(predictedLabel);
                detectionStartTime.current = 0; // Reset after success
                setHoldProgress(0);
                lastPrediction.current = null; // Force reset cycle
              }

            } else {
              // Label changed, reset timer
              lastPrediction.current = predictedLabel;
              detectionStartTime.current = now;
              setHoldProgress(0);
            }
          } else {
            detectionStartTime.current = 0;
            setHoldProgress(0);
            lastPrediction.current = null; 
          }
        } catch (error) {
          console.error("Prediction error:", error);
        } finally {
          // CRITICAL: Dispose tensors returned from tidy manually
          tensorsToDispose.forEach(t => t && t.dispose());
        }
      }
    } else {
      setDetectedLetter(null);
      setHoldProgress(0);
      detectionStartTime.current = 0;
      lastPrediction.current = null;
    }
    ctx.restore();
  }, [model, handleLetterInput]);

  useEffect(() => {
    if (handsRef.current) handsRef.current.onResults(onResults);
  }, [onResults]);

  // --- START SYSTEM ---
  const handleStartSystem = async () => {
    setIsModelLoading(true);

    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 2000));
    const loadAiPromise = (async () => {
      if (!model) {
        try {
          const loadedModel = await tf.loadLayersModel('/model/model.json');
          if(isMounted.current) setModel(loadedModel);
          tf.tidy(() => { loadedModel.predict(tf.zeros([1, 63])); });
        } catch (err) {
          console.error("Failed to load model:", err);
          throw err;
        }
      }
      let handsInstance = handsRef.current;
      if (!handsInstance) {
        handsInstance = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        handsInstance.setOptions({ maxNumHands: 2, modelComplexity: 0, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        handsInstance.onResults(onResults);
        handsRef.current = handsInstance;
      }
    })();

    try {
      await Promise.all([minDelayPromise, loadAiPromise]);
      
      if (isMounted.current) {
        setIsModelLoading(false);
        setIsCameraActive(true);
      }
    } catch (error) {
      if (isMounted.current) setIsModelLoading(false);
      console.error("Gagal memulai sistem:", error);
      alert("Gagal memuat sistem AI. Cek koneksi internet anda.");
    }
  };

  const handleStopSystem = () => {
    setIsCameraActive(false);
    setDetectedLetter(null);
    setHoldProgress(0);
    detectionStartTime.current = 0;
    lastPrediction.current = null;
  };

  useEffect(() => {
    let animationId;
    const detect = async (timestamp) => {
      if (!isMounted.current) return;

      const THROTTLE_MS = 50; 
      if (isCameraActive && webcamRef.current && webcamRef.current.video.readyState === 4 && handsRef.current) {
        if (timestamp - lastProcessedTime.current >= THROTTLE_MS) {
          lastProcessedTime.current = timestamp;
          await handsRef.current.send({ image: webcamRef.current.video });
        }
      }
      animationId = requestAnimationFrame(detect);
    };

    if (isCameraActive) animationId = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(animationId);
  }, [isCameraActive]);

  // --- DICTIONARY LOADING ---
  useEffect(() => {
    const fetchDictionary = async () => {
      setIsDictLoading(true);
      try {
        const url = language === 'id' ? '/kamus-id.json' : '/kamus-en.json';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Gagal download file kamus (${language})`);
        
        const data = await response.json();
        let wordSet;

        if (language === 'id') {
           // kamus-id.json is Array of Uppercase Strings
           wordSet = new Set(data);
        } else {
           // kamus-en.json is Object { "word": 1 }
           // keys are likely lowercase, convert to UPPERCASE to match LABELS input
           const keys = Object.keys(data).map(w => w.toUpperCase());
           wordSet = new Set(keys);
        }

        if(isMounted.current) {
          setDictionarySet(wordSet);
          setIsDictLoading(false);
        }
      } catch (error) {
        console.error("Error memuat kamus:", error);
        if(isMounted.current) setIsDictLoading(false);
      }
    };
    
    fetchDictionary();
  }, [language]);

  // --- LOGIC VALIDASI ---
  const checkValidityInstant = useCallback((word) => {
    if (!word || isDictLoading) return false;
    const upper = word.toUpperCase();
    if (upper.length === 1 && !['A', 'I'].includes(upper)) return false;
    if (upper.length === 2 && upper[0] === upper[1]) return false;
    return /^\d+$/.test(upper) || dictionarySet.has(upper);
  }, [dictionarySet, isDictLoading]);

  // Timer Delay Validasi
  useEffect(() => {
    setIsChecking(true);
    setIsValid(false);

    if (!currentWord) {
      setIsChecking(false);
      return;
    }

    const timer = setTimeout(() => {
      if(isMounted.current) {
        const result = checkValidityInstant(currentWord);
        setIsValid(result);
        setIsChecking(false);
      }
    }, VALIDATION_DELAY);

    return () => clearTimeout(timer);
  }, [currentWord, checkValidityInstant]);


  const handleSpace = () => {
    if (currentWord.length > 0) {
      const isWordValid = checkValidityInstant(currentWord);
      
      setFinalSentence(prev => [...prev, { text: currentWord, valid: isWordValid }]);
      
      if (!isWordValid) {
        setShakeIndex(finalSentence.length);
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        setTimeout(() => {
          if(isMounted.current) setShakeIndex(null);
        }, 500);
      }

      setCurrentWord("");
    }
  };

  const handleBackspace = () => {
    if (currentWord.length > 0) setCurrentWord(prev => prev.slice(0, -1));
    else setFinalSentence(prev => prev.slice(0, -1));
  };

  const handleReset = () => {
    setFinalSentence([]);
    setCurrentWord("");
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const handleSpeak = () => {
    const text = finalSentence.map(w => w.text).join(" ") + " " + currentWord;
    if (!text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // DYNAMIC LANGUAGE
    utterance.lang = language === 'id' ? 'id-ID' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    const text = finalSentence.map(w => w.text).join(" ") + " " + currentWord;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => { if(isMounted.current) setIsCopied(false) }, 2000);
  };

  const showEmptyState = finalSentence.length === 0 && !currentWord;

  return (
    <div className="flex flex-col md:flex-row gap-8 h-[85%] items-center justify-center px-4 pt-4">
      {/* left: camera */}
      {/* UPDATE STYLE CONTAINER: Support Dark Mode */}
      <Motion.div layout className={`flex-1 w-full max-w-[600px] aspect-[4/3] rounded-[2.5rem] p-3 shadow-xl border-[4px] relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-brand-main'}`}>
        <div className="w-full h-full bg-gray-900 rounded-[2rem] relative overflow-hidden flex flex-col items-center justify-center group">
          <div className="absolute inset-0 w-full h-full bg-black z-0">
            {isCameraActive ? (
              <>
                <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={VIDEO_CONSTRAINTS} className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none" style={{ transform: "scaleX(-1)" }} />
              </>
            ) : (
              // UPDATE: Placeholder Camera Dark Mode friendly
              <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center gap-4">
                {isModelLoading ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-main/20 blur-xl rounded-full"></div>
                      <Loader2 className="w-16 h-16 text-brand-main animate-spin relative z-10" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-bold text-lg">Menyiapkan AI...</h3>
                      <p className="text-white/40 text-sm">Memuat Model & Vision Engine</p>
                    </div>
                  </>
                ) : (
                  <div className="text-white/20 font-bold text-2xl">Camera Off</div>
                )}
              </div>
            )}
          </div>

          {isCameraActive && (
            <>
              <AnimatePresence>
                {activeGuide && (
                  <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <img src={`/assets_kamus/${activeGuide}.png`} alt={`Panduan ${activeGuide}`} className="h-[70%] object-contain drop-shadow-2xl grayscale contrast-125 invert opacity-80" onError={(e) => e.target.style.display = 'none'} />
                  </Motion.div>
                )}
              </AnimatePresence>

              <div className="absolute top-6 left-6 backdrop-blur-md px-5 py-2 rounded-full flex items-center gap-3 border border-white/10 z-30 shadow-lg bg-green-500/20 text-green-100">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-sm font-medium tracking-wide">AI Live</span>
              </div>

              <button onClick={handleStopSystem} className="absolute top-6 right-6 z-50 p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95 group" title="Matikan Kamera">
                <Power className="w-5 h-5 group-hover:drop-shadow-md" strokeWidth={2.5} />
              </button>

              <AnimatePresence>
                {detectedLetter && (
                  <Motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="absolute bottom-20 left-0 right-0 mx-auto z-40 flex flex-col items-center pointer-events-none">
                    <div className="mb-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                      <ScanFace className="w-3 h-3 text-brand-main" />
                      <span className="text-white font-bold text-xs">{aiConfidence}%</span>
                    </div>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                        <Motion.circle cx="50" cy="50" r="42" fill="none" stroke="#38BDF8" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * holdProgress) / 100} strokeLinecap="round" />
                      </svg>
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">{detectedLetter}</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-[10px] mt-1 font-medium tracking-wide">Tahan posisi...</p>
                  </Motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end">
                <AnimatePresence mode="wait" initial={false}>
                  {activeGuide ? (
                    <Motion.div key="ghost-mode" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.2 }} className="pb-6 pt-2 w-full flex justify-center bg-gradient-to-t from-black/80 to-transparent rounded-b-[2rem]">
                      <button onClick={() => setActiveGuide(null)} className="bg-red-500/80 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg"><X className="w-4 h-4" /> Tutup Panduan</button>
                    </Motion.div>
                  ) : (
                    <Motion.div key="normal-mode" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }} className="w-full flex flex-col items-center">
                      <button onClick={() => setIsGuideOpen(!isGuideOpen)} className="bg-black/60 hover:bg-brand-main/80 backdrop-blur-md border border-white/10 text-white p-1.5 rounded-t-xl transition-all active:scale-95 shadow-lg-up w-16 flex justify-center border-b-0">
                        {isGuideOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                      </button>
                      <AnimatePresence>
                        {isGuideOpen && (
                          <Motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="w-full bg-black/60 backdrop-blur-xl border-t border-white/10 overflow-hidden rounded-b-[2rem]">
                            <div className="py-4 w-full">
                              <p className="text-white/50 text-[10px] text-center mb-3 font-medium uppercase tracking-widest">Pilih Panduan Isyarat</p>
                              <div className="flex gap-3 overflow-x-auto overflow-y-hidden flex-nowrap px-4 w-full scrollbar-hide justify-start">
                                {alphabet.map((char) => (
                                  <button key={char} onClick={() => { setActiveGuide(char); setIsGuideOpen(false); }} className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg shrink-0 hover:bg-brand-main hover:scale-100 transition-all flex items-center justify-center active:scale-95">{char}</button>
                                ))}
                                <div className="w-2 shrink-0" />
                              </div>
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          <AnimatePresence>
            {!isCameraActive && !isModelLoading && (
              <Motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute bottom-6 flex justify-center w-full z-20">
                <button onClick={handleStartSystem} className="bg-brand-main p-4 rounded-full hover:scale-110 transition-all shadow-glow border-4 border-white/20">
                  <IconCamera className="w-8 h-8 text-white" />
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </Motion.div>

      {/* right: translation */}
      <Motion.div layout className="flex-1 w-full max-w-[500px] h-[450px] flex flex-col relative">
        {/* UPDATE STYLE HEADER */}
          {/* HEADER AREA */}
          <div className="relative w-fit">
            {/* TITLE TAB */}
            <div className={`w-fit px-12 py-3 rounded-t-[1.5rem] relative top-[4px] z-0 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-brand-main'}`}>
              <h2 className="text-white font-bold text-lg tracking-wider">Terjemah</h2>
            </div>
            
            {/* STYLED LANGUAGE TOGGLE */}
            <div className="absolute left-[calc(100%+8px)] bottom-[6px] flex items-center gap-3 z-10 select-none">
              <span className={`text-sm font-bold transition-colors ${language === 'id' ? (isDarkMode ? 'text-white' : 'text-brand-main') : 'text-slate-400'}`}>ID</span>
              
              <button 
                onClick={() => setLanguage(prev => prev === 'id' ? 'en' : 'id')}
                className={`w-16 h-8 rounded-full shadow-inner relative cursor-pointer overflow-hidden border-2 group hover:scale-105 transition-transform ${isDarkMode ? 'border-slate-700' : 'border-brand-main'}`}
                title={language === 'id' ? "Bahasa Indonesia" : "English"}
              >
                {/* Dynamic Background (Flag) */}
                <Motion.div 
                  initial={false}
                  animate={{
                    background: language === 'id' 
                      ? 'linear-gradient(to bottom, #EF4444 50%, #F8FAFC 50%)' // ID Flag: Simple Red/White
                      : `
                        linear-gradient(90deg, transparent 46%, #C8102E 46%, #C8102E 54%, transparent 54%), 
                        linear-gradient(180deg, transparent 46%, #C8102E 46%, #C8102E 54%, transparent 54%), 
                        linear-gradient(90deg, transparent 40%, #FFFFFF 40%, #FFFFFF 60%, transparent 60%), 
                        linear-gradient(180deg, transparent 40%, #FFFFFF 40%, #FFFFFF 60%, transparent 60%), 
                        linear-gradient(135deg, transparent 45%, #FFFFFF 45%, #FFFFFF 55%, transparent 55%), 
                        linear-gradient(45deg, transparent 45%, #FFFFFF 45%, #FFFFFF 55%, transparent 55%), 
                        #012169
                      ` 
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Sliding Thumb */}
                <Motion.div 
                  layout
                  initial={false}
                  animate={{ x: language === 'id' ? 3 : 30 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-brand-dark hover:bg-brand-main transition-colors rounded-full shadow-md absolute top-[2px] z-10"
                />
              </button>

              <span className={`text-sm font-bold transition-colors ${language === 'en' ? (isDarkMode ? 'text-white' : 'text-brand-main') : 'text-slate-400'}`}>EN</span>
            </div>
          </div>
        
        {/* UPDATE STYLE BODY */}
        <div className={`rounded-[2.5rem] rounded-tl-none border-[4px] shadow-soft flex-1 flex flex-col relative z-10 p-2 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-brand-main'}`}>
          {!showEmptyState && (
            <div className="absolute top-4 right-6 flex gap-2 z-20">
              <button onClick={handleSpeak} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-brand-main hover:text-white'}`}><Volume2 className="w-4 h-4" /></button>
              <button onClick={handleCopy} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-brand-main hover:text-white'}`}>
                {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          <div className="flex-1 w-full p-8 pt-12 overflow-y-auto custom-scrollbar-white text-left content-start flex flex-wrap items-center gap-x-2 gap-y-2 relative">
            {showEmptyState && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 select-none pointer-events-none z-0">
                <ScanFace className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} strokeWidth={1.5} />
                <p className={`font-medium text-center text-sm ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>
                  Area penerjemah kosong.<br />
                  {isCameraActive ? "Peragakan isyarat untuk memulai." : "Nyalakan kamera untuk memulai."}
                </p>
              </div>
            )}

            <div className="z-10 flex flex-wrap items-center gap-x-0.5 gap-y-1.5 w-full">
              {finalSentence.map((wordObj, idx) => (
                <Motion.div
                    key={idx}
                    layout
                    animate={shakeIndex === idx ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`relative px-2 py-1 border-2 rounded-xl flex items-center gap-2 transition-colors duration-300 ${wordObj.valid ? (isDarkMode ? 'border-transparent text-white' : 'border-transparent text-brand-text') : 'border-red-400 bg-red-500/10'}`}
                >
                  <span className={`text-4xl font-bold ${!wordObj.valid && 'text-red-500'}`}>{wordObj.text}</span>
                  {!wordObj.valid && <div className="bg-red-500/20 rounded-full p-0.5"><AlertCircle className="w-4 h-4 text-red-500" /></div>}
                </Motion.div>
              ))}

              {currentWord && (
                <Motion.div
                    layoutId="activeWord"
                    className={`relative px-2 py-1 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${isValid ? (isDarkMode ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-green-100 border-green-400 text-green-700') : (isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-gray-100 border-gray-300 text-gray-500')}`}
                >
                  <span className="text-4xl font-bold">{currentWord}</span>
                  
                  {isChecking ? (
                    <div className="bg-yellow-500/20 rounded-full p-1"><Loader2 className="w-3 h-3 text-yellow-500 animate-spin" /></div>
                  ) : isValid ? (
                    <Motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 rounded-full p-1"><Check className="w-3 h-3 text-white" strokeWidth={4} /></Motion.div>
                  ) : (
                    <div className={`rounded-full p-1 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`}><span className={`w-3 h-3 block rounded-full animate-pulse ${isDarkMode ? 'bg-slate-500' : 'bg-gray-400'}`} /></div>
                  )}

                  <div className={`absolute -bottom-5 left-0 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap ${isChecking ? 'text-yellow-600' : isValid ? 'text-green-500' : (isDarkMode ? 'text-slate-500' : 'text-gray-400')}`}>
                      {isChecking ? 'Membaca...' : isValid ? 'Valid' : 'Tidak Valid'}
                  </div>
                </Motion.div>
              )}

              {!currentWord && isCameraActive && (
                <div className="px-1 py-2 border-2 border-transparent"><span className={`w-1 h-8 block animate-pulse rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-brand-main'}`} /></div>
              )}
            </div>
          </div>

          <div className="px-8 pb-4 text-center"><p className={`text-xs italic ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>*Pastikan pencahayaan cukup terang</p></div>
          <div className={`h-20 border-t flex items-center justify-center gap-4 px-6 rounded-b-[2rem] transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <button onClick={handleReset} className={`p-3 rounded-xl border shadow-sm active:scale-95 transition-all ${isDarkMode ? 'bg-slate-800 text-red-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-red-500 border-slate-200 hover:bg-red-50'}`}><RefreshCcw className="w-6 h-6" /></button>
            <button onClick={handleSpace} className={`flex-1 py-3 rounded-xl border shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 font-bold ${isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-brand-dark border-slate-200 hover:bg-brand-light'}`}><RectangleHorizontal className="w-8 h-8" /> <span>SPASI / NEXT</span></button>
            <button onClick={handleBackspace} className={`p-3 rounded-xl border shadow-sm active:scale-95 transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-600 border-slate-200 hover:bg-gray-100'}`}><Delete className="w-6 h-6" /></button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default Terjemah;