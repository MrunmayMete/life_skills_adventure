import React, { useState, useEffect, useCallback } from 'react';
import type { VolunteerActivity } from '../../types';
import { generateVolunteerActivities } from '../../services/geminiService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { XIcon, LoaderCircleIcon, UploadIcon, VideoIcon } from '../icons/Icons';

type GeolocationStatus = 'pending' | 'granted' | 'denied' | 'unavailable';

const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 }; // San Francisco

// --- Permission Modal ---
interface PermissionModalProps {
    activity: VolunteerActivity;
    onClose: () => void;
    onActionComplete: () => void;
}
const PermissionModal: React.FC<PermissionModalProps> = ({ activity, onClose, onActionComplete }) => (
    <Modal isOpen={true} onClose={onClose} title="Guardian Permission Needed!">
        <div className="text-center">
            <p className="text-gray-600 mb-4">
                You're about to learn more about: <br />
                <strong className="text-brand-dark">{activity.title}</strong>.
            </p>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
                <p className="font-bold">Heads up!</p>
                <p>Volunteering is awesome, but safety comes first. Make sure you have your parent or guardian's permission before you register or visit.</p>
            </div>
            
            <div className="space-y-4">
                 <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <UploadIcon className="w-5 h-5" />
                    Upload Written Permission
                </Button>
                <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={() => alert('Video recording feature coming soon!')}>
                    <VideoIcon className="w-5 h-5" />
                    Record Video Permission
                </Button>
            </div>

            <a href={activity.registrationLink} target="_blank" rel="noopener noreferrer" onClick={onActionComplete}>
                 <Button className="w-full mt-6 bg-brand-blue hover:bg-brand-blue/90">View on Google Maps</Button>
            </a>
        </div>
    </Modal>
);

// --- Main Feature Modal ---
interface CommunityVolunteeringModalProps {
    onClose: () => void;
    onActionComplete: () => void;
}

export const CommunityVolunteeringModal: React.FC<CommunityVolunteeringModalProps> = ({ onClose, onActionComplete }) => {
    const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('pending');
    const [summary, setSummary] = useState('');
    const [activities, setActivities] = useState<VolunteerActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activityForPermission, setActivityForPermission] = useState<VolunteerActivity | null>(null);
    
    const fetchActivities = useCallback(async (location: { lat: number, lng: number }) => {
        setIsLoading(true);
        setError(null);
        try {
            const { summary, activities } = await generateVolunteerActivities(location.lat, location.lng);
            setSummary(summary);
            setActivities(activities);
        } catch (err) {
            setError("Oops! Couldn't fetch activities. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeoStatus('granted');
                    fetchActivities({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}`);
                    setGeoStatus('denied');
                    fetchActivities(DEFAULT_LOCATION); // Fallback to default
                }
            );
        } else {
            setGeoStatus('unavailable');
            fetchActivities(DEFAULT_LOCATION); // Fallback to default
        }
    }, [fetchActivities]);

    const handleRegisterClick = (activity: VolunteerActivity) => {
        if(activity.registrationLink === '#') {
            alert("Sorry, we couldn't find a specific link for this place, but you can search for it online!");
            return;
        }
        setActivityForPermission(activity);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <LoaderCircleIcon className="w-12 h-12 animate-spin text-brand-blue" />
                    <p className="mt-4 text-gray-600">Finding local hero opportunities...</p>
                </div>
            );
        }
        if (error) {
            return <div className="text-center text-red-500">{error}</div>;
        }
        return (
            <div>
                {geoStatus === 'denied' && (
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm mb-4">
                        Location access was denied. Showing activities for a default area.
                    </div>
                )}
                <p className="text-gray-700 mb-6 leading-relaxed">{summary}</p>
                 <div className="space-y-4 max-h-[calc(80vh-200px)] overflow-y-auto pr-2">
                    {activities.length > 0 ? activities.map(activity => (
                        <div key={activity.title} className="bg-white rounded-lg p-4 flex items-start space-x-4 shadow-sm animate-slide-in-up">
                            <span className="text-4xl mt-1">{activity.emoji}</span>
                            <div className="flex-grow">
                                <h3 className="font-bold text-brand-dark text-lg">{activity.title}</h3>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <Button size="sm" onClick={() => handleRegisterClick(activity)}>Learn More</Button>
                        </div>
                    )) : (
                         <div className="text-center p-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">We couldn't find specific volunteer spots right now, but try looking up local parks, animal shelters, or libraries online!</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={onClose}
        >
            <div 
                className="bg-brand-bg rounded-2xl shadow-2xl w-full max-w-2xl h-auto max-h-[85vh] p-6 relative animate-slide-in-up flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                  <h2 className="text-3xl font-bold text-brand-dark">Community Adventures</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-grow min-h-0">{renderContent()}</div>
            </div>
             {activityForPermission && (
                <PermissionModal 
                    activity={activityForPermission} 
                    onClose={() => setActivityForPermission(null)}
                    onActionComplete={onActionComplete}
                />
            )}
        </div>
    );
};