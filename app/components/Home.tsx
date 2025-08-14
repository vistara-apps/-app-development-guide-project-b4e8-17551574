"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface HomeProps {
  onStartGame: (gameId: string) => void;
  setActiveTab: (tab: string) => void;
}

export function Home({ onStartGame, setActiveTab }: HomeProps) {
  const router = useRouter();
  const [opponentFid, setOpponentFid] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGame = async () => {
    if (!opponentFid.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opponentFid: opponentFid.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const result = await response.json();
      onStartGame(result.gameId);
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handlePaymentClick = () => {
    router.push('/payment');
  };

  return (
    <div className="space-y-lg animate-fade-in">
      <div className="text-center space-y-md">
        <div className="text-6xl mb-md">✂️📄🗿</div>
        <h2 className="display text-primary">Welcome to RPS Showdown</h2>
        <p className="body text-text-secondary max-w-md mx-auto">
          Challenge your Farcaster friends to Rock, Paper, Scissors right in your feed. 
          Start a game and show off your skills!
        </p>
      </div>

      <div className="card max-w-md mx-auto space-y-lg">
        <h3 className="heading text-center">Start New Game</h3>
        
        <div className="space-y-md">
          <div>
            <label htmlFor="opponent" className="block caption mb-2">
              Opponent FID
            </label>
            <input
              id="opponent"
              type="text"
              value={opponentFid}
              onChange={(e) => setOpponentFid(e.target.value)}
              placeholder="Enter opponent's FID"
              className="input-field w-full"
              disabled={isCreating}
            />
          </div>
          
          <button
            onClick={handleCreateGame}
            disabled={!opponentFid.trim() || isCreating}
            className="btn-primary w-full"
          >
            {isCreating ? "Creating Game..." : "Challenge Player"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md max-w-2xl mx-auto">
        <div className="card text-center space-y-sm">
          <div className="text-3xl">🎮</div>
          <h4 className="heading">Quick Play</h4>
          <p className="caption">
            Jump into a game instantly with random opponents
          </p>
          <button 
            onClick={() => setActiveTab("game")}
            className="btn-secondary w-full"
          >
            Quick Match
          </button>
        </div>

        <div className="card text-center space-y-sm">
          <div className="text-3xl">🏆</div>
          <h4 className="heading">Leaderboard</h4>
          <p className="caption">
            Check your ranking and see top players
          </p>
          <button 
            onClick={() => setActiveTab("leaderboard")}
            className="btn-secondary w-full"
          >
            View Rankings
          </button>
        </div>

        <div className="card text-center space-y-sm">
          <div className="text-3xl">💳</div>
          <h4 className="heading">Support Us</h4>
          <p className="caption">
            Make a small donation with USDC on Base
          </p>
          <button 
            onClick={handlePaymentClick}
            className="btn-secondary w-full bg-accent/10 text-accent hover:bg-accent/20"
          >
            Make Payment
          </button>
        </div>
      </div>

      <div className="card bg-accent/5 border-accent/20 max-w-2xl mx-auto">
        <h4 className="heading text-accent mb-md">How to Play</h4>
        <div className="space-y-sm text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-accent font-bold">1.</span>
            <span>Challenge a friend by entering their FID</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-accent font-bold">2.</span>
            <span>Both players select Rock, Paper, or Scissors</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-accent font-bold">3.</span>
            <span>Winner is determined: Rock beats Scissors, Paper beats Rock, Scissors beats Paper</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-accent font-bold">4.</span>
            <span>Climb the leaderboard and earn bragging rights!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

