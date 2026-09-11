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

export class GroqProvider implements AiProviderAdapter {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY || '';
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    // Use openai/gpt-oss-120b as the supported model
    this.defaultModel = process.env.AI_PRIMARY_MODEL || 'openai/gpt-oss-120b';
  }

  getProviderName(): AiProviderType {
    return 'groq';
  }

  supportsTools(): boolean {
    return true;
  }

  supportsStructuredOutput(): boolean {
    return true;
  }

  /**
   * Converts provider-neutral AiTool to OpenAI's tool format used by Groq
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
   * Normalizes Groq/OpenAI errors into AiProviderError
   */
  private handleError(error: any): never {
    const status = error?.status || error?.response?.status || 500;
    let isRetryable = false;
    const message = error?.message || 'Unknown error';

    // 429 is Rate Limit / Quota Exceeded. 408 is Timeout.
    if (status === 429 || status === 408 || (status >= 500 && status < 600)) {
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
