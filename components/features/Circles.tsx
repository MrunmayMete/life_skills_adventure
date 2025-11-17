import React from 'react';
import type { Peer } from '../../types';
import { Modal } from '../ui/Modal';
import { FlameIcon } from '../icons/Icons';

const DUMMY_PEERS: Peer[] = [
    { id: 1, name: 'Alex', emoji: '🧑‍🚀', streak: 12, status: 'Just read a story on communication.' },
    { id: 2, name: 'Sam', emoji: '🎨', streak: 25, status: 'Completed the Time Master Challenge.' },
    { id: 3, name: 'Jordan', emoji: '🎸', streak: 5, status: 'Found a volunteer opportunity nearby!' },
    { id: 4, name: 'Taylor', emoji: '🧪', streak: 18, status: 'Shared their feelings in the mood checker.' },
    { id: 5, name: 'Casey', emoji: '🏀', streak: 3, status: 'Just started their adventure today.' },
    { id: 6, name: 'Riley', emoji: '📚', streak: 31, status: 'Is on a roll with their daily streak!' }
];

export const CirclesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Your Circle">
            <p className="text-center text-gray-600 mb-6">See what your friends are up to on their adventures!</p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {DUMMY_PEERS.map(peer => (
                    <div key={peer.id} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 animate-slide-in-up">
                        <span className="text-4xl">{peer.emoji}</span>
                        <div className="flex-grow">
                            <h3 className="font-bold text-brand-dark">{peer.name}</h3>
                            <p className="text-sm text-gray-500">{peer.status}</p>
                        </div>
                        <div className="flex items-center space-x-1 bg-orange-100 text-orange-600 font-bold rounded-full px-3 py-1 text-sm">
                            <FlameIcon className="w-4 h-4" />
                            <span>{peer.streak}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};