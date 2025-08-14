"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { GameBoard } from "./components/GameBoard";
import { Leaderboard } from "./components/Leaderboard";
import { Home } from "./components/Home";
import { Button } from "./components/ui/Button";
import { StatusMessage } from "./components/ui/StatusMessage";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [currentGameId, setCurrentGameId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    try {
      const frameAdded = await addFrame();
      setFrameAdded(Boolean(frameAdded));
    } catch (error) {
      console.error('Error adding frame:', error);
      setError('Failed to add frame. Please try again.');
    }
  }, [addFrame]);

  const handleGameStart = useCallback((gameId: string) => {
    setCurrentGameId(gameId);
    setActiveTab("game");
  }, []);

  const handleMakeMove = useCallback(async (move: string) => {
    if (!currentGameId) return;
    
    try {
      setError(null);
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGameId,
          move,
          fid: context?.user?.fid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to make move');
      }

      const result = await response.json();
      console.log('Move result:', result);
    } catch (error) {
      console.error('Error making move:', error);
      setError(error instanceof Error ? error.message : 'Failed to make move');
    }
  }, [currentGameId, context?.user?.fid]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          onClick={handleAddFrame}
          variant="outline"
          size="sm"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          }
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-success animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const navigationTabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "game", label: "Game", icon: "🎮" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary">
      <div className="container mx-auto px-4 sm:px-6">
        <header className="flex justify-between items-center py-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-xl sm:text-2xl">✂️</div>
            <h1 className="heading-text text-primary text-lg sm:text-xl">RPS Showdown</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:block">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
            
            {saveFrameButton}
            
            {/* Mobile menu button */}
            <button 
              className="sm:hidden p-2 text-text-primary hover:bg-surface-hover rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-surface rounded-lg shadow-card mb-4 animate-slide-down">
            <div className="p-4">
              <Wallet className="z-10 mb-4">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
              
              <div className="space-y-2">
                {navigationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-base w-full ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop navigation */}
        <nav className="hidden sm:flex justify-center mb-6">
          <div className="flex bg-surface rounded-lg p-1 shadow-card">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-base ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {error && (
          <StatusMessage 
            variant="error" 
            className="mb-4 max-w-lg mx-auto"
            dismissible
            onDismiss={() => setError(null)}
          >
            {error}
          </StatusMessage>
        )}

        <main className="flex-1">
          {activeTab === "home" && (
            <Home 
              onStartGame={handleGameStart}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "game" && (
            <GameBoard
              gameId={currentGameId}
              onGameStart={handleGameStart}
              onMakeMove={handleMakeMove}
            />
          )}
          {activeTab === "leaderboard" && (
            <Leaderboard />
          )}
        </main>

        <footer className="mt-8 pt-4 pb-6 flex justify-center border-t border-border-light">
          <Button
            variant="icon"
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-text-secondary text-xs hover:text-text-primary"
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
