import { GoogleGenAI, Type } from "@google/genai";
import type { Story, VolunteerActivity, TimeManagementTask, MoodEntry } from '../types';

const LIFE_SKILLS = [
  "time management",
  "emotional intelligence",
  "financial literacy",
  "effective communication",
  "healthy habits",
  "problem-solving",
  "critical thinking"
];

// Fix: Initialize GoogleGenAI with the API key directly from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const generateStory = async (username: string): Promise<Story | null> => {
  try {
    const randomSkill = LIFE_SKILLS[Math.floor(Math.random() * LIFE_SKILLS.length)];
    
    const prompt = `Create a short, engaging, and inspiring story for a 12-year-old named ${username} about the importance of ${randomSkill}. Make ${username} the main character, who is a curious and resourceful kid. The story should be easy to read, have a clear moral, and feature relatable situations. Format the response as a JSON object with keys "title", "content" (the story text), and "skill" (the life skill covered).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            skill: { type: Type.STRING },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const storyData: Story = JSON.parse(jsonText);

    return storyData;
  } catch (error) {
    console.error("Error generating story:", error);
    // Return a fallback story on error
    return {
      title: "The Missing Homework Mystery",
      skill: "Problem-Solving",
      content: "Leo couldn't find his math homework anywhere! Instead of panicking, he took a deep breath. First, he retraced his steps from school. Then, he checked his backpack, his desk, and even the kitchen table. Finally, he found it tucked inside his science textbook. By thinking through the problem step-by-step, Leo solved his own mystery and learned that a calm approach is the best way to tackle any challenge."
    };
  }
};

export const generateVolunteerActivities = async (lat: number, lng: number): Promise<{ summary: string; activities: VolunteerActivity[] }> => {
    try {
        const prompt = `You are a friendly guide for a 12-year-old looking for volunteer opportunities.
        Based on my location, find 3-5 local, kid-friendly places to volunteer. Ideas include animal shelters, park cleanups, community gardens, or libraries.
        
        First, write a short, encouraging summary of why volunteering is great.
        
        Then, for each place found via Google Maps, provide the following on a new line, separated by a pipe (|):
        - A fun emoji
        - The name of the place
        - A short, one-sentence description of a fun activity a kid could do there.
        
        Example format for each place:
        🌳|Greenwood Park|Help keep the park beautiful by planting flowers and picking up litter.
        🐶|Happy Paws Shelter|Spend time playing with cats and dogs to help them feel loved.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: lat,
                            longitude: lng,
                        }
                    }
                }
            },
        });

        const fullText = response.text;
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        const defaultSummary = "Volunteering is a fantastic way to make new friends, learn new skills, and make a real difference in your community. Here are a few ideas to get you started!";
        const activityLines = fullText.split('\n').filter(line => line.includes('|'));
        const summary = fullText.split(activityLines[0] || '$$$')[0].trim() || defaultSummary;

        const activities: VolunteerActivity[] = chunks.map((chunk) => {
            if (!('maps' in chunk) || !chunk.maps) {
                return null;
            }
            const placeTitle = chunk.maps.title;
            const placeUri = chunk.maps.uri;
            
            const matchingLine = activityLines.find(line => line.toLowerCase().includes(placeTitle.toLowerCase()));
            
            let emoji = '💖';
            let description = `Learn more about ${placeTitle} and how you can help!`;

            if (matchingLine) {
                const lineParts = matchingLine.split('|');
                if (lineParts.length === 3) {
                    emoji = lineParts[0].trim();
                    description = lineParts[2].trim();
                }
            }

            return {
                title: placeTitle,
                description: description,
                ngo: 'Local Organization',
                registrationLink: placeUri,
                emoji: emoji,
            };
        }).filter((a): a is VolunteerActivity => a !== null);

        if (activities.length === 0 && activityLines.length > 0) {
             activityLines.forEach(line => {
                const lineParts = line.split('|');
                 if (lineParts.length === 3) {
                     activities.push({
                        title: lineParts[1].trim(),
                        description: lineParts[2].trim(),
                        ngo: 'Local Organization',
                        registrationLink: '#',
                        emoji: lineParts[0].trim(),
                     });
                 }
            });
        }

        return { summary, activities };

    } catch (error) {
        console.error("Error generating volunteer activities with Maps:", error);
        return {
            summary: "It looks like our map had a little glitch! No worries, here are some classic ideas for being a community hero. You can look for similar places in your own neighborhood!",
            activities: [
                { title: 'Local Park Cleanup', description: 'Help make our local park sparkle by picking up litter and planting new flowers.', ngo: 'Green Thumbs Org', registrationLink: '#', emoji: '🌳' },
                { title: 'Animal Shelter Helper', description: 'Help care for cats and dogs waiting for their forever homes. Playtime included!', ngo: 'Paws & Whiskers', registrationLink: '#', emoji: '🐶' },
                { title: 'Library Book Shelver', description: 'Visit your local library and help organize books for other kids to enjoy.', ngo: 'Community Reads', registrationLink: '#', emoji: '📖' },
            ]
        };
    }
};

export const generateTimeManagementTasks = async (): Promise<TimeManagementTask[]> => {
    try {
      const prompt = `Generate a list of 8 simple, age-appropriate tasks for 11-14 year olds focused on time management. Categorize them as 'Home', 'Academic', or 'Personal'. Provide a name, category, and a relevant emoji for each. Format the response as a valid JSON array of objects.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                emoji: { type: Type.STRING },
              },
              required: ['name', 'category', 'emoji'],
            },
          },
        },
      });
      const jsonText = response.text.trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Error generating time management tasks:", error);
      // Return fallback data
      return [
        { name: 'Organize your backpack', category: 'Academic', emoji: '🎒' },
        { name: 'Tidy up your desk', category: 'Academic', emoji: '💻' },
        { name: 'Make your bed', category: 'Home', emoji: '🛏️' },
        { name: 'Help with dinner prep', category: 'Home', emoji: '🥕' },
        { name: 'Read a chapter of a book', category: 'Personal', emoji: '📚' },
        { name: 'Practice an instrument for 15 mins', category: 'Personal', emoji: '🎸' },
        { name: 'Empty the dishwasher', category: 'Home', emoji: '🍽️' },
        { name: 'Plan your outfit for tomorrow', category: 'Personal', emoji: '👕' },
      ];
    }
};

export const analyzeMoodHistory = async (history: MoodEntry[]): Promise<string> => {
    try {
        const formattedHistory = history.map(entry => 
            `- On ${new Date(entry.date).toLocaleDateString()}, I felt ${entry.emoji || 'a certain way'}. Notes: "${entry.text || 'none'}"`
        ).join('\n');

        const prompt = `You are a friendly and encouraging wellness coach for a 12-year-old. Analyze the following mood journal entries and provide a short (under 80 words), positive, and insightful summary. Your tone should be like a cool, supportive older sibling, not a doctor. Point out any patterns in a gentle way and offer one simple, actionable tip for well-being. Here are the entries:\n${formattedHistory}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing mood history:", error);
        return "It looks like there was a small glitch analyzing your mood journey. No worries! The most important thing is that you're checking in with yourself. Keep it up!";
    }
};

export const analyzeSingleMoodEntry = async (entry: MoodEntry): Promise<'positive' | 'neutral' | 'negative'> => {
    try {
        const prompt = `Analyze the sentiment of the following mood journal entry from a child. The entry includes an emoji and a text note. Respond with only a single word: "positive", "neutral", or "negative".
        
        Emoji: ${entry.emoji || 'none'}
        Note: "${entry.text || 'none'}"`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const sentiment = response.text.trim().toLowerCase();
        if (sentiment === 'positive' || sentiment === 'neutral' || sentiment === 'negative') {
            return sentiment;
        }
        return 'neutral'; // Fallback for unexpected responses
    } catch (error) {
        console.error("Error analyzing single mood entry:", error);
        return 'neutral'; // Fallback on error
    }
};