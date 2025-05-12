using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace ApiLibrary.Localization
{
    public class GoogleTranslateService
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        // Usa la API pública de Google Translate (no oficial, para pruebas)
        public async Task<string> TranslateAsync(string text, string targetLanguage, string sourceLanguage = "auto")
        {
            var url = $"https://translate.googleapis.com/translate_a/single?client=gtx&sl={sourceLanguage}&tl={targetLanguage}&dt=t&q={Uri.EscapeDataString(text)}";
            var response = await _httpClient.GetStringAsync(url);

            // El resultado es un array JSON anidado, ejemplo: [[[\"Casa\",\"Home\",null,null,1]],null,\"en\"]
            using var doc = JsonDocument.Parse(response);
            var translated = doc.RootElement[0][0][0].GetString();
            return translated ?? text;
        }
    }
}
