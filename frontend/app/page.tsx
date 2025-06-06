"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { api } from "@/lib/api";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface DocumentInfo {
  name: string;
  type: string;
  uploadDate: Date;
  status: "processed" | "processing" | "pending";
}

export default function ParentInTheLoopPlatform() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I am here to help you with your child's school. You can upload school papers or photos, and I will help you understand what to do next.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [uploadedDocs, setUploadedDocs] = useState<DocumentInfo[]>([
    {
      name: "IEP_Notice_2024.pdf",
      type: "IEP Notice",
      uploadDate: new Date(),
      status: "processed",
    },
    {
      name: "Report_Card_Q1.pdf",
      type: "Report Card",
      uploadDate: new Date(),
      status: "processed",
    },
  ]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I understand. Let me look at your school papers and help you know what to do. I will give you simple steps to follow.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleTranslate = async () => {
    // DeepL API integration would go here
    const languages = [
      "English",
      "Spanish",
      "Chinese",
      "Arabic",
      "French",
      "Portuguese",
      "Russian",
    ];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    setCurrentLanguage(nextLanguage);

    // In a real implementation, you would call DeepL API here
    console.log(`Translating to ${nextLanguage}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/hello/");
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Parent in the Loop
              </h1>
              <p className="text-sm text-gray-600">
                We help parents understand their child's school
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleTranslate}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Languages className="h-4 w-4" />
              <span>{currentLanguage}</span>
            </Button>
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              {uploadedDocs.length} Papers Ready
            </Badge>
            <Button variant="outline" size="sm">
              Settings
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Your School Helper
                </h2>
                <p className="text-sm text-gray-600">
                  Ask questions and get help right away
                </p>
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
              <p className="text-sm text-blue-700 font-medium">
                Upload School Papers
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Upload files (PDF, Word) or take photos of school papers
              </p>
              <p className="text-xs text-blue-600">
                Report cards, letters from school, IEP papers, etc.
              </p>
              <Button size="sm" className="mt-2" variant="outline">
                Choose Files or Photos
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
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
                placeholder="Ask about your child's school, your rights, or what to do next..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
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
                  <span>What You Need to Do Now</span>
                </CardTitle>
                <CardDescription>
                  Important things to do and when to do them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        School Meeting - Answer Needed
                      </p>
                      <p className="text-xs text-orange-700">
                        You must answer by March 15, 2024
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Show Me What to Do
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Report Card - Done
                      </p>
                      <p className="text-xs text-green-700">
                        Next: Talk to your child's teacher
                      </p>
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
                  <span>Understanding School Rules</span>
                </CardTitle>
                <CardDescription>
                  We explain school processes in simple words
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">
                      IEP Meeting
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      A meeting to talk about special help for your child at
                      school...
                    </p>
                    <Button
                      size="sm"
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                    >
                      Learn More →
                    </Button>
                  </div>
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900">
                      504 Plan
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Special help for children who need extra support in
                      school...
                    </p>
                    <Button
                      size="sm"
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                    >
                      Learn More →
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
                  <span>Your Rights as a Parent</span>
                </CardTitle>
                <CardDescription>
                  Know what you can do and ask for at school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900">
                      What You Can Do
                    </h4>
                    <ul className="text-xs text-purple-700 mt-2 space-y-1">
                      <li>• You can join school meetings about your child</li>
                      <li>• You can ask for tests to help your child</li>
                      <li>• You can see your child's school records</li>
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Email Examples
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Questions to Ask
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
                  <span>Help Near You</span>
                </CardTitle>
                <CardDescription>
                  Services and programs in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">
                      Special Education Help
                    </h4>
                    <p className="text-xs text-green-700 mt-1">
                      3 programs available in your area
                    </p>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900">
                      College Prep Programs
                    </h4>
                    <p className="text-xs text-green-700 mt-1">
                      5 programs taking new students
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    See All Help Available
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Contextualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span>How Your Child is Doing</span>
                </CardTitle>
                <CardDescription>
                  What your child's grades mean for their future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h4 className="text-sm font-medium text-indigo-900">
                      School Performance
                    </h4>
                    <p className="text-xs text-indigo-700 mt-1">
                      Your child is doing well in math and reading. They might
                      be ready for harder classes.
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h4 className="text-sm font-medium text-indigo-900">
                      Future Options
                    </h4>
                    <p className="text-xs text-indigo-700 mt-1">
                      Your child can take college prep classes to get ready for
                      university.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
