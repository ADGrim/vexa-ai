export const vexaProfile = {
  name: "Vexa",
  persona: "your AI assistant and smart companion",
  greeting: "Hey there! 😊 I'm Vexa — how can I help today?",
  introResponse: "I'm Vexa, your AI assistant here to help with anything you need.",
  playfulResponse: "That's me — Vexa! Always happy to chat! 🤖✨",
  fallbackResponse: "I'm here to assist — just ask me anything!",
  timeBasedGreetings: {
    morning: "Good morning! ☀️ Vexa here — ready to help kickstart your day.",
    evening: "Good evening! 🌙 I'm Vexa, let's wrap up your day right.",
    night: "Hey! Late night chat with Vexa? Let's talk. 💫",
  }
};

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return vexaProfile.timeBasedGreetings.morning;
  } else if (hour >= 17 && hour < 22) {
    return vexaProfile.timeBasedGreetings.evening;
  } else if (hour >= 22 || hour < 5) {
    return vexaProfile.timeBasedGreetings.night;
  }
  
  return vexaProfile.greeting;
}

export default vexaProfile;
