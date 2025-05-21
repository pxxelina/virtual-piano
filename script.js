const cuteWords = [
  "🌸 Snugglebug 🌸", "✨ Honeydrop ✨", "💖 Cupcake 💖", "🌼 Sweetpea 🌼",
  "🧁 Muffin 🧁", "🌈 Cuddlebug 🌈", "💫 Sugarplum 💫", "🐰 Bunnyhop 🐰",
  "🍓 Peachy 🍓", "🎀 Lovebug 🎀", "🌟 Twinkletoes 🌟", "🎉 Giggles 🎉",
  "☁️ Puffball ☁️", "🌻 Sunnybean 🌻", "🍬 Jellybean 🍬", "🌷 Daisyface 🌷",
  "🩵 Marshmallow 🩵", "🐣 Cuddlebean 🐣", "🍭 Sweetiebun 🍭", "💐 Joydrop 💐"
];

function playCute(note) {
  const word = cuteWords[Math.floor(Math.random() * cuteWords.length)];
  document.getElementById("display").textContent = word;
}
