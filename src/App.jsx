import { useState } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import "./App.css";

const EMOJIS = ["☕", "🎲", "🚀", "🌮", "🤖", "🎃", "🤔", "✅", "✌️", "🍕"];

function pickEmoji(current) {
  const choices = EMOJIS.filter((e) => e !== current);
  return choices[Math.floor(Math.random() * choices.length)];
}

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ecobos",
    icon: (
      <svg height="15" viewBox="0 0 16 16" width="15" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/edgarcobos",
    icon: (
      <svg height="15" viewBox="0 0 24 24" width="15" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function App() {
  const [bubble, setBubble] = useState(null);

  function handleMouseEnter() {
    setBubble((prev) => pickEmoji(prev));
  }

  function handleMouseLeave() {
    setBubble(null);
  }

  return (
    <>
      <AnimatedBackground />
      <main className="main">
        <div className="content">
          <div className="avatar-wrap">
            <img
              src="/images/profile_picture_clear_bg_small.png"
              alt="Edgar Cobos"
              className="avatar"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {bubble && <span className="speech-bubble">{bubble}</span>}
          </div>

          <hr className="divider" />

          <h1 className="name">Edgar Cobos</h1>

          <p className="title">Software Engineer</p>

          <p className="bio">
            First-generation Mexican-American, born and raised in Los Angeles.
            Passionate about building great products, coffee, board games, and
            thinking about where technology will take us next.
          </p>

          <p className="location">
            <svg height="13" viewBox="0 0 12 16" width="10" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"
              />
            </svg>
            Minneapolis, Minnesota
          </p>

          <nav className="links" aria-label="Social links">
            {LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </div>
      </main>
    </>
  );
}
