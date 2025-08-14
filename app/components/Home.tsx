"use client";

import { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { StatusMessage } from "./ui/StatusMessage";

interface HomeProps {
  onStartGame: (gameId: string) => void;
  setActiveTab: (tab: string) => void;
}

export function Home({ onStartGame, setActiveTab }: HomeProps) {
  const [opponentFid, setOpponentFid] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateGame = async () => {
    if (!opponentFid.trim()) return;
    
    setIsCreating(true);
    setError(null);
    
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create game');
      }

      const result = await response.json();
      setSuccess("Game created successfully!");
      setTimeout(() => {
        onStartGame(result.gameId);
      }, 1000);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(error instanceof Error ? error.message : 'Failed to create game');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-lg animate-fade-in px-4 sm:px-0">
      <div className="text-center space-y-md">
        <div className="text-5xl sm:text-6xl mb-md flex justify-center space-x-2">
          <span className="animate-bounce-scale inline-block" style={{ animationDelay: '0ms' }}>✂️</span>
          <span className="animate-bounce-scale inline-block" style={{ animationDelay: '200ms' }}>📄</span>
          <span className="animate-bounce-scale inline-block" style={{ animationDelay: '400ms' }}>🪨</span>
        </div>
        <h2 className="display-text text-primary text-3xl sm:text-4xl">Welcome to RPS Showdown</h2>
        <p className="body-text text-text-secondary max-w-md mx-auto px-4 sm:px-0">
          Challenge your Farcaster friends to Rock, Paper, Scissors right in your feed. 
          Start a game and show off your skills!
        </p>
      </div>

      {error && (
        <StatusMessage 
          variant="error" 
          className="max-w-md mx-auto"
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </StatusMessage>
      )}

      {success && (
        <StatusMessage 
          variant="success" 
          className="max-w-md mx-auto"
        >
          {success}
        </StatusMessage>
      )}

      <Card className="max-w-md mx-auto space-y-lg">
        <h3 className="heading-text text-center">Start New Game</h3>
        
        <div className="space-y-md">
          <div>
            <label htmlFor="opponent" className="input-label">
              Opponent FID
            </label>
            <input
              id="opponent"
              type="text"
              value={opponentFid}
              onChange={(e) => setOpponentFid(e.target.value)}
              placeholder="Enter opponent's FID"
              className="input-field"
              disabled={isCreating}
              aria-describedby="opponent-hint"
            />
            <p id="opponent-hint" className="text-xs text-text-secondary mt-1">
              Enter the Farcaster ID of the player you want to challenge
            </p>
          </div>
          
          <Button
            onClick={handleCreateGame}
            disabled={!opponentFid.trim() || isCreating}
            variant="primary"
            fullWidth
            isLoading={isCreating}
          >
            Challenge Player
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Card className="text-center space-y-sm card-hover interactive" onClick={() => setActiveTab("game")}>
          <div className="text-3xl mb-2">🎮</div>
          <h4 className="subheading-text mb-1">Quick Play</h4>
          <p className="caption-text mb-4">
            Jump into a game instantly with random opponents
          </p>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("game");
            }}
            variant="secondary"
            fullWidth
          >
            Quick Match
          </Button>
        </Card>

        <Card className="text-center space-y-sm card-hover interactive" onClick={() => setActiveTab("leaderboard")}>
          <div className="text-3xl mb-2">🏆</div>
          <h4 className="subheading-text mb-1">Leaderboard</h4>
          <p className="caption-text mb-4">
            Check your ranking and see top players
          </p>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("leaderboard");
            }}
            variant="secondary"
            fullWidth
          >
            View Rankings
          </Button>
        </Card>
      </div>

      <Card 
        variant="accent" 
        className="max-w-2xl mx-auto"
      >
        <h4 className="heading-text text-accent-dark mb-4">How to Play</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <span className="text-accent-dark font-bold mr-2 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent-light">1</span>
            <span>Challenge a friend by entering their FID</span>
          </div>
          <div className="flex items-start">
            <span className="text-accent-dark font-bold mr-2 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent-light">2</span>
            <span>Both players select Rock, Paper, or Scissors</span>
          </div>
          <div className="flex items-start">
            <span className="text-accent-dark font-bold mr-2 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent-light">3</span>
            <span>Winner is determined: Rock beats Scissors, Paper beats Rock, Scissors beats Paper</span>
          </div>
          <div className="flex items-start">
            <span className="text-accent-dark font-bold mr-2 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-accent-light">4</span>
            <span>Climb the leaderboard and earn bragging rights!</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
