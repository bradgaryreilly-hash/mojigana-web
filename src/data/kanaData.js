/**
 * kanaData.js
 * Contains the dictionaries and layout grids for Hiragana, Katakana, and Numbers.
 */

export const KANA_DICT = {
  'a': { h: 'あ', k: 'ア' }, 'i': { h: 'い', k: 'イ' }, 'u': { h: 'う', k: 'ウ' }, 'e': { h: 'え', k: 'エ' }, 'o': { h: 'お', k: 'オ' },
  'ka': { h: 'か', k: 'カ' }, 'ki': { h: 'き', k: 'キ' }, 'ku': { h: 'く', k: 'ク' }, 'ke': { h: 'け', k: 'ケ' }, 'ko': { h: 'こ', k: 'コ' },
  'sa': { h: 'さ', k: 'サ' }, 'shi': { h: 'し', k: 'シ', aliases: ['si'] }, 'su': { h: 'す', k: 'ス' }, 'se': { h: 'せ', k: 'セ' }, 'so': { h: 'そ', k: 'ソ' },
  'ta': { h: 'た', k: 'タ' }, 'chi': { h: 'ち', k: 'チ', aliases: ['ti'] }, 'tsu': { h: 'つ', k: 'ツ', aliases: ['tu'] }, 'te': { h: 'て', k: 'テ' }, 'to': { h: 'と', k: 'ト' },
  'na': { h: 'な', k: 'ナ' }, 'ni': { h: 'に', k: 'ニ' }, 'nu': { h: 'ぬ', k: 'ヌ' }, 'ne': { h: 'ね', k: 'ネ' }, 'no': { h: 'の', k: 'ノ' },
  'ha': { h: 'は', k: 'ハ' }, 'hi': { h: 'ひ', k: 'ヒ' }, 'fu': { h: 'ふ', k: 'フ', aliases: ['hu'] }, 'he': { h: 'へ', k: 'ヘ' }, 'ho': { h: 'ほ', k: 'ホ' },
  'ma': { h: 'ま', k: 'マ' }, 'mi': { h: 'み', k: 'ミ' }, 'mu': { h: 'む', k: 'ム' }, 'me': { h: 'め', k: 'メ' }, 'mo': { h: 'も', k: 'モ' },
  'ya': { h: 'や', k: 'ヤ' }, 'yu': { h: 'ゆ', k: 'ユ' }, 'yo': { h: 'よ', k: 'ヨ' },
  'ra': { h: 'ら', k: 'ラ' }, 'ri': { h: 'り', k: 'リ' }, 'ru': { h: 'る', k: 'ル' }, 're': { h: 'れ', k: 'レ' }, 'ro': { h: 'ろ', k: 'ロ' },
  'wa': { h: 'わ', k: 'ワ' }, 'wo': { h: 'を', k: 'ヲ' }, 'n': { h: 'ん', k: 'ン' },
  'ga': { h: 'が', k: 'ガ' }, 'gi': { h: 'ぎ', k: 'ギ' }, 'gu': { h: 'ぐ', k: 'グ' }, 'ge': { h: 'げ', k: 'ゲ' }, 'go': { h: 'ご', k: 'ゴ' },
  'za': { h: 'ざ', k: 'ザ' }, 'ji': { h: 'じ', k: 'ジ' }, 'zu': { h: 'ず', k: 'ズ' }, 'ze': { h: 'ぜ', k: 'ゼ' }, 'zo': { h: 'ぞ', k: 'ゾ' },
  'da': { h: 'だ', k: 'ダ' }, 'de': { h: 'で', k: 'デ' }, 'do': { h: 'ど', k: 'ド' },
  'ba': { h: 'ば', k: 'バ' }, 'bi': { h: 'び', k: 'ビ' }, 'bu': { h: 'ぶ', k: 'ブ' }, 'be': { h: 'べ', k: 'ベ' }, 'bo': { h: 'ぼ', k: 'ボ' },
  'pa': { h: 'ぱ', k: 'パ' }, 'pi': { h: 'ぴ', k: 'ピ' }, 'pu': { h: 'ぷ', k: 'プ' }, 'pe': { h: 'ぺ', k: 'ペ' }, 'po': { h: 'ぽ', k: 'ポ' },
  'kya': { h: 'きゃ', k: 'キャ' }, 'kyu': { h: 'きゅ', k: 'キュ' }, 'kyo': { h: 'きょ', k: 'キョ' },
  'sha': { h: 'しゃ', k: 'シャ' }, 'shu': { h: 'しゅ', k: 'シュ' }, 'sho': { h: 'しょ', k: 'ショ' },
  'cha': { h: 'ちゃ', k: 'チャ' }, 'chu': { h: 'ちゅ', k: 'チュ' }, 'cho': { h: 'ちょ', k: 'チョ' },
  'nya': { h: 'にゃ', k: 'ニャ' }, 'nyu': { h: 'にゅ', k: 'ニュ' }, 'nyo': { h: 'にょ', k: 'ニョ' },
  'hya': { h: 'ひゃ', k: 'ヒャ' }, 'hyu': { h: 'ひゅ', k: 'ヒュ' }, 'hyo': { h: 'ひょ', k: 'ヒョ' },
  'mya': { h: 'みゃ', k: 'ミャ' }, 'myu': { h: 'みゅ', k: 'ミュ' }, 'myo': { h: 'みょ', k: 'ミョ' },
  'rya': { h: 'りゃ', k: 'リャ' }, 'ryu': { h: 'りゅ', k: 'リュ' }, 'ryo': { h: 'りょ', k: 'リョ' },
  'gya': { h: 'ぎゃ', k: 'ギャ' }, 'gyu': { h: 'ぎゅ', k: 'ギュ' }, 'gyo': { h: 'ぎょ', k: 'ギョ' },
  'ja': { h: 'じゃ', k: 'ジャ' }, 'ju': { h: 'じゅ', k: 'ジュ' }, 'jo': { h: 'じょ', k: 'ジョ' },
  'bya': { h: 'びゃ', k: 'ビャ' }, 'byu': { h: 'びゅ', k: 'ビュ' }, 'byo': { h: 'びょ', k: 'ビョ' },
  'pya': { h: 'ぴゃ', k: 'ピャ' }, 'pyu': { h: 'ぴゅ', k: 'ピュ' }, 'pyo': { h: 'ぴょ', k: 'ピョ' }
};

export const NUM_DICT = {
  '1': { char: '一', romaji: 'ichi' }, '2': { char: '二', romaji: 'ni' }, '3': { char: '三', romaji: 'san' },
  '4': { char: '四', romaji: 'yon', aliases: ['shi'] }, '5': { char: '五', romaji: 'go' },
  '6': { char: '六', romaji: 'roku' }, '7': { char: '七', romaji: 'nana', aliases: ['shichi'] },
  '8': { char: '八', romaji: 'hachi' }, '9': { char: '九', romaji: 'kyu', aliases: ['ku'] }, '10': { char: '十', romaji: 'ju' },
  '100': { char: '百', romaji: 'hyaku' }, '1000': { char: '千', romaji: 'sen' }, '10000': { char: '万', romaji: 'man' }
};

export const BASIC_GRID = [
  ['a', 'i', 'u', 'e', 'o'], ['ka', 'ki', 'ku', 'ke', 'ko'], ['sa', 'shi', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'], ['na', 'ni', 'nu', 'ne', 'no'], ['ha', 'hi', 'fu', 'he', 'ho'],
  ['ma', 'mi', 'mu', 'me', 'mo'], ['ya', null, 'yu', null, 'yo'], ['ra', 'ri', 'ru', 're', 'ro'],
  ['wa', null, null, null, 'wo'], ['n', null, null, null, null]
];

export const DAKUON_GRID = [
  ['ga', 'gi', 'gu', 'ge', 'go'], ['za', 'ji', 'zu', 'ze', 'zo'], ['da', null, null, 'de', 'do'],
  ['ba', 'bi', 'bu', 'be', 'bo'], ['pa', 'pi', 'pu', 'pe', 'po']
];

export const COMBO_GRID = [
  ['kya', 'kyu', 'kyo'], ['sha', 'shu', 'sho'], ['cha', 'chu', 'cho'],
  ['nya', 'nyu', 'nyo'], ['hya', 'hyu', 'hyo'], ['mya', 'myu', 'myo'],
  ['rya', 'ryu', 'ryo'], ['gya', 'gyu', 'gyo'], ['ja', 'ju', 'jo'],
  ['bya', 'byu', 'byo'], ['pya', 'pyu', 'pyo']
];

export const NUM_LAYOUT = [
  ['1', '2', '3', '4', '5'], ['6', '7', '8', '9', '10'], ['100', '1000', '10000', null, null]
];

export const CONFUSION_MAP = {
  'a': ['o', 'e'], 'o': ['a', 'u'], 'wa': ['re', 'ne'], 're': ['wa', 'ne'], 
  'ne': ['re', 'wa'], 'ha': ['ho', 'ma'], 'ho': ['ha', 'ma'], 'ma': ['ha', 'ho'], 
  'ru': ['ro'], 'ro': ['ru'], 'nu': ['me'], 'me': ['nu', 'ne'], 'sa': ['ki'], 
  'ki': ['sa'], 'shi': ['tsu'], 'tsu': ['shi'], 'so': ['n'], 'n': ['so'], 
  'ku': ['ke', 'ta'], 'ke': ['ku', 'ta'], 'ta': ['ku', 'ke'], 'fu': ['wa', 'ra'], 
  'ra': ['fu', 'wa'], '6': ['8'], '8': ['6'], '7': ['9'], '9': ['7']
};