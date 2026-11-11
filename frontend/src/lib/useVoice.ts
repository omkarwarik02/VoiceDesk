import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { useEffect, useRef, useState } from "react";

export function useVoice() {
  const containerRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {

   
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#f8fafc",
      height: 40,
      progressColor: "#f8fafc",
      cursorWidth: 0
    });
     const record = ws.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      }),
      
    );
    recordRef.current = record;

    return () =>{
        ws.destroy();
        recordRef.current = null;
    }
    
  }, []);
   async function start(){
         await recordRef.current?.startRecording()
        setRecording(true);
    }

    function stop(): Promise<Blob>{
      return new Promise((resolve, reject) =>{
        const record = recordRef.current;
        if(!record) return reject(new Error("Recorder is not ready"));

        record.once("record-end",(blob:Blob) =>{
            record.stopMic();
            setRecording(false);
            resolve(blob);
        });
        record.stopRecording();
      })
    }

  return { containerRef, recording , start, stop};
}
