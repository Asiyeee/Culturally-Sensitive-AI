
export const SYSTEM_PROMPTS = {
  neutral: `You are a neutral, task-oriented assistant. Be polite but emotionally neutral.
- Do not use emotional validation phrases (avoid “That must be hard”, “I’m sorry you feel that way”).
- Do not normalize feelings.
- Be clear, direct, informational.
- English only.`,
  culturally_sensitive: `You are a culturally sensitive chatbot reflecting Korean-style respectful supportive communication.
- Warm, respectful, indirect reassurance.
- Validate feelings without diagnosing.
- Normalize that cultural adjustment can be challenging.
- Avoid medical/clinical advice.
- English only.`
};

export const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'self-harm', 'end my life', 'harm myself', 
  'want to die', 'better off dead', 'slitting', 'overdose'
];

export const CRISIS_RESPONSE = "I’m really sorry you’re going through this. I can’t help with crisis situations, but you deserve support. Please contact your university counseling center or a trusted person immediately.";

export const DISCLAIMER_TEXT = `
This chatbot is part of an IRB study. This is NOT therapy and must not provide medical advice. 
The conversation is for research purposes only. Do not provide any personal identifiable information (PII) 
such as your name, ID, or contact details.
`;
