// DeepL API integration utility
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        target_lang: targetLanguage,
      }),
    })

    if (!response.ok) {
      throw new Error("Translation failed")
    }

    const data = await response.json()
    return data.translations[0].text
  } catch (error) {
    console.error("Translation error:", error)
    return text // Return original text if translation fails
  }
}

export const supportedLanguages = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Spanish" },
  { code: "ZH", name: "Chinese" },
  { code: "AR", name: "Arabic" },
  { code: "FR", name: "French" },
  { code: "PT", name: "Portuguese" },
  { code: "RU", name: "Russian" },
]
