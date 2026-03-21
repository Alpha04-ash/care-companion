import axios from 'axios';

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export const sendMessage = async (message: string, history: ChatMessage[]) => {
  try {
    const response = await axios.post('/api/chat', {
      message,
      history
    });
    
    return response.data.reply;
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
};
