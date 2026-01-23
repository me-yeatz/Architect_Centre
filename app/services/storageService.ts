// Storage service for saving and retrieving generated content
export interface SavedContent {
  id: string;
  type: 'email' | 'social' | 'chat';
  content: string;
  timestamp: Date;
  projectName: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'ai_architect_saved_content';

export const saveContent = (content: SavedContent): void => {
  try {
    const existing = getSavedContent();
    const updated = [content, ...existing].slice(0, 100); // Keep last 100 items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save content:', error);
  }
};

export const getSavedContent = (): SavedContent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to retrieve content:', error);
    return [];
  }
};

export const clearSavedContent = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear content:', error);
  }
};

// WhatsApp preview service
export interface WhatsAppPreview {
  id: string;
  recipient: string;
  message: string;
  timestamp: Date;
  sent: boolean;
}

const WHATSAPP_PREVIEW_KEY = 'ai_architect_whatsapp_previews';

export const saveWhatsAppPreview = (preview: WhatsAppPreview): void => {
  try {
    const existing = getWhatsAppPreviews();
    const updated = [preview, ...existing].slice(0, 50); // Keep last 50 previews
    localStorage.setItem(WHATSAPP_PREVIEW_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save WhatsApp preview:', error);
  }
};

export const getWhatsAppPreviews = (): WhatsAppPreview[] => {
  try {
    const stored = localStorage.getItem(WHATSAPP_PREVIEW_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to retrieve WhatsApp previews:', error);
    return [];
  }
};

export const markWhatsAppAsSent = (id: string): void => {
  try {
    const previews = getWhatsAppPreviews();
    const updated = previews.map(p => 
      p.id === id ? { ...p, sent: true } : p
    );
    localStorage.setItem(WHATSAPP_PREVIEW_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to mark WhatsApp as sent:', error);
  }
};
