# Full House — AI Media Prompt Pack

Generate one **60-second looping video** and one **hero photo** per dish.
Paste each prompt into your generator of choice, then drop the resulting
URL into `shared/menu-data.ts` (`videoUrl` / `photoUrl`).

**Recommended generators (June 2026):**
- **Video:** Sora, Runway Gen-4, Kling 2.0, Google Veo 3 — pick one with
  seamless-loop support. Ask for **1080×1920 vertical** or **16:9**.
- **Photo:** Midjourney v7, Flux 1.1, DALL·E 4 — ask for **16:9**, photoreal.

**Global style (prepend to every prompt):**
> Cinematic food photography shot inside a warm Dutch eetcafé. Amber/golden
> walls, dark wood tables, soft warm hanging lights. The food sits on a dark
> wooden table with a white plate or rustic board. No people's faces. Shallow
> depth of field, steam and motion, ultra appetizing, 4K, no text.
> Seamless loop, slow camera push-in. The vibe is genuine, cozy, local —
> NOT a Michelin-star restaurant. Think Eetcafé Full House, Lelystad.

---

## VOORGERECHTEN (Starters)

### s1 — Mandje Stokbrood
**Video:** A rustic woven basket of fresh sliced baguette, golden crust,
soft steam rising. A hand dips bread into herb butter and aioli, slow
motion, butter glistening. Warm wood table, dark background, orange rim
light. Seamless 60s loop.
**Photo:** Overhead 3/4 shot of the bread basket with two small bowls of
herb butter and aioli, crumbs scattered, warm light.

### s2 — Tomatensoep
**Video:** A deep bowl of rich red tomato soup, fresh basil leaf placed on
top, tiny meatballs visible, gentle steam swirling. A spoon stirs slowly,
cream swirl forms. Dark slate background, orange highlight.
**Photo:** Close-up of the soup bowl, basil garnish, steam, spoon resting.

### s3 — Gamba's á la Jan  *(signature — make this the best one)*
**Video:** Sizzling garlic prawns in a black cast-iron pan, white wine
flambé, garlic and parsley tossed, oil bubbling, dramatic steam. Slow
motion toss of the prawns mid-air. Dark kitchen, warm orange flame glow.
The signature dish of the house — make it irresistible.
**Photo:** Hero shot of plated garlic prawns, glistening sauce, parsley,
lemon wedge, dark plate.

### s4 — Plat geslagen Rund
**Video:** Thin beef carpaccio fanned on a white plate, drizzle of pesto
poured in slow motion, pine nuts and parmesan shavings falling, arugula.
Top-down rotating shot. Dark marble surface, orange rim light.
**Photo:** Overhead carpaccio plate, pesto swirl, parmesan curls.

### s5 — Funghi "Full House"
**Video:** Sautéed mushrooms tossing in a pan with garlic and white wine,
herbs sprinkled, butter melting, steam. Slow-motion pan flip. Dark
background, warm glow.
**Photo:** Close-up of the finished mushrooms in a rustic bowl, herb
garnish.

### s6 — Volendammer Paling
**Video:** Smoked eel fillets on toast, glossy and rich, a knife spreads
butter, slow reveal. Traditional Dutch presentation, dark wood, orange
light. Elegant and authentic.
**Photo:** Smoked eel on toast, lemon, dark plate, side angle.

### s7 — Het 'Slakkengangetje'
**Video:** Snails wrapped in crispy bacon, sizzling in herb butter in a
small pan, garlic aroma steam, slow bubbling. Intimate close-up, dark
moody, orange flame reflection.
**Photo:** The bacon-wrapped snails plated with herb butter, garnish.

---

## HOOFDGERECHTEN (Mains)

### m1 — Schnitzel
**Video:** A giant golden crispy schnitzel, fresh from the fryer, steam
rising, a hand squeezes lemon over it in slow motion, droplets flying.
Side of golden fries. Dark table, warm orange light.
**Photo:** Overhead schnitzel with fries and salad, lemon wedge.

### m2 — Lekker zonnig
**Video:** Schnitzel topped with melting cheese and grilled pineapple
rings, cheese pull in slow motion, golden and bubbling. Dark background,
orange glow, tropical warmth.
**Photo:** Close-up cheese-and-pineapple schnitzel, cheese stretch.

### m3 — Smulfestijn  *(crowd favorite — make it epic)*
**Video:** A glistening rack of soy-glazed spareribs, sticky sauce
dripping, honey glaze caught in light, a hand pulls one rib apart — meat
falling off the bone in slow motion. Steam, dark smoky background, orange
embers glow. Make it mouth-watering.
**Photo:** Full rack of ribs on a wooden board, sesame, sauce pooling.

### m4 — Wokkie-Wokkie
**Video:** Colorful vegetables and chicken stir-frying in a wok over high
flame, dramatic toss mid-air, soy sauce poured sizzling, steam and flame.
Vibrant, fresh, fast energy then slow-motion toss. Dark kitchen, orange
fire.
**Photo:** The finished wok dish in a bowl, glossy, vibrant veg.

### m5 — Zwijntje van "Full House"
**Video:** Tender pork tenderloin wrapped in crispy bacon, sliced open to
reveal juicy pink center, juices running, slow motion knife cut. Roasted
potatoes and vegetables beside. Dark plate, warm orange light.
**Photo:** Sliced bacon-wrapped pork medallions, juices, garnish.

### m6 — Mijn naam is Haas
**Video:** Two pork medallions topped with melting brie and gorgonzola
sauce poured in slow motion, cheese cascading, elegant. Refined plating,
dark slate, orange rim light.
**Photo:** The medallions with brie and gorgonzola, sauce drizzle.

### m7 — Diamanthaasje  *(premium — make it luxurious)*
**Video:** A perfectly seared 220g diamond-cut beef, sliced to reveal a
rosy medium-rare center, juices glistening, steam rising. Sauce brushed
on in slow motion. Premium dark plating, dramatic orange light. Luxurious
and tender.
**Photo:** Sliced diamanthaas showing pink center, fries, sauce, dark
plate.

---

## Workflow

1. Generate each clip/photo from the prompts above.
2. Host the files (Cloudflare R2, S3, Bunny.net, or any CDN with direct
   `.mp4` / `.jpg` links).
3. Edit `shared/menu-data.ts` — add to each dish:
   ```ts
   videoUrl: "https://cdn.fullhouse.nl/gambas.mp4",
   photoUrl: "https://cdn.fullhouse.nl/gambas.jpg",
   ```
4. The menu card shows the video in loop automatically. No code changes.

**Tip:** keep clips under ~6 MB and ~10s real length (set to loop) so they
load fast on a phone at the table. The "60s" is the *feel* — short
seamless loops read as continuous.
