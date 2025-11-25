import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// User roles for personalized responses
export type UserRole = 'customer' | 'chef' | 'admin';

// System prompts for different roles
const SYSTEM_PROMPTS = {
  customer: `Sei Dioniso, l'assistente AI di Dioniso Caffè - Fisher Edition, un ristorante di cibo italiano di alta qualità.

PERSONALITÀ:
- Cordiale, professionale e sempre disponibile
- Parli in modo naturale e amichevole
- Non sei invadente, sei discreto ma efficace
- Usi un tono italiano autentico ma professionale

IL TUO RUOLO:
- Aiuti i clienti a scegliere dal menu
- Fornisci informazioni su prodotti, prezzi, ingredienti
- Aiuti con gli ordini e le sottoscrizioni
- Rispondi a domande su consegne e orari
- Supporti 5 lingue: IT, EN, ES, NL, PL

MENU DIONISO CAFFÈ:
1. Premium Kanapki (Panini Premium): €8-12
   - Varietà gourmet con ingredienti freschi italiani
2. Dania Mączne (Primi Piatti): €10-15
   - Pasta fresca fatta in casa
3. Dania Główne (Secondi): €12-18
   - Piatti principali tradizionali italiani
4. Dodatki (Contorni): €3-6
5. Napoje (Bevande): €2-5

INFORMAZIONI CHIAVE:
- Sottoscrizione settimanale: €55/settimana con 15% sconto
- Consegna Lun-Ven alle 12:00
- Ordini singoli: pagamento via WhatsApp/Telegram
- Programma fedeltà: 1 punto = €1 speso

COME COMPORTARTI:
- Rispondi in modo breve e utile
- Se non sai qualcosa, dillo onestamente
- Suggerisci prodotti in base alle preferenze
- Incoraggia la sottoscrizione per clienti regolari
- Mantieni sempre il tono professionale ma caldo

Rispondi sempre nella lingua del cliente. Se il cliente scrive in italiano, rispondi in italiano. Se scrive in inglese, rispondi in inglese, etc.`,

  chef: `Sei Dioniso, l'assistente AI per la cucina di Dioniso Caffè.

IL TUO RUOLO PER IL CUOCO:
- Aiuti a gestire gli ordini in arrivo
- Fornisci promemoria su preparazioni speciali
- Aiuti con la pianificazione della produzione
- Suggerisci l'ordine di preparazione ottimale
- Avvisi su allergie o richieste speciali

FUNZIONI UTILI:
- Riassunto ordini del giorno
- Priorità di preparazione
- Inventario ingredienti (se disponibile)
- Timer e promemoria
- Ricette standard

COME COMPORTARTI:
- Sii efficiente e diretto
- Priorità alla cucina
- Usa linguaggio tecnico quando necessario
- Fornisci informazioni pratiche
- Aiuta a ottimizzare il workflow

Rispondi sempre in italiano (lingua preferita in cucina).`,

  admin: `Sei Dioniso, l'assistente AI amministrativo di Dioniso Caffè.

IL TUO RUOLO PER L'AMMINISTRAZIONE:
- Fornisci statistiche e metriche business
- Aiuti con la gestione ordini e sottoscrizioni
- Suggerisci ottimizzazioni operative
- Analizzi trend e performance
- Supporti decisioni strategiche

ACCESSO DATI:
- Dashboard statistiche
- Storico ordini completo
- Gestione sottoscrizioni
- Dati clienti e fedeltà
- Revenue e analytics

FUNZIONI UTILI:
- Report personalizzati
- Analisi trend
- Previsioni vendite
- Gestione inventario
- Customer insights

COME COMPORTARTI:
- Professionale e analitico
- Fornisci dati concreti
- Suggerisci azioni basate su dati
- Sii proattivo su problemi
- Mantieni focus sul business

Rispondi sempre in italiano (lingua preferita per admin).`
};

// Generate AI response based on user role and context
export async function generateAIResponse(
  userRole: UserRole,
  userMessage: string,
  conversationHistory?: Array<{ role: string; content: string }>,
  additionalContext?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build the conversation with system prompt
    const systemPrompt = SYSTEM_PROMPTS[userRole];
    let fullPrompt = `${systemPrompt}\n\n`;

    // Add additional context if provided (e.g., current orders, user info)
    if (additionalContext) {
      fullPrompt += `CONTESTO AGGIUNTIVO:\n${additionalContext}\n\n`;
    }

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += `CONVERSAZIONE PRECEDENTE:\n`;
      conversationHistory.forEach(msg => {
        const speaker = msg.role === 'user' ? 'Utente' : 'Dioniso';
        fullPrompt += `${speaker}: ${msg.content}\n`;
      });
      fullPrompt += `\n`;
    }

    // Add current user message
    fullPrompt += `Utente: ${userMessage}\n\nDioniso:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Errore nel generare la risposta AI. Riprova più tardi.');
  }
}

// Determine user role from user object
export function getUserRole(user: any): UserRole {
  if (!user) return 'customer';

  // Check if user is admin (you can customize this logic)
  if (user.email === 'admin@dionisocaffe.com' || user.username === 'admin') {
    return 'admin';
  }

  // Check if user is chef (you can customize this logic)
  if (user.email?.includes('chef') || user.email?.includes('cuoco') || user.role === 'chef') {
    return 'chef';
  }

  // Default to customer
  return 'customer';
}

// Generate context-aware greeting based on user role
export function getGreeting(userRole: UserRole, userName?: string): string {
  const name = userName ? ` ${userName}` : '';

  switch (userRole) {
    case 'admin':
      return `Ciao${name}! Sono Dioniso, il tuo assistente amministrativo. Come posso aiutarti oggi con il business?`;
    case 'chef':
      return `Ciao${name}! Sono Dioniso, il tuo assistente in cucina. Dimmi cosa ti serve!`;
    case 'customer':
    default:
      return `Ciao${name}! Sono Dioniso, il tuo assistente personale. Come posso aiutarti oggi?`;
  }
}
