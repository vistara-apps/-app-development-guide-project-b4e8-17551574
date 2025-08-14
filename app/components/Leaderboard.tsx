"use client";

import { useState, useEffect } from "react";

interface PlayerStats {
  fid: string;
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
}

export function Leaderboard() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'wins' | 'winRate'>('wins');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === 'wins') {
      return b.wins - a.wins;
    }
    return b.winRate - a.winRate;
  });

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `#${index + 1}`;
    }
  };

  if (isLoading) {
    return (
      <div className="card text-center space-y-md max-w-md mx-auto">
        <div className="animate-spin text-2xl">⏳</div>
        <p className="body">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg animate-fade-in">
      <div className="text-center space-y-md">
        <div className="text-4xl">🏆</div>
        <h2 className="display text-primary">Leaderboard</h2>
        <p className="body text-text-secondary">
          Top RPS champions in the Farcaster community
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="flex justify-center space-x-2 mb-lg">
          <button
            onClick={() => setSortBy('wins')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'wins'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            Most Wins
          </button>
          <button
            onClick={() => setSortBy('winRate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'winRate'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            Best Win Rate
          </button>
        </div>

        {sortedPlayers.length === 0 ? (
          <div className="text-center py-lg">
            <div className="text-3xl mb-md">🎮</div>
            <p className="body text-text-secondary">
              No games played yet. Be the first to start!
            </p>
          </div>
        ) : (
          <div className="space-y-sm">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.fid}
                className={`player-card leaderboard ${
                  index < 3 ? 'top-three' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-md">
                    <div className="text-lg font-bold min-w-[3rem]">
                      {getRankEmoji(index)}
                    </div>
                    <div>
                      <p className="font-medium">Player {player.fid}</p>
                      <p className="caption">
                        {player.totalGames} game{player.totalGames !== 1 ? 's' : ''} played
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-md">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{player.wins}</p>
                        <p className="caption">Wins</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-500">{player.losses}</p>
                        <p className="caption">Losses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-accent">
                          {(player.winRate * 100).toFixed(0)}%
                        </p>
                        <p className="caption">Win Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card bg-primary/5 border-primary/20 max-w-lg mx-auto text-center">
        <h4 className="heading text-primary mb-md">Want to climb higher?</h4>
        <p className="body text-text-secondary mb-md">
          Challenge more players and improve your win rate!
        </p>
        <button className="btn-primary">
          Start New Game
        </button>
      </div>
    </div>
  );
}
