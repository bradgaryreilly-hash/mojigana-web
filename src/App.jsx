import { useMojiganaApp } from './hooks/useMojiganaApp';
import HomeView from './components/views/HomeView';
import SelectionView from './components/views/SelectionView';
import QuizView from './components/views/QuizView';
import ResultsView from './components/views/ResultsView';
import SettingsModal from './components/modals/SettingsModal';
import MasteryGuideModal from './components/modals/MasteryGuideModal';
import InfoPagesModal from './components/modals/InfoPagesModal';

/**
 * MojiGana - Version 7.7.3
 * Update: Manual confirm option for typed quiz answers (Enter / Space to submit)
 */
const App = () => {
  const app = useMojiganaApp();

  // Must match HomeView gradients: safe-area padding paints the shell background,
  // so on Home a plain white shell showed as a bar above the transparent header.
  const shellBg =
    app.currentView === 'home'
      ? app.isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40'
        : 'bg-gradient-to-br from-cyan-50 via-white to-emerald-50'
      : app.isDark
        ? 'bg-slate-900'
        : 'bg-white';

  return (
    <div className="min-h-screen w-full bg-slate-900 flex justify-center selection:bg-emerald-100">
      <div
        className={`w-full max-w-xl min-h-[100dvh] h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 box-border pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] ${shellBg}`}
      >
        {app.currentView === 'home' && (
          <HomeView
            isDark={app.isDark}
            toggleTheme={app.toggleTheme}
            setIsSettingsOpen={app.setIsSettingsOpen}
            setCurrentView={app.setCurrentView}
            setInfoModal={app.setInfoModal}
          />
        )}
        {app.currentView === 'selection' && (
          <SelectionView
            isDark={app.isDark}
            scriptMode={app.scriptMode}
            setScriptMode={app.setScriptMode}
            selectedIds={app.selectedIds}
            setSelectedIds={app.setSelectedIds}
            mastery={app.mastery}
            sessionDuration={app.sessionDuration}
            setSessionDuration={app.setSessionDuration}
            setCurrentView={app.setCurrentView}
            toggleTheme={app.toggleTheme}
            setIsSettingsOpen={app.setIsSettingsOpen}
            setIsMasteryInfoOpen={app.setIsMasteryInfoOpen}
            startQuiz={app.startQuiz}
            getId={app.getId}
            toggleKana={app.toggleKana}
            toggleMedalGroup={app.toggleMedalGroup}
            toggleRow={app.toggleRow}
            toggleCol={app.toggleCol}
            toggleAllInLayout={app.toggleAllInLayout}
          />
        )}
        {app.currentView === 'quiz' && (
          <QuizView
            isDark={app.isDark}
            isSmartTraining={app.isSmartTraining}
            sessionDuration={app.sessionDuration}
            timeLeft={app.timeLeft}
            isPaused={app.isPaused}
            setIsPaused={app.setIsPaused}
            setCurrentView={app.setCurrentView}
            toggleTheme={app.toggleTheme}
            setIsSettingsOpen={app.setIsSettingsOpen}
            showPrev={app.showPrev}
            prevQuizItem={app.prevQuizItem}
            showNext={app.showNext}
            nextQuizItem={app.nextQuizItem}
            currentQuizItem={app.currentQuizItem}
            isCorrect={app.isCorrect}
            isWrong={app.isWrong}
            showingAnswer={app.showingAnswer}
            setShowingAnswer={app.setShowingAnswer}
            isMultipleChoice={app.isMultipleChoice}
            quizOptions={app.quizOptions}
            handleInputChange={app.handleInputChange}
            handleQuizInputKeyDown={app.handleQuizInputKeyDown}
            handleQuizInputKeyUp={app.handleQuizInputKeyUp}
            handleQuizInputBeforeInput={app.handleQuizInputBeforeInput}
            manualAnswerConfirm={app.manualAnswerConfirm}
            inputRef={app.inputRef}
            inputValue={app.inputValue}
            isFocused={app.isFocused}
            setIsFocused={app.setIsFocused}
          />
        )}
        {app.currentView === 'results' && (
          <ResultsView
            isDark={app.isDark}
            sessionStats={app.sessionStats}
            getPool={app.getPool}
            sortConfig={app.sortConfig}
            setSortConfig={app.setSortConfig}
            setCurrentView={app.setCurrentView}
          />
        )}
        <SettingsModal
          isDark={app.isDark}
          isSettingsOpen={app.isSettingsOpen}
          setIsSettingsOpen={app.setIsSettingsOpen}
          isMultipleChoice={app.isMultipleChoice}
          setIsMultipleChoice={app.setIsMultipleChoice}
          isSmartTraining={app.isSmartTraining}
          setIsSmartTraining={app.setIsSmartTraining}
          showPrev={app.showPrev}
          setShowPrev={app.setShowPrev}
          showNext={app.showNext}
          setShowNext={app.setShowNext}
          manualAnswerConfirm={app.manualAnswerConfirm}
          setManualAnswerConfirm={app.setManualAnswerConfirm}
          setInfoModal={app.setInfoModal}
        />
        <InfoPagesModal
          isDark={app.isDark}
          infoModal={app.infoModal}
          setInfoModal={app.setInfoModal}
        />
        <MasteryGuideModal
          isDark={app.isDark}
          isMasteryInfoOpen={app.isMasteryInfoOpen}
          setIsMasteryInfoOpen={app.setIsMasteryInfoOpen}
        />
      </div>
    </div>
  );
};

export default App;
