// SyncPulse question bank.
//
// Two kinds of item:
//   solo — one prompt both partners answer the same way ("Quickies").
//          Scored by comparing A's answer with B's answer.
//   pair — two complementary prompts, a "top" side and a "bottom" side
//          ("Spanking your partner" / "Being spanked"). Scored crosswise:
//          A's top answer vs B's bottom answer, and B's top vs A's bottom.
//          So a dominant + a submissive match, and two dominants don't.
//
// Body filters (optional) hide prompts that can't apply to a couple:
//   pair: tb = body the top-side person needs, bb = body the bottom-side needs
//   solo: self / partner = body the answerer / their partner needs,
//         any = at least one of the two needs it
//   values: "p" (penis) or "v" (vulva). A person who picks "show everything"
//   sees every prompt.
//
// IMPORTANT: the code people swap encodes answers by position in this file.
// Never reorder, remove or insert items in the middle. Add new items at the
// end of a category's list only if you also bump BANK_VERSION.

export const BANK_VERSION = 1;

export const SCALE = [
  { value: 4, label: "Love it", hint: "Yes, please" },
  { value: 3, label: "Into it", hint: "I'd like this" },
  { value: 2, label: "Neutral", hint: "No strong feelings" },
  { value: 1, label: "Hesitant", hint: "Maybe, if we go slow" },
  { value: 0, label: "Hard no", hint: "Not for me" },
];

export const LABELS = { 0: "Hard no", 1: "Hesitant", 2: "Neutral", 3: "Into it", 4: "Love it" };

const solo = (id, name, text, extra = {}) => ({ kind: "solo", id, name, text, ...extra });
const pair = (id, name, top, bottom, extra = {}) => ({
  kind: "pair", id, name, top, bottom,
  topRole: "giving", bottomRole: "receiving", ...extra,
});

export const CATEGORIES = [
  {
    id: "power",
    name: "Power exchange",
    blurb: "Who's in charge, and how far it goes.",
    items: [
      pair("dom", "Dominance", "Dominating your partner", "Being dominated by your partner",
        { topRole: "dominant", bottomRole: "submissive" }),
      pair("orders", "Orders", "Giving your partner orders", "Following your partner's orders",
        { topRole: "gives orders", bottomRole: "obeys" }),
      pair("rules", "Rules and protocol", "Setting rules your partner has to follow", "Living by rules your partner sets",
        { topRole: "sets rules", bottomRole: "follows" }),
      pair("title", "Titles", "Being called Sir, Master or Mistress", "Calling your partner Sir, Master or Mistress",
        { topRole: "is called", bottomRole: "calls" }),
      pair("collar", "Collar", "Putting a collar on your partner", "Wearing a collar for your partner",
        { topRole: "collars", bottomRole: "wears it" }),
      pair("leash", "Leash", "Leading your partner on a leash", "Being led on a leash",
        { topRole: "leads", bottomRole: "is led" }),
      pair("kneel", "Kneeling", "Having your partner kneel for you", "Kneeling for your partner",
        { topRole: "is knelt for", bottomRole: "kneels" }),
      pair("service", "Service", "Being served and pampered by your partner", "Serving your partner (chores, attention, comfort)",
        { topRole: "is served", bottomRole: "serves" }),
      pair("punish", "Punishment", "Punishing your partner for breaking rules", "Being punished for breaking rules",
        { topRole: "punishes", bottomRole: "is punished" }),
      pair("bathroom", "Bathroom control", "Deciding when your partner can use the bathroom", "Needing permission to use the bathroom",
        { topRole: "decides", bottomRole: "asks" }),
      pair("worship", "Body worship", "Having your whole body worshipped", "Worshipping your partner's whole body",
        { topRole: "is worshipped", bottomRole: "worships" }),
      solo("247", "Dynamic outside the bedroom", "A power dynamic that carries on outside the bedroom"),
      solo("aftercare", "Aftercare", "Cuddles and care after intense play (aftercare)"),
    ],
  },
  {
    id: "bondage",
    name: "Bondage and restraint",
    blurb: "Ties, rope, blindfolds and being held still.",
    items: [
      pair("tie", "Cuffs and ties", "Tying up or cuffing your partner", "Being tied up or cuffed",
        { topRole: "ties", bottomRole: "is tied" }),
      pair("rope", "Rope bondage", "Tying your partner in rope (shibari)", "Being tied in rope (shibari)",
        { topRole: "ties", bottomRole: "is tied", hint: "Shibari is decorative Japanese-style rope bondage." }),
      pair("suspend", "Rope suspension", "Suspending your partner in rope", "Being suspended in rope",
        { topRole: "rigs", bottomRole: "is suspended" }),
      pair("spread", "Spread out", "Restraining your partner spread out on the bed", "Being restrained spread out on the bed",
        { topRole: "restrains", bottomRole: "is restrained" }),
      pair("blind", "Blindfold", "Blindfolding your partner", "Being blindfolded",
        { topRole: "blindfolds", bottomRole: "is blindfolded" }),
      pair("gag", "Gag", "Gagging your partner", "Being gagged",
        { topRole: "gags", bottomRole: "is gagged" }),
      pair("deprive", "Sensory deprivation", "Taking away your partner's senses (hood, earplugs)", "Having your senses taken away (hood, earplugs)",
        { topRole: "deprives", bottomRole: "is deprived" }),
      pair("mummy", "Mummification", "Wrapping your partner from head to toe", "Being wrapped from head to toe",
        { topRole: "wraps", bottomRole: "is wrapped" }),
      pair("cage", "Cage", "Locking your partner in a cage", "Being locked in a cage",
        { topRole: "locks", bottomRole: "is caged" }),
      pair("helpless", "Teased while helpless", "Teasing your partner while they can't move", "Being teased while you can't move",
        { topRole: "teases", bottomRole: "is helpless" }),
    ],
  },
  {
    id: "impact",
    name: "Impact and pain",
    blurb: "Spanking, slapping, biting and marks.",
    items: [
      pair("pain", "Pain play", "Hurting your partner because you both enjoy it", "Being hurt because you enjoy it",
        { topRole: "sadist", bottomRole: "masochist" }),
      pair("spank", "Spanking", "Spanking your partner", "Being spanked",
        { topRole: "spanks", bottomRole: "is spanked" }),
      pair("paddle", "Paddle", "Paddling your partner", "Being paddled",
        { topRole: "paddles", bottomRole: "is paddled" }),
      pair("flog", "Flogging", "Flogging or whipping your partner", "Being flogged or whipped",
        { topRole: "flogs", bottomRole: "is flogged" }),
      pair("cane", "Cane or crop", "Using a cane or riding crop on your partner", "Feeling a cane or riding crop",
        { topRole: "strikes", bottomRole: "is struck" }),
      pair("slap", "Face slapping", "Slapping your partner's face", "Being slapped in the face",
        { topRole: "slaps", bottomRole: "is slapped" }),
      pair("bite", "Biting", "Biting your partner", "Being bitten",
        { topRole: "bites", bottomRole: "is bitten" }),
      pair("scratch", "Scratching", "Scratching your partner", "Being scratched",
        { topRole: "scratches", bottomRole: "is scratched" }),
      pair("hair", "Hair pulling", "Pulling your partner's hair", "Having your hair pulled",
        { topRole: "pulls", bottomRole: "is pulled" }),
      pair("marks", "Leaving marks", "Leaving marks or bruises on your partner", "Wearing marks or bruises from your partner",
        { topRole: "marks", bottomRole: "is marked" }),
      pair("clamps", "Nipple clamps", "Putting nipple clamps on your partner", "Wearing nipple clamps",
        { topRole: "clamps", bottomRole: "wears them" }),
      pair("cbt", "Cock and ball torture", "Cock and ball torture on your partner", "Receiving cock and ball torture",
        { bb: "p" }),
      pair("vspank", "Pussy spanking", "Spanking your partner's pussy", "Having your pussy spanked",
        { bb: "v", topRole: "spanks", bottomRole: "is spanked" }),
    ],
  },
  {
    id: "sensation",
    name: "Sensation and edge play",
    blurb: "Wax, ice, blades, electricity and tickling.",
    items: [
      pair("wax", "Wax play", "Dripping hot wax on your partner", "Having hot wax dripped on you"),
      pair("ice", "Temperature play", "Using ice or cold on your partner's body", "Feeling ice or cold on your body"),
      pair("feather", "Light touch", "Teasing your partner with feathers or fingertips", "Being teased with feathers or fingertips"),
      pair("tickle", "Tickling", "Tickling your partner", "Being tickled",
        { topRole: "tickles", bottomRole: "is tickled" }),
      pair("massage", "Sensual massage", "Giving your partner a slow oil massage", "Getting a slow oil massage"),
      pair("electro", "Electro play", "Using electro toys on your partner (TENS, violet wand)", "Feeling electro toys (TENS, violet wand)"),
      pair("knife", "Knife play", "Running a blade over your partner's skin, no cutting", "Having a blade run over your skin, no cutting"),
      pair("needle", "Needle play", "Needle play on your partner", "Receiving needle play",
        { hint: "Sterile needles briefly placed in the skin." }),
      pair("cupping", "Cupping", "Using suction cups on your partner", "Having suction cups used on you"),
      pair("sting", "Stinging sensations", "Using nettles or tingling creams on your partner", "Feeling nettles or tingling creams"),
    ],
  },
  {
    id: "orgasm",
    name: "Orgasm control",
    blurb: "Edging, denial, permission and overstimulation.",
    items: [
      pair("edge", "Edging", "Edging your partner: bringing them close, then stopping", "Being edged again and again",
        { topRole: "edges", bottomRole: "is edged" }),
      pair("deny", "Orgasm denial", "Denying your partner an orgasm", "Being denied an orgasm",
        { topRole: "denies", bottomRole: "is denied" }),
      pair("permit", "Permission to come", "Making your partner ask permission to come", "Having to ask permission to come",
        { topRole: "grants", bottomRole: "asks" }),
      pair("command", "Coming on command", "Telling your partner exactly when to come", "Coming on your partner's command",
        { topRole: "commands", bottomRole: "comes on cue" }),
      pair("forced", "Forced orgasms", "Making your partner come again and again", "Being made to come again and again"),
      pair("overstim", "Overstimulation", "Keeping going after your partner comes", "Being kept going after you come"),
      pair("ruin", "Ruined orgasms", "Ruining your partner's orgasm on purpose", "Having your orgasm ruined on purpose"),
      pair("chastity", "Chastity", "Holding the key to your partner's chastity device", "Wearing a chastity device",
        { topRole: "keyholder", bottomRole: "wearer" }),
      pair("squirt", "Squirting", "Making your partner squirt", "Squirting",
        { bb: "v", topRole: "makes it happen", bottomRole: "squirts" }),
    ],
  },
  {
    id: "oral",
    name: "Oral and hands",
    blurb: "Mouths, fingers and touch.",
    items: [
      pair("blow", "Blowjobs", "Giving a blowjob", "Getting a blowjob", { bb: "p" }),
      pair("cunni", "Eating pussy", "Going down on your partner's pussy", "Having your pussy eaten", { bb: "v" }),
      pair("throat", "Deep throat", "Having your partner deep throat you", "Deep throating your partner",
        { tb: "p", topRole: "receives", bottomRole: "deep throats" }),
      pair("facesit", "Face sitting", "Sitting on your partner's face", "Having your partner sit on your face",
        { topRole: "sits", bottomRole: "is sat on" }),
      solo("69", "69", "69, oral at the same time"),
      pair("handjob", "Hand jobs", "Giving a hand job", "Getting a hand job", { bb: "p" }),
      pair("finger", "Fingering", "Fingering your partner", "Being fingered", { bb: "v" }),
      pair("nipples", "Nipple play", "Playing with your partner's nipples", "Having your nipples played with"),
      pair("genworship", "Genital worship", "Worshipping your partner's genitals, taking your time", "Having your genitals worshipped, slowly"),
      pair("titjob", "Titjob", "Fucking your partner's breasts", "Using your breasts on your partner",
        { tb: "p", topRole: "receives", bottomRole: "gives" }),
      pair("hickey", "Hickeys", "Giving your partner hickeys", "Getting hickeys"),
      solo("mutualmast", "Mutual masturbation", "Masturbating side by side"),
      solo("makeout", "Making out", "Long, heavy make-out sessions"),
    ],
  },
  {
    id: "sex",
    name: "Sex and positions",
    blurb: "When, where and how.",
    items: [
      pair("piv", "Vaginal sex", "Fucking your partner's pussy", "Being fucked in the pussy",
        { tb: "p", bb: "v", topRole: "penetrates", bottomRole: "is penetrated" }),
      pair("deep", "Deep penetration", "Going as deep as your partner can take", "Being penetrated as deep as you can take",
        { topRole: "penetrates", bottomRole: "is penetrated" }),
      solo("quickie", "Quickies", "Quickies"),
      solo("morning", "Morning sex", "Morning sex"),
      pair("wake", "Waking up to sex", "Waking your partner up with sex (agreed in advance)", "Being woken up with sex (agreed in advance)",
        { topRole: "wakes", bottomRole: "is woken" }),
      solo("missionary", "Face to face", "Face to face (missionary)"),
      solo("behind", "From behind", "From behind (doggy style)"),
      pair("ride", "Riding", "Riding your partner", "Being ridden by your partner",
        { topRole: "rides", bottomRole: "is ridden" }),
      solo("standing", "Standing sex", "Standing up or against a wall"),
      solo("slow", "Slow sex", "Slow, drawn-out, tantric-style sex"),
      solo("grind", "Grinding", "Grinding or dry humping with clothes on"),
      solo("scissor", "Scissoring", "Scissoring (tribbing)", { self: "v", partner: "v" }),
      solo("frot", "Frotting", "Frotting (rubbing cocks together)", { self: "p", partner: "p" }),
      pair("thigh", "Thigh sex", "Fucking between your partner's thighs", "Having your partner fuck between your thighs",
        { tb: "p", topRole: "thrusts", bottomRole: "squeezes" }),
      solo("period", "Period sex", "Sex during a period", { any: "v" }),
      solo("newplaces", "New places at home", "Sex in every room of the house"),
      solo("positions", "New positions", "Working through new positions together"),
    ],
  },
  {
    id: "anal",
    name: "Anal play",
    blurb: "Rimming, plugs, pegging and anal sex.",
    items: [
      pair("anal", "Anal sex", "Fucking your partner's ass", "Being fucked in the ass",
        { topRole: "penetrates", bottomRole: "is penetrated" }),
      pair("rim", "Rimming", "Rimming your partner", "Being rimmed"),
      pair("afinger", "Anal fingering", "Fingering your partner's ass", "Having your ass fingered"),
      pair("plug", "Butt plug", "Putting a plug in your partner", "Wearing a butt plug"),
      pair("plugout", "Plug in public", "Having your partner wear a plug out in public", "Wearing a plug out in public",
        { topRole: "decides", bottomRole: "wears it" }),
      pair("beads", "Anal beads", "Using anal beads on your partner", "Having anal beads used on you"),
      pair("peg", "Pegging", "Pegging your partner with a strap-on", "Being pegged with a strap-on",
        { topRole: "pegs", bottomRole: "is pegged" }),
      pair("prostate", "Prostate massage", "Massaging your partner's prostate", "Having your prostate massaged", { bb: "p" }),
      pair("fist", "Fisting", "Fisting your partner", "Being fisted",
        { topRole: "fists", bottomRole: "is fisted" }),
    ],
  },
  {
    id: "toys",
    name: "Toys and gear",
    blurb: "Vibrators, machines and kink furniture.",
    items: [
      solo("toys", "Toys together", "Using sex toys together"),
      pair("wand", "Wand vibrator", "Using a wand vibrator on your partner", "Having a wand vibrator used on you"),
      pair("dildo", "Dildo", "Using a dildo on your partner", "Having a dildo used on you"),
      pair("remote", "Remote vibrator", "Controlling your partner's remote vibrator", "Wearing a vibrator your partner controls",
        { topRole: "controls", bottomRole: "wears it" }),
      pair("strapon", "Strap-on", "Wearing a strap-on for your partner", "Your partner using a strap-on on you"),
      pair("machine", "Sex machine", "Putting your partner on a sex machine (Sybian, fucking machine)", "Being put on a sex machine (Sybian, fucking machine)"),
      pair("cockring", "Cock ring", "Putting a cock ring on your partner", "Wearing a cock ring", { bb: "p" }),
      pair("stroker", "Stroker", "Using a stroker on your partner (Fleshlight)", "Having a stroker used on you (Fleshlight)", { bb: "p" }),
      pair("pump", "Pump", "Using a penis or clit pump on your partner", "Having a pump used on you"),
      pair("kegel", "Kegel balls", "Having your partner wear kegel balls (Ben Wa)", "Wearing kegel balls (Ben Wa)",
        { bb: "v", topRole: "decides", bottomRole: "wears them" }),
      solo("furniture", "Kink furniture", "Kink furniture (bench, cross, sling)"),
      solo("toyshop", "Toy shopping", "Shopping for toys together"),
    ],
  },
  {
    id: "rough",
    name: "Rough play and CNC",
    blurb: "Force, struggle and consensual non-consent, agreed in advance.",
    items: [
      solo("rough", "Rough sex", "Rough, aggressive sex"),
      pair("pin", "Pinned down", "Pinning your partner down", "Being pinned down",
        { topRole: "pins", bottomRole: "is pinned" }),
      pair("throw", "Thrown around", "Throwing your partner around (onto the bed, against the wall)", "Being thrown around (onto the bed, against the wall)",
        { topRole: "throws", bottomRole: "is thrown" }),
      pair("choke", "Choking", "Choking your partner", "Being choked",
        { topRole: "chokes", bottomRole: "is choked" }),
      pair("breath", "Breath play", "Controlling your partner's breathing", "Having your breathing controlled",
        { topRole: "controls", bottomRole: "is controlled" }),
      pair("cnc", "Consensual non-consent", "Taking your partner \"against their will\" in a scene you planned together", "Being taken \"against your will\" in a scene you planned together",
        { topRole: "takes", bottomRole: "is taken", hint: "A pre-agreed scene with a safeword, where resistance is part of the play." }),
      pair("struggle", "Struggle", "Overpowering your partner while they fight back", "Fighting back while your partner overpowers you",
        { topRole: "overpowers", bottomRole: "struggles" }),
      pair("abduct", "Abduction fantasy", "Abduction fantasy, as the one who takes", "Abduction fantasy, as the one who's taken",
        { topRole: "abductor", bottomRole: "taken" }),
      pair("primal", "Primal play", "Hunting your partner down, predator style", "Being hunted down, prey style",
        { topRole: "predator", bottomRole: "prey" }),
      pair("use", "Being used", "Using your partner purely for your own pleasure", "Being used purely for your partner's pleasure",
        { topRole: "uses", bottomRole: "is used" }),
      solo("wrestle", "Wrestling", "Wrestling for control"),
    ],
  },
  {
    id: "role",
    name: "Roleplay and fantasy",
    blurb: "Characters, scenes and dressing up.",
    items: [
      solo("strangers", "Strangers", "Pretending to meet as strangers"),
      solo("costume", "Costumes", "Dressing up in costumes"),
      solo("scene", "Scripted scene", "Acting out a fantasy scene you've planned together"),
      pair("pet", "Pet play", "Owning your partner as your pet (puppy, kitten)", "Being your partner's pet (puppy, kitten)",
        { topRole: "owner", bottomRole: "pet" }),
      pair("authority", "Authority roleplay", "Playing the authority figure (boss, officer, guard)", "Playing the one under their authority",
        { topRole: "authority", bottomRole: "under them" }),
      pair("medical", "Medical roleplay", "Medical roleplay as the doctor or nurse", "Medical roleplay as the patient",
        { topRole: "doctor", bottomRole: "patient" }),
      pair("interrogate", "Interrogation", "Interrogating your partner as your captive", "Being interrogated as a captive",
        { topRole: "interrogator", bottomRole: "captive" }),
      pair("escort", "Escort roleplay", "Playing the client paying for sex", "Playing the escort being paid",
        { topRole: "client", bottomRole: "escort" }),
      pair("maid", "Maid or houseboy", "Having your partner play your maid or houseboy", "Playing your partner's maid or houseboy",
        { topRole: "employer", bottomRole: "maid" }),
      pair("object", "Objectification", "Treating your partner as an object or doll", "Being treated as an object or doll",
        { topRole: "user", bottomRole: "object" }),
      pair("feminize", "Feminization", "Feminizing your partner (sissification)", "Being feminized (sissification)"),
      pair("hypno", "Erotic hypnosis", "Erotically hypnotizing your partner", "Being erotically hypnotized"),
      solo("furry", "Furry play", "Furry or fursuit play"),
      solo("size", "Size fantasies", "Size fantasies (giants and tiny people)"),
    ],
  },
  {
    id: "talk",
    name: "Talk and mind games",
    blurb: "Words, praise, humiliation and teasing.",
    items: [
      pair("dirty", "Dirty talk", "Talking dirty to your partner", "Being talked dirty to"),
      pair("praise", "Praise", "Praising your partner (\"good girl\", \"good boy\")", "Being praised (\"good girl\", \"good boy\")"),
      pair("names", "Degrading names", "Calling your partner names like slut or whore", "Being called names like slut or whore"),
      pair("humil", "Humiliation", "Humiliating or embarrassing your partner", "Being humiliated or embarrassed"),
      pair("beg", "Begging", "Making your partner beg", "Begging your partner",
        { topRole: "makes them beg", bottomRole: "begs" }),
      pair("joi", "Instructions (JOI)", "Telling your partner exactly how to touch themselves", "Following instructions on how to touch yourself",
        { topRole: "instructs", bottomRole: "follows" }),
      pair("texttease", "All-day teasing", "Teasing your partner by text all day", "Being teased by text all day"),
      pair("fear", "Fear play", "Scaring your partner as part of a scene", "Being scared as part of a scene"),
      pair("tears", "Tear play", "Bringing your partner to tears during play", "Being brought to tears during play"),
      solo("fantasies", "Sharing fantasies", "Telling each other your dirtiest fantasies"),
      solo("sexting", "Sexting", "Sexting and trading nudes"),
      solo("loud", "Being loud", "Being loud and vocal during sex"),
      solo("erotica", "Erotica", "Reading or listening to erotica together"),
    ],
  },
  {
    id: "exhib",
    name: "Exhibition and voyeurism",
    blurb: "Watching, being watched and getting caught.",
    items: [
      pair("watchmast", "Watching masturbation", "Watching your partner touch themselves", "Touching yourself while your partner watches",
        { topRole: "watches", bottomRole: "is watched" }),
      pair("strip", "Striptease", "Getting a striptease or lap dance from your partner", "Stripping or giving a lap dance for your partner",
        { topRole: "watches", bottomRole: "performs" }),
      pair("photo", "Photos and video", "Photographing or filming your partner", "Being photographed or filmed by your partner",
        { topRole: "films", bottomRole: "is filmed" }),
      pair("pubtouch", "Secret touching in public", "Secretly touching your partner in public", "Being secretly touched in public",
        { topRole: "touches", bottomRole: "is touched" }),
      solo("filmus", "Filming yourselves", "Filming yourselves having sex"),
      solo("mirror", "Mirror", "Watching yourselves in a mirror"),
      solo("caught", "Risk of getting caught", "Sex somewhere you might get caught"),
      solo("audience", "Audience", "Having sex while other people watch"),
      solo("watchothers", "Watching others", "Watching other people have sex in person"),
      solo("porn", "Porn together", "Watching porn together"),
      solo("nude", "Nudity", "Spending time naked together (at home, nude beach)"),
      solo("phonesex", "Phone or video sex", "Phone or video sex when you're apart"),
    ],
  },
  {
    id: "group",
    name: "Group and open play",
    blurb: "Other people, swapping and opening things up.",
    items: [
      solo("three_w", "Threesome with a woman", "A threesome with another woman"),
      solo("three_m", "Threesome with a man", "A threesome with another man"),
      solo("orgy", "Group sex", "Group sex or an orgy"),
      solo("softswap", "Soft swap", "Soft swap: everything but sex with another couple"),
      solo("swing", "Full swap", "Full swap with another couple"),
      solo("sameroom", "Same room", "Sex in the same room as another couple"),
      pair("cuck", "Watching your partner with someone", "Watching your partner with someone else", "Being with someone else while your partner watches",
        { topRole: "watches", bottomRole: "is with someone" }),
      pair("share", "Sharing", "Sharing your partner with others", "Being shared with others",
        { topRole: "shares", bottomRole: "is shared" }),
      pair("gangbang", "Gang bang", "Setting up a gang bang for your partner", "Being the center of a gang bang",
        { topRole: "sets it up", bottomRole: "is the center" }),
      solo("glory", "Glory hole", "Glory hole play"),
      solo("club", "Sex club", "Going to a sex or kink club together"),
      solo("munch", "Kink meetups", "Kink social meetups (munches)"),
      solo("hallpass", "Hall pass", "A hall pass: a one-off night with someone else"),
      solo("open", "Open relationship", "An open relationship"),
      solo("poly", "Polyamory", "Polyamory: more than one loving relationship"),
      solo("mono", "Just us", "Keeping it strictly between the two of you"),
    ],
  },
  {
    id: "fetish",
    name: "Fetishes and attire",
    blurb: "Materials, outfits and body parts.",
    items: [
      pair("lingerie", "Lingerie", "Your partner in lingerie or stockings", "Wearing lingerie or stockings for your partner",
        { topRole: "admires", bottomRole: "wears" }),
      pair("heels", "Heels and boots", "Your partner in heels or boots", "Wearing heels or boots for your partner",
        { topRole: "admires", bottomRole: "wears" }),
      pair("uniform", "Uniforms", "Your partner in a uniform", "Wearing a uniform for your partner",
        { topRole: "admires", bottomRole: "wears" }),
      pair("panties", "Worn underwear", "Keeping or smelling your partner's worn underwear", "Giving your partner your worn underwear",
        { topRole: "keeps", bottomRole: "gives" }),
      pair("feet", "Foot worship", "Worshipping your partner's feet", "Having your feet worshipped",
        { topRole: "worships", bottomRole: "is worshipped" }),
      pair("footjob", "Foot jobs", "Giving a foot job", "Getting a foot job", { bb: "p" }),
      solo("latex", "Latex", "Latex or rubber"),
      solo("leather", "Leather", "Leather"),
      solo("catsuit", "Catsuits", "Full-body suits (catsuits, zentai)"),
      solo("crossdress", "Cross-dressing", "Cross-dressing"),
      solo("jock", "Jockstraps", "Jockstraps"),
      solo("armpits", "Armpits", "Armpit play"),
      solo("hairfetish", "Hair", "Body hair or long hair as a turn-on"),
      solo("piercings", "Piercings", "Nipple or genital piercings"),
    ],
  },
  {
    id: "fluids",
    name: "Fluids and body",
    blurb: "Cum, spit, scent and mess.",
    items: [
      pair("facial", "Facials", "Coming on your partner's face", "Being come on, on your face", { tb: "p" }),
      pair("cumbody", "Coming on the body", "Coming on your partner's body", "Being come on, on your body", { tb: "p" }),
      pair("swallow", "Swallowing", "Your partner swallowing your cum", "Swallowing your partner's cum",
        { tb: "p", topRole: "comes", bottomRole: "swallows" }),
      pair("inside", "Coming inside", "Coming inside your partner", "Your partner coming inside you", { tb: "p" }),
      solo("snowball", "Snowballing", "Sharing cum by kissing (snowballing)"),
      pair("spit", "Spitting", "Spitting on your partner or in their mouth", "Being spat on or in your mouth",
        { topRole: "spits", bottomRole: "is spat on" }),
      pair("golden", "Golden showers", "Peeing on your partner", "Being peed on",
        { topRole: "pees", bottomRole: "is peed on" }),
      solo("omorashi", "Wetting play", "Desperation and wetting play (omorashi)"),
      solo("scent", "Scent", "Natural body scent, sweat and musk"),
      solo("messy", "Messy food play", "Messy food play (whipped cream, chocolate, oil)"),
      solo("scat", "Scat play", "Scat play"),
    ],
  },
];

// Flat, canonical list of prompts. Order is what the swap code encodes.
export const PROMPTS = [];
for (const cat of CATEGORIES) {
  for (const item of cat.items) {
    if (item.kind === "solo") {
      PROMPTS.push({ key: item.id, cat: cat.id, item, side: "solo", text: item.text });
    } else {
      PROMPTS.push({ key: `${item.id}:t`, cat: cat.id, item, side: "top", text: item.top });
      PROMPTS.push({ key: `${item.id}:b`, cat: cat.id, item, side: "bottom", text: item.bottom });
    }
  }
}

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const fits = (need, body) => !need || body === "a" || body === need;

// Whether a prompt applies, given the answerer's body and their partner's.
// body values: "p", "v", or "a" (show everything).
export function promptApplies(prompt, self, partner) {
  const it = prompt.item;
  if (prompt.side === "solo") {
    if (!fits(it.self, self) || !fits(it.partner, partner)) return false;
    if (it.any && !(fits(it.any, self) || fits(it.any, partner))) return false;
    return true;
  }
  const mine = prompt.side === "top" ? it.tb : it.bb;
  const theirs = prompt.side === "top" ? it.bb : it.tb;
  return fits(mine, self) && fits(theirs, partner);
}
