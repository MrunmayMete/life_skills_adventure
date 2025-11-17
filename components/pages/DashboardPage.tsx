import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { Activity, Story, MoodEntry, DailyGoal } from '../../types';
import { generateStory } from '../../services/geminiService';
import { Header } from '../ui/Header';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CommunityVolunteeringModal } from '../features/CommunityVolunteering';
import { TimeManagementChallengeModal } from '../features/TimeManagementChallenge';
import { CirclesModal } from '../features/Circles';
import { CalendarModal } from '../features/AcademicCalendar';
import { MoodJourneyModal } from '../features/MoodJourney';
import { WelcomeModal } from '../features/WelcomeModal';
import { GoalSetterModal } from '../features/GoalSetterModal';
import { BookOpenIcon, MessageSquareHeartIcon, ZapIcon, LoaderCircleIcon, AwardIcon, HeartHandshakeIcon, TimerIcon, UsersIcon, CalendarIcon, SmilePlusIcon, ShareIcon, RefreshCwIcon, LockIcon, TargetIcon, CheckIcon } from '../icons/Icons';

const UNLOCK_THRESHOLDS = {
    TIME_CHALLENGE: 3,
    CALENDAR: 5,
    CIRCLES: 7,
};

// Define components outside parent to prevent re-renders
const CommunicationActivities: React.FC = () => {
    const activities: Activity[] = [
        {
            title: "Homework Huddle",
            description: "Chat with a friend about your homework. Ask what they think about an assignment.",
            icon: <BookOpenIcon className="w-8 h-8 text-white" />
        },
        {
            title: "Dinner Debrief",
            description: "Share one interesting thing you learned today with your family at dinner.",
            icon: <MessageSquareHeartIcon className="w-8 h-8 text-white" />
        },
        {
            title: "Compliment Quest",
            description: "Give a genuine compliment to someone today. Notice how it makes them (and you!) feel.",
            icon: <AwardIcon className="w-8 h-8 text-white" />
        },
        {
            title: "Active Listener",
            description: "When someone talks to you, try to summarize what they said before you reply. It shows you're really listening!",
            icon: <ZapIcon className="w-8 h-8 text-white" />
        }
    ];

    return (
         <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-brand-dark">Communication Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activities.map((activity, index) => (
                    <Card key={index} className="group bg-gradient-to-br from-brand-teal to-green-400 text-white p-6 flex flex-col items-center text-center animate-slide-in-up transition-transform transform hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="bg-white/20 p-3 rounded-full mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">{activity.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
                        <p className="text-sm opacity-90">{activity.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
};

const StoryGenerator: React.FC<{username: string; onActionComplete: () => void; onGoToChallenges: () => void;}> = ({ username, onActionComplete, onGoToChallenges }) => {
    const [story, setStory] = useState<Story | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [canShare, setCanShare] = useState(false);

    useEffect(() => {
        if (navigator.share) {
            setCanShare(true);
        }
    }, []);

    const handleGenerateStory = useCallback(async () => {
        setIsLoading(true);
        setStory(null);
        setIsModalOpen(true);
        const newStory = await generateStory(username);
        setStory(newStory);
        setIsLoading(false);
        onActionComplete();
    }, [onActionComplete, username]);

    const closeModal = () => {
        setIsModalOpen(false);
        setStory(null);
    }
    
    const handleShare = () => {
        if (navigator.share && story) {
            navigator.share({
                title: story.title,
                text: `Check out this story from Life Skills Adventure: "${story.title}"`,
                url: window.location.href,
            }).catch(error => console.log('Error sharing:', error));
        }
    };

    const handleGoToChallenges = () => {
        closeModal();
        onGoToChallenges();
    };

    return (
        <>
            <Card className="bg-gradient-to-br from-brand-purple to-brand-pink p-4 md:p-6 text-white flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-xl font-bold">Ready for a Story?</h2>
                    <p className="mt-1 text-sm opacity-90">Discover new skills and ideas through an exciting tale!</p>
                </div>
                <Button onClick={handleGenerateStory} disabled={isLoading} className="bg-white text-brand-pink font-bold hover:bg-gray-100 transition-transform transform hover:scale-105 ml-4">
                    {isLoading ? <LoaderCircleIcon className="w-6 h-6 animate-spin" /> : 'Read a Story'}
                </Button>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={story?.title || "Generating your story..."}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <LoaderCircleIcon className="w-12 h-12 animate-spin text-brand-purple" />
                        <p className="mt-4 text-gray-600">Our storytellers are writing a special tale just for you, {username}...</p>
                    </div>
                ) : story && (
                    <>
                        <div className="text-left max-h-[60vh] overflow-y-auto pr-2">
                            <div className="mb-4">
                                <span className="inline-block bg-brand-yellow/20 text-brand-yellow font-semibold px-3 py-1 rounded-full text-sm">{story.skill}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{story.content}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t flex flex-wrap gap-2 justify-end">
                            {canShare && (
                                <Button onClick={handleShare} variant="secondary" size="sm" className="flex items-center gap-2">
                                    <ShareIcon className="w-4 h-4" /> Share
                                </Button>
                            )}
                            <Button onClick={handleGenerateStory} variant="secondary" size="sm" className="flex items-center gap-2">
                                <RefreshCwIcon className="w-4 h-4" /> Read Again
                            </Button>
                            <Button onClick={handleGoToChallenges} size="sm">
                                Try a Challenge!
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </>
    )
}

const MoodChecker: React.FC<{ onActionComplete: () => void }> = ({ onActionComplete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');
    
    const emojiCategories = [
        { name: 'Happy', emojis: ['😊', '😄', '😂', '😍', '🥳'] },
        { name: 'Calm', emojis: ['😌', '🥰', '😎', '😇', '🧘'] },
        { name: 'Unsure', emojis: ['🤔', '😐', '🤷', '🧐', '😕'] },
        { name: 'Sad', emojis: ['😟', '😢', '😭', '😞', '😩'] },
        { name: 'Frustrated', emojis: ['😠', '😤', '😡', '🤯', '😑'] },
        { name: 'Tired', emojis: ['😴', '🥱', '😪', '😒', '😬'] },
    ];

    useEffect(() => {
        const lastChecked = localStorage.getItem('mood_last_checked');
        const today = new Date().toDateString();
        if (lastChecked !== today) {
            setTimeout(() => setIsModalOpen(true), 1500);
        }
    }, []);

    const handleSubmit = () => {
        if (!selectedEmoji) return;

        const history: MoodEntry[] = JSON.parse(localStorage.getItem('mood_history') || '[]');
        const newEntry: MoodEntry = {
            date: new Date().toISOString(),
            emoji: selectedEmoji,
            text: textInput.trim(),
        };
        history.push(newEntry);
        localStorage.setItem('mood_history', JSON.stringify(history));
        localStorage.setItem('mood_last_checked', new Date().toDateString());
        onActionComplete();
        setIsModalOpen(false);
        setSelectedEmoji(null);
        setTextInput('');
    };

    return (
         <Modal 
            isOpen={isModalOpen} 
            onClose={() => {}} 
            title="How are you feeling today?"
         >
            <p className="text-gray-600 mb-6 text-center">Checking in with yourself is a great habit! Pick an emoji that fits best.</p>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
                {emojiCategories.map(category => (
                    <div key={category.name}>
                        <h4 className="font-semibold text-gray-700 mb-2">{category.name}</h4>
                        <div className="flex flex-wrap gap-4">
                            {category.emojis.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => setSelectedEmoji(emoji)}
                                    className={`text-4xl transform transition-all duration-200 hover:scale-125 focus:outline-none rounded-full p-1 ${selectedEmoji === emoji ? 'scale-125 ring-2 ring-brand-purple' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Want to share more?" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple" 
            />
            <Button 
                onClick={handleSubmit} 
                className="w-full mt-4 bg-brand-purple text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedEmoji}
            >
                Submit
            </Button>
        </Modal>
    );
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}> = ({ icon, title, description, onClick, className, style }) => (
    <Card
        className={`p-6 animate-fade-in cursor-pointer hover:shadow-xl transition-shadow flex flex-col items-center justify-center text-center h-full ${className}`}
        onClick={onClick}
        style={style}
        role="button"
        tabIndex={0}
        aria-label={`Open ${title}`}
    >
        <div className="mb-4">{icon}</div>
        <div>
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    </Card>
);

const LockedFeatureCard: React.FC<{ title: string; requirement: string }> = ({ title, requirement }) => (
    <Card className="bg-gray-200/50 backdrop-blur-sm text-gray-600 p-6 flex flex-col items-center justify-center text-center h-full animate-fade-in border border-white/20">
        <LockIcon className="w-10 h-10 mb-4" />
        <p className="text-lg font-semibold text-gray-700">{title}</p>
        <p className="text-sm opacity-90">{requirement}</p>
    </Card>
);

const DailyGoalTracker: React.FC<{ goal: DailyGoal | null; onSetGoal: () => void }> = ({ goal, onSetGoal }) => {
    const progress = goal?.completed ? 100 : 0;
    
    return (
        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Your Daily Goal</h3>
            {goal ? (
                <div>
                    <div className={`flex items-center gap-3 ${goal.completed ? 'text-green-600' : ''}`}>
                        {goal.completed ? <CheckIcon className="w-6 h-6" /> : <TargetIcon className="w-6 h-6" />}
                        <span className={`font-semibold ${goal.completed ? 'line-through' : ''}`}>{goal.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    {goal.completed && (
                         <Button onClick={onSetGoal} size="sm" className="mt-4">Set Tomorrow's Goal</Button>
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Set a mission to complete today!</p>
                    <Button onClick={onSetGoal}>Set Your Goal</Button>
                </div>
            )}
        </Card>
    );
};

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [streak, setStreak] = useState(0);
    const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
    const [isTimeChallengeModalOpen, setIsTimeChallengeModalOpen] = useState(false);
    const [isCirclesModalOpen, setIsCirclesModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isMoodJourneyModalOpen, setIsMoodJourneyModalOpen] = useState(false);
    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
    const communicationRef = useRef<HTMLDivElement>(null);

    const handleScrollToChallenges = () => {
        communicationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleActionComplete = useCallback(() => {
        // Update Streak
        const today = new Date().toDateString();
        const streakData = JSON.parse(localStorage.getItem('streak_data') || '{}');
        if (streakData.date !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            let newStreak = 1;
            if (streakData.date === yesterday.toDateString()) {
                newStreak = (streakData.streak || 0) + 1;
            }
            setStreak(newStreak);
            localStorage.setItem('streak_data', JSON.stringify({ streak: newStreak, date: today }));
        }

        // Update Daily Goal
        setDailyGoal(prevGoal => {
            if (prevGoal && !prevGoal.completed) {
                const updatedGoal = { ...prevGoal, completed: true };
                localStorage.setItem('daily_goal', JSON.stringify(updatedGoal));
                setTimeout(() => setIsGoalModalOpen(true), 1000); // Prompt for next day's goal
                return updatedGoal;
            }
            return prevGoal;
        });
    }, []);

    useEffect(() => {
        // Load Streak
        const streakData = JSON.parse(localStorage.getItem('streak_data') || '{}');
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (streakData.date === today || streakData.date === yesterday.toDateString()) {
            setStreak(streakData.streak || 0);
        } else {
             setStreak(0);
             localStorage.setItem('streak_data', JSON.stringify({ streak: 0, date: null }));
        }

        // Load Daily Goal
        const goalData = JSON.parse(localStorage.getItem('daily_goal') || 'null');
        if (goalData && goalData.date === today) {
            setDailyGoal(goalData);
        } else {
            setDailyGoal(null);
            localStorage.removeItem('daily_goal');
        }

        // Show Welcome Modal on first visit
        const hasVisited = localStorage.getItem('has_visited');
        if (!hasVisited) {
            setIsWelcomeModalOpen(true);
            localStorage.setItem('has_visited', 'true');
        }
    }, []);

    const handleStreakClick = () => {
        setStreak(prevStreak => {
            const newStreak = prevStreak + 1;
            const today = new Date().toDateString();
            localStorage.setItem('streak_data', JSON.stringify({ streak: newStreak, date: today }));
            return newStreak;
        });
    };
    
    const handleSetGoal = (goalText: string) => {
        const today = new Date().toDateString();
        const newGoal: DailyGoal = { text: goalText, completed: false, date: today };
        setDailyGoal(newGoal);
        localStorage.setItem('daily_goal', JSON.stringify(newGoal));
        setIsGoalModalOpen(false);
    };


    return (
        <div className="bg-transparent min-h-screen">
            <Header username={user?.name || 'Explorer'} onLogout={logout} streak={streak} onStreakClick={handleStreakClick} />
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="space-y-8">
                    <StoryGenerator 
                        username={user?.name || 'Explorer'} 
                        onActionComplete={handleActionComplete} 
                        onGoToChallenges={handleScrollToChallenges} 
                    />

                    <DailyGoalTracker goal={dailyGoal} onSetGoal={() => setIsGoalModalOpen(true)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {streak >= UNLOCK_THRESHOLDS.TIME_CHALLENGE ? (
                             <FeatureCard
                                icon={<TimerIcon className="w-10 h-10 text-white" />}
                                title="Time Master Challenge"
                                description="Learn to beat the clock!"
                                onClick={() => setIsTimeChallengeModalOpen(true)}
                                className="bg-gradient-to-br from-indigo-500 to-cyan-400 text-white"
                            />
                        ) : (
                            <LockedFeatureCard title="Time Master Challenge" requirement={`Reach a ${UNLOCK_THRESHOLDS.TIME_CHALLENGE}-day streak!`} />
                        )}
                        {streak >= UNLOCK_THRESHOLDS.CALENDAR ? (
                            <FeatureCard
                                icon={<CalendarIcon className="w-10 h-10 text-white" />}
                                title="Calendar"
                                description="Organize your schedule."
                                onClick={() => setIsCalendarModalOpen(true)}
                                className="bg-gradient-to-br from-green-500 to-emerald-400 text-white"
                            />
                        ) : (
                            <LockedFeatureCard title="Calendar" requirement={`Reach a ${UNLOCK_THRESHOLDS.CALENDAR}-day streak!`} />
                        )}
                        {streak >= UNLOCK_THRESHOLDS.CIRCLES ? (
                             <FeatureCard
                                icon={<UsersIcon className="w-10 h-10 text-white" />}
                                title="Circles"
                                description="Connect with friends."
                                onClick={() => setIsCirclesModalOpen(true)}
                                className="bg-gradient-to-br from-pink-500 to-rose-400 text-white"
                            />
                        ) : (
                             <LockedFeatureCard title="Circles" requirement={`Reach a ${UNLOCK_THRESHOLDS.CIRCLES}-day streak!`} />
                        )}
                         <FeatureCard
                            icon={<SmilePlusIcon className="w-10 h-10 text-white" />}
                            title="Your Mood Journey"
                            description="See your feelings over time."
                            onClick={() => setIsMoodJourneyModalOpen(true)}
                            className="bg-gradient-to-br from-amber-500 to-orange-400 text-white"
                        />
                    </div>
                
                    <Card
                        className="bg-gradient-to-br from-brand-blue to-brand-teal text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between animate-fade-in cursor-pointer hover:shadow-2xl transition-shadow"
                        onClick={() => setIsCommunityModalOpen(true)}
                        style={{ animationDelay: '300ms' }}
                        role="button"
                        tabIndex={0}
                        aria-label="Become a Community Hero"
                    >
                        <div>
                            <h2 className="text-2xl font-bold">Become a Community Hero!</h2>
                            <p className="mt-2 opacity-90">Find fun local volunteer activities and make a difference.</p>
                        </div>
                        <div className="mt-4 md:mt-0 bg-white/20 p-4 rounded-full">
                            <HeartHandshakeIcon className="w-10 h-10 text-white" />
                        </div>
                    </Card>

                    <div ref={communicationRef}>
                        <CommunicationActivities />
                    </div>
                </div>
            </main>
            <MoodChecker onActionComplete={handleActionComplete} />
            {isWelcomeModalOpen && <WelcomeModal onClose={() => setIsWelcomeModalOpen(false)} />}
            {isCommunityModalOpen && <CommunityVolunteeringModal onClose={() => setIsCommunityModalOpen(false)} onActionComplete={handleActionComplete} />}
            {isTimeChallengeModalOpen && <TimeManagementChallengeModal onClose={() => setIsTimeChallengeModalOpen(false)} onActionComplete={handleActionComplete} />}
            {isCirclesModalOpen && <CirclesModal onClose={() => setIsCirclesModalOpen(false)} />}
            {isCalendarModalOpen && <CalendarModal onClose={() => setIsCalendarModalOpen(false)} onActionComplete={handleActionComplete} />}
            {isMoodJourneyModalOpen && <MoodJourneyModal onClose={() => setIsMoodJourneyModalOpen(false)} />}
            {isGoalModalOpen && <GoalSetterModal onClose={() => setIsGoalModalOpen(false)} onSetGoal={handleSetGoal} goalCompleted={dailyGoal?.completed || false}/>}
        </div>
    );
};

export default DashboardPage;