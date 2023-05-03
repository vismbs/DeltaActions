import { Configuration, OpenAIApi } from "openai";

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAI = new OpenAIApi(openAIConfiguration);
