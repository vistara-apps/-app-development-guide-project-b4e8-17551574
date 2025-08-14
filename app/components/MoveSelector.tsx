"use client";

import { useState } from "react";

type Move = "rock" | "paper" | "scissors";

interface MoveSelectorProps {
  selectedMove?: Move | null;
  onMoveSelect: (move: Move) => void;
  disabled?: boolean;
  showResult?: boolean;
  winningMove?: Move | null;
  size?: "sm" | "md" | "lg";
}

const moveEmojis = {
  rock: "🪨",
  paper: "📄", 
  scissors: "✂️"
};

const moveLabels = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors"
};

const moveDescriptions = {
  rock: "Crushes scissors",
  paper: "Covers rock",
  scissors: "Cuts paper"
};

export function MoveSelector({ 
  selectedMove, 
  onMoveSelect, 
  disabled = false,
  showResult = false,
  winningMove,
  size = "md"
}: MoveSelectorProps) {
  const [hoveredMove, setHoveredMove] = useState<Move | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-20 h-20 text-2xl",
    lg: "w-24 h-24 text-3xl"
  };

  const containerSizeClasses = {
    sm: "space-y-3",
    md: "space-y-4",
    lg: "space-y-6"
  };

  const labelSizeClasses = {
    sm: "space-x-6",
    md: "space-x-8",
    lg: "space-x-10"
  };

  return (
    <div className={`${containerSizeClasses[size]} animate-fade-in`}>
      <div className="heading-text text-center">
        {showResult ? "Game Result" : "Choose Your Move"}
      </div>
      
      <div className="flex justify-center space-x-4">
        {(["rock", "paper", "scissors"] as const).map((move) => (
          <button
            key={move}
            className={`move-button ${sizeClasses[size]} ${
              selectedMove === move ? "selected" : ""
            } ${
              showResult && winningMove === move ? "winner" : ""
            }`}
            onClick={() => onMoveSelect(move)}
            disabled={disabled || showResult}
            onMouseEnter={() => setHoveredMove(move)}
            onMouseLeave={() => setHoveredMove(null)}
            aria-label={moveLabels[move]}
            aria-pressed={selectedMove === move}
            aria-disabled={disabled || showResult}
          >
            <span className="transform transition-transform duration-base" 
              style={{ 
                transform: hoveredMove === move && !disabled && !showResult 
                  ? 'scale(1.1)' 
                  : 'scale(1)' 
              }}
            >
              {moveEmojis[move]}
            </span>
          </button>
        ))}
      </div>
      
      <div className={`flex justify-center ${labelSizeClasses[size]} caption-text`}>
        <span>Rock</span>
        <span>Paper</span>
        <span>Scissors</span>
      </div>
      
      {hoveredMove && !disabled && !showResult && (
        <div className="text-center text-sm text-text-secondary animate-fade-in mt-2">
          {moveDescriptions[hoveredMove]}
        </div>
      )}
      
      {selectedMove && !showResult && (
        <div className="text-center text-sm text-primary font-medium animate-slide-up mt-2">
          You selected {moveLabels[selectedMove]}
        </div>
      )}
      
      {showResult && winningMove && (
        <div className="text-center text-success font-medium animate-slide-up mt-2">
          {moveLabels[winningMove]} wins!
        </div>
      )}
      
      {showResult && !winningMove && (
        <div className="text-center text-text-secondary font-medium animate-slide-up mt-2">
          It's a tie!
        </div>
      )}
    </div>
  );
}
