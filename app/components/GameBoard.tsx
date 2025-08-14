"use client";

import { useState, useEffect } from "react";

interface GameBoardProps {
  gameId?: string;
  onGameStart: (gameId: string) => void;
  onMakeMove: (move: string) => void;
}

interface GameState {
  gameId: string;
  initiatorFid: string;
  opponentFid: string;
  initiatorMove?: string;
  opponentMove?: string;
  status: 'waiting' | 'playing' | 'finished';
  winnerFid?: string;
}

export function GameBoard({ gameId, onGameStart, onMakeMove }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedMove, setSelectedMove] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const moves = [
    { id: "rock", name: "Rock", emoji: "🗿", beats: "scissors" },
    { id: "paper", name: "Paper", emoji: "📄", beats: "rock" },
    { id: "scissors", name: "Scissors", emoji: "✂️", beats: "paper" },
  ];

  useEffect(() => {
    if (gameId) {
      fetchGameState();
    }
  }, [gameId]);

  const fetchGameState = async () => {
    if (!gameId) return;
    
    try {
      const response = await fetch(`/api/game/${gameId}`);
      if (response.ok) {
        const game = await response.json();
        setGameState(game);
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const handleMoveSelection = async (move: string) => {
    setSelectedMove(move);
    setIsLoading(true);
    
    try {
      await onMakeMove(move);
      await fetchGameState();
    } catch (error) {
      console.error('Error making move:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWinnerMessage = () => {
    if (!gameState || gameState.status !== 'finished') return "";
    
    if (!gameState.winnerFid) return "It's a tie! 🤝";
    
    return `Player ${gameState.winnerFid} wins! 🎉`;
  };

  const getMoveEmoji = (move?: string) => {
    const moveData = moves.find(m => m.id === move);
    return moveData ? moveData.emoji : "❓";
  };

  if (!gameId) {
    return (
      <div className="card text-center space-y-lg max-w-md mx-auto">
        <div className="text-4xl">🎮</div>
        <h3 className="heading">No Active Game</h3>
        <p className="body text-text-secondary">
          Start a new game from the home screen to begin playing!
        </p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="card text-center space-y-md max-w-md mx-auto">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="body">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg animate-fade-in">
      <div className="card text-center space-y-md max-w-lg mx-auto">
        <h3 className="heading">Game #{gameState.gameId.slice(0, 8)}</h3>
        
        <div className="flex justify-between items-center py-md">
          <div className="text-center space-y-sm">
            <div className="text-2xl">{getMoveEmoji(gameState.initiatorMove)}</div>
            <p className="caption">Player {gameState.initiatorFid}</p>
            <p className="text-xs text-text-secondary">
              {gameState.initiatorMove ? "Move made" : "Waiting..."}
            </p>
          </div>
          
          <div className="text-3xl text-text-secondary">VS</div>
          
          <div className="text-center space-y-sm">
            <div className="text-2xl">{getMoveEmoji(gameState.opponentMove)}</div>
            <p className="caption">Player {gameState.opponentFid}</p>
            <p className="text-xs text-text-secondary">
              {gameState.opponentMove ? "Move made" : "Waiting..."}
            </p>
          </div>
        </div>

        {gameState.status === 'finished' && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-md">
            <p className="heading text-accent">{getWinnerMessage()}</p>
          </div>
        )}
      </div>

      {gameState.status === 'playing' && (
        <div className="card max-w-lg mx-auto space-y-lg">
          <h4 className="heading text-center">Choose Your Move</h4>
          
          <div className="grid grid-cols-3 gap-md">
            {moves.map((move) => (
              <button
                key={move.id}
                onClick={() => handleMoveSelection(move.id)}
                disabled={isLoading || selectedMove !== ""}
                className={`move-selector ${move.id} ${
                  selectedMove === move.id ? "selected" : ""
                }`}
              >
                <div className="text-4xl mb-2">{move.emoji}</div>
                <div className="font-medium">{move.name}</div>
              </button>
            ))}
          </div>

          {selectedMove && (
            <div className="text-center">
              <p className="caption text-accent">
                You selected {moves.find(m => m.id === selectedMove)?.name}!
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Waiting for opponent...
              </p>
            </div>
          )}
        </div>
      )}

      {gameState.status === 'waiting' && (
        <div className="card text-center space-y-md max-w-md mx-auto">
          <div className="text-3xl">⏳</div>
          <h4 className="heading">Waiting for Opponent</h4>
          <p className="body text-text-secondary">
            Share this game with your opponent to start playing!
          </p>
        </div>
      )}

      {gameState.status === 'finished' && (
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
