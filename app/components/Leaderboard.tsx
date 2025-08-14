"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { StatusMessage } from "./ui/StatusMessage";

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
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'wins' | 'winRate'>('wins');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch leaderboard');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
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

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 0.7) return "text-success";
    if (winRate >= 0.5) return "text-accent";
    if (winRate >= 0.3) return "text-warning";
    return "text-error";
  };

  if (isLoading && !refreshing) {
    return (
      <Card className="text-center space-y-md max-w-md mx-auto animate-fade-in">
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin text-2xl mr-3">⏳</div>
          <p className="body-text">Loading leaderboard...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-lg animate-fade-in px-4 sm:px-0">
      <div className="text-center space-y-md">
        <div className="text-4xl animate-bounce-scale">🏆</div>
        <h2 className="display-text text-primary">Leaderboard</h2>
        <p className="body-text text-text-secondary max-w-md mx-auto">
          Top RPS champions in the Farcaster community
        </p>
      </div>

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

      <Card className="max-w-2xl mx-auto overflow-hidden">
        <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
          <h3 className="heading-text">Player Rankings</h3>
          
          <div className="flex space-x-2">
            <Button
              variant={sortBy === 'wins' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortBy('wins')}
            >
              Most Wins
            </Button>
            <Button
              variant={sortBy === 'winRate' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortBy('winRate')}
            >
              Best Win Rate
            </Button>
          </div>
        </div>

        {refreshing && (
          <div className="absolute inset-0 bg-bg/50 flex items-center justify-center z-10">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        )}

        {sortedPlayers.length === 0 ? (
          <div className="text-center py-lg">
            <div className="text-5xl mb-4 animate-bounce-scale">🎮</div>
            <p className="body-text text-text-secondary mb-4">
              No games played yet. Be the first to start!
            </p>
            <Button variant="primary">Start Playing</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.fid}
                className={`bg-surface hover:bg-surface-hover border border-border-light rounded-lg p-4 transition-all duration-base ${
                  index < 3 ? 'border-primary/20 bg-primary-light/20' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideUp 0.3s cubic-bezier(0.22,1,0.36,1) forwards'
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-xl font-bold min-w-[3rem] h-10 w-10 flex items-center justify-center rounded-full ${
                      index < 3 ? 'bg-primary text-white' : 'bg-surface-hover'
                    }`}>
                      {getRankEmoji(index)}
                    </div>
                    <div>
                      <p className="font-medium">Player {player.fid}</p>
                      <p className="caption-text">
                        {player.totalGames} game{player.totalGames !== 1 ? 's' : ''} played
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-success">{player.wins}</p>
                      <p className="caption-text">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-error">{player.losses}</p>
                      <p className="caption-text">Losses</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${getWinRateColor(player.winRate)}`}>
                        {(player.winRate * 100).toFixed(0)}%
                      </p>
                      <p className="caption-text">Win Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
              </svg>
            }
          >
            Refresh Leaderboard
          </Button>
        </div>
      </Card>

      <Card 
        variant="accent" 
        className="max-w-lg mx-auto text-center animate-slide-up"
        padding="lg"
      >
        <h4 className="heading-text text-accent-dark mb-4">Want to climb higher?</h4>
        <p className="body-text text-text-secondary mb-6">
          Challenge more players and improve your win rate!
        </p>
        <Button 
          variant="accent"
          onClick={() => window.location.href = "/"}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          }
        >
          Start New Game
        </Button>
      </Card>
    </div>
  );
}
