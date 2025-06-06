import { NextRequest, NextResponse } from 'next/server';

const DEEPL_API_KEY = '1f30c3cd-cf09-4d40-a0b6-d6318cc418c1:fx';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await request.json();

    console.log(`🔄 Translating "${text.substring(0, 50)}..." from ${sourceLang} to ${targetLang}`);

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        source_lang: sourceLang || 'EN',
        target_lang: targetLang,
        preserve_formatting: '1'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepL API error:', response.status, errorText);
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.translations[0].text;
    
    console.log(`✅ Translation successful: "${translatedText.substring(0, 50)}..."`);
    
    return NextResponse.json({
      translatedText: translatedText
    });

  } catch (error) {
    console.error('❌ Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}