
// Fix: Made uri and title optional to match the GroundingChunk type from `@google/genai`, resolving a type incompatibility error.
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}
