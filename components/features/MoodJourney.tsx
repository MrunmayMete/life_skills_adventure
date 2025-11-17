import React, { useState, useEffect } from 'react';
import type { MoodEntry } from '../../types';
import { analyzeMoodHistory, analyzeSingleMoodEntry } from '../../services/geminiService';
import { Modal } from '../ui/Modal';
import { LoaderCircleIcon, SparklesIcon } from '../icons/Icons';
import { Card } from '../ui/Card';

const MoodChart: React.FC<{ data: MoodEntry[] }> = ({ data }) => {
    const sentimentColors: Record<string, string> = {
        positive: 'bg-green-400',
        neutral: 'bg-gray-400',
        negative: 'bg-red-400',
    };
    
    const sentimentHeight: Record<string, string> = {
        positive: '100%',
        neutral: '60%',
        negative: '20%',
    }

    return (
        <div className="mt-4">
             <h3 className="text-xl font-bold text-brand-dark mb-4">Your Mood Chart</h3>
            <div className="flex h-40 w-full items-end justify-around bg-gray-50 p-4 rounded-lg space-x-2">
                {data.map((entry) => (
                    <div key={entry.date} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                        <div
                            className={`w-full rounded-t-md transition-all duration-300 ${sentimentColors[entry.sentiment || 'neutral']}`}
                            style={{ height: sentimentHeight[entry.sentiment || 'neutral'] }}
                        />
                        <span className="text-2xl mt-1">{entry.emoji}</span>
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-brand-dark text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                             {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {entry.sentiment}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const MoodJourneyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [historyWithSentiment, setHistoryWithSentiment] = useState<MoodEntry[]>([]);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndAnalyzeHistory = async () => {
            setIsLoading(true);
            const storedHistory: MoodEntry[] = JSON.parse(localStorage.getItem('mood_history') || '[]');
            const recentHistory = storedHistory.slice(-15); // Analyze last 15 entries
            setHistory(recentHistory);

            // Fetch overall analysis if enough entries exist
            if (recentHistory.length >= 3) {
                const result = await analyzeMoodHistory(recentHistory);
                setAnalysis(result);
            }
            
            // Fetch individual sentiments for the chart
            if (recentHistory.length > 0) {
                 const sentimentPromises = recentHistory.map(entry => 
                    analyzeSingleMoodEntry(entry).then(sentiment => ({ ...entry, sentiment }))
                );
                const analyzedEntries = await Promise.all(sentimentPromises);
                setHistoryWithSentiment(analyzedEntries);
            }

            setIsLoading(false);
        };

        fetchAndAnalyzeHistory();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <LoaderCircleIcon className="w-12 h-12 animate-spin text-brand-purple" />
                    <p className="mt-4 text-gray-600">Reflecting on your journey...</p>
                </div>
            );
        }

        if (history.length === 0) {
            return (
                <div className="text-center p-8">
                    <h3 className="text-xl font-semibold text-brand-dark">Start Your Journey!</h3>
                    <p className="text-gray-600 mt-2">
                        Check in with your mood each day. After a few entries, you'll see your personalized mood chart and insights here!
                    </p>
                </div>
            );
        }

        return (
            <div>
                {analysis && (
                     <Card className="bg-gradient-to-br from-amber-100 to-orange-50 p-6 mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-amber-500 text-white rounded-full p-2">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-amber-900">A Quick Reflection</h3>
                                <p className="text-amber-800 mt-1">{analysis}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {historyWithSentiment.length > 0 && <MoodChart data={historyWithSentiment} />}

                <h3 className="text-xl font-bold text-brand-dark mb-4 mt-6">Your Recent Moods</h3>
                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
                    {history.slice().reverse().map((entry) => (
                        <div key={entry.date} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-4">
                            <span className="text-3xl">{entry.emoji || '😶'}</span>
                            <div className="flex-grow">
                                <p className="text-sm font-semibold text-gray-800">
                                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </p>
                                {entry.text && <p className="text-xs text-gray-500 italic">"{entry.text}"</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Your Mood Journey">
            {renderContent()}
        </Modal>
    );
};