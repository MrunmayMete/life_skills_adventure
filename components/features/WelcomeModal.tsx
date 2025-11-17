import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SparklesIcon, FlameIcon, LockIcon } from '../icons/Icons';

export const WelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Welcome to Your Adventure!">
            <div className="text-center">
                <p className="text-gray-600 mb-6">
                    We're so excited you're here! This is your place to learn cool skills and become your most awesome self.
                </p>
                <div className="space-y-4 text-left">
                    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <SparklesIcon className="w-8 h-8 text-brand-purple flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold">Start Your Journey</h4>
                            <p className="text-sm text-gray-600">Each day, check in with your mood, read a personalized story, or take on a fun challenge.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <FlameIcon className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold">Build Your Streak</h4>
                            <p className="text-sm text-gray-600">Complete at least one activity every day to build up your daily streak!</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <LockIcon className="w-8 h-8 text-gray-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold">Unlock New Features</h4>
                            <p className="text-sm text-gray-600">The higher your streak, the more cool features you'll unlock, like the Time Challenge and more!</p>
                        </div>
                    </div>
                </div>
                <Button onClick={onClose} className="w-full mt-8">
                    Let's Go!
                </Button>
            </div>
        </Modal>
    );
};
