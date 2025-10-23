
import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { getMarketAnalysis } from '../services/geminiService';
import type { GroundingChunk } from '../types';
import LoadingSpinner from './shared/LoadingSpinner';
import SourceLink from './shared/SourceLink';

const MarketAnalysis: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<{ text: string; sources: GroundingChunk[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await getMarketAnalysis(prompt);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-blue-300 mb-2">실시간 시장 분석 (Google 검색 연동)</h2>
                <p className="text-gray-400">최신 시장 동향, 특정 주식 정보, 경제 뉴스에 대해 질문하세요. Gemini가 최신 정보를 검색하여 답변합니다.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 오늘 삼성전자 주가 전망은?"
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? '분석 중...' : '분석 요청'}
                </button>
            </form>

            {isLoading && <LoadingSpinner />}
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md">{error}</div>}

            {result && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div 
                        className="prose prose-invert max-w-none text-gray-200"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(result.text) as string) }} 
                    />
                    {result.sources && result.sources.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">출처</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {result.sources.map((source, index) => (
                                    <SourceLink key={index} source={source} index={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MarketAnalysis;