import Groq, {toFile} from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({ apiKey:env.GROQ_API_KEY});

export async function transcribe(buffer:Buffer, filename:string):Promise<string>{
    const file = await toFile(buffer, filename);

    const result = await groq.audio.transcriptions.create({
        file,
        model:"whisper-large-v3-turbo",
        prompt:"Hinglish shop notes in English letters: order, advance, delivery, ready, cards, banner, kal, parso, kitna, dikhao.",
    });
    return result.text.trim();
}