
import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { analyzeImage, fileToBase64 } from '../services/geminiService';
import LoadingSpinner from './shared/LoadingSpinner';

const ImageAnalyzer: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !imageFile || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const response = await analyzeImage(prompt, base64Image, imageFile.type);
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
                <h2 className="text-xl font-semibold text-teal-300 mb-2">차트 및 문서 이미지 분석</h2>
                <p className="text-gray-400">주식 차트, 재무제표 스크린샷 등을 업로드하고 질문하여 AI 분석을 받아보세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-4 rounded-md transition-colors duration-300"
                    >
                        이미지 선택
                    </button>
                    {previewUrl && (
                        <div className="mt-4">
                            <img src={previewUrl} alt="Preview" className="rounded-lg max-h-64 w-auto mx-auto" />
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="이미지에 대해 질문하세요. 예: 이 차트의 주요 지지선과 저항선은 어디인가요?"
                        className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-4 focus:ring-2 focus:ring-teal-500 focus:outline-none transition h-32 resize-none"
                        disabled={isLoading || !imageFile}
                    />
                    <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                        disabled={isLoading || !imageFile || !prompt.trim()}
                    >
                        {isLoading ? '분석 중...' : '이미지 분석 요청'}
                    </button>
                </form>
            </div>

            {isLoading && <LoadingSpinner />}
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md">{error}</div>}

            {result && (
                <div className="bg-gray-800 p-4 rounded-lg mt-6">
                    <div 
                        className="prose prose-invert max-w-none text-gray-200"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(result) as string) }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageAnalyzer;