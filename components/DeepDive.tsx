
import React, { useState } from 'react';
import { getDeepDiveAnalysis } from '../services/geminiService';
import LoadingSpinner from './shared/LoadingSpinner';

const DeepDive: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await getDeepDiveAnalysis(prompt);
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
                <h2 className="text-xl font-semibold text-purple-300 mb-2">심층 분석 (Thinking Mode)</h2>
                <p className="text-gray-400">복잡한 투자 전략, 포트폴리오 구성, 거시 경제 분석 등 깊이 있는 질문을 통해 전문적인 인사이트를 얻으세요.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 인플레이션 시기에 방어주 중심으로 포트폴리오를 재구성하는 전략과 추천 종목 5가지를 알려줘."
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition h-40 resize-y"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? '심층 분석 중...' : '심층 분석 요청'}
                </button>
            </form>

            {isLoading && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-800 rounded-lg">
                    <LoadingSpinner />
                    <p className="mt-2 text-purple-300">Gemini Pro가 심도있게 생각하고 있습니다. 잠시만 기다려주세요...</p>
                </div>
            )}
            
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md">{error}</div>}

            {result && (
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap">{result}</div>
                </div>
            )}
        </div>
    );
};

export default DeepDive;
