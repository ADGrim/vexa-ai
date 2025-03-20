// Utility class to analyze and adapt response styles to match user communication patterns
export class SpeakMyStyle {
  private enabled: boolean = false;
  private userMessages: string[] = [];

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  recordMessage(message: string) {
    this.userMessages.push(message);
    // Keep only last 10 messages for analysis
    if (this.userMessages.length > 10) {
      this.userMessages.shift();
    }
  }

  styleResponse(response: string): string {
    if (!this.enabled || this.userMessages.length === 0) {
      return response;
    }

    const lastMsg = this.userMessages[this.userMessages.length - 1];

    // Mimic excited tone with exclamation marks
    if (lastMsg.includes('!')) {
      response = response.replace(/[.?\s]*$/, '!');
    }

    // Mimic emoji usage
    if (lastMsg.includes(':)') || lastMsg.includes('😊')) {
      response = response.replace(/[.?\s]*$/, ' 😊');
    }

    // Mimic shouting (uppercase)
    const lettersOnly = lastMsg.replace(/[^A-Za-z]/g, '');
    if (lettersOnly.length > 0) {
      const uppercaseRatio = (lettersOnly.replace(/[^A-Z]/g, '').length) / lettersOnly.length;
      if (uppercaseRatio > 0.5) {
        response = response.toUpperCase();
      }
    }

    // Mimic inquisitive style
    const questionCount = this.userMessages.filter(msg => msg.trim().endsWith('?')).length;
    if (questionCount / this.userMessages.length > 0.5) {
      if (!response.trim().endsWith('?')) {
        response = response.replace(/[.!\s]*$/, '?');
      }
    }

    return response;
  }
}

export const speakMyStyle = new SpeakMyStyle();
