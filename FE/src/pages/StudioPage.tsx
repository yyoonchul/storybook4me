import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useStudioTitle, usePageText } from "../features/studio/hooks";
import { storybookApi } from "@/features/storybook";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";
import { Button } from "../shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/components/ui/card";
import { Input } from "../shared/components/ui/input";
import { Textarea } from "../shared/components/ui/textarea";
import { Separator } from "../shared/components/ui/separator";
import { ScrollArea } from "../shared/components/ui/scroll-area";
import { 
  ChevronLeft, 
  ChevronRight, 
  Send,
  Wand2,
  ArrowLeft,
  Loader2
} from "lucide-react";

// Mock chat history for AI chat feature

const mockChatHistory = [
  { role: "assistant", content: "Hello! I'm your AI storytelling assistant. How would you like to improve your story today?" },
  { role: "user", content: "Make Nova look more excited in the first page" },
  { role: "assistant", content: "Great idea! I've updated Nova's expression to show more excitement. Her eyes are now sparkling with wonder as she looks at the stars. Would you like me to adjust anything else?" }
];

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prompt = searchParams.get("prompt");
  const initialMode = searchParams.get("mode");

  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(mockChatHistory);
  
  // Title editing (debounced autosave)
  const { title: liveTitle, setTitle: setLiveTitle, status: titleStatus, isFetching: isTitleFetching } = useStudioTitle(id);
  
  // Storybook data - using same approach as BookViewerPage
  const [storybook, setStorybook] = useState<any>(null);
  const [isStorybookLoading, setIsStorybookLoading] = useState(true);
  const [storybookError, setStorybookError] = useState<string | null>(null);
  const { session, isLoaded } = useSession();

  // Load storybook data
  useEffect(() => {
    if (!id || !isLoaded) return;
    let mounted = true;
    setIsStorybookLoading(true);
    setStorybookError(null);
    (async () => {
      try {
        const token = await session?.getToken({ template: 'storybook4me' });
        const res = await storybookApi.get(id, token || undefined);
        if (!mounted) return;
        setStorybook(res.storybook);
      } catch (e: any) {
        if (!mounted) return;
        setStorybookError(e?.message || 'Failed to load storybook');
      } finally {
        if (!mounted) return;
        setIsStorybookLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isLoaded, session]);
  
  // Current page content editing - using same pattern as title editing
  const currentPageNumber = storybook?.pages?.[currentPage]?.page_number;
  const { 
    text: pageText, 
    setText: setPageText, 
    status: pageStatus, 
    error: pageError, 
    isFetching: isPageFetching 
  } = usePageText(id, currentPageNumber || undefined);

  // Reset current page when storybook changes
  useEffect(() => {
    if (storybook?.pages?.length && currentPage >= storybook.pages.length) {
      setCurrentPage(0);
    }
  }, [storybook?.pages?.length, currentPage]);

  // Debug: Log storybook data
  useEffect(() => {
    if (storybook) {
      console.log('Storybook loaded:', storybook);
      console.log('Pages:', storybook.pages);
    }
  }, [storybook]);
  const [rightMode, setRightMode] = useState<'preview' | 'settings'>(initialMode === 'settings' ? 'settings' : 'preview');
  const [settingsTab, setSettingsTab] = useState<'synopsis' | 'characters' | 'style'>('synopsis');
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const synopsisBtnRef = useRef<HTMLButtonElement>(null);
  const charactersBtnRef = useRef<HTMLButtonElement>(null);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const [settingsHighlight, setSettingsHighlight] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const updateSettingsHighlight = () => {
    const container = settingsMenuRef.current;
    if (!container) return;
    const target = settingsTab === 'synopsis' ? synopsisBtnRef.current : settingsTab === 'characters' ? charactersBtnRef.current : styleBtnRef.current;
    if (!target) return;
    const cRect = container.getBoundingClientRect();
    const bRect = target.getBoundingClientRect();
    setSettingsHighlight({ left: bRect.left - cRect.left, width: bRect.width });
  };

  useLayoutEffect(() => {
    // Measure immediately after layout
    updateSettingsHighlight();
    // Next frame to account for font/render adjustments
    const raf = requestAnimationFrame(() => updateSettingsHighlight());
    return () => cancelAnimationFrame(raf);
  }, [settingsTab, rightMode]);

  useEffect(() => {
    const onResize = () => updateSettingsHighlight();
    window.addEventListener('resize', onResize);
    // Observe container size changes
    const container = settingsMenuRef.current;
    let ro: ResizeObserver | undefined;
    if (container && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => updateSettingsHighlight());
      ro.observe(container);
    }
    // Fallback delayed measurement (first paint)
    const t = setTimeout(() => updateSettingsHighlight(), 100);
    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  // Simulate initial generation if there's a prompt
  useEffect(() => {
    if (prompt && !id) {
      setIsGenerating(true);
      const timer = setTimeout(() => setIsGenerating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [prompt, id]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = { role: "user" as const, content: chatMessage };
    setChatHistory([...chatHistory, newMessage]);
    setChatMessage("");
    
    setIsGenerating(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        role: "assistant" as const, 
        content: "I've made those changes to your story! The characters now have more vibrant expressions and the scene feels more dynamic. What would you like to adjust next?"
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };


  const handleFinishStory = () => {
    // Generate new ID for completed story
    const newId = `completed-${Date.now()}`;
    navigate(`/book/${newId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isGenerating && !id) {
  return (
    <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <Card className="glass-effect p-8 text-center max-w-md">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 mx-auto mb-4">
                <Wand2 className="w-full h-full text-purple-500 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold">Creating Your Story</h2>
              <p className="text-muted-foreground">Story fairies are weaving magic...</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
          {prompt && (
                <div className="mt-4 p-3 bg-white/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Your idea:</p>
                  <p className="text-sm font-medium">{prompt}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Top Bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <input
                  value={liveTitle ?? ''}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  placeholder="Untitled storybook"
                  className="text-lg font-semibold bg-white/60 border border-gray-300 rounded px-2 py-1 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors disabled:opacity-60"
                  aria-label="Storybook title"
                  disabled={isTitleFetching}
                />
                <span
                  className={
                    `text-xs min-w-[60px] text-right ` +
                    (titleStatus === 'saved'
                      ? 'text-purple-600'
                      : titleStatus === 'error'
                      ? 'text-red-600'
                      : titleStatus === 'saving'
                      ? 'text-amber-600'
                      : 'text-muted-foreground')
                  }
                >
                  {isTitleFetching && 'Loading title...'}
                  {!isTitleFetching && titleStatus === 'saving' && 'Saving...'}
                  {titleStatus === 'saved' && 'Saved'}
                  {titleStatus === 'error' && 'Save failed'}
                  {titleStatus === 'idle' && 'Saved'}
                </span>
              </div>
            </div>
            
            <Button onClick={handleFinishStory} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Save Storybook
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - Editor */}
        <div className="w-[30%] border-r bg-white/50 backdrop-blur-sm flex flex-col min-h-0">
          <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
            <h3 className="text-sm font-semibold">AI Storyteller</h3>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            <div className="h-full flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white border'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-white border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Tell me what you'd like to change..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!chatMessage.trim() || isGenerating}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Try: "Make the character happier" or "Add a rainbow in the background"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-[70%] bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col min-h-0">
          <div className="p-4 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-lg font-semibold">{rightMode === 'preview' ? 'Live Preview' : 'Story Settings'}</h3>
              <p className="text-sm text-muted-foreground">{rightMode === 'preview' ? 'See your changes in real-time' : 'Review and edit global story settings'}</p>
            </div>
            <div className="relative inline-flex rounded-full bg-white border shadow-sm p-1 overflow-hidden">
              <span
                className="absolute inset-y-1 left-1 rounded-full bg-purple-500/15 border border-purple-400/30 transition-transform duration-300 ease-out"
                style={{ width: 'calc(50% - 0.25rem)', transform: `translateX(${rightMode === 'preview' ? '0%' : '100%'})` }}
                aria-hidden
              />
              <button
                className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                  rightMode === 'preview'
                    ? 'text-purple-700'
                    : 'hover:bg-gray-100 active:scale-[0.98]'
                }`}
                aria-pressed={rightMode === 'preview'}
                onClick={() => setRightMode('preview')}
              >
                Preview
              </button>
              <button
                className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                  rightMode === 'settings'
                    ? 'text-purple-700'
                    : 'hover:bg-gray-100 active:scale-[0.98]'
                }`}
                aria-pressed={rightMode === 'settings'}
                onClick={() => setRightMode('settings')}
              >
                Settings
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col min-h-0">
            {rightMode === 'preview' ? (
              <Card className="glass-effect flex-1 overflow-hidden min-h-0">
                <CardContent className="p-0 h-full flex flex-col min-h-0">
                  {/* Preview Book Page */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
                    {/* Image Side */}
                    <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-6 min-h-0">
                      <div className="aspect-square w-full max-w-xs">
                        <img 
                          src={'/placeholder.svg'} 
                          alt={`Preview`}
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-xs px-3 py-1 rounded-full border shadow">
                        This is a preview image. Actual images will be custom-generated.
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className="p-6 flex flex-col justify-center bg-white/50 min-h-0">
                      <div className="text-center lg:text-left">
                        {isStorybookLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Loading storybook...</span>
                          </div>
                        ) : storybookError ? (
                          <div className="text-red-500 text-center py-8">
                            Error loading storybook: {storybookError}
                          </div>
                        ) : (
                          <>
                            <Textarea
                              value={pageText ?? ''}
                              onChange={(e) => setPageText(e.target.value)}
                              className="text-base leading-relaxed text-gray-700 mb-4 min-h-[120px] resize-none border-0 bg-transparent p-0 focus:ring-0 focus:border-0"
                              placeholder="Enter your story text here..."
                              disabled={isPageFetching}
                            />
                            
                            <Separator className="my-4" />
                            
                            <div className="text-sm text-muted-foreground flex justify-between items-center">
                              <span>Page {currentPage + 1} of {storybook?.pages?.length || 0}</span>
                              {pageStatus === 'saving' && (
                                <span className="text-blue-500 text-xs">Saving...</span>
                              )}
                              {pageStatus === 'saved' && (
                                <span className="text-green-500 text-xs">Saved</span>
                              )}
                              {pageStatus === 'error' && (
                                <span className="text-red-500 text-xs">Save failed</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="p-4 bg-white/80 backdrop-blur-sm border-t flex justify-between items-center flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {storybook?.pages?.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentPage ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min((storybook?.pages?.length || 1) - 1, currentPage + 1))}
                      disabled={currentPage === (storybook?.pages?.length || 1) - 1}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-effect flex-1 overflow-hidden min-h-0">
                <CardContent className="p-0 h-full flex flex-col min-h-0">
                  {/* Floating settings menu */}
                  <div className="sticky top-0 z-10 px-4 pt-4">
                    <div ref={settingsMenuRef} className="relative inline-flex rounded-full bg-white border shadow-sm p-1 overflow-hidden">
                      <span
                        className="absolute inset-y-1 rounded-full bg-purple-500/15 border border-purple-400/30 transition-all duration-300 ease-out"
                        style={{ left: settingsHighlight.left + 4, width: Math.max(0, settingsHighlight.width - 8) }}
                        aria-hidden
                      />
                      <button
                        ref={synopsisBtnRef}
                        className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                          settingsTab === 'synopsis'
                            ? 'text-purple-700'
                            : 'hover:bg-gray-100 active:scale-[0.98]'
                        }`}
                        aria-pressed={settingsTab === 'synopsis'}
                        onClick={() => setSettingsTab('synopsis')}
                      >
                        Synopsis
                      </button>
                      <button
                        ref={charactersBtnRef}
                        className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                          settingsTab === 'characters'
                            ? 'text-purple-700'
                            : 'hover:bg-gray-100 active:scale-[0.98]'
                        }`}
                        aria-pressed={settingsTab === 'characters'}
                        onClick={() => setSettingsTab('characters')}
                      >
                        Characters
                      </button>
                      <button
                        ref={styleBtnRef}
                        className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                          settingsTab === 'style'
                            ? 'text-purple-700'
                            : 'hover:bg-gray-100 active:scale-[0.98]'
                        }`}
                        aria-pressed={settingsTab === 'style'}
                        onClick={() => setSettingsTab('style')}
                      >
                        Style
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-6 space-y-6">
                    {settingsTab === 'synopsis' && (
                      <>
                        <div>
                          <h4 className="text-base font-semibold mb-2">Main Concept</h4>
                          <Textarea
                            defaultValue={prompt || "A brave young explorer discovers magical worlds beyond the stars"}
                            className="min-h-[80px] resize-none w-full max-w-full"
                            placeholder="Enter your main story concept..."
                          />
                        </div>
                        <Separator />
                        <div>
                          <h4 className="text-base font-semibold mb-2">Story Synopsis</h4>
                          <Textarea
                            defaultValue="Nova, a young space explorer, embarks on an incredible journey through the galaxy with her robot companion Zyx. Together, they discover new worlds, face exciting challenges, and learn valuable lessons about friendship and courage."
                            className="min-h-[100px] resize-none w-full max-w-full"
                            placeholder="Write an overall synopsis of your story..."
                          />
                        </div>
                      </>
                    )}

                    {settingsTab === 'characters' && (
                      <>
                        <div>
                          <h4 className="text-base font-semibold mb-2">Characters</h4>
                          <div className="flex flex-wrap gap-3">
                            <div className="relative bg-white rounded-lg p-3 border shadow-sm min-w-[140px]">
                              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <img src="/placeholder.svg" alt="Nova" className="w-10 h-10 rounded-full" />
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">Nova</div>
                                <div className="text-xs text-muted-foreground">Main Character</div>
                              </div>
                              <button className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center">×</button>
                            </div>
                            <div className="relative bg-white rounded-lg p-3 border shadow-sm min-w-[140px]">
                              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                                <img src="/placeholder.svg" alt="Zyx" className="w-10 h-10 rounded-full" />
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">Zyx</div>
                                <div className="text-xs text-muted-foreground">Robot Companion</div>
                              </div>
                              <button className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center">×</button>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1">👥 Select from My Family</Button>
                            <Button variant="outline" size="sm">+ Create</Button>
                          </div>
                        </div>
                      </>
                    )}

                    {settingsTab === 'style' && (
                      <>
                        <div>
                          <h4 className="text-base font-semibold mb-2">Art Style</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button className="relative p-3 border-2 border-purple-500 bg-purple-50 rounded-lg text-left overflow-hidden group">
                          <div className="flex items-center gap-4">
                            <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 rounded overflow-hidden w-1/2">
                              <img src="/placeholder.svg" alt="Watercolor Fantasy" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Watercolor Fantasy</div>
                              <div className="text-xs text-muted-foreground">Soft, dreamy illustrations</div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </button>
                        <button className="relative p-3 border rounded-lg text-left hover:border-gray-400 overflow-hidden group">
                          <div className="flex items-center gap-4">
                            <div className="aspect-video bg-gradient-to-br from-blue-200 to-green-200 rounded overflow-hidden w-1/2">
                              <img src="/placeholder.svg" alt="Digital Cartoon" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Digital Cartoon</div>
                              <div className="text-xs text-muted-foreground">Bright, colorful style</div>
                            </div>
                          </div>
                        </button>
                        <button className="relative p-3 border rounded-lg text-left hover:border-gray-400 overflow-hidden group">
                          <div className="flex items-center gap-4">
                            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded overflow-hidden w-1/2">
                              <img src="/placeholder.svg" alt="Realistic Art" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Realistic Art</div>
                              <div className="text-xs text-muted-foreground">Detailed, lifelike images</div>
                            </div>
                          </div>
                        </button>
                        <button className="relative p-3 border rounded-lg text-left hover:border-gray-400 overflow-hidden group">
                          <div className="flex items-center gap-4">
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded overflow-hidden w-1/2">
                              <img src="/placeholder.svg" alt="Minimalist" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Minimalist</div>
                              <div className="text-xs text-muted-foreground">Simple, clean designs</div>
                            </div>
                          </div>
                        </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudioPage;