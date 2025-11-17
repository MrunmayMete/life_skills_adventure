import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircleIcon } from '../icons/Icons';

interface GoalSetterModalProps {
    onClose: () => void;
    onSetGoal: (goalText: string) => void;
    goalCompleted: boolean;
}

const GOAL_SUGGESTIONS = [
    'Read one story',
    'Complete a Time Master Challenge',
    'Add an event to my calendar',
    'Share how I feel in the mood checker',
    'Learn about one volunteer opportunity',
];

export const GoalSetterModal: React.FC<GoalSetterModalProps> = ({ onClose, onSetGoal, goalCompleted }) => {
    const [customGoal, setCustomGoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customGoal.trim()) {
            onSetGoal(customGoal.trim());
        }
    };

    if (goalCompleted) {
        return (
             <Modal isOpen={true} onClose={onClose} title="Goal Complete!">
                <div className="text-center">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-brand-dark">Awesome Work!</h3>
                    <p className="text-gray-600 mt-2 mb-6">You crushed your daily goal! Let's get ready for another great day tomorrow.</p>
                    <h4 className="font-bold text-lg mb-4">Set Your Goal for Tomorrow:</h4>
                    {/* Render the goal setting part again for the next day */}
                     <div className="space-y-3">
                        {GOAL_SUGGESTIONS.map(goal => (
                            <Button key={goal} variant="secondary" className="w-full" onClick={() => onSetGoal(goal)}>
                                {goal}
                            </Button>
                        ))}
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={customGoal}
                                onChange={(e) => setCustomGoal(e.target.value)}
                                placeholder="Or type your own goal..."
                                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                            />
                            <Button type="submit">Set</Button>
                        </form>
                    </div>
                </div>
            </Modal>
        )
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="Set Your Daily Goal">
            <p className="text-center text-gray-600 mb-6">What's one thing you want to accomplish today?</p>
            <div className="space-y-3">
                {GOAL_SUGGESTIONS.map(goal => (
                    <Button key={goal} variant="secondary" className="w-full" onClick={() => onSetGoal(goal)}>
                        {goal}
                    </Button>
                ))}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
                     <input
                        type="text"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        placeholder="Or type your own goal..."
                        className="flex-grow w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                    />
                    <Button type="submit">Set</Button>
                </form>
            </div>
        </Modal>
    );
};