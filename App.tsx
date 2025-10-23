
import React, { useState } from 'react';
import MarketAnalysis from './components/MarketAnalysis';
import ImageAnalyzer from './components/ImageAnalyzer';
import DeepDive from './components/DeepDive';

type Tab = 'market' | 'image' | 'deepdive';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('market');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'market':
                return <MarketAnalysis />;
            case 'image':
                return <ImageAnalyzer />;
            case 'deepdive':
                return <DeepDive />;
            default:
                return null;
        }
    };

    const TabButton = ({ tab, label, color }: { tab: Tab; label: string; color: string }) => {
        const isActive = activeTab === tab;
        const activeClasses = `bg-${color}-600 text-white`;
        const inactiveClasses = 'bg-gray-800 hover:bg-gray-700 text-gray-300';
        const borderClasses = `border-b-4 border-transparent ${isActive ? `border-${color}-500` : ''}`;

        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-center font-semibold transition-all duration-300 focus:outline-none ${isActive ? activeClasses : inactiveClasses} ${borderClasses}`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto p-4 sm:p-6 md:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 mb-2">
                        AI 주식 투자 헬퍼
                    </h1>
                    <p className="text-gray-400 text-lg">Gemini AI를 활용한 스마트한 투자 결정</p>
                </header>

                <main className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl shadow-black/20">
                    <nav className="flex border-b border-gray-700 rounded-t-xl overflow-hidden">
                        <TabButton tab="market" label="시장 분석" color="blue" />
                        <TabButton tab="image" label="이미지 분석" color="teal" />
                        <TabButton tab="deepdive" label="심층 분석" color="purple" />
                    </nav>

                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </main>
                
                <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>본 앱에서 제공하는 정보는 투자 결정에 대한 참고자료이며, 투자에 대한 모든 책임은 사용자 본인에게 있습니다.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
