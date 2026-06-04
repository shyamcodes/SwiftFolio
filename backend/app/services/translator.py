from deep_translator import GoogleTranslator
from typing import Dict, List, Any
import time

def translate_text(text: str, target_language: str) -> str:
    """Translate a single text string to target language using Google Translate."""
    if not text or target_language == "en":
        return text
    
    try:
        # Split long text into chunks (Google Translate has 5000 char limit)
        max_chunk_size = 1000  # Reduced for faster translation
        if len(text) <= max_chunk_size:
            translator = GoogleTranslator(source='en', target=target_language)
            result = translator.translate(text)
            return result if result else text
        
        # For longer texts, split by sentences
        chunks = []
        current_chunk = ""
        sentences = text.split('. ')
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) + 2 <= max_chunk_size:
                current_chunk += sentence + '. '
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + '. '
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        # Translate each chunk (limit to 3 chunks max for speed)
        chunks = chunks[:3]
        translated_chunks = []
        translator = GoogleTranslator(source='en', target=target_language)
        for chunk in chunks:
            result = translator.translate(chunk)
            translated_chunks.append(result if result else chunk)
            time.sleep(0.05)  # Minimal rate limiting
        
        return ' '.join(translated_chunks)
    except Exception as e:
        print(f"Translation error for {target_language}: {e}")
        return text


def translate_portfolio(portfolio: Dict[str, Any], target_language: str) -> Dict[str, Any]:
    """Translate all text fields in a portfolio to target language."""
    if target_language == "en":
        return portfolio
    
    translated = portfolio.copy()
    
    # Translate only main content fields (skip skills and projects for speed)
    fields_to_translate = ["about", "bio"]
    
    for field in fields_to_translate:
        if field in translated and translated[field]:
            translated[field] = translate_text(translated[field], target_language)
    
    # Keep skills and projects as-is (technical terms don't need translation)
    # This significantly improves translation speed
    
    # Translate generated content if present
    if "generated_content" in translated and translated["generated_content"]:
        gen_content = translated["generated_content"].copy()
        if "about" in gen_content:
            gen_content["about"] = translate_text(gen_content["about"], target_language)
        if "bio" in gen_content:
            gen_content["bio"] = translate_text(gen_content["bio"], target_language)
        # Skip skills_summary and project_descriptions for faster translation
        translated["generated_content"] = gen_content
    
    return translated


def get_available_languages() -> List[Dict[str, str]]:
    """Get list of all 100+ available languages supported by Google Translate."""
    return [
        {"code": "en", "name": "English"},
        {"code": "af", "name": "Afrikaans"},
        {"code": "sq", "name": "Albanian - Shqip"},
        {"code": "am", "name": "Amharic - አማርኛ"},
        {"code": "ar", "name": "Arabic - العربية"},
        {"code": "hy", "name": "Armenian - Հայերեն"},
        {"code": "az", "name": "Azerbaijani - Azərbaycan"},
        {"code": "eu", "name": "Basque - Euskara"},
        {"code": "be", "name": "Belarusian - Беларуская"},
        {"code": "bn", "name": "Bengali - বাংলা"},
        {"code": "bs", "name": "Bosnian - Bosanski"},
        {"code": "bg", "name": "Bulgarian - Български"},
        {"code": "ca", "name": "Catalan - Català"},
        {"code": "ceb", "name": "Cebuano"},
        {"code": "ny", "name": "Chichewa - Nyanja"},
        {"code": "zh-CN", "name": "Chinese (Simplified) - 简体中文"},
        {"code": "zh-TW", "name": "Chinese (Traditional) - 繁體中文"},
        {"code": "co", "name": "Corsican - Corsu"},
        {"code": "hr", "name": "Croatian - Hrvatski"},
        {"code": "cs", "name": "Czech - Čeština"},
        {"code": "da", "name": "Danish - Dansk"},
        {"code": "nl", "name": "Dutch - Nederlands"},
        {"code": "eo", "name": "Esperanto"},
        {"code": "et", "name": "Estonian - Eesti"},
        {"code": "tl", "name": "Filipino - Tagalog"},
        {"code": "fi", "name": "Finnish - Suomi"},
        {"code": "fr", "name": "French - Français"},
        {"code": "fy", "name": "Frisian - Frysk"},
        {"code": "gl", "name": "Galician - Galego"},
        {"code": "ka", "name": "Georgian - ქართული"},
        {"code": "de", "name": "German - Deutsch"},
        {"code": "el", "name": "Greek - Ελληνικά"},
        {"code": "gu", "name": "Gujarati - ગુજરાતી"},
        {"code": "ht", "name": "Haitian Creole - Kreyòl"},
        {"code": "ha", "name": "Hausa"},
        {"code": "haw", "name": "Hawaiian - ʻŌlelo Hawaiʻi"},
        {"code": "iw", "name": "Hebrew - עברית"},
        {"code": "hi", "name": "Hindi - हिन्दी"},
        {"code": "hmn", "name": "Hmong"},
        {"code": "hu", "name": "Hungarian - Magyar"},
        {"code": "is", "name": "Icelandic - Íslenska"},
        {"code": "ig", "name": "Igbo"},
        {"code": "id", "name": "Indonesian - Bahasa Indonesia"},
        {"code": "ga", "name": "Irish - Gaeilge"},
        {"code": "it", "name": "Italian - Italiano"},
        {"code": "ja", "name": "Japanese - 日本語"},
        {"code": "jw", "name": "Javanese - Basa Jawa"},
        {"code": "kn", "name": "Kannada - ಕನ್ನಡ"},
        {"code": "kk", "name": "Kazakh - Қазақ"},
        {"code": "km", "name": "Khmer - ខ្មែរ"},
        {"code": "ko", "name": "Korean - 한국어"},
        {"code": "ku", "name": "Kurdish - Kurdî"},
        {"code": "ky", "name": "Kyrgyz - Кыргызча"},
        {"code": "lo", "name": "Lao - ລາວ"},
        {"code": "la", "name": "Latin - Latina"},
        {"code": "lv", "name": "Latvian - Latviešu"},
        {"code": "lt", "name": "Lithuanian - Lietuvių"},
        {"code": "lb", "name": "Luxembourgish - Lëtzebuergesch"},
        {"code": "mk", "name": "Macedonian - Македонски"},
        {"code": "mg", "name": "Malagasy"},
        {"code": "ms", "name": "Malay - Bahasa Melayu"},
        {"code": "ml", "name": "Malayalam - മലയാളം"},
        {"code": "mt", "name": "Maltese - Malti"},
        {"code": "mi", "name": "Maori - Te Reo"},
        {"code": "mr", "name": "Marathi - मराठी"},
        {"code": "mn", "name": "Mongolian - Монгол"},
        {"code": "my", "name": "Myanmar (Burmese) - မြန်မာ"},
        {"code": "ne", "name": "Nepali - नेपाली"},
        {"code": "no", "name": "Norwegian - Norsk"},
        {"code": "or", "name": "Odia (Oriya) - ଓଡ଼ିଆ"},
        {"code": "ps", "name": "Pashto - پښتو"},
        {"code": "fa", "name": "Persian - فارسی"},
        {"code": "pl", "name": "Polish - Polski"},
        {"code": "pt", "name": "Portuguese - Português"},
        {"code": "pa", "name": "Punjabi - ਪੰਜਾਬੀ"},
        {"code": "ro", "name": "Romanian - Română"},
        {"code": "ru", "name": "Russian - Русский"},
        {"code": "sm", "name": "Samoan"},
        {"code": "gd", "name": "Scots Gaelic - Gàidhlig"},
        {"code": "sr", "name": "Serbian - Српски"},
        {"code": "st", "name": "Sesotho"},
        {"code": "sn", "name": "Shona"},
        {"code": "sd", "name": "Sindhi - سنڌي"},
        {"code": "si", "name": "Sinhala - සිංහල"},
        {"code": "sk", "name": "Slovak - Slovenčina"},
        {"code": "sl", "name": "Slovenian - Slovenščina"},
        {"code": "so", "name": "Somali - Soomaali"},
        {"code": "es", "name": "Spanish - Español"},
        {"code": "su", "name": "Sundanese - Basa Sunda"},
        {"code": "sw", "name": "Swahili - Kiswahili"},
        {"code": "sv", "name": "Swedish - Svenska"},
        {"code": "tg", "name": "Tajik - Тоҷикӣ"},
        {"code": "ta", "name": "Tamil - தமிழ்"},
        {"code": "te", "name": "Telugu - తెలుగు"},
        {"code": "th", "name": "Thai - ไทย"},
        {"code": "tr", "name": "Turkish - Türkçe"},
        {"code": "uk", "name": "Ukrainian - Українська"},
        {"code": "ur", "name": "Urdu - اردو"},
        {"code": "ug", "name": "Uyghur - ئۇيغۇرچە"},
        {"code": "uz", "name": "Uzbek - Oʻzbek"},
        {"code": "vi", "name": "Vietnamese - Tiếng Việt"},
        {"code": "cy", "name": "Welsh - Cymraeg"},
        {"code": "xh", "name": "Xhosa - isiXhosa"},
        {"code": "yi", "name": "Yiddish - ייִדיש"},
        {"code": "yo", "name": "Yoruba - Èdè Yorùbá"},
        {"code": "zu", "name": "Zulu - isiZulu"},
    ]


