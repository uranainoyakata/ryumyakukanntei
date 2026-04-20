import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Lock } from 'lucide-react';

const QUESTIONS = [
  { q: "今のあなたの直感で、惹かれる色はどれですか？", c: ["神々しい黄金色", "深淵なる瑠璃色", "優美な薄紅色"] },
  { q: "ご自宅の郵便番号の「下一桁」は次のうちどれですか？", c: ["1・2・3・4", "5・6・7", "8・9・0"] },
  { q: "ふと空を見上げた時、どのような雲に目が止まりますか？", c: ["天を昇るような龍雲", "柔らかく広がる瑞雲", "渦を巻くような不思議な雲"] },
  { q: "今、あなたの心はどの状態に近いですか？", c: ["新たな挑戦へ魂を燃やしたい", "心身を清らかに癒やしたい", "滞った現状を打ち破りたい"] },
  { q: "龍神様からのメッセージを、どのように受け取りたいですか？", c: ["背中を押す力強い言葉", "優しく包み込むような愛", "ハッキリとした進むべき道"] }
];

const NUM_KANJI = ["一", "二", "三", "四", "五"];
const LINE_ID = "@576iickk"; 

const DIAGNOSIS_PATTERns = {
  A: [
    { title: "第一層：あなたの龍脈属性", content: "『青龍の波動』\nあなたの魂は、発展と成長を司る青龍と深く共鳴しています。新しい環境や挑戦において圧倒的な運気を引き寄せる状態にあります。", isRevealed: true },
    { title: "第二層：現在の運気の流れ", content: "『上昇と覚醒の兆し』\nこれまで滞りを感じていた事象が、一気に解放へと向かっています。直感に従うことで思いもよらない繋がりが生まれ、金運が連動して上昇し始めています。", isRevealed: true },
    { title: "第三層：3ヶ月以内に訪れる転換点", content: "※この内容は秘匿されています。\nまもなくあなたの人生に、これまで全く想定していなかった方向からの『運命のオファー』が訪れます。ある人物との再会が経済状況を一変させる可能性があります。", isRevealed: false },
    { title: "第四層：転換点を最大限に活かす秘伝", content: "※この内容は秘匿されています。\n転換点において最も重要なのは、特定の『言霊』を習慣づけることです。不要な人間関係のエネルギーコードを断ち切る具体的なアクションプランとして...", isRevealed: false },
    { title: "第五層：守護龍からの最終メッセージ", content: "※この内容は秘匿されています。\n「恐れることなく魂の赴くままに進め。あなたの決断はすでに宇宙の意図と合致している。我々は常に背後で風を送り続けている...」", isRevealed: false }
  ],
  B: [
    { title: "第一層：あなたの龍脈属性", content: "『白龍の波動』\nあなたの魂は、浄化と財運を司る白龍と深く共鳴しています。現在、過去のネガティブな因果を清算し、純粋な豊かさを引き寄せる準備が整いつつあります。", isRevealed: true },
    { title: "第二層：現在の運気の流れ", content: "『蓄積と開花の兆し』\nこれまで陰で努力してきたことが、形となって現れる時期に突入しました。人間関係の整理が進み、本当に必要なご縁だけが残り始めています。", isRevealed: true },
    { title: "第三層：3ヶ月以内に訪れる転換点", content: "※この内容は秘匿されています。\nあなたの元に、かつて諦めかけた夢や目標に関する『再挑戦のチャンス』が舞い込みます。この時、ある直感があなたを正しい道へと導くサインとなります。", isRevealed: false },
    { title: "第四層：転換点を最大限に活かす秘伝", content: "※この内容は秘匿されています。\n富の器を広げるためには、毎朝の『水』に関する特定の儀式が鍵となります。あなたが受け取るべき富の総量を桁違いに引き上げる空間作りとは...", isRevealed: false },
    { title: "第五層：守護龍からの最終メッセージ", content: "※この内容は秘匿されています。\n「過去の傷はすでに癒えた。今こそ両手を広げ、天からの恵みを受け取る許可を自分自身に与えよ。あなたは全てを手にする資格がある...」", isRevealed: false }
  ],
  C: [
    { title: "第一層：あなたの龍脈属性", content: "『赤龍の波動』\nあなたの魂は、情熱と勝負運を司る赤龍と深く共鳴しています。現在、内に秘められた強大なエネルギーが目覚め、あらゆる壁を打ち破る力を持っています。", isRevealed: true },
    { title: "第二層：現在の運気の流れ", content: "『激動と飛躍の兆し』\n周囲の環境が目まぐるしく変化していますが、それは大飛躍の前の準備段階です。迷いを捨てて直感で動くことで、一気に次元が上昇する波に乗っています。", isRevealed: true },
    { title: "第三層：3ヶ月以内に訪れる転換点", content: "※この内容は秘匿されています。\n全く新しいコミュニティや環境から『あなたを主役へと引き上げるオファー』が届きます。そこで出会う特定のキーマンが、あなたの才能を爆発させるでしょう。", isRevealed: false },
    { title: "第四層：転換点を最大限に活かす秘伝", content: "※この内容は秘匿されています。\nこの波に乗るためには、赤い色を身につけることと、ある『火』の要素を取り入れた習慣が不可欠です。強力な勝負運を日常に固定化する具体的な方法とは...", isRevealed: false },
    { title: "第五層：守護龍からの最終メッセージ", content: "※この内容は秘匿されています。\n「遠慮はいらない。あなたの情熱の炎で、周囲を照らし世界を変えよ。あなたが先頭に立つ時、我々はその道を黄金で埋め尽くすだろう...」", isRevealed: false }
  ]
};

function ParticleBackground() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['rgba(0, 210, 255, 0.6)', 'rgba(230, 194, 122, 0.6)'];
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 2,
      background: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up opacity-0"
          style={{
            width: `${p.width}px`,
            height: `${p.width}px`,
            background: p.background,
            boxShadow: `0 0 10px ${p.background}`,
            left: `${p.left}vw`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'loading' | 'result'>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedInQ, setSelectedInQ] = useState<number | null>(null);
  
  const lineButtonRef = useRef<HTMLDivElement>(null);

  const scrollToLineButton = () => {
    lineButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const [pattern, setPattern] = useState<'A' | 'B' | 'C'>('A');

  const startQuiz = () => {
    setScreen('quiz');
  };

  const handleSelect = (index: number) => {
    if (selectedInQ !== null) return;
    setSelectedInQ(index);
    
    setTimeout(() => {
      const nextAnswers = [...answers, index + 1];
      setAnswers(nextAnswers);
      
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedInQ(null);
      } else {
        const sum = nextAnswers.reduce((a, b) => a + b, 0);
        const selectedPattern = sum % 3 === 0 ? 'C' : sum % 2 === 0 ? 'B' : 'A';
        setPattern(selectedPattern);
        
        setScreen('loading');
        setTimeout(() => {
          setScreen('result');
        }, 3000);
      }
    }, 500);
  };

  const sendToLine = () => {
    const diagnosticCode = `RYUMYAKU-${pattern}`;
    const message = `【龍脈診断】結果を判定してください\n診断コード：${diagnosticCode}\n\n※このまま文章を送信してください`;
    const lineUrl = `https://line.me/R/oaMessage/${LINE_ID}/?${encodeURIComponent(message)}`;
    window.location.href = lineUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-y-auto">
      <ParticleBackground />

      <main className="w-full max-w-[600px] min-h-[100dvh] md:min-h-[800px] geometric-container rounded-none md:rounded-[24px] px-6 py-10 md:p-10 text-center backdrop-blur-md relative z-10 flex flex-col justify-center transition-all duration-500">
        
        {/* Progress Bar */}
        {(screen === 'quiz' || screen === 'loading') && (
          <div className="w-full h-3 bg-white/20 rounded-full mb-10 overflow-hidden">
            <motion.div 
              className="h-full bg-cyan shadow-[0_0_15px_var(--color-cyan)]"
              initial={{ width: 0 }}
              animate={{ width: `${(answers.length / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {screen === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-gold text-xl font-bold tracking-widest mb-4">【先着5名様 限定】</div>
              <h1 className="text-gold-gradient text-[2.75rem] font-extrabold tracking-widest leading-tight mb-8 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                無料<br />龍脈診断
              </h1>
              
              <div className="divider-geometric w-full h-[2px] mx-auto mb-10" />
              
              <div className="visual-frame-geometric w-full h-[240px] rounded-2xl mb-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)] z-10" />
                <div 
                  className="absolute inset-0 bg-center bg-cover opacity-70 grayscale-[30%]"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=800&auto=format&fit=crop')" }}
                />
                <div className="absolute w-[180px] h-[180px] border-[3px] border-dashed border-cyan/40 rounded-full animate-spin-right" />
                <div className="absolute w-[130px] h-[130px] border-2 border-gold/30 rounded-full animate-spin-left" />
              </div>

              <div className="text-white text-xl mb-6 font-bold tracking-wide">
                下のボタンをタップして<br className="sm:hidden" />診断を始めましょう
              </div>
              
              <button 
                onClick={startQuiz}
                className="w-full bg-gradient-to-b from-[#e6c27a] to-[#b38b36] py-6 px-10 rounded-2xl text-[26px] font-extrabold text-black cursor-pointer tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.6)] border-2 border-white/20 active:scale-95 transition-transform font-mincho"
              >
                診断をはじめる
                <span className="block text-base font-bold mt-2 opacity-80">（ここをタップ）</span>
              </button>
            </motion.div>
          )}

          {screen === 'quiz' && (
            <motion.div
              key={`quiz-${currentQ}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-8"
            >
              <div className="text-gold-mid text-xl tracking-[4px] font-bold border-b-2 border-gold-dark/50 pb-3 inline-block">
                第{NUM_KANJI[currentQ]}の問い
              </div>
              <div className="text-[28px] font-bold leading-[1.6] mb-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-2">
                {QUESTIONS[currentQ].q}
              </div>
              <div className="space-y-6 w-full">
                {QUESTIONS[currentQ].c.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-6 text-[22px] font-bold rounded-2xl border-[3px] transition-all duration-300 font-mincho shadow-[0_6px_10px_rgba(0,0,0,0.4)]
                      ${selectedInQ === idx 
                        ? 'bg-cyan/30 border-cyan text-white shadow-[0_0_25px_rgba(0,210,255,0.6)]' 
                        : 'bg-black/80 border-gold-dark/60 text-text-white hover:bg-cyan/10 hover:border-cyan hover:text-white'
                      }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full space-y-12 py-10"
            >
              <div className="relative w-[180px] h-[180px] mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-[3px] border-dashed border-cyan rounded-full animate-spin-right shadow-[0_0_30px_rgba(0,210,255,0.2)]" />
                <div className="absolute inset-[20px] border-[3px] border-gold border-t-transparent border-bottom-transparent rounded-full animate-spin-left opacity-30" />
                <div className="w-[50px] h-[50px] bg-cyan rounded-full shadow-[0_0_50px_var(--color-cyan)] animate-pulse" />
              </div>
              <div>
                <div className="text-gold-gradient text-[28px] font-bold italic mb-6 animate-text-blink">龍脈の波動を解析中...</div>
                <p className="text-xl text-cyan/90 tracking-widest font-bold break-keep">あなたの魂が青龍と共鳴しています</p>
              </div>
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center pb-12"
            >
              <h2 className="text-gold-gradient text-[32px] font-extrabold mb-6 leading-tight">鑑定結果の一部を公開</h2>
              <div className="divider-geometric w-full h-[2px] mb-10" />
              
              <div className="w-full text-left space-y-6 mb-12">
                {DIAGNOSIS_PATTERns[pattern].map((result, idx) => (
                  <div key={idx} className="bg-black/70 border-2 border-gold-dark/40 p-6 rounded-2xl relative overflow-hidden">
                    <h3 className="text-gold-mid font-black text-xl mb-4 tracking-wider border-b border-gold-dark/30 pb-3">{result.title}</h3>
                    <div className={result.isRevealed 
                      ? "text-white text-lg leading-[1.8] whitespace-pre-wrap font-mincho font-medium" 
                      : "text-white/30 text-lg leading-[1.8] whitespace-pre-wrap blur-[6px] select-none font-mincho"}>
                      {result.content}
                    </div>
                    
                    {!result.isRevealed && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10 px-4">
                        <button 
                          onClick={scrollToLineButton}
                          className="bg-navy-dark border-2 border-cyan px-8 py-5 rounded-2xl flex flex-col items-center gap-3 shadow-[0_0_30px_rgba(0,210,255,0.3)] w-full text-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        >
                           <Lock className="w-10 h-10 text-cyan mb-2" />
                           <span className="text-cyan font-bold tracking-widest text-xl mb-2">この続きはLINEで<br className="sm:hidden" />無料公開中！</span>
                           <span className="text-white text-base bg-cyan/20 px-6 py-2 rounded-full w-full border border-cyan/50">続きを読む ▼</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-navy-dark border-[3px] border-cyan p-6 rounded-2xl text-[17px] text-cyan/90 leading-relaxed font-bold w-full mb-10 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                すべての鑑定結果を受け取るには、下の大きな緑のボタンをタップして公式LINEにお進みください。
                <span className="text-white text-[15px] opacity-90 mt-4 block p-3 bg-black/50 rounded-xl leading-normal">※LINE画面が開いたら、入力されている文字をそのまま送信してください</span>
              </div>
              
              <div className="w-full sticky bottom-4 z-50" ref={lineButtonRef}>
                <button 
                  onClick={sendToLine}
                  className="bg-[#06C755] w-full flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl text-white font-extrabold transition-all hover:scale-[1.02] active:scale-95 font-mincho shadow-[0_15px_30px_rgba(0,0,0,0.9)] border-4 border-white/20"
                >
                  <div className="flex items-center justify-center gap-4 text-[26px]">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.55 8.945 8.441 9.615.333.076.772.235.885.539.102.274.033.7.016.892-.023.255-.106.634.428.406.533-.228 2.879-1.696 3.935-2.894 1.341-.532 12.3-3.087 12.3-8.558z"/>
                    </svg>
                    完全版をLINEで読む
                  </div>
                  <span className="text-lg opacity-90">（ここをタップして進む）</span>
                </button>
                <div className="mt-6 text-sm text-white/50 tracking-widest uppercase">
                  公式アカウントID: @576iickk
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
