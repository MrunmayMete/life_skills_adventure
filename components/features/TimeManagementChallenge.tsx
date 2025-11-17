import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { TimeManagementTask } from '../../types';
import { generateTimeManagementTasks } from '../../services/geminiService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LoaderCircleIcon, TimerIcon, CheckCircleIcon } from '../icons/Icons';

type ChallengeStage = 'selection' | 'estimation' | 'timing' | 'finished';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TimeManagementChallengeModal: React.FC<{ onClose: () => void; onActionComplete: () => void; }> = ({ onClose, onActionComplete }) => {
    const [stage, setStage] = useState<ChallengeStage>('selection');
    const [tasks, setTasks] = useState<TimeManagementTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<TimeManagementTask | null>(null);
    const [userEstimate, setUserEstimate] = useState<string>('');
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            const fetchedTasks = await generateTimeManagementTasks();
            setTasks(fetchedTasks);
            setIsLoading(false);
        };
        fetchTasks();
    }, []);
    
    useEffect(() => {
        if (stage === 'finished') {
            onActionComplete();
        }
    }, [stage, onActionComplete]);

    useEffect(() => {
        let interval: number;
        if (isTimerRunning && timerSeconds > 0) {
            interval = window.setInterval(() => {
                setTimerSeconds(prev => prev - 1);
            }, 1000);
        } else if (timerSeconds === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setStage('finished');
        }
        return () => window.clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);
    
    const handleTaskSelect = (task: TimeManagementTask) => {
        setSelectedTask(task);
        setStage('estimation');
    };

    const handleStartChallenge = (e: React.FormEvent) => {
        e.preventDefault();
        const minutes = parseInt(userEstimate, 10);
        if (minutes > 0) {
            const challengeTime = Math.floor(minutes * 60 * 0.9);
            setTimerSeconds(challengeTime);
            setInitialTime(challengeTime);
            setStage('timing');
            setIsTimerRunning(true);
        }
    };
    
    const handleFinishEarly = () => {
        setIsTimerRunning(false);
        setStage('finished');
    };
    
    const handleReset = () => {
        setIsTimerRunning(false);
        setStage('selection');
        setSelectedTask(null);
        setUserEstimate('');
        setTimerSeconds(0);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <LoaderCircleIcon className="w-12 h-12 animate-spin text-brand-purple" />
                    <p className="mt-4 text-gray-600">Loading new challenges...</p>
                </div>
            );
        }

        switch (stage) {
            case 'selection':
                return (
                    <div>
                        <p className="text-center text-gray-600 mb-6">Choose a task to start your challenge!</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                            {tasks.map(task => (
                                <button key={task.name} onClick={() => handleTaskSelect(task)} className="p-4 border rounded-lg text-center hover:bg-gray-100 hover:shadow-md transition-all transform hover:scale-105">
                                    <span className="text-4xl">{task.emoji}</span>
                                    <p className="mt-2 font-semibold">{task.name}</p>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{task.category}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            
            case 'estimation':
                return (
                    <div className="text-center">
                        <div className="mb-6">
                            <span className="text-6xl">{selectedTask?.emoji}</span>
                            <h3 className="text-2xl font-bold mt-2">{selectedTask?.name}</h3>
                        </div>
                        <form onSubmit={handleStartChallenge}>
                            <label htmlFor="time-estimate" className="block text-gray-700 font-semibold mb-2">How many minutes do you think this will take?</label>
                            <input
                                id="time-estimate"
                                type="number"
                                value={userEstimate}
                                onChange={(e) => setUserEstimate(e.target.value)}
                                placeholder="e.g., 10"
                                className="w-full max-w-xs mx-auto p-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple text-xl"
                                required
                                min="1"
                            />
                            <Button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600">
                                Start the Challenge!
                            </Button>
                        </form>
                    </div>
                );

            case 'timing':
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-700">{selectedTask?.name}</h3>
                        <div className="my-8">
                            <p className="text-7xl font-bold font-mono text-brand-dark tabular-nums">{formatTime(timerSeconds)}</p>
                            <p className="text-gray-500">Time Remaining</p>
                        </div>
                        <div className="space-y-3">
                            <Button onClick={handleFinishEarly} className="w-full bg-brand-purple hover:bg-brand-purple/90">
                                I'm Done!
                            </Button>
                            <Button onClick={() => setIsTimerRunning(!isTimerRunning)} variant="secondary" className="w-full">
                                {isTimerRunning ? 'Pause' : 'Resume'}
                            </Button>
                             <Button onClick={handleReset} variant="secondary" className="w-full bg-red-100 text-red-700 hover:bg-red-200">
                                Start Over
                            </Button>
                        </div>
                    </div>
                );

            case 'finished':
                const timeRemaining = timerSeconds > 0 ? initialTime - timerSeconds : 0;
                return (
                     <div className="text-center">
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-brand-dark">Challenge Complete!</h3>
                        {timerSeconds > 0 ? (
                           <p className="text-gray-600 mt-2">Awesome work! You finished the task in {formatTime(timeRemaining)}.</p>
                        ) : (
                           <p className="text-gray-600 mt-2">Great effort! Time's up, but you did it.</p>
                        )}
                        <Button onClick={handleReset} className="w-full mt-8 bg-brand-purple hover:bg-brand-purple/90">
                            Try Another Challenge
                        </Button>
                    </div>
                );
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Time Master Challenge">
            {renderContent()}
        </Modal>
    );
};