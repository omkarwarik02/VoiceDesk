import logo from "../../assets/voicedesk.png";


export default function Footer(){
    return (
        <footer className="mt-10 px-5 pb-10 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 border-t border-line pt-8 text-center text-sm text-muted md:flex-row md:justify-between md:text-left">
         <img src={logo} alt="VoiceDesk" className="h-10 w-auto" />
            <p>Built by Omkar Warik</p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                <a
            href="https://github.com/omkarwarik02/VoiceDesk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center  hover:bg-white/5"
          >
        GitHub
          </a>
              <a
            href="https://www.linkedin.com/in/omkar-warik-/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:bg-white/5"
          >
        LinkedIn
          </a>
            <a
            href="https://x.com/OmkarWarik2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:bg-white/5"
          >
        X
          </a>
           <a
            href="https://www.omkarwarik.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:bg-white/5"
          >
        Portfolio
          </a>
           <a
            href="/privacy.html"
            className="inline-flex items-center hover:bg-white/5"
          >
        Privacy
          </a>
            </div>
             
          <p>React . Express . LangGraph . Postgres . Groq</p>
            </div>  

        </footer>
    )
}