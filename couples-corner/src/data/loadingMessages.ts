export const LOADING_MESSAGES = [
  "loading love… please wait, it's worth it 💛",
  "polishing the polaroids ✨",
  "asking the frog for directions 🐸",
  "stirring something sweet into the pixels 🍫",
  "wrapping the next surprise 🥚",
  "sharpening the sword ⚔️",
  "calculating moves… ♟️",
  "counting sunflowers 🌻",
  "feeding the dino 🦖",
  "unfolding a memory 💌",
  "pinning a new place on the map 📍",
  "tuning the playlist 🎵",
  "ticking off the list ✅",
]

export const randomMessage = () =>
  LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
