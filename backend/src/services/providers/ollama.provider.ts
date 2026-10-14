import OpenAI from 'openai';
import { 
  AiProviderAdapter, 
  AiProviderType, 
  AiMessage, 
  AiGenerateOptions, 
  AiGenerateResult, 
  AiTool,
  AiProviderError
} from '../ai.gateway';

export class OllamaProvider implements AiProviderAdapter {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
    
    // Ollama's OpenAI-compatible API does not require a real API key, 
    // but the SDK requires a non-empty string.
    this.client = new OpenAI({
      apiKey: 'ollama', 
      baseURL,
    });
    
    // Use llama3.1 as the recommended tool-capable default model
    this.defaultModel = process.env.AI_LOCAL_MODEL || process.env.OLLAMA_MODEL || 'llama3.1';
  }

  getProviderName(): AiProviderType {
    return 'ollama';
  }

  supportsTools(): boolean {
    return true;
  }

  supportsStructuredOutput(): boolean {
    return true;
  }

  /**
   * Converts provider-neutral AiTool to OpenAI's tool format used by Ollama
   */
  private convertToolToOpenAI(tool: AiTool): OpenAI.Chat.ChatCompletionTool {
    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: tool.parameters?.properties || {},
          required: tool.parameters?.required || [],
        },
      },
    };
  }

  /**
   * Normalizes Ollama/OpenAI errors into AiProviderError
   */
  private handleError(error: any): never {
    const status = error?.status || error?.response?.status || 500;
    let isRetryable = false;
    let message = error?.message || 'Unknown error';

    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('fetch failed') || error?.message?.includes('Connection error') || error?.name === 'APIConnectionError') {
      isRetryable = true;
      message = 'Ollama local runtime is not available or connection was refused. Is Ollama running?';
    } else if (status === 404 || message.includes('not found')) {
      isRetryable = false;
      message = `Ollama model not found. Ensure the model is pulled using 'ollama run <model>'`;
    } else if (status === 429 || status === 408 || (status >= 500 && status < 600)) {
      isRetryable = true;
    } else if (error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT') {
      isRetryable = true;
    }

    throw new AiProviderError(
      this.getProviderName(),
      status,
      message,
      isRetryable
    );
  }

  async generateChat(messages: AiMessage[], options?: AiGenerateOptions): Promise<AiGenerateResult> {
    try {
      const modelName = options?.model || this.defaultModel;
      
      const openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      // Add system instruction if provided
      if (options?.systemInstruction) {
        openAiMessages.push({
          role: 'system',
          content: options.systemInstruction,
        });
      }

      // Add user/assistant messages
      for (const msg of messages) {
        openAiMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : (msg.role === 'system' ? 'system' : 'user'),
          content: msg.content,
        });
      }

      const requestPayload: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
        model: modelName,
        messages: openAiMessages,
      };

      if (options?.temperature !== undefined) {
        requestPayload.temperature = options.temperature;
      }

      if (options?.jsonMode) {
        requestPayload.response_format = { type: 'json_object' };
      }

      if (options?.tools && options.tools.length > 0) {
        requestPayload.tools = options.tools.map(this.convertToolToOpenAI);
        // Note: some Ollama models might ignore tool_choice: 'auto' but we pass it per OpenAI standard
        requestPayload.tool_choice = 'auto';
      }

      const response = await this.client.chat.completions.create(requestPayload);
      const choice = response.choices[0];
      const message = choice?.message;

      let toolCalls;
      if (message?.tool_calls && message.tool_calls.length > 0) {
        toolCalls = message.tool_calls.map((tc: any) => ({
          name: tc.function.name,
          args: tc.function.arguments ? JSON.parse(tc.function.arguments) : {},
        }));
      }

      return {
        text: message?.content || '',
        toolCalls,
        provider: this.getProviderName(),
        model: response.model || modelName,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
      
    } catch (error) {
      this.handleError(error);
    }
  }
}
