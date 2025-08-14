"use client";

import { useState, useEffect } from "react";
import { MoveSelector } from "./MoveSelector";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { StatusMessage } from "./ui/StatusMessage";

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

type Move = "rock" | "paper" | "scissors";

export function GameBoard({ gameId, onGameStart, onMakeMove }: GameBoardProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const moves = [
    { id: "rock" as Move, name: "Rock", emoji: "🪨", beats: "scissors" },
    { id: "paper" as Move, name: "Paper", emoji: "📄", beats: "rock" },
    { id: "scissors" as Move, name: "Scissors", emoji: "✂️", beats: "paper" },
  ];

  useEffect(() => {
    if (gameId) {
      fetchGameState();
      
      // Set up polling for game state updates
      const interval = setInterval(() => {
        fetchGameState();
      }, 5000); // Poll every 5 seconds
      
      setRefreshInterval(interval);
      
      return () => {
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      };
    }
  }, [gameId]);

  const fetchGameState = async () => {
    if (!gameId) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/game/${gameId}`);
      if (response.ok) {
        const game = await response.json();
        setGameState(game);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch game state");
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
      setError("Network error. Please try again.");
    }
  };

  const handleMoveSelection = async (move: Move) => {
    setSelectedMove(move);
    setIsLoading(true);
    setError(null);
    
    try {
      await onMakeMove(move);
      await fetchGameState();
    } catch (error) {
      console.error('Error making move:', error);
      setError("Failed to make move. Please try again.");
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
    const moveData = moves.find(m => m.id === move as Move);
    return moveData ? moveData.emoji : "❓";
  };

  const getWinningMove = (): Move | null => {
    if (!gameState || gameState.status !== 'finished' || !gameState.initiatorMove || !gameState.opponentMove) {
      return null;
    }
    
    if (gameState.initiatorMove === gameState.opponentMove) {
      return null; // Tie
    }
    
    const initiatorMove = gameState.initiatorMove as Move;
    const opponentMove = gameState.opponentMove as Move;
    
    const moveData = moves.find(m => m.id === initiatorMove);
    if (moveData && moveData.beats === opponentMove) {
      return initiatorMove;
    } else {
      return opponentMove;
    }
  };

  if (!gameId) {
    return (
      <Card className="text-center space-y-lg max-w-md mx-auto animate-fade-in">
        <div className="text-4xl mb-4">🎮</div>
        <h3 className="heading-text mb-2">No Active Game</h3>
        <p className="body-text text-text-secondary mb-4">
          Start a new game from the home screen to begin playing!
        </p>
        <Button 
          variant="primary" 
          onClick={() => window.location.href = "/"}
          fullWidth
        >
          Go to Home
        </Button>
      </Card>
    );
  }

  if (!gameState) {
    return (
      <Card className="text-center space-y-md max-w-md mx-auto animate-fade-in">
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin text-2xl mr-3">⏳</div>
          <p className="body-text">Loading game...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-lg animate-fade-in">
      {error && (
        <StatusMessage 
          variant="error" 
          className="max-w-lg mx-auto mb-4"
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </StatusMessage>
      )}
      
      <Card className="text-center space-y-md max-w-lg mx-auto">
        <div className="flex justify-between items-center border-b border-border-light pb-4 mb-4">
          <h3 className="heading-text">Game #{gameState.gameId.slice(0, 8)}</h3>
          <div className="status-badge status-badge-info">
            {gameState.status === 'waiting' ? 'Waiting' : 
             gameState.status === 'playing' ? 'In Progress' : 'Finished'}
          </div>
        </div>
        
        <div className="flex justify-between items-center py-md">
          <div className="text-center space-y-sm relative">
            <div className="text-3xl mb-2 transition-all duration-base">
              {gameState.initiatorMove ? (
                <span className="animate-bounce-scale">{getMoveEmoji(gameState.initiatorMove)}</span>
              ) : (
                <span className="opacity-50">❓</span>
              )}
            </div>
            <div className="caption-text font-medium">Player {gameState.initiatorFid}</div>
            <div className="text-xs text-text-secondary mt-1">
              {gameState.initiatorMove ? (
                <span className="status-badge status-badge-success">Move made</span>
              ) : (
                <span className="status-badge">Waiting...</span>
              )}
            </div>
          </div>
          
          <div className="text-3xl text-text-secondary font-bold">VS</div>
          
          <div className="text-center space-y-sm">
            <div className="text-3xl mb-2 transition-all duration-base">
              {gameState.opponentMove ? (
                <span className="animate-bounce-scale">{getMoveEmoji(gameState.opponentMove)}</span>
              ) : (
                <span className="opacity-50">❓</span>
              )}
            </div>
            <div className="caption-text font-medium">Player {gameState.opponentFid}</div>
            <div className="text-xs text-text-secondary mt-1">
              {gameState.opponentMove ? (
                <span className="status-badge status-badge-success">Move made</span>
              ) : (
                <span className="status-badge">Waiting...</span>
              )}
            </div>
          </div>
        </div>

        {gameState.status === 'finished' && (
          <StatusMessage 
            variant={gameState.winnerFid ? "success" : "info"}
            className="mt-4"
          >
            <p className="font-medium">{getWinnerMessage()}</p>
          </StatusMessage>
        )}
      </Card>

      {gameState.status === 'playing' && (
        <Card className="max-w-lg mx-auto space-y-lg">
          <MoveSelector
            selectedMove={selectedMove}
            onMoveSelect={handleMoveSelection}
            disabled={isLoading || selectedMove !== null}
            size="lg"
          />

          {isLoading && (
            <div className="text-center animate-pulse">
              <p className="text-text-secondary">
                Submitting your move...
              </p>
            </div>
          )}
        </Card>
      )}

      {gameState.status === 'waiting' && (
        <Card className="text-center space-y-md max-w-md mx-auto">
          <div className="text-3xl mb-4 animate-pulse">⏳</div>
          <h4 className="heading-text mb-2">Waiting for Opponent</h4>
          <p className="body-text text-text-secondary mb-4">
            Share this game with your opponent to start playing!
          </p>
          <div className="flex justify-center">
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`Game ID: ${gameState.gameId}`);
                alert('Game ID copied to clipboard!');
              }}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
              }
            >
              Copy Game ID
            </Button>
          </div>
        </Card>
      )}

      {gameState.status === 'finished' && (
        <div className="text-center mt-6">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
              </svg>
            }
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
