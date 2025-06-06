"use client"

import { useState, useContext, createContext, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Send,
  FileText,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  GraduationCap,
  Languages,
  Camera,
  ChevronDown,
} from "lucide-react"

// Base English translations
const baseTranslations = {
  title: "Parent in the Loop",
  subtitle: "We help parents understand their child's school",
  schoolHelper: "Your School Helper",
  schoolHelperDesc: "Ask questions and get help right away",
  uploadPapers: "Upload School Papers",
  uploadDesc: "Upload files (PDF, Word) or take photos of school papers",
  uploadSubDesc: "Report cards, letters from school, IEP papers, etc.",
  chooseFiles: "Choose Files or Photos",
  greeting: "Hello! I am here to help you with your child's school. You can upload school papers or photos, and I will help you understand what to do next.",
  askPlaceholder: "Ask about your child's school, your rights, or what to do next...",
  actionTitle: "What You Need to Do Now",
  actionDesc: "Important things to do and when to do them",
  schoolMeeting: "School Meeting - Answer Needed",
  answerBy: "You must answer by March 15, 2024",
  showWhatToDo: "Show Me What to Do",
  reportCard: "Report Card - Done",
  nextStep: "Next: Talk to your child's teacher",
  understandingRules: "Understanding School Rules",
  rulesDesc: "We explain school processes in simple words",
  iepMeeting: "IEP Meeting",
  iepDesc: "A meeting to talk about special help for your child at school...",
  learnMore: "Learn More",
  plan504: "504 Plan",
  plan504Desc: "Special help for children who need extra support in school...",
  rightsTitle: "Your Rights as a Parent",
  rightsDesc: "Know what you can do and ask for at school",
  whatYouCanDo: "What You Can Do",
  rightsText1: "You can join school meetings about your child",
  rightsText2: "You can ask for tests to help your child", 
  rightsText3: "You can see your child's school records",
  emailExamples: "Email Examples",
  questionsToAsk: "Questions to Ask",
  helpNearYou: "Help Near You",
  helpNearYouDesc: "Services and programs in your area",
  specialEdHelp: "Special Education Help",
  specialEdDesc: "3 programs available in your area",
  collegePrepHelp: "College Prep Programs",
  collegePrepDesc: "5 programs taking new students",
  seeAllHelp: "See All Help Available",
  howChildDoing: "How Your Child is Doing",
  howChildDoingDesc: "What your child's grades mean for their future",
  schoolPerformance: "School Performance",
  schoolPerformanceDesc: "Your child is doing well in math and reading. They might be ready for harder classes.",
  futureOptions: "Future Options",
  futureOptionsDesc: "Your child can take college prep classes to get ready for university.",
  papersReady: "Papers Ready",
  settings: "Settings",
  aiResponse: "I understand. Let me look at your school papers and help you know what to do. I will give you simple steps to follow."
};

// Translation context
const TranslationContext = createContext<{
  t: (key: string) => string;
  changeLang: (langCode: string) => Promise<void>;
  currentLang: string;
  isTranslating: boolean;
  translateText: (text: string) => Promise<string>;
} | undefined>(undefined);

// Language configuration
interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' }
];

// Translation service using Next.js API route
class TranslationService {
  async translateText(text: string, targetLang: string): Promise<string> {
    try {
      console.log(`🔄 Translating to ${targetLang}: "${text.substring(0, 50)}..."`);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          targetLang: targetLang,
          sourceLang: 'EN'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Translation API Error:', response.status, errorData);
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Translation successful: "${data.translatedText.substring(0, 50)}..."`);
      
      return data.translatedText;
    } catch (error) {
      console.error('❌ Translation error:', error);
      return text; // Fallback to original text
    }
  }

  async translateMultiple(texts: string[], targetLang: string): Promise<string[]> {
    const results: string[] = [];
    
    for (const text of texts) {
      const translated = await this.translateText(text, targetLang);
      results.push(translated);
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }
}

const translationService = new TranslationService();

// Stores translations for each language
const languageTranslations: Record<string, Record<string, string>> = {
  en: baseTranslations
};

// Translation provider
const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  
  // Check if translation API is available
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'test', targetLang: 'ES', sourceLang: 'EN' })
        });
        setApiAvailable(response.ok);
        console.log('🔌 Translation API status:', response.ok ? 'Available' : 'Not available');
      } catch (error) {
        console.error('❌ API check failed:', error);
        setApiAvailable(false);
      }
    };
    checkApi();
  }, []);
  
  const t = (key: string): string => {
    const translations = languageTranslations[currentLang];
    if (translations && translations[key]) {
      return translations[key];
    }
    // Fallback to English
    return baseTranslations[key as keyof typeof baseTranslations] || key;
  };
  
  const translateText = async (text: string): Promise<string> => {
    if (currentLang === 'en' || !apiAvailable) return text;
    
    return await translationService.translateText(text, currentLang.toUpperCase());
  };
  
  const changeLang = async (langCode: string): Promise<void> => {
    if (langCode === currentLang) return;
    
    setIsTranslating(true);
    
    try {
      if (langCode === 'en') {
        setCurrentLang(langCode);
        return;
      }
      
      if (!apiAvailable) {
        console.warn('⚠️ Translation API not available');
        alert('Translation API is not available. Please check your API setup.');
        return;
      }
      
      // Check if we already have translations for this language
      if (!languageTranslations[langCode]) {
        const langName = languages.find(l => l.code === langCode)?.name;
        console.log(`🌍 Translating interface to ${langName}...`);
        
        // Get all translation keys and values
        const keys = Object.keys(baseTranslations);
        const values = Object.values(baseTranslations);
        
        // Translate all interface text
        const translatedValues = await translationService.translateMultiple(values, langCode.toUpperCase());
        
        // Create translation object
        const translations: Record<string, string> = {};
        keys.forEach((key, index) => {
          translations[key] = translatedValues[index];
        });
        
        languageTranslations[langCode] = translations;
        console.log(`✅ Interface translated to ${langName}`);
      }
      
      setCurrentLang(langCode);
    } catch (error) {
      console.error('❌ Failed to change language:', error);
      alert('Translation failed. Please check your API setup.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <TranslationContext.Provider value={{ 
      t, 
      changeLang, 
      currentLang, 
      isTranslating,
      translateText 
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use translation
const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface DocumentInfo {
  name: string
  type: string
  uploadDate: Date
  status: "processed" | "processing" | "pending"
}

const ParentInTheLoopPlatform: React.FC = () => {
  const { t, currentLang, isTranslating, changeLang, translateText } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [uploadedDocs] = useState<DocumentInfo[]>([
    { name: "IEP_Notice_2024.pdf", type: "IEP Notice", uploadDate: new Date(2024, 2, 15), status: "processed" },
    { name: "Report_Card_Q1.pdf", type: "Report Card", uploadDate: new Date(2024, 2, 10), status: "processed" },
  ])

  // Initialize messages after component mounts
  useEffect(() => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content: t('greeting'),
        timestamp: new Date(),
      },
    ]);
  }, [currentLang]);

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  const handleLanguageChange = async (langCode: string) => {
    await changeLang(langCode);
    setShowLanguageDropdown(false);
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")

    // Simulate AI response with translation
    setTimeout(async () => {
      let responseText = baseTranslations.aiResponse;
      
      if (currentLang !== 'en') {
        try {
          responseText = await translateText(responseText);
        } catch (error) {
          console.error('Failed to translate response:', error);
        }
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responseText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
            <Languages className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="font-medium">Translating with DeepL...</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <Button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                disabled={isTranslating}
              >
                <Languages className="h-4 w-4" />
                <span>{isTranslating ? 'Translating...' : currentLanguage?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showLanguageDropdown && !isTranslating && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                        currentLang === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {currentLang === lang.code && (
                        <CheckCircle className="w-4 h-4 ml-auto text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Badge variant="outline" className="text-green-600 border-green-600">
              {uploadedDocs.length} {t('papersReady')}
            </Badge>
            <Button variant="outline" size="sm">
              {t('settings')}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - AI Chatbot */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('schoolHelper')}</h2>
                <p className="text-sm text-gray-600">{t('schoolHelperDesc')}</p>
              </div>
            </div>
          </div>

          {/* Document Upload Area */}
          <div className="p-4 bg-blue-50 border-b border-gray-200">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Upload className="h-6 w-6 text-blue-600" />
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700 font-medium">{t('uploadPapers')}</p>
              <p className="text-xs text-blue-600 mt-1">{t('uploadDesc')}</p>
              <p className="text-xs text-blue-600">{t('uploadSubDesc')}</p>
              <Button size="sm" className="mt-2" variant="outline">
                {t('chooseFiles')}
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                placeholder={t('askPlaceholder')}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
                disabled={isTranslating}
              />
              <Button onClick={handleSendMessage} size="sm" disabled={isTranslating || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Information Panels */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Immediate Action Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>{t('actionTitle')}</span>
                </CardTitle>
                <CardDescription>{t('actionDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">{t('schoolMeeting')}</p>
                      <p className="text-xs text-orange-700">{t('answerBy')}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        {t('showWhatToDo')}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{t('reportCard')}</p>
                      <p className="text-xs text-green-700">{t('nextStep')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Decoding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>{t('understandingRules')}</span>
                </CardTitle>
                <CardDescription>{t('rulesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">{t('iepMeeting')}</h4>
                    <p className="text-xs text-blue-700 mt-1">{t('iepDesc')}</p>
                    <Button size="sm" variant="link" className="p-0 h-auto text-blue-600">
                      {t('learnMore')} →
                    </Button>
                  </div>
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">{t('plan504')}</h4>
                    <p className="text-xs text-blue-700 mt-1">{t('plan504Desc')}</p>
                    <Button size="sm" variant="link" className="p-0 h-auto text-blue-600">
                      {t('learnMore')} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rights and Advocacy Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>{t('rightsTitle')}</span>
                </CardTitle>
                <CardDescription>{t('rightsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900">{t('whatYouCanDo')}</h4>
                    <ul className="text-xs text-purple-700 mt-2 space-y-1">
                      <li>{t('rightsText1')}</li>
                      <li>{t('rightsText2')}</li>
                      <li>{t('rightsText3')}</li>
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      {t('emailExamples')}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      {t('questionsToAsk')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resource Mapping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>{t('helpNearYou')}</span>
                </CardTitle>
                <CardDescription>{t('helpNearYouDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">{t('specialEdHelp')}</h4>
                    <p className="text-xs text-green-700 mt-1">{t('specialEdDesc')}</p>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">{t('collegePrepHelp')}</h4>
                    <p className="text-xs text-green-700 mt-1">{t('collegePrepDesc')}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    {t('seeAllHelp')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Contextualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span>{t('howChildDoing')}</span>
                </CardTitle>
                <CardDescription>{t('howChildDoingDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h4 className="text-sm font-medium text-indigo-900">{t('schoolPerformance')}</h4>
                    <p className="text-xs text-indigo-700 mt-1">{t('schoolPerformanceDesc')}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h4 className="text-sm font-medium text-indigo-900">{t('futureOptions')}</h4>
                    <p className="text-xs text-indigo-700 mt-1">{t('futureOptionsDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const MainPageWithTranslation: React.FC = () => {
  return (
    <TranslationProvider>
      <ParentInTheLoopPlatform />
    </TranslationProvider>
  );
};

export default MainPageWithTranslation;