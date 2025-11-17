import React, { useState, useEffect, useMemo } from 'react';
import type { CalendarEvent } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const DUMMY_SCHOOL_EVENTS: Omit<CalendarEvent, 'id'>[] = [
    { date: '2024-09-03', title: 'First Day of School', type: 'school' },
    { date: '2024-10-14', title: 'Mid-term Exams Start', type: 'school' },
    { date: '2024-11-28', title: 'Thanksgiving Break', type: 'school' },
    { date: '2024-12-20', title: 'Winter Break Starts', type: 'school' },
];

const STORAGE_KEY = 'lifeskills_calendar_events';

export const CalendarModal: React.FC<{ onClose: () => void; onActionComplete: () => void; }> = ({ onClose, onActionComplete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isAddingEvent, setIsAddingEvent] = useState<string | null>(null); // Holds date string
    const [newEventTitle, setNewEventTitle] = useState('');

    useEffect(() => {
        const storedEvents = localStorage.getItem(STORAGE_KEY);
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        } else {
            // Initialize with dummy data
            const initialEvents = DUMMY_SCHOOL_EVENTS.map((event, index) => ({ ...event, id: Date.now() + index }));
            setEvents(initialEvents);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }, [events]);

    const { month, year, startingDay, daysInMonth } = useMemo(() => {
        const date = new Date(currentDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        return {
            month,
            year,
            startingDay: new Date(year, month, 1).getDay(),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    }, [currentDate]);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEventTitle.trim() && isAddingEvent) {
            const newEvent: CalendarEvent = {
                id: Date.now(),
                date: isAddingEvent,
                title: newEventTitle.trim(),
                type: 'personal',
            };
            setEvents([...events, newEvent]);
            onActionComplete();
            setNewEventTitle('');
            setIsAddingEvent(null);
        }
    };

    const renderCells = () => {
        const blanks = Array(startingDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const totalCells = [...blanks, ...days];

        return totalCells.map((day, index) => {
            if (!day) {
                return <div key={`blank-${index}`} className="border-r border-b border-gray-200"></div>;
            }
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);

            return (
                <div key={day} className="border-r border-b border-gray-200 p-2 min-h-[100px] flex flex-col">
                    <button onClick={() => setIsAddingEvent(dateStr)} className="font-semibold self-start hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors">{day}</button>
                    <div className="mt-1 space-y-1 overflow-y-auto">
                        {dayEvents.map(event => (
                            <div key={event.id} className={`text-xs px-1.5 py-0.5 rounded ${event.type === 'school' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-dark">
                        {currentDate.toLocaleString('default', { month: 'long' })} {year}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Button onClick={handlePrevMonth} variant="secondary" size="sm">Prev</Button>
                        <Button onClick={handleNextMonth} variant="secondary" size="sm">Next</Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-center font-bold text-gray-600 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 border-l border-t border-gray-200">
                    {renderCells()}
                </div>

                {isAddingEvent && (
                    <Modal isOpen={true} onClose={() => setIsAddingEvent(null)} title={`Add Event for ${isAddingEvent}`}>
                        <form onSubmit={handleAddEvent}>
                            <input
                                type="text"
                                value={newEventTitle}
                                onChange={e => setNewEventTitle(e.target.value)}
                                placeholder="e.g., Soccer practice"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple"
                                autoFocus
                            />
                            <Button type="submit" className="w-full mt-4 bg-brand-purple text-white">Add Event</Button>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
};