import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Supported AI Providers
 */
export type AiProviderType = 'gemini' | 'groq' | 'openrouter' | 'ollama';

/**
 * Provider-neutral Message formats
 */
export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Provider-neutral Tool definitions
 */
export interface AiTool {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema format
}

/**
 * Provider-neutral Tool Call
 */
export interface AiToolCall {
  name: string;
  args: Record<string, any>;
}

/**
 * Unified generation options
 */
export interface AiGenerateOptions {
  model?: string;
  systemInstruction?: string;
  tools?: AiTool[];
  temperature?: number;
  jsonMode?: boolean;
}

/**
 * Unified generation result
 */
export interface AiGenerateResult {
  text?: string;
  toolCalls?: AiToolCall[];
  usage?: AiUsage;
  provider: AiProviderType;
  model: string;
  fallbackUsed?: boolean;
  attemptedProviders?: string[];
}

/**
 * Usage metadata tracking
 */
export interface AiUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Normalized AI Error
 */
export class AiProviderError extends Error {
  constructor(
    public provider: AiProviderType,
    public statusCode: number,
    public message: string,
    public isRetryable: boolean
  ) {
    super(`[${provider}] ${message}`);
    this.name = 'AiProviderError';
  }
}

/**
 * Provider Adapter Contract
 */
export interface AiProviderAdapter {
  getProviderName(): AiProviderType;
  supportsTools(): boolean;
  supportsStructuredOutput(): boolean;
  
  generateChat(messages: AiMessage[], options?: AiGenerateOptions): Promise<AiGenerateResult>;
}



/**
 * Provider-neutral AI Gateway
 * Responsible for selecting providers, fallback logic, and normalizing communication.
 */
export class AiGateway {
  
  // NOTE: Full adapter initialization and fallback routing will be implemented in future commands
  private adapters: Map<AiProviderType, AiProviderAdapter> = new Map();
  
  constructor() {
    // Initialization deferred to prevent circular dependency at module load
  }

  private getAdapter(provider: AiProviderType): AiProviderAdapter {
    if (this.adapters.has(provider)) {
      return this.adapters.get(provider)!;
    }
    
    if (provider === 'gemini') {
      const { GeminiProvider } = require('./providers/gemini.provider');
      const adapter = new GeminiProvider();
      this.adapters.set('gemini', adapter);
      return adapter;
    }
    
    if (provider === 'groq') {
      const { GroqProvider } = require('./providers/groq.provider');
      const adapter = new GroqProvider();
      this.adapters.set('groq', adapter);
      return adapter;
    }
    
    if (provider === 'openrouter') {
      const { OpenRouterProvider } = require('./providers/openrouter.provider');
      const adapter = new OpenRouterProvider();
      this.adapters.set('openrouter', adapter);
      return adapter;
    }
    
    if (provider === 'ollama') {
      const { OllamaProvider } = require('./providers/ollama.provider');
      const adapter = new OllamaProvider();
      this.adapters.set('ollama', adapter);
      return adapter;
    }
    
    throw new Error(`Provider ${provider} not implemented`);
  }

  private getProviderChain(): AiProviderType[] {
    const chain: AiProviderType[] = [];
    
    const primary = process.env.AI_PRIMARY_PROVIDER as AiProviderType;
    if (primary) chain.push(primary);
    
    const fallback = process.env.AI_FALLBACK_PROVIDER as AiProviderType;
    if (fallback && !chain.includes(fallback)) chain.push(fallback);
    
    const secondary = process.env.AI_SECONDARY_PROVIDER as AiProviderType;
    if (secondary && !chain.includes(secondary)) chain.push(secondary);
    
    const local = process.env.AI_LOCAL_PROVIDER as AiProviderType;
    if (local && !chain.includes(local)) chain.push(local);
    
    if (chain.length === 0) chain.push('gemini');
    
    return chain;
  }

  /**
   * Generates a chat response from the configured primary provider, 
   * falling back automatically if required.
   */
  public async generateChat(messages: AiMessage[], options?: AiGenerateOptions): Promise<AiGenerateResult> {
    const chain = this.getProviderChain();
    const attemptedProviders: string[] = [];
    let lastError: any = null;

    for (const providerType of chain) {
      try {
        const adapter = this.getAdapter(providerType);
        
        if (options?.tools && options.tools.length > 0 && !adapter.supportsTools()) {
          console.warn(`[AiGateway] Skipping ${providerType} as it does not support tools`);
          continue;
        }
        if (options?.jsonMode && !adapter.supportsStructuredOutput()) {
          console.warn(`[AiGateway] Skipping ${providerType} as it does not support JSON output`);
          continue;
        }

        attemptedProviders.push(providerType);
        
        const result = await adapter.generateChat(messages, options);
        
        result.fallbackUsed = attemptedProviders.length > 1;
        result.attemptedProviders = attemptedProviders;
        
        return result;
      } catch (error: any) {
        lastError = error;
        
        if (error instanceof AiProviderError) {
          if (!error.isRetryable) {
            throw error;
          }
          console.warn(`[AiGateway] Provider ${providerType} failed (Retryable): ${error.message}`);
        } else {
          throw new AiProviderError(providerType, 500, error?.message || 'Unknown internal error', false);
        }
      }
    }
    
    if (lastError) {
      throw lastError;
    }
    
    throw new Error('No valid providers configured in AiGateway');
  }

  /**
   * Specifically requests structured JSON output from the most suitable provider.
   */
  public async generateJson(prompt: string, options?: Omit<AiGenerateOptions, 'jsonMode'>): Promise<string> {
    const messages: AiMessage[] = [{ role: 'user', content: prompt }];
    const result = await this.generateChat(messages, { ...options, jsonMode: true });
    return result.text || '{}';
  }
}

export const aiGateway = new AiGateway();
