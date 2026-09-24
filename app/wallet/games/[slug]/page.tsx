"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { GAMES, getGame, monogram } from "../data";
import {
  DownloadIcon,
  PlusIcon,
  CopyIcon,
  CheckIcon,
  LockIcon,
} from "../../icons";

type Progress = {
  downloaded: boolean;
  funded: boolean;
  user: string;
  pass: string;
};

function StepBadge({ n, done, active }: { n: number; done: boolean; active: boolean }) {
  return (
    <span
      className={styles.stepBadge}
      style={!done && !active ? { background: "#cbd0d6" } : undefined}
    >
      {done ? <CheckIcon /> : n}
    </span>
  );
}

export default function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const game = getGame(slug) ?? GAMES[0];
  const key = `sl_game_${slug}`;

  const [progress, setProgress] = useState<Progress | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // load or create persisted per-game progress + credentials
  useEffect(() => {
    let p: Progress | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) p = JSON.parse(raw) as Progress;
    } catch {
      /* ignore */
    }
    if (!p) {
      const rnd = Math.floor(1000 + Math.random() * 8999);
      const pass = Math.random().toString(36).slice(2, 8).toUpperCase();
      p = {
        downloaded: false,
        funded: false,
        user: `SL_${slug.replace(/-/g, "")}_${rnd}`,
        pass,
      };
    }
    setProgress(p);
  }, [key, slug]);

  const save = (next: Progress) => {
    setProgress(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const copy = async (text: string, k: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(k);
      setTimeout(() => setCopied((c) => (c === k ? null : c)), 1600);
    } catch {
      /* ignore */
    }
  };

  if (!progress) {
    return (
      <div className={styles.screen}>
        <InnerHeader title="Set up game" fallback="/wallet/games" />
      </div>
    );
  }

  const { downloaded, funded } = progress;
  const unlocked = downloaded && funded;

  const download = () => save({ ...progress, downloaded: true });
  const addFunds = () => {
    if (downloaded) save({ ...progress, funded: true });
    router.push("/wallet/add-funds");
  };

  return (
    <div className={styles.screen}>
      <InnerHeader title="Set up game" fallback="/wallet/games" />

      <div className={styles.body}>
        <div className={styles.gameHero}>
          <span className={styles.gameHeroMark} style={{ background: game.bg }}>
            {monogram(game.name)}
          </span>
          <div>
            <div className={styles.gameHeroName}>
              {game.name}
              {game.hot && (
                <span className={styles.hotBadge} style={{ position: "static" }}>
                  🔥 Hot
                </span>
              )}
            </div>
            <div className={styles.gameHeroMeta}>
              <span className={styles.gTag}>{game.genre}</span>
              <span>
                <span className={styles.star}>★</span> {game.rating}
              </span>
              <span>· {game.players} playing</span>
            </div>
          </div>
        </div>

        <p className={styles.formIntro} style={{ marginTop: 4 }}>
          Follow these 3 steps to start playing {game.name}.
        </p>

        {/* Step 1 — download */}
        <div className={styles.setupStep}>
          <StepBadge n={1} done={downloaded} active />
          <div className={styles.stepBody}>
            <h3>Download the app</h3>
            <p>
              Install the {game.name} app to play. Allow installs from your
              browser if prompted.
            </p>
            <button className={styles.downloadBtn} onClick={download}>
              <DownloadIcon />
              {downloaded ? (
                "Downloaded — reinstall"
              ) : (
                <span>
                  Download APK <small>· Android</small>
                </span>
              )}
            </button>
            <div className={styles.dlMeta}>
              <span>v3.2.1</span> · <span>48 MB</span> · <span>Android 8+</span>
            </div>
          </div>
        </div>

        {/* Step 2 — add funds */}
        <div className={styles.setupStep}>
          <StepBadge n={2} done={funded} active={downloaded} />
          <div className={styles.stepBody}>
            <h3>Add funds to the game</h3>
            <p>
              {downloaded
                ? "Load credits from your SL Sweep balance so you're ready to play."
                : "Finish step 1 first, then load credits to play."}
            </p>
            <button
              className={styles.secondaryBtn}
              onClick={addFunds}
              disabled={!downloaded}
              style={!downloaded ? { opacity: 0.5, cursor: "default" } : undefined}
            >
              <PlusIcon /> {funded ? "Add more funds" : "Add funds"}
            </button>
          </div>
        </div>

        {/* Step 3 — credentials */}
        <div className={styles.setupStep}>
          <StepBadge n={3} done={unlocked} active={unlocked} />
          <div className={styles.stepBody}>
            <h3>Your login &amp; password</h3>
            <p>Use these to sign in to the {game.name} app.</p>

            {unlocked ? (
              <>
                <div className={styles.credField}>
                  <div className={styles.credInfo}>
                    <div className={styles.credLabel}>Username</div>
                    <div className={styles.credValue}>{progress.user}</div>
                  </div>
                  <button className={styles.copyMini} onClick={() => copy(progress.user, "u")}>
                    {copied === "u" ? <CheckIcon /> : <CopyIcon />}
                    {copied === "u" ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className={styles.credField}>
                  <div className={styles.credInfo}>
                    <div className={styles.credLabel}>Password</div>
                    <div className={styles.credValue}>{progress.pass}</div>
                  </div>
                  <button className={styles.copyMini} onClick={() => copy(progress.pass, "p")}>
                    {copied === "p" ? <CheckIcon /> : <CopyIcon />}
                    {copied === "p" ? "Copied" : "Copy"}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.lockedNote}>
                <LockIcon />
                Complete steps 1 &amp; 2 to unlock your login details.
              </div>
            )}
          </div>
        </div>

        <button
          className={styles.btnBlock}
          style={{ marginTop: 22 }}
          disabled={!unlocked}
          onClick={() => router.push("/wallet/add-funds")}
        >
          {unlocked ? "Play now" : "Complete the steps above"}
        </button>
      </div>
    </div>
  );
}
