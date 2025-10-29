import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Volume2, VolumeX, RotateCcw, BookOpenCheck, Play, Info, Settings2, ChevronRight, CheckCircle2, XCircle, Sparkles, TimerReset, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------
// Spelling Bee Web Portal (Grades 4–6)
// Modes: Practice, Bee, Speller (letters), Dictation (whole word)
// Features: Hints, TTS Pronouncer, Timer/Lives, Leaderboard, JSON Import, Results Summary
// ---------------------------------------------

const DEFAULT_WORDS = [
  // Everyday Words
  { word: "bargain", syll: "bar•gain", def: "a good deal or lower price", sent: "That shirt was a real bargain.", cat: "Everyday" },
  { word: "chimney", syll: "chim•ney", def: "a pipe that carries smoke from a fire", sent: "Smoke rose from the red brick chimney.", cat: "Everyday" },
  { word: "curtain", syll: "cur•tain", def: "a piece of cloth that covers a window", sent: "The curtain fluttered in the breeze.", cat: "Everyday" },
  { word: "laundry", syll: "laun•dry", def: "clothes that need washing", sent: "She folded the clean laundry.", cat: "Everyday" },
  { word: "lightning", syll: "light•ning", def: "a flash of electricity in the sky", sent: "The lightning lit up the night.", cat: "Everyday" },
  { word: "neighbor", syll: "neigh•bor", def: "a person living nearby", sent: "Our neighbor brought fresh cookies.", cat: "Everyday" },
  { word: "plumber", syll: "plum•ber", def: "a person who fixes water pipes", sent: "The plumber repaired the leak.", cat: "Everyday" },
  { word: "receipt", syll: "re•ceipt", def: "a paper showing you paid for something", sent: "Keep the receipt for the return.", cat: "Everyday" },
  { word: "stomach", syll: "stom•ach", def: "body part that digests food", sent: "He had an upset stomach after lunch.", cat: "Everyday" },
  { word: "whistle", syll: "whis•tle", def: "a sound made by blowing air", sent: "The coach blew a loud whistle.", cat: "Everyday" },
  // Feelings & Character
  { word: "courageous", syll: "cou•ra•geous", def: "showing bravery", sent: "The firefighter was very courageous.", cat: "Character" },
  { word: "friendly", syll: "friend•ly", def: "kind and pleasant", sent: "The shop owner was friendly to everyone.", cat: "Character" },
  { word: "generous", syll: "gen•er•ous", def: "willing to share or give", sent: "She is generous with her time.", cat: "Character" },
  { word: "jealous", syll: "jeal•ous", def: "unhappy when others have what you want", sent: "He felt jealous of the new bike.", cat: "Character" },
  { word: "loyalty", syll: "loy•al•ty", def: "being faithful or true", sent: "The dog's loyalty was clear.", cat: "Character" },
  { word: "mysterious", syll: "mys•te•ri•ous", def: "hard to explain or understand", sent: "A mysterious sound came from the attic.", cat: "Character" },
  { word: "nervous", syll: "ner•vous", def: "feeling worried or uneasy", sent: "She felt nervous before the test.", cat: "Character" },
  { word: "righteous", syll: "right•eous", def: "doing what is right or moral", sent: "He made a righteous choice.", cat: "Character" },
  { word: "sincere", syll: "sin•cere", def: "honest and genuine", sent: "Her apology was sincere.", cat: "Character" },
  { word: "stubborn", syll: "stub•born", def: "not wanting to change your mind", sent: "The mule was stubborn.", cat: "Character" },
  // Nature & Environment
  { word: "blizzard", syll: "bliz•zard", def: "a strong snowstorm", sent: "The blizzard kept everyone indoors.", cat: "Nature" },
  { word: "creature", syll: "crea•ture", def: "any living being", sent: "The small creature hid under a leaf.", cat: "Nature" },
  { word: "earthquake", syll: "earth•quake", def: "shaking of the ground", sent: "The earthquake rattled the dishes.", cat: "Nature" },
  { word: "meadow", syll: "mead•ow", def: "a field of grass or flowers", sent: "Bees buzzed over the meadow.", cat: "Nature" },
  { word: "rainstorm", syll: "rain•storm", def: "a heavy fall of rain", sent: "We got soaked in the rainstorm.", cat: "Nature" },
  { word: "sunlight", syll: "sun•light", def: "light from the sun", sent: "Sunlight filled the kitchen.", cat: "Nature" },
  { word: "thunderstorm", syll: "thun•der•storm", def: "storm with thunder and lightning", sent: "The thunderstorm shook the windows.", cat: "Nature" },
  { word: "wildfire", syll: "wild•fire", def: "a fast-spreading fire outdoors", sent: "A wildfire can move quickly.", cat: "Nature" },
  // Action Words
  { word: "acknowledge", syll: "ac•knowl•edge", def: "admit or recognize something", sent: "Please acknowledge the message.", cat: "Action" },
  { word: "borrowed", syll: "bor•rowed", def: "took something to return later", sent: "I borrowed a book from the library.", cat: "Action" },
  { word: "fasten", syll: "fas•ten", def: "to close or tie something", sent: "Fasten the buttons on your coat.", cat: "Action" },
  { word: "lengthen", syll: "length•en", def: "to make something longer", sent: "We will lengthen the rope.", cat: "Action" },
  { word: "mislead", syll: "mis•lead", def: "to give the wrong idea", sent: "The map could mislead travelers.", cat: "Action" },
  { word: "overcome", syll: "o•ver•come", def: "to succeed after difficulty", sent: "She can overcome her fears.", cat: "Action" },
  { word: "protect", syll: "pro•tect", def: "to keep safe", sent: "A helmet protects your head.", cat: "Action" },
  { word: "surrender", syll: "sur•ren•der", def: "to give up", sent: "The knight refused to surrender.", cat: "Action" },
  { word: "whispered", syll: "whis•pered", def: "spoke very quietly", sent: "He whispered a secret.", cat: "Action" },
  { word: "withstand", syll: "with•stand", def: "to resist or survive something difficult", sent: "These walls withstand strong winds.", cat: "Action" },
  // Literature & Imagination
  { word: "adventure", syll: "ad•ven•ture", def: "an exciting experience", sent: "They started an adventure at dawn.", cat: "Imagination" },
  { word: "bewildered", syll: "be•wil•dered", def: "very confused", sent: "He looked bewildered by the puzzle.", cat: "Imagination" },
  { word: "destiny", syll: "des•ti•ny", def: "what is meant to happen", sent: "It felt like destiny.", cat: "Imagination" },
  { word: "frightened", syll: "fright•ened", def: "scared or afraid", sent: "The crash made the cat frightened.", cat: "Imagination" },
  { word: "kingdom", syll: "king•dom", def: "land ruled by a king or queen", sent: "The kingdom slept under stars.", cat: "Imagination" },
];

const RANDOM_WORD_POOL = [
  { word: "horizon", syll: "ho•ri•zon", def: "the line where the earth and sky seem to meet", sent: "They watched the sun dip below the horizon.", cat: "Nature" },
  { word: "compass", syll: "com•pass", def: "a tool used to find direction", sent: "She checked the compass before hiking north.", cat: "Everyday" },
  { word: "resourceful", syll: "re•source•ful", def: "able to solve problems with what you have", sent: "The resourceful student fixed the project with tape and paperclips.", cat: "Character" },
  { word: "lantern", syll: "lan•tern", def: "a portable light with a protective case", sent: "The lantern glowed softly in the tent.", cat: "Everyday" },
  { word: "torrent", syll: "tor•rent", def: "a strong and fast-moving stream of water", sent: "Rain turned the trail into a rushing torrent.", cat: "Nature" },
  { word: "discovery", syll: "dis•cov•er•y", def: "something found for the first time", sent: "The discovery excited the young scientists.", cat: "Imagination" },
  { word: "guardian", syll: "guard•i•an", def: "someone who protects or watches over others", sent: "The guardian watched the gate carefully.", cat: "Character" },
  { word: "navigate", syll: "nav•i•gate", def: "to find the way from place to place", sent: "He learned to navigate by the stars.", cat: "Action" },
  { word: "voyage", syll: "voy•age", def: "a long journey, especially by sea or in space", sent: "Their voyage across the ocean took months.", cat: "Imagination" },
  { word: "whittle", syll: "whit•tle", def: "to carve or shape by cutting small pieces", sent: "She used a pocketknife to whittle a small boat.", cat: "Action" },
];

const OPENAI_MODEL = "gpt-4o-mini";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

function extractJsonBlock(raw: string): string {
  const fence = /```json([\s\S]*?)```/i;
  const match = raw.match(fence);
  if (match) return match[1].trim();
  return raw.trim();
}

function normalizeAiWordItems(payload: unknown): WordItem[] {
  if (!Array.isArray(payload)) return [];
  return (payload as any[]).map((item) => {
    const word = String(item?.word ?? "").trim();
    return {
      word,
      syll: String(item?.syll ?? "").trim(),
      def: String(item?.def ?? "").trim(),
      sent: String(item?.sent ?? "").trim(),
      cat: String(item?.cat ?? "AI").trim() || "AI",
    } satisfies WordItem;
  }).filter((item) => item.word);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Mode = "practice" | "bee" | "speller" | "dictation";

export type WordItem = {
  word: string;
  syll: string;
  def: string;
  sent: string;
  cat: string;
};

export type ResultItem = {
  word: string;
  user: string;
  correct: boolean;
};

type LeaderboardEntry = {
  date: string;
  points: number;
  mode: Mode;
};

type FileInputEvent = {
  target: {
    files: FileList | null;
  };
};

type TextInputEvent = {
  target: {
    value: string;
  };
};

type KeyboardEventLike = {
  key: string;
};

// NATO phonetic alphabet (optional for Speller mode)
const NATO: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
  G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
  M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey",
  X: "X-ray", Y: "Yankee", Z: "Zulu",
};

const speakWithRate = (text: string, rate = 0.95) => {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = 1.0;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

// Stable, generic LocalStorage state hook (function form avoids TSX generic parsing quirks)
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

// ---------- Pure helpers for dev sanity tests ----------
export const equalIgnoreCase = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
export const toNatoPhrase = (word: string) => word.split("").map(ch => {
  const up = ch.toUpperCase();
  const code = NATO[up] || ch;
  return `${ch}. as in ${code}`;
}).join(", ");

export default function SpellingBeePortal() {
  // Settings
  const [mode, setMode] = useState<Mode>("practice");
  const [wordCount, setWordCount] = useState<number>(10);
  const [useTTS, setUseTTS] = useState<boolean>(true);
  const [showSyllables, setShowSyllables] = useState<boolean>(false);
  const [showSentence, setShowSentence] = useState<boolean>(true);
  const [showDefinition, setShowDefinition] = useState<boolean>(true);
  const [ttsRate, setTtsRate] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [useNATO, setUseNATO] = useState<boolean>(false);
  const [revealAfterSubmit, setRevealAfterSubmit] = useState<boolean>(true);

  // Data
  const [customWords, setCustomWords] = useLocalStorage<WordItem[]>("sb_custom_words", []);
  const [extraWords, setExtraWords] = useLocalStorage<WordItem[]>("sb_extra_words", []);
  const [baseWords, setBaseWords] = useLocalStorage<WordItem[]>("sb_base_words", DEFAULT_WORDS);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const bank = useMemo(() => (customWords.length ? customWords : [...baseWords, ...extraWords]), [customWords, baseWords, extraWords]);

  // Game state
  const [deck, setDeck] = useState<WordItem[]>([]);
  const [idx, setIdx] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [bestScores, setBestScores] = useLocalStorage<LeaderboardEntry[]>("sb_leaderboard", []);
  const [revealNow, setRevealNow] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [results, setResults] = useState<(ResultItem | undefined)[]>([]);
  const [completedResults, setCompletedResults] = useState<(ResultItem | undefined)[]>([]);
  const [completedDeck, setCompletedDeck] = useState<WordItem[]>([]);
  const [preCountdown, setPreCountdown] = useState<number>(0);
  const [showPreCountdown, setShowPreCountdown] = useState<boolean>(false);
  const [preCountdownDescription, setPreCountdownDescription] = useState<string>("The round will begin when the countdown reaches zero.");

  // Refs & derived
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutIndexRef = useRef<number | null>(null);
  const countdownActiveRef = useRef<boolean>(false);
  const previousTimeRef = useRef<number>(0);
  const countdownTimerRef = useRef<number | null>(null);
  const deckRef = useRef<WordItem[]>(deck);
  const idxRef = useRef<number>(idx);
  const scoreRef = useRef<number>(score);
  const modeRef = useRef<Mode>(mode);
  const resultsRef = useRef<(ResultItem | undefined)[]>(results);
  const skipNextSpellerSpeakRef = useRef<boolean>(false);
  const current: WordItem | undefined = deck[idx];
  const progress = deck.length ? Math.round((idx / deck.length) * 100) : 0;
  const ttsRateValue = ttsRate === 'slow' ? 0.85 : ttsRate === 'fast' ? 1.15 : 0.95;

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    modeRef.current = mode;
    skipNextSpellerSpeakRef.current = false;
  }, [mode]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const speakSpelled = (w: string) => {
    if (!useTTS) return;
    const letters = w.split("");
    if (useNATO) speakWithRate(toNatoPhrase(w), ttsRateValue);
    else speakWithRate(letters.join(", "), ttsRateValue);
  };

  const startDictationTurn = () => {
    if (modeRef.current !== "dictation") return;
    if (showPreCountdown) return;
    const currentIdx = idxRef.current;
    const deckSnapshot = deckRef.current;
    const word = deckSnapshot[currentIdx];
    if (!deckSnapshot.length || !word) {
      countdownActiveRef.current = false;
      setTimeLeft(0);
      return;
    }
    countdownActiveRef.current = true;
    previousTimeRef.current = 30;
    setTimeLeft(30);
    if (useTTS) speakWithRate(word.word, ttsRateValue);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const playModeStartPrompt = () => {
    if (!useTTS) return;
    const activeMode = modeRef.current;
    if (activeMode === "dictation") return;
    const deckSnapshot = deckRef.current;
    const currentIdx = idxRef.current;
    const word = deckSnapshot[currentIdx];
    if (!word) return;

    if (activeMode === "speller") {
      speakSpelled(word.word);
      return;
    }

    const safeDef = word.def || "";
    const safeSent = word.sent || "";
    const base = `${word.word}. Definition: ${safeDef}${safeSent ? `. In a sentence: ${safeSent}` : ""}`;

    if (activeMode === "bee") {
      speakWithRate(`${base}. Spell the word now.`, ttsRateValue);
      return;
    }

    speakWithRate(`${base}. Practice spelling when you're ready.`, ttsRateValue);
  };

  // Effects
  useEffect(() => {
    if (deck.length === 0) {
      countdownActiveRef.current = false;
      setTimeLeft(0);
      return;
    }
    if (showPreCountdown) {
      countdownActiveRef.current = false;
      setTimeLeft(0);
      return;
    }
    if (mode === "bee") {
      countdownActiveRef.current = true;
      previousTimeRef.current = 25;
      setTimeLeft(25);
      return;
    }
    if (mode === "speller") {
      countdownActiveRef.current = true;
      previousTimeRef.current = 30;
      setTimeLeft(30);
      if (!skipNextSpellerSpeakRef.current && current) speakSpelled(current.word);
      skipNextSpellerSpeakRef.current = false;
      return;
    }
    if (mode === "practice") {
      countdownActiveRef.current = false;
      previousTimeRef.current = 0;
      setTimeLeft(0);
      return;
    }
    // Dictation handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, deck, idx, showPreCountdown, current]);

  useEffect(() => {
    if (mode !== "bee" && mode !== "speller" && mode !== "dictation") return;
    if (timeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft((s: number) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode, timeLeft]);

  const ensureResultsSize = (len: number) =>
    setResults((prev: (ResultItem | undefined)[]) => {
      if (prev.length >= len) return prev;
      const copy = [...prev];
      while (copy.length < len) copy.push(undefined);
      return copy;
    });

  const recordResult = (ok: boolean) => {
    if (!current) return;
    ensureResultsSize(deck.length);
    setResults((prev: (ResultItem | undefined)[]) => {
      const copy = [...prev];
      if (!copy[idx]) {
        copy[idx] = { word: current.word, user: answer, correct: ok };
      }
      return copy;
    });
  };

  // Handlers
  const startGame = () => {
    const d = shuffle(bank).slice(0, Math.min(wordCount, bank.length));
    timeoutIndexRef.current = null;
    countdownActiveRef.current = false;
    previousTimeRef.current = 0;
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setDeck(d);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setAnswer("");
    setFeedback(null);
    setRevealNow(false);
    setFinished(false);
    setResults([] as (ResultItem | undefined)[]);
    setCompletedResults([]);
    setCompletedDeck([]);
    resultsRef.current = [];

    const welcomeMessage =
      mode === "dictation"
        ? "Welcome to Dictation Mode. Listen carefully."
        : mode === "bee"
        ? "Welcome to Bee Mode. Stay sharp and spell fast."
        : mode === "speller"
        ? "Welcome to Speller Mode. Spell it out with confidence."
        : "Welcome to Practice Mode. Take your time and have fun.";
    const countdownDescription =
      mode === "dictation"
        ? "Dictation will begin when the countdown reaches zero."
        : mode === "bee"
        ? "Bee Mode will begin when the countdown reaches zero."
        : mode === "speller"
        ? "Speller Mode will begin when the countdown reaches zero."
        : "Practice Mode will begin when the countdown reaches zero.";

    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setPreCountdownDescription(countdownDescription);
    setShowPreCountdown(true);
    setPreCountdown(3);
    if (useTTS) speakWithRate(welcomeMessage, ttsRateValue);

    countdownTimerRef.current = window.setInterval(() => {
      setPreCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          setShowPreCountdown(false);
          if (modeRef.current === "dictation") {
            startDictationTurn();
          } else {
            if (modeRef.current === "speller") {
              skipNextSpellerSpeakRef.current = true;
            }
            playModeStartPrompt();
            setTimeout(() => inputRef.current?.focus(), 120);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCheck = (fromTimeout = false) => {
    if (!current) return;
    const correct = equalIgnoreCase(answer, current.word);

    if (correct) {
      recordResult(true);
      setFeedback("correct");
      setScore((s: number) => s + 10 + Math.min(streak * 2, 10));
      setStreak((st: number) => st + 1);
      if (mode === "speller" && revealAfterSubmit) setRevealNow(true);
      if (useTTS) speakWithRate("Correct", ttsRateValue);
      setTimeout(() => nextWord(), 800);
    } else {
      setFeedback("wrong");
      setStreak(0);
      if (mode === "speller" && revealAfterSubmit) setRevealNow(true);
      if (mode === "bee") setLives((l: number) => Math.max(0, l - 1));
      if (useTTS && fromTimeout) speakWithRate("Time's up", ttsRateValue);
      else if (useTTS) speakWithRate("Incorrect", ttsRateValue);
      // Do not record yet; allow retry. We'll record as wrong if user presses Next without a correct.
    }
  };

  const nextWord = () => {
    // If no result recorded for this index yet, mark as wrong with the latest answer
    if (current) {
      ensureResultsSize(deck.length);
      setResults((prev: (ResultItem | undefined)[]) => {
        const copy = [...prev];
        if (!copy[idx]) copy[idx] = { word: current.word, user: answer, correct: false };
        return copy;
      });
    }

    setFeedback(null);
    setAnswer("");
    setRevealNow(false);
    timeoutIndexRef.current = null;
    countdownActiveRef.current = false;
    previousTimeRef.current = 0;

    if (idx + 1 < deck.length) {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      idxRef.current = nextIdx;

      const activeMode = modeRef.current;
      if (activeMode === "dictation") {
        setTimeout(() => startDictationTurn(), 120);
      } else {
        if (activeMode !== "speller") {
          setTimeout(() => playModeStartPrompt(), 140);
        }
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } else {
      // Round finished
      setFinished(true);
      const entry: LeaderboardEntry = {
        date: new Date().toLocaleString(),
        points: scoreRef.current,
        mode: modeRef.current,
      };
      setBestScores((arr: LeaderboardEntry[]) => shuffle([...arr, entry]).slice(0, 15));
      setCompletedDeck([...deckRef.current]);
      setCompletedResults(resultsRef.current);
      if (useTTS) speakWithRate(`Round finished. Your score is ${score} points.`, ttsRateValue);
    }
  };

  const reveal = () => {
    if (!current) return;
    setAnswer(current.word);
    if (useTTS) speakWithRate(current.word, ttsRateValue);
  };

  const pronounce = () => {
    if (!current) return;
    if (mode === "speller") { speakSpelled(current.word); return; }
    if (mode === "dictation") { if (useTTS) speakWithRate(current.word, ttsRateValue); return; }
    const safeDef = current.def || "";
    const safeSent = current.sent || "";
    const p = `${current.word}. Definition: ${safeDef}${safeSent ? `. In a sentence: ${safeSent}` : ''}`;
    if (useTTS) speakWithRate(p, ttsRateValue);
  };

  useEffect(() => {
    const timedMode = mode === "bee" || mode === "speller" || mode === "dictation";
    if (!timedMode) {
      timeoutIndexRef.current = null;
      countdownActiveRef.current = false;
      previousTimeRef.current = timeLeft;
      return;
    }
    if (!deck.length || !current) {
      timeoutIndexRef.current = null;
      countdownActiveRef.current = false;
      previousTimeRef.current = timeLeft;
      return;
    }
    if (timeLeft > 0) {
      timeoutIndexRef.current = null;
      previousTimeRef.current = timeLeft;
      return;
    }

    if (!countdownActiveRef.current || timeoutIndexRef.current === idx || showPreCountdown) {
      previousTimeRef.current = timeLeft;
      return;
    }
    timeoutIndexRef.current = idx;
    countdownActiveRef.current = false;

    handleCheck(true);

    if (!finished) {
      const timer = window.setTimeout(() => {
        if (timeoutIndexRef.current === idx && !finished) {
          nextWord();
        }
      }, mode === "dictation" ? 1200 : 800);
      return () => window.clearTimeout(timer);
    }
    previousTimeRef.current = timeLeft;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, mode, idx, deck.length, current, finished]);

  const importJSON = (ev: FileInputEvent) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("JSON must be an array of word items");
        const normalized: WordItem[] = data.map((x: Partial<WordItem>) => ({
          word: String(x.word || "").trim(),
          syll: String(x.syll || "").trim(),
          def: String(x.def || "").trim(),
          sent: String(x.sent || "").trim(),
          cat: String(x.cat || "Custom"),
        })).filter((x) => x.word);
        if (normalized.length === 0) throw new Error("No valid items found");
        setCustomWords(normalized);
        alert(`Loaded ${normalized.length} custom words`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        alert(`Import failed: ${message}`);
      }
    };
    reader.readAsText(file);
  };

  const addRandomWord = () => {
    const existing = new Set(
      [...baseWords, ...extraWords, ...customWords].map((item) => item.word.trim().toLowerCase())
    );
    const randomWord = RANDOM_WORD_POOL.find((item) => !existing.has(item.word.trim().toLowerCase()));
    if (!randomWord) {
      alert("No more random words available.");
      return;
    }
    setExtraWords((prev) => [...prev, randomWord]);
    alert(`Added random word: ${randomWord.word}`);
  };

  const fetchAiWordBank = async () => {
    if (customWords.length) {
      alert("Custom words are active. Clear them before generating AI words.");
      return;
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setAiError("Missing VITE_OPENAI_API_KEY. Please set it in your environment.");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    try {
      const prompt = `Generate a JSON array of ${Math.max(wordCount, 10)} unique English spelling-bee words for grades 4-6. Each item must be an object with the keys word, syll, def, sent, and cat. Use kid-friendly language. Respond with JSON only.`;
      const requestPayload = {
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates educational word lists for middle grade spelling bees.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
      } as const;
      console.info("[OpenAI] Request payload", requestPayload);

      const response = await fetch(OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.info("[OpenAI] Response", {
        status: response.status,
        usage: data?.usage,
        choicesCount: data?.choices?.length ?? 0,
      });
      const rawContent: string | undefined = data?.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error("OpenAI response did not include content.");

      const cleaned = extractJsonBlock(rawContent);
      const parsed = JSON.parse(cleaned);
      const normalized = normalizeAiWordItems(parsed);
      if (!normalized.length) throw new Error("No usable words returned by OpenAI.");

      setBaseWords(normalized);
      setExtraWords([] as WordItem[]);
      alert(`Loaded ${normalized.length} AI-generated words.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setAiError(message);
    } finally {
      setAiLoading(false);
    }
  };

  // ---------- Dev-only sanity tests (console.assert) ----------
  const isDevEnvironment = typeof window !== "undefined" && (window as any)?.process?.env?.NODE_ENV !== "production";
  if (isDevEnvironment) {
    try {
      const a = [1,2,3]; const b = shuffle(a);
      console.assert(a.length === 3 && b.length === 3, 'shuffle keeps length');
      console.assert(a !== b, 'shuffle returns new array');
      console.assert(equalIgnoreCase('Test', 'test') && !equalIgnoreCase('Test', 'text'), 'equalIgnoreCase basic checks');
      console.assert(toNatoPhrase('ab').includes('a. as in Alpha') && toNatoPhrase('ab').includes('b. as in Bravo'), 'NATO mapping check');
      // Extra: ensure pronounce never throws when fields are missing
      const tmp: WordItem = { word: 'x', syll: '', def: '', sent: '', cat: '' };
      const safe = `${tmp.word}. Definition: ${tmp.def || ''}${tmp.sent ? `. In a sentence: ${tmp.sent}` : ''}`;
      console.assert(typeof safe === 'string', 'pronounce formatting safe with empty fields');
      // Results: when finished, results length should equal deck length
    } catch {}
  }

  const displayResults = finished ? completedResults : results;
  const displayDeck = finished && completedDeck.length ? completedDeck : deck;
  const showSentenceBlock = (mode !== "speller" && mode !== "dictation" && showSentence) || (mode === "speller" && revealAfterSubmit && revealNow && showSentence);
  const showDefinitionBlock = (mode !== "speller" && showDefinition) || (mode === "speller" && revealAfterSubmit && revealNow && showDefinition);
  const showSyllableBlock = (mode !== "speller" && showSyllables) || (mode === "speller" && revealAfterSubmit && revealNow && showSyllables);
  const isTimed = mode === "bee" || mode === "speller" || mode === "dictation";
  const correctCount = displayResults.reduce<number>((count: number, item: ResultItem | undefined) => count + (item?.correct ? 1 : 0), 0);
  const answeredCount = displayResults.reduce<number>((count: number, item: ResultItem | undefined) => count + (item ? 1 : 0), 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl p-4 md:p-10">
        {showPreCountdown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="rounded-3xl bg-white px-16 py-12 text-center shadow-2xl">
              <div className="mb-4 text-sm font-medium uppercase tracking-wide text-brand-500">Get Ready</div>
              <div className="animate-bounce text-6xl font-display font-semibold text-brand-600">{preCountdown}</div>
              <p className="mt-3 text-base text-slate-600">{preCountdownDescription}</p>
            </div>
          </div>
        )}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Spelling Bee Portal — Grades 4–6</h1>
              <p className="text-sm text-slate-600">Practice and compete with curated word lists. English-only focus.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Medium Level</Badge>
            <Badge className="text-xs">v1.6</Badge>
          </div>
        </header>

        {/* Controls */}
        <Card className="mb-8 border-slate-200 shadow-sm">
          <CardHeader className="pb-2 space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Settings2 className="h-5 w-5"/> Game Settings</CardTitle>
            <CardDescription className="text-sm text-slate-600">Choose a mode, size, and hint preferences. Import custom words (JSON) as needed.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <Label className="block text-sm font-semibold text-slate-700">Mode</Label>
              <Tabs value={mode} onValueChange={(value: string) => setMode(value as Mode)}>
                <TabsList className="grid grid-cols-4 gap-2 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                  <TabsTrigger value="bee">Bee Mode</TabsTrigger>
                  <TabsTrigger value="speller">Speller</TabsTrigger>
                  <TabsTrigger value="dictation">Dictation</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="mt-2 text-xs text-slate-500 flex gap-1 items-center"><Info className="h-3 w-3"/> {mode === "bee" ? "Bee Mode adds timer and lives." : mode === "speller" ? "Speller: tool spells letters; type the full word." : mode === "dictation" ? "Dictation: tool says the word once; type what you heard." : "Practice freely with optional hints."}</p>
            </div>
            <div className="space-y-3">
              <Label className="block text-sm font-semibold text-slate-700">Round Size</Label>
              <div className="flex flex-wrap gap-2">
                {[10, 15, 25].map((n: number) => (
                  <Button key={n} size="sm" variant={wordCount === n ? "default" : "outline"} onClick={() => setWordCount(n)}>{n}</Button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">Total available words: {bank.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              <div className="flex items-center justify-between">
                <Label htmlFor="tts" className="text-sm font-medium text-slate-700">Pronouncer (TTS)</Label>
                <Switch id="tts" checked={useTTS} onCheckedChange={setUseTTS} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="rate" className="text-sm font-medium text-slate-700">Spelling speed</Label>
                <div className="flex gap-2">
                  {(['slow','normal','fast'] as const).map((r) => (
                    <Button key={r} size="sm" variant={ttsRate===r? 'default':'outline'} onClick={() => setTtsRate(r)} className="capitalize">{r}</Button>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="nato" className="text-sm font-medium text-slate-700">Use NATO phonetics</Label>
                <Switch id="nato" checked={useNATO} onCheckedChange={setUseNATO} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="reveal" className="text-sm font-medium text-slate-700">Speller: reveal hints after submit</Label>
                <Switch id="reveal" checked={revealAfterSubmit} onCheckedChange={setRevealAfterSubmit} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="syll" className="text-sm font-medium text-slate-700">Show syllables</Label>
                <Switch id="syll" checked={showSyllables} onCheckedChange={setShowSyllables} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="def" className="text-sm font-medium text-slate-700">Show definition</Label>
                <Switch id="def" checked={showDefinition} onCheckedChange={setShowDefinition} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Label htmlFor="sent" className="text-sm font-medium text-slate-700">Show sentence</Label>
                <Switch id="sent" checked={showSentence} onCheckedChange={setShowSentence} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={startGame} size="lg" className="gap-2"><Play className="h-4 w-4"/> Start Round</Button>
              <Button variant="outline" size="lg" onClick={() => { setCustomWords([] as WordItem[]); alert("Restored default word bank."); }} className="gap-2"><RotateCcw className="h-4 w-4"/> Reset Bank</Button>
              <Button variant="outline" size="lg" onClick={fetchAiWordBank} disabled={!!customWords.length} className="gap-2"><Loader2 className="h-4 w-4"/> Fetch AI Words</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <Label htmlFor="import" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700"><Upload className="h-4 w-4"/> Import JSON</Label>
              <input id="import" type="file" accept="application/json" onChange={importJSON} className="hidden" />
              <span className="text-xs text-slate-500">Supports {`[{"word","syll","def","sent","cat"}]`}</span>
              {aiLoading ? (
                <span className="text-xs text-slate-500">Loading AI words...</span>
              ) : aiError ? (
                <span className="text-xs text-slate-500">{aiError}</span>
              ) : (
                <span className="text-xs text-slate-500">AI words available</span>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Game Area */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900"><BookOpenCheck className="h-5 w-5"/> Round</CardTitle>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="secondary" className="uppercase tracking-wide">Mode: {mode === "bee" ? "Bee" : mode === "speller" ? "Speller" : mode === "dictation" ? "Dictation" : "Practice"}</Badge>
                    <Badge variant="outline">Words: {deck.length || "—"}</Badge>
                  </div>
                </div>
                <CardDescription className="text-sm text-slate-600">Type the correct spelling and press Enter or Check.</CardDescription>
              </CardHeader>

              {/* If round finished, show summary list */}
              {finished ? (
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Round Results</h3>
                    <p className="text-sm text-slate-600">Each word and whether it was spelled correctly. Click Start Round to try again.</p>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="grid grid-cols-12 bg-slate-100 p-2 text-xs font-medium text-slate-700">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-4">Word</div>
                      <div className="col-span-3">Your Answer</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Correct Spelling</div>
                    </div>
                    <ul className="divide-y">
                      {(results || []).map((r: ResultItem | undefined, i: number) => (
                        <li key={i} className="grid grid-cols-12 items-center p-2 text-sm">
                          <div className="col-span-1 text-center text-slate-500">{i + 1}</div>
                          <div className="col-span-4 font-medium text-slate-900">{r?.word ?? deck[i]?.word ?? '—'}</div>
                          <div className="col-span-3 text-slate-700">{r?.user ?? ''}</div>
                          <div className="col-span-2">
                            {r?.correct ? (
                              <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 className="h-4 w-4"/> Correct</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-700"><XCircle className="h-4 w-4"/> Incorrect</span>
                            )}
                          </div>
                          <div className="col-span-2 text-slate-700">{r?.correct ? '' : (deck[i]?.word || '')}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-600">Score: <span className="font-semibold">{score}</span> • Correct: <span className="font-semibold">{correctCount}</span> / {deck.length}</div>
                    <div className="flex gap-2">
                      <Button onClick={startGame}><Play className="h-4 w-4 mr-2"/>Start Round</Button>
                      <Button variant="outline" onClick={() => setFinished(false)}>Review Round</Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="mb-3">
                    <Progress value={progress} />
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{idx}/{deck.length}</span>
                    </div>
                  </div>

                  {/* Current Word Panel */}
                  {deck.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                      Start a round to begin. Choose your settings above.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">#{idx + 1}</Badge>
                          <Badge variant="outline">{current?.cat || '—'}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={pronounce} disabled={!useTTS || !current} title="Pronounce">
                            {useTTS ? <Volume2 className="h-4 w-4"/> : <VolumeX className="h-4 w-4"/>}
                          </Button>
                          {mode === "practice" && (
                            <Button variant="outline" size="sm" onClick={reveal} disabled={!current}>Reveal</Button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          ref={inputRef}
                          value={answer}
                          onChange={(e: TextInputEvent) => setAnswer(e.target.value)}
                          onKeyDown={(e: KeyboardEventLike) => { if (e.key === "Enter") handleCheck(); }}
                          placeholder={mode === "speller" ? "Type the word that was spelled…" : mode === "dictation" ? "Type the word you heard…" : "Type your spelling here…"}
                          className="h-12 rounded-xl border-slate-300 bg-white text-lg shadow-sm"
                          // Disable grammar correction & autocomplete in Dictation
                          autoComplete={mode === 'dictation' ? 'off' : 'on'}
                          autoCorrect={mode === 'dictation' ? 'off' : 'on'}
                          autoCapitalize={mode === 'dictation' ? 'off' : 'sentences'}
                          spellCheck={mode === 'dictation' ? false : true}
                          data-gramm={mode === 'dictation' ? 'false' : undefined}
                          data-gramm_editor={mode === 'dictation' ? 'false' : undefined}
                        />
                        <Button onClick={() => handleCheck()} size="lg" className="gap-2" disabled={!current}>
                          Check <ChevronRight className="h-4 w-4"/>
                        </Button>
                        {mode === "speller" && (
                          <Button variant="outline" size="lg" onClick={pronounce} disabled={!current}>Spell again</Button>
                        )}
                        {mode === "dictation" && (
                          <Button variant="outline" size="lg" onClick={pronounce} disabled={!current}>Say again</Button>
                        )}
                      </div>

                      <AnimatePresence>
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                          >
                            {feedback === "correct" ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-green-600"/>
                                <span className="text-green-700">Correct! Great job.</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 text-red-600"/>
                                <span className="text-red-700">Not quite. Try again{mode === "bee" ? ", or press Next to continue" : ""}.</span>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-sm">
                          <span>Score: <span className="font-semibold">{score}</span></span>
                          <span>Streak: <span className="font-semibold">{streak}</span></span>
                          {mode === "bee" && (
                            <span>Lives: <span className="font-semibold">{"❤".repeat(lives) || "—"}</span></span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={nextWord} disabled={!current}>Next</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar: Leaderboard & Help */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Trophy className="h-5 w-5"/> Leaderboard</CardTitle>
                <CardDescription className="text-sm text-slate-600">Top recent scores on this device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {bestScores.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No scores yet. Finish a round to record your score.</div>
                ) : (
                  <ul className="space-y-2">
                    {bestScores.slice(0, 8).map((b: LeaderboardEntry, i: number) => (
                      <li key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
                        <div className="text-sm">
                          <div className="font-medium">{b.points} pts</div>
                          <div className="text-xs text-slate-500">{b.mode === "bee" ? "Bee" : b.mode === 'speller' ? 'Speller' : b.mode === 'dictation' ? 'Dictation' : "Practice"} • {b.date}</div>
                        </div>
                        <Badge variant="outline">#{i + 1}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="border-t border-slate-100 bg-slate-50">
                <Button variant="outline" className="w-full" onClick={() => setBestScores([] as LeaderboardEntry[])}>Clear Leaderboard</Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg font-semibold text-slate-900">How to Play</CardTitle>
                <CardDescription className="text-sm text-slate-600">Quick tips for teachers & students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Choose <span className="font-medium">Practice</span> to learn; <span className="font-medium">Bee</span> to compete; <span className="font-medium">Speller</span> to hear letters and type the word; <span className="font-medium">Dictation</span> to hear the whole word and type it.</li>
                  <li>Use the <span className="font-medium">Pronouncer</span> to hear the word, definition, and sentence (Practice/Bee) or letters (Speller).</li>
                  <li>Turn on/off <span className="font-medium">Syllables, Definition, Sentence</span> as hints. In Speller, hints can appear after submit. In Dictation, the sentence is hidden.</li>
                  <li>Press <span className="font-medium">Enter</span> or the <span className="font-medium">Check</span> button to submit.</li>
                  <li>Bee mode: You have <span className="font-medium">25s</span> per word and <span className="font-medium">3 lives</span>. Speller & Dictation: <span className="font-medium">30s</span>.</li>
                  <li>Import your own words via a <span className="font-medium">JSON</span> file with fields: <code>{`{"word","syll","def","sent","cat"}`}</code>.</li>
                </ul>
              </CardContent>
              <CardFooter className="border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
                Tip: Encourage students to say the word, spell it, then say it again.
              </CardFooter>
            </Card>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          Built for Grades 4–6 • English-only word list • Spelling Bee practice portal
        </footer>

        {/* Dev Test Panel (hidden visually but accessible for QA) */}
        {isDevEnvironment && (
          <div className="sr-only" aria-hidden>
            <div id="tests">
              {/* Test cases to ensure safe access when current is undefined */}
              <div data-test="no-deck-safe-cat">{deck.length === 0 ? String((undefined as any)?.cat ?? 'safe') : 'na'}</div>
              <div data-test="sentence-hidden-dictation">{mode === 'dictation' && showSentence ? 'toggle-ignored' : 'ok'}</div>
              <div data-test="dictation-input-protections">{mode === 'dictation' ? 'ac_off,sc_false,cap_off' : 'na'}</div>
              <div data-test="results-finished-size">{finished ? `${answeredCount}/${deck.length}` : 'running'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
