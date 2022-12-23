import { Injectable } from '@angular/core';
import { OpenAIApi, Configuration } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private openai: any;
  private model = "text-davinci-003";
  private apiKey = "";

  constructor() {
    const configuration = new Configuration({
      apiKey: this.apiKey
    });

    this.openai = new OpenAIApi(configuration);
    this.model = this.model;
  }

  // async generateText(prompt: string) {
  //   const model = this.model;
  //   const response = await this.openai.createCompletion({
  //     prompt,
  //     model,
  //     max_tokens: 256
  //   });

  //   return response.data.choices[0].text;
  // }

  async generateText(prompt: string) { 
    const model = this.model;
    const params_ = { 
      prompt,
      model,
      max_tokens: 256
     };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(this.apiKey),
      },
      body: JSON.stringify(params_)
    };
    const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
    const data = await response.json();
    return data.choices[0].text;
  }

}