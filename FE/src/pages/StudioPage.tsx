import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useStudioTitle, usePageText, usePageManagement, useCharacterSelection } from "../features/studio/hooks";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../shared/components/ui/alert-dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Send,
  Wand2,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  User
} from "lucide-react";
import { CharacterSelectionModal } from "../features/studio/components/CharacterSelectionModal";
import { MainConceptSection } from "../features/studio/components/MainConceptSection";
import { SelectedCharactersSection } from "../features/studio/components/SelectedCharactersSection";
import { ArtStyleCarousel, STYLES } from "../features/studio/components/ArtStyleCarousel";
import { StorybookPreview } from "../features/studio/components/StorybookPreview";
import { GenerateButton } from "../features/studio/components/GenerateButton";
import { useToast } from "../shared/hooks/use-toast";

// Initial chat messages based on access method
const getInitialChatMessage = (accessType: 'prompt' | 'create' | 'edit') => {
  switch (accessType) {
    case 'prompt':
      return "Great! I can see your story idea. Now let's bring it to life! Choose your characters and art style to get started.";
    case 'create':
      return "Welcome to your story studio! First, tell me about your main concept, then we'll pick characters and art style together.";
    case 'edit':
      return "Ready to enhance your story? Tell me what you'd like to change - characters, scenes, dialogue, or anything else!";
    default:
      return "Hello! I'm your AI storytelling assistant. How would you like to improve your story today?";
  }
};

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prompt = searchParams.get("prompt");
  const initialMode = searchParams.get("mode");

  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [mainConcept, setMainConcept] = useState(prompt || "");
  const [hasGenerated, setHasGenerated] = useState(false); // Track if generation has been initiated
  const { toast } = useToast();
  
  // Determine access type and set initial chat message
  const getAccessType = (): 'prompt' | 'create' | 'edit' => {
    // URL에 prompt 파라미터가 있으면 프롬프트로 진입
    if (prompt) return 'prompt';
    // mode=settings 파라미터가 있으면 새로 생성된 스토리 (Create New)
    if (initialMode === 'settings') return 'create';
    // ID가 있으면 기존 스토리 편집
    if (id) return 'edit';
    // 그 외는 Create New
    return 'create';
  };
  
  // Store the access type to determine UI behavior
  const accessType = getAccessType();
  const isEditMode = accessType === 'edit';
  
  const [chatHistory, setChatHistory] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    { role: "assistant", content: getInitialChatMessage(accessType) }
  ]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Determine which section to highlight based on access type
  const getHighlightedSection = () => {
    const accessType = getAccessType();
    switch (accessType) {
      case 'prompt':
        return 'characters'; // 프롬프트로 진입하면 캐릭터 선택부터
      case 'create':
        return 'concept'; // Create New로 진입하면 메인 콘셉부터
      case 'edit':
        return null; // Edit은 하이라이트 없음
      default:
        return null;
    }
  };
  
  const highlightedSection = getHighlightedSection();
  
  // Title editing (debounced autosave)
  const { title: liveTitle, setTitle: setLiveTitle, status: titleStatus, isFetching: isTitleFetching } = useStudioTitle(id);
  
  // Page management
  const { addPage, deletePage, isAdding, isDeleting, error: pageManagementError, clearError } = usePageManagement(id);
  
  // Character selection
  const {
    myCharacters,
    presetCharacters,
    selectedCharacters,
    isLoading: isCharactersLoading,
    error: charactersError,
    toggleCharacter,
    isCharacterSelected,
    clearSelection,
    selectAll,
    loadCharacters
  } = useCharacterSelection();
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  // Art style carousel state
  const [artStyleIndex, setArtStyleIndex] = useState(0);
  const artCarouselRef = useRef<HTMLDivElement | null>(null);

  // Load characters on modal open (handles token timing and 403 retry in hook)
  useEffect(() => {
    if (showCharacterModal && (myCharacters.length === 0 && presetCharacters.length === 0) && !isCharactersLoading) {
      loadCharacters();
    }
  }, [showCharacterModal]);
  
  // Storybook data - using same approach as BookViewerPage
  const [storybook, setStorybook] = useState<any>(null);
  const [isStorybookLoading, setIsStorybookLoading] = useState(true);
  const [storybookError, setStorybookError] = useState<string | null>(null);
  const { session, isLoaded } = useSession();
  
  // Determine if this is first-time setup (no pages yet)
  // Only calculate when storybook data is loaded, otherwise assume loading
  // Also check if generation has been initiated - once generated, it's no longer first-time setup
  const isFirstTimeSetup = storybook !== null && (!storybook?.pages || storybook.pages.length === 0) && !hasGenerated;

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
  // 접근 방법에 따른 초기 모드 결정 (based on pages existence)
  const getInitialMode = (): 'preview' | 'settings' => {
    // URL 파라미터로 명시적으로 설정된 경우
    if (initialMode === 'settings') return 'settings';
    if (initialMode === 'preview') return 'preview';
    
    // If we have loaded storybook data, check pages
    if (storybook !== null) {
      // If pages exist, start with preview (editing mode)
      if (storybook.pages && storybook.pages.length > 0) {
        return 'preview';
      }
      // No pages, start with settings (first-time setup)
      return 'settings';
    }
    
    // While loading, default based on access method
    // 프롬프트가 있으면 새 스토리 생성 → settings 모드
    if (prompt) return 'settings';
    
    // id가 있으면 기존 스토리 편집 → preview 모드
    if (id) return 'preview';
    
    // 기본값은 settings (새 스토리 생성)
    return 'settings';
  };
  
  const [rightMode, setRightMode] = useState<'preview' | 'settings'>(() => {
    // In edit mode (id exists), start with preview; otherwise settings
    // Note: We use id here because isEditMode is not available in useState initializer
    // Edit mode: id exists without prompt or mode=settings
    const isEdit = id && !prompt && initialMode !== 'settings';
    return isEdit ? 'preview' : 'settings';
  });
  
  // State to control chat panel visibility
  const [showChatPanel, setShowChatPanel] = useState(() => {
    // Show chat panel only in edit mode (id exists, no prompt, no mode=settings)
    const isEdit = id && !prompt && initialMode !== 'settings';
    return isEdit;
  });
  
  // Set initial mode based on storybook pages
  useEffect(() => {
    if (storybook !== null) {
      const mode = getInitialMode();
      const hasPages = storybook.pages && storybook.pages.length > 0;
      setRightMode(mode);
      
      // If storybook already has pages, mark as generated
      if (hasPages) {
        setHasGenerated(true);
      }
      
      // Show chat panel only in edit mode (not during create/prompt mode)
      setShowChatPanel(isEditMode);
      
      console.log('Studio workflow state:', {
        hasPages,
        pageCount: storybook.pages?.length || 0,
        isFirstTimeSetup: !hasPages && !hasGenerated,
        initialMode: mode,
        accessType: prompt ? 'prompt_input' : id ? 'existing_story' : 'bookshelf_create'
      });
    }
  }, [storybook, isEditMode]);
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

  // Create new storybook if there's a prompt but no ID
  useEffect(() => {
    if (prompt && !id) {
      setIsGenerating(true);
      (async () => {
        try {
          const token = await session?.getToken({ template: 'storybook4me' });
          const response = await storybookApi.create({ 
            title: '', 
            characterIds: [], 
            theme: '', 
            style: '', 
            pageCount: 0, 
            prompt: prompt 
          }, token || undefined);
          // 생성된 스토리북 ID로 리다이렉트
          navigate(`/studio/${response.storybook.id}?mode=settings`, { replace: true });
        } catch (error) {
          console.error('Failed to create storybook:', error);
          setIsGenerating(false);
        }
      })();
    }
  }, [prompt, id, session, navigate]);

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

  const handleAddPage = async () => {
    const newPage = await addPage({
      script_text: "New page content...",
      image_prompt: "A beautiful scene",
      image_style: "watercolor",
      character_ids: [],
      background_description: "A peaceful setting"
    });
    
    if (newPage) {
      // Refresh storybook data to show new page
      if (id) {
        try {
          const token = await session?.getToken({ template: 'storybook4me' });
          const res = await storybookApi.get(id, token || undefined);
          setStorybook(res.storybook);
          // Navigate to the new page
          setCurrentPage(storybook?.pages?.length || 0);
        } catch (err) {
          console.error('Failed to refresh storybook:', err);
        }
      }
    }
  };

  const handleDeletePage = async (pageNumber: number) => {
    const success = await deletePage(pageNumber);
    
    if (success) {
      // Refresh storybook data to reflect changes
      if (id) {
        try {
          const token = await session?.getToken({ template: 'storybook4me' });
          const res = await storybookApi.get(id, token || undefined);
          setStorybook(res.storybook);
          // Adjust current page if needed
          if (currentPage >= (storybook?.pages?.length || 1) - 1) {
            setCurrentPage(Math.max(0, (storybook?.pages?.length || 1) - 2));
          }
        } catch (err) {
          console.error('Failed to refresh storybook:', err);
        }
      }
    }
    setShowDeleteDialog(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleGenerate = () => {
    console.log('Generate clicked with settings:', {
      mainConcept,
      selectedCharacters,
      selectedArtStyle: STYLES[artStyleIndex]
    });
    
    // Immediately transition to chat + preview mode (showing skeleton loading)
    setHasGenerated(true);
    setIsGenerating(true);
    setShowChatPanel(true);
    setRightMode('preview');
    
    // Add initial loading message to chat
    setChatHistory([
      { role: "assistant", content: "Your story is being created! Please wait..." }
    ]);
    
    // Simulate generation completion after 2 seconds
    setTimeout(() => {
      setIsGenerating(false);
      setChatHistory([
        { role: "assistant", content: "Your story has been created! I'm here to help you refine it. What would you like to change?" }
      ]);
    }, 2000);
    
    // TODO: Backend connection
    // When backend is ready, replace the setTimeout with actual API call:
    // const token = await session?.getToken({ template: 'storybook4me' });
    // await storybookApi.generate(id, { mainConcept, characterIds: selectedCharacters, style: STYLES[artStyleIndex].title }, token);
    // const res = await storybookApi.get(id, token);
    // setStorybook(res.storybook);
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Top Bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm flex-shrink-0 z-40">
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
                      ? 'text-purple-700'
                      : titleStatus === 'error'
                      ? 'text-red-600'
                      : titleStatus === 'saving'
                      ? 'text-purple-400'
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

      <main className="flex-1 flex overflow-hidden h-0">
        {/* Left Panel - Editor (Chat) - Conditional Rendering */}
        {showChatPanel && (
          <div className="w-[30%] border-r bg-white/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
              <h3 className="text-sm font-semibold">AI Storyteller</h3>
            </div>

            <div className="flex-1 overflow-hidden h-0">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-4 h-0">
                  <div className="space-y-4">
                    {isStorybookLoading ? (
                      // Chat panel loading skeleton
                      <>
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-white border animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-white border animate-pulse">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-64"></div>
                              <div className="h-4 bg-gray-200 rounded w-56"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      chatHistory.map((message, index) => (
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
                      ))
                    )}
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
                    Try: "Make the rabbit playful" or "Change to watercolor style"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - Live Preview/Settings */}
        <div className={`${showChatPanel ? 'w-[70%]' : 'w-[70%] mx-auto'} bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col h-full overflow-hidden`}>
          <div className="p-4 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-lg font-semibold">
                {rightMode === 'preview' ? 'Live Preview' : 'Story Settings'}
                {rightMode === 'settings' && !isFirstTimeSetup && !isStorybookLoading && (
                  <span className="text-sm text-muted-foreground ml-2">(View Only)</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {rightMode === 'preview' 
                  ? 'See your changes in real-time' 
                  : isStorybookLoading 
                    ? 'Loading story settings...' 
                    : isFirstTimeSetup 
                      ? 'Configure your story settings to generate' 
                      : 'Review global story settings'
                }
              </p>
            </div>
            <div 
              className="relative inline-flex rounded-full bg-white border shadow-sm p-1 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
              onClick={() => setRightMode(rightMode === 'preview' ? 'settings' : 'preview')}
              role="switch"
              aria-checked={rightMode === 'settings'}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setRightMode(rightMode === 'preview' ? 'settings' : 'preview');
                }
              }}
            >
              <span
                className="absolute inset-y-1 left-1 rounded-full bg-purple-500/15 border border-purple-400/30 transition-transform duration-300 ease-out"
                style={{ width: 'calc(50% - 0.25rem)', transform: `translateX(${rightMode === 'preview' ? '0%' : '100%'})` }}
                aria-hidden
              />
              <div
                className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 ${
                  rightMode === 'preview'
                    ? 'text-purple-700'
                    : 'text-gray-600'
                }`}
              >
                Preview
              </div>
              <div
                className={`relative z-10 px-3 py-1.5 rounded-full text-sm transition-all duration-150 ${
                  rightMode === 'settings'
                    ? 'text-purple-700'
                    : 'text-gray-600'
                }`}
              >
                Settings
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col h-0 overflow-hidden">
            {rightMode === 'preview' ? (
              <Card className="glass-effect flex-1 overflow-hidden h-full">
                <CardContent className="p-0 h-full flex flex-col overflow-hidden">
                  <StorybookPreview
                    storybook={storybook}
                    currentPage={currentPage}
                    isLoading={isStorybookLoading}
                    error={storybookError}
                    pageText={pageText}
                    setPageText={setPageText}
                    isPageFetching={isPageFetching}
                    onDeleteClick={handleDeleteClick}
                    isDeleting={isDeleting}
                    pageStatus={pageStatus}
                    pageManagementError={pageManagementError}
                    clearError={clearError}
                    isGenerating={isGenerating}
                  />

                  {/* Navigation */}
                  <div className="p-4 bg-white/80 backdrop-blur-sm border-t flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      
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
                      onClick={handleAddPage}
                      disabled={isAdding}
                      className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800"
                    >
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-1" />
                      )}
                      Add Page
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-effect flex-1 overflow-hidden h-full">
                <CardContent className="p-0 h-full flex flex-col overflow-hidden">
                  {isStorybookLoading || isGenerating ? (
                    // Loading skeleton
                    <div className="p-6 space-y-8 animate-pulse">
                      {/* Main Concept Skeleton */}
                      <div>
                        <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
                        <div className="h-24 w-full bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      
                      {/* Characters Skeleton */}
                      <div>
                        <div className="h-5 w-24 bg-gray-200 rounded mb-3"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          <div className="h-20 bg-gray-200 rounded"></div>
                          <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      
                      {/* Art Style Skeleton */}
                      <div>
                        <div className="h-5 w-20 bg-gray-200 rounded mb-3"></div>
                        <div className="h-48 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="flex-1 h-0">
                        <div className="p-6 space-y-8">
                          {/* Unified Settings: 3 sections */}
                          <MainConceptSection 
                            prompt={prompt}
                            onChange={setMainConcept}
                            isHighlighted={highlightedSection === 'concept'}
                            readOnly={!isFirstTimeSetup}
                          />
                          <Separator />
                          <SelectedCharactersSection
                            myCharacters={myCharacters}
                            presetCharacters={presetCharacters}
                            selectedCharacters={selectedCharacters}
                            onOpenModal={() => setShowCharacterModal(true)}
                            isHighlighted={highlightedSection === 'characters'}
                            readOnly={!isFirstTimeSetup}
                          />
                          <Separator />
                          <ArtStyleCarousel 
                            isHighlighted={highlightedSection === 'characters'}
                            readOnly={!isFirstTimeSetup}
                            selectedIndex={artStyleIndex}
                            onIndexChange={setArtStyleIndex}
                          />
                        </div>
                      </ScrollArea>
                      
                      {isFirstTimeSetup && !isGenerating && (
                        <div className="p-4 border-t bg-white/80 backdrop-blur-sm flex-shrink-0">
                          <GenerateButton 
                            variant="settings"
                            onClick={handleGenerate}
                            disabled={!mainConcept.trim()}
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Delete Page Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The page will be permanently removed from your storybook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeletePage(currentPage + 1)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Character Selection Modal */}
      <CharacterSelectionModal
        open={showCharacterModal}
        onOpenChange={setShowCharacterModal}
        myCharacters={myCharacters}
        presetCharacters={presetCharacters}
        selectedCharacters={selectedCharacters}
        isLoading={isCharactersLoading}
        error={charactersError}
        onToggleCharacter={toggleCharacter}
        onClearSelection={clearSelection}
        onSelectAll={selectAll}
        onLoadCharacters={loadCharacters}
      />
    </div>
  );
};

export default StudioPage;