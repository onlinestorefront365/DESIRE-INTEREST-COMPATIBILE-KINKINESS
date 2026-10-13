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
// Screeners and follow-ups:
//   An item marked { screener: true } is a broad question. Items marked
//   { gate: "<screener id>" } are narrower follow-ups that are only asked if
//   the screener didn't get a Hard no. A follow-up must be strictly covered
//   by its screener, so a Hard no on the screener really means no to it too.
//   - pair screener, pair follow-up: each side follows the same side
//     ("Having anything anal done to you" gates "Being pegged" only)
//   - pair screener, solo follow-up: skipped only if both sides are Hard no
//   - solo screener: gates every prompt of its follow-ups
//   Skipped follow-ups are sent as "screened out" and scored as Hard no.
//
// Body filters (optional) hide prompts that can't apply to a couple:
//   pair: tb = body the top-side person needs, bb = body the bottom-side needs
//   solo: self / partner = body the answerer / their partner needs,
//         any = at least one of the two needs it
//   values: "p" (penis) or "v" (vulva). "Show everything" sees every prompt.
//
// IMPORTANT: the code people swap encodes answers by position in this file.
// Any reorder, removal or insertion must bump BANK_VERSION.

export const BANK_VERSION = 2;

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
    items: [
      pair("control", "Dominance and submission", "Being in control of your partner", "Being under your partner's control",
        { screener: true, topRole: "dominant", bottomRole: "submissive" }),
      pair("orders", "Orders", "Giving your partner orders", "Following your partner's orders",
        { gate: "control", topRole: "gives orders", bottomRole: "obeys" }),
      pair("rules", "Rules and protocol", "Setting rules your partner has to follow", "Living by rules your partner sets",
        { gate: "control", topRole: "sets rules", bottomRole: "follows" }),
      pair("title", "Titles", "Being called Sir, Master or Mistress", "Calling your partner Sir, Master or Mistress",
        { gate: "control", topRole: "is called", bottomRole: "calls" }),
      pair("collar", "Collar", "Putting a collar on your partner", "Wearing a collar for your partner",
        { gate: "control", topRole: "collars", bottomRole: "wears it" }),
      pair("leash", "Leash", "Leading your partner on a leash", "Being led on a leash",
        { gate: "control", topRole: "leads", bottomRole: "is led" }),
      pair("kneel", "Kneeling", "Having your partner kneel for you", "Kneeling for your partner",
        { gate: "control", topRole: "is knelt for", bottomRole: "kneels" }),
      pair("punish", "Punishment", "Punishing your partner for breaking rules", "Being punished for breaking rules",
        { gate: "control", topRole: "punishes", bottomRole: "is punished" }),
      pair("bathroom", "Bathroom control", "Deciding when your partner can use the bathroom", "Needing permission to use the bathroom",
        { gate: "control", topRole: "decides", bottomRole: "asks" }),
      solo("247", "Dynamic outside the bedroom", "A power dynamic that carries on outside the bedroom", { gate: "control" }),
      pair("service", "Service", "Being served and pampered by your partner", "Serving your partner (chores, attention, comfort)",
        { topRole: "is served", bottomRole: "serves" }),
      pair("worship", "Body worship", "Having your whole body worshipped", "Worshipping your partner's whole body",
        { topRole: "is worshipped", bottomRole: "worships" }),
      solo("aftercare", "Aftercare", "Cuddles and care after intense play (aftercare)"),
    ],
  },
  {
    id: "bondage",
    name: "Bondage and restraint",
    items: [
      pair("restrain", "Restraint", "Restraining your partner (ties, cuffs or rope)", "Being restrained (ties, cuffs or rope)",
        { screener: true, topRole: "restrains", bottomRole: "is restrained" }),
      pair("rope", "Rope bondage", "Tying your partner in rope (shibari)", "Being tied in rope (shibari)",
        { gate: "restrain", topRole: "ties", bottomRole: "is tied", hint: "Shibari is decorative Japanese-style rope bondage." }),
      pair("suspend", "Rope suspension", "Suspending your partner in rope", "Being suspended in rope",
        { gate: "restrain", topRole: "rigs", bottomRole: "is suspended" }),
      pair("spread", "Spread out", "Restraining your partner spread out on the bed", "Being restrained spread out on the bed",
        { gate: "restrain", topRole: "restrains", bottomRole: "is restrained" }),
      pair("mummy", "Mummification", "Wrapping your partner from head to toe", "Being wrapped from head to toe",
        { gate: "restrain", topRole: "wraps", bottomRole: "is wrapped" }),
      pair("cage", "Cage", "Locking your partner in a cage", "Being locked in a cage",
        { gate: "restrain", topRole: "locks", bottomRole: "is caged" }),
      pair("helpless", "Teased while helpless", "Teasing your partner while they can't move", "Being teased while you can't move",
        { gate: "restrain", topRole: "teases", bottomRole: "is helpless" }),
      pair("blind", "Blindfold", "Blindfolding your partner", "Being blindfolded",
        { topRole: "blindfolds", bottomRole: "is blindfolded" }),
      pair("gag", "Gag", "Gagging your partner", "Being gagged",
        { topRole: "gags", bottomRole: "is gagged" }),
      pair("deprive", "Sensory deprivation", "Taking away your partner's senses (hood, earplugs)", "Having your senses taken away (hood, earplugs)",
        { topRole: "deprives", bottomRole: "is deprived" }),
    ],
  },
  {
    id: "impact",
    name: "Impact and pain",
    items: [
      pair("pain", "Pain and impact", "Giving your partner pain they enjoy, even light (spanking, pinching)", "Getting pain you enjoy, even light (spanking, pinching)",
        { screener: true, topRole: "gives pain", bottomRole: "takes pain" }),
      pair("spank", "Spanking", "Spanking your partner", "Being spanked",
        { gate: "pain", topRole: "spanks", bottomRole: "is spanked" }),
      pair("paddle", "Paddle", "Paddling your partner", "Being paddled",
        { gate: "pain", topRole: "paddles", bottomRole: "is paddled" }),
      pair("flog", "Flogging", "Flogging or whipping your partner", "Being flogged or whipped",
        { gate: "pain", topRole: "flogs", bottomRole: "is flogged" }),
      pair("cane", "Cane or crop", "Using a cane or riding crop on your partner", "Feeling a cane or riding crop",
        { gate: "pain", topRole: "strikes", bottomRole: "is struck" }),
      pair("slap", "Face slapping", "Slapping your partner's face", "Being slapped in the face",
        { gate: "pain", topRole: "slaps", bottomRole: "is slapped" }),
      pair("marks", "Leaving marks", "Leaving marks or bruises on your partner", "Wearing marks or bruises from your partner",
        { gate: "pain", topRole: "marks", bottomRole: "is marked" }),
      pair("clamps", "Nipple clamps", "Putting nipple clamps on your partner", "Wearing nipple clamps",
        { gate: "pain", topRole: "clamps", bottomRole: "wears them" }),
      pair("cbt", "Cock and ball torture", "Cock and ball torture on your partner", "Receiving cock and ball torture",
        { gate: "pain", bb: "p" }),
      pair("vspank", "Pussy spanking", "Spanking your partner's pussy", "Having your pussy spanked",
        { gate: "pain", bb: "v", topRole: "spanks", bottomRole: "is spanked" }),
      pair("bite", "Biting", "Biting your partner", "Being bitten",
        { topRole: "bites", bottomRole: "is bitten" }),
      pair("scratch", "Scratching", "Scratching your partner", "Being scratched",
        { topRole: "scratches", bottomRole: "is scratched" }),
      pair("hair", "Hair pulling", "Pulling your partner's hair", "Having your hair pulled",
        { topRole: "pulls", bottomRole: "is pulled" }),
    ],
  },
  {
    id: "sensation",
    name: "Sensation and edge play",
    items: [
      pair("wax", "Wax play", "Dripping hot wax on your partner", "Having hot wax dripped on you"),
      pair("ice", "Temperature play", "Using ice or cold on your partner's body", "Feeling ice or cold on your body"),
      pair("feather", "Light touch", "Teasing your partner with feathers or fingertips", "Being teased with feathers or fingertips"),
      pair("tickle", "Tickling", "Tickling your partner", "Being tickled",
        { topRole: "tickles", bottomRole: "is tickled" }),
      pair("massage", "Sensual massage", "Giving your partner a slow oil massage", "Getting a slow oil massage"),
      pair("cupping", "Cupping", "Using suction cups on your partner", "Having suction cups used on you"),
      pair("sting", "Stinging sensations", "Using nettles or tingling creams on your partner", "Feeling nettles or tingling creams"),
      pair("blades", "Blades, needles or electricity", "Using blades, needles or electricity on your partner", "Having blades, needles or electricity used on you",
        { screener: true }),
      pair("electro", "Electro play", "Using electro toys on your partner (TENS, violet wand)", "Feeling electro toys (TENS, violet wand)",
        { gate: "blades" }),
      pair("knife", "Knife play", "Running a blade over your partner's skin, no cutting", "Having a blade run over your skin, no cutting",
        { gate: "blades" }),
      pair("needle", "Needle play", "Needle play on your partner", "Receiving needle play",
        { gate: "blades", hint: "Sterile needles briefly placed in the skin." }),
    ],
  },
  {
    id: "orgasm",
    name: "Orgasm control",
    items: [
      pair("ocontrol", "Orgasm control", "Controlling your partner's orgasms: when, how or whether", "Having your orgasms controlled by your partner",
        { screener: true, topRole: "controls", bottomRole: "is controlled" }),
      pair("edge", "Edging", "Edging your partner: bringing them close, then stopping", "Being edged again and again",
        { gate: "ocontrol", topRole: "edges", bottomRole: "is edged" }),
      pair("deny", "Orgasm denial", "Denying your partner an orgasm", "Being denied an orgasm",
        { gate: "ocontrol", topRole: "denies", bottomRole: "is denied" }),
      pair("permit", "Permission to come", "Deciding when your partner is allowed to come", "Coming only when your partner allows it",
        { gate: "ocontrol", topRole: "decides", bottomRole: "waits" }),
      pair("ruin", "Ruined orgasms", "Ruining your partner's orgasm on purpose", "Having your orgasm ruined on purpose",
        { gate: "ocontrol" }),
      pair("chastity", "Chastity", "Holding the key to your partner's chastity device", "Wearing a chastity device",
        { gate: "ocontrol", topRole: "keyholder", bottomRole: "wearer" }),
      pair("forced", "Forced orgasms", "Making your partner come again and again", "Being made to come again and again"),
      pair("overstim", "Overstimulation", "Keeping going after your partner comes", "Being kept going after you come"),
      pair("squirt", "Squirting", "Making your partner squirt", "Squirting",
        { bb: "v", topRole: "makes it happen", bottomRole: "squirts" }),
    ],
  },
  {
    id: "oral",
    name: "Oral and hands",
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
    items: [
      pair("piv", "Vaginal sex", "Fucking your partner's pussy", "Being fucked in the pussy",
        { tb: "p", bb: "v", topRole: "penetrates", bottomRole: "is penetrated" }),
      pair("deep", "Deep penetration", "Going as deep as your partner can take", "Being penetrated as deep as you can take",
        { topRole: "penetrates", bottomRole: "is penetrated" }),
      pair("fist", "Fisting", "Fisting your partner", "Being fisted",
        { topRole: "fists", bottomRole: "is fisted" }),
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
    items: [
      pair("anyanal", "Anything anal", "Doing anything anal to your partner", "Having anything anal done to you",
        { screener: true, topRole: "gives", bottomRole: "receives" }),
      pair("anal", "Anal sex", "Fucking your partner's ass", "Being fucked in the ass",
        { gate: "anyanal", topRole: "penetrates", bottomRole: "is penetrated" }),
      pair("rim", "Rimming", "Rimming your partner", "Being rimmed", { gate: "anyanal" }),
      pair("afinger", "Anal fingering", "Fingering your partner's ass", "Having your ass fingered", { gate: "anyanal" }),
      pair("plug", "Butt plug", "Putting a plug in your partner", "Wearing a butt plug", { gate: "anyanal" }),
      pair("plugout", "Plug in public", "Having your partner wear a plug out in public", "Wearing a plug out in public",
        { gate: "anyanal", topRole: "decides", bottomRole: "wears it" }),
      pair("beads", "Anal beads", "Using anal beads on your partner", "Having anal beads used on you", { gate: "anyanal" }),
      pair("peg", "Pegging", "Pegging your partner with a strap-on", "Being pegged with a strap-on",
        { gate: "anyanal", topRole: "pegs", bottomRole: "is pegged" }),
      pair("prostate", "Prostate massage", "Massaging your partner's prostate", "Having your prostate massaged",
        { gate: "anyanal", bb: "p" }),
    ],
  },
  {
    id: "toys",
    name: "Toys and gear",
    items: [
      solo("toys", "Toys together", "Using sex toys together", { screener: true }),
      pair("wand", "Wand vibrator", "Using a wand vibrator on your partner", "Having a wand vibrator used on you", { gate: "toys" }),
      pair("dildo", "Dildo", "Using a dildo on your partner", "Having a dildo used on you", { gate: "toys" }),
      pair("remote", "Remote vibrator", "Controlling your partner's remote vibrator", "Wearing a vibrator your partner controls",
        { gate: "toys", topRole: "controls", bottomRole: "wears it" }),
      pair("strapon", "Strap-on", "Wearing a strap-on for your partner", "Your partner using a strap-on on you", { gate: "toys" }),
      pair("machine", "Sex machine", "Putting your partner on a sex machine (Sybian, fucking machine)", "Being put on a sex machine (Sybian, fucking machine)",
        { gate: "toys" }),
      pair("cockring", "Cock ring", "Putting a cock ring on your partner", "Wearing a cock ring", { gate: "toys", bb: "p" }),
      pair("stroker", "Stroker", "Using a stroker on your partner (Fleshlight)", "Having a stroker used on you (Fleshlight)",
        { gate: "toys", bb: "p" }),
      pair("pump", "Pump", "Using a penis or clit pump on your partner", "Having a pump used on you", { gate: "toys" }),
      pair("kegel", "Kegel balls", "Having your partner wear kegel balls (Ben Wa)", "Wearing kegel balls (Ben Wa)",
        { gate: "toys", bb: "v", topRole: "decides", bottomRole: "wears them" }),
      solo("toyshop", "Toy shopping", "Shopping for toys together", { gate: "toys" }),
      solo("furniture", "Kink furniture", "Kink furniture (bench, cross, sling)"),
    ],
  },
  {
    id: "rough",
    name: "Rough play and CNC",
    items: [
      pair("rough", "Rough play", "Being rough with your partner", "Your partner being rough with you",
        { screener: true, topRole: "rough", bottomRole: "takes it" }),
      pair("pin", "Pinned down", "Pinning your partner down", "Being pinned down",
        { gate: "rough", topRole: "pins", bottomRole: "is pinned" }),
      pair("throw", "Thrown around", "Throwing your partner around (onto the bed, against the wall)", "Being thrown around (onto the bed, against the wall)",
        { gate: "rough", topRole: "throws", bottomRole: "is thrown" }),
      pair("choke", "Choking", "Choking your partner", "Being choked",
        { gate: "rough", topRole: "chokes", bottomRole: "is choked" }),
      pair("breath", "Breath play", "Controlling your partner's breathing", "Having your breathing controlled",
        { gate: "rough", topRole: "controls", bottomRole: "is controlled" }),
      pair("cnc", "Consensual non-consent", "Taking your partner \"against their will\" in a scene you planned together", "Being taken \"against your will\" in a scene you planned together",
        { gate: "rough", topRole: "takes", bottomRole: "is taken", hint: "A pre-agreed scene with a safeword, where resistance is part of the play." }),
      pair("struggle", "Struggle", "Overpowering your partner while they fight back", "Fighting back while your partner overpowers you",
        { gate: "rough", topRole: "overpowers", bottomRole: "struggles" }),
      pair("abduct", "Abduction fantasy", "Abduction fantasy, as the one who takes", "Abduction fantasy, as the one who's taken",
        { gate: "rough", topRole: "abductor", bottomRole: "taken" }),
      pair("primal", "Primal play", "Hunting your partner down, predator style", "Being hunted down, prey style",
        { gate: "rough", topRole: "predator", bottomRole: "prey" }),
      solo("wrestle", "Wrestling", "Wrestling for control", { gate: "rough" }),
      pair("use", "Being used", "Using your partner purely for your own pleasure", "Being used purely for your partner's pleasure",
        { topRole: "uses", bottomRole: "is used" }),
    ],
  },
  {
    id: "role",
    name: "Roleplay and fantasy",
    items: [
      solo("roleplay", "Roleplay", "Roleplay: playing characters or acting out scenes", { screener: true }),
      solo("strangers", "Strangers", "Pretending to meet as strangers", { gate: "roleplay" }),
      solo("scene", "Scripted scene", "Acting out a fantasy scene you've planned together", { gate: "roleplay" }),
      pair("pet", "Pet play", "Owning your partner as your pet (puppy, kitten)", "Being your partner's pet (puppy, kitten)",
        { gate: "roleplay", topRole: "owner", bottomRole: "pet" }),
      pair("authority", "Authority roleplay", "Playing the authority figure (boss, officer, guard)", "Playing the one under their authority",
        { gate: "roleplay", topRole: "authority", bottomRole: "under them" }),
      pair("medical", "Medical roleplay", "Medical roleplay as the doctor or nurse", "Medical roleplay as the patient",
        { gate: "roleplay", topRole: "doctor", bottomRole: "patient" }),
      pair("interrogate", "Interrogation", "Interrogating your partner as your captive", "Being interrogated as a captive",
        { gate: "roleplay", topRole: "interrogator", bottomRole: "captive" }),
      pair("escort", "Escort roleplay", "Playing the client paying for sex", "Playing the escort being paid",
        { gate: "roleplay", topRole: "client", bottomRole: "escort" }),
      pair("maid", "Maid or houseboy", "Having your partner play your maid or houseboy", "Playing your partner's maid or houseboy",
        { gate: "roleplay", topRole: "employer", bottomRole: "maid" }),
      solo("furry", "Furry play", "Furry or fursuit play", { gate: "roleplay" }),
      solo("costume", "Costumes", "Dressing up in costumes"),
      pair("object", "Objectification", "Treating your partner as an object or doll", "Being treated as an object or doll",
        { topRole: "user", bottomRole: "object" }),
      pair("feminize", "Feminization", "Feminizing your partner (sissification)", "Being feminized (sissification)"),
      pair("hypno", "Erotic hypnosis", "Erotically hypnotizing your partner", "Being erotically hypnotized"),
      solo("size", "Size fantasies", "Size fantasies (giants and tiny people)"),
    ],
  },
  {
    id: "talk",
    name: "Talk and mind games",
    items: [
      pair("dirty", "Dirty talk", "Talking dirty to your partner", "Being talked dirty to"),
      pair("praise", "Praise", "Praising your partner (\"good girl\", \"good boy\")", "Being praised (\"good girl\", \"good boy\")"),
      pair("humil", "Degradation and humiliation", "Degrading or humiliating your partner (names, embarrassment)", "Being degraded or humiliated (names, embarrassment)",
        { screener: true }),
      pair("names", "Degrading names", "Calling your partner names like slut or whore", "Being called names like slut or whore",
        { gate: "humil" }),
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
    items: [
      pair("watchmast", "Watching masturbation", "Watching your partner touch themselves", "Touching yourself while your partner watches",
        { topRole: "watches", bottomRole: "is watched" }),
      pair("strip", "Striptease", "Getting a striptease or lap dance from your partner", "Stripping or giving a lap dance for your partner",
        { topRole: "watches", bottomRole: "performs" }),
      pair("photo", "Photos and video", "Photographing or filming your partner", "Being photographed or filmed by your partner",
        { topRole: "films", bottomRole: "is filmed" }),
      solo("filmus", "Filming yourselves", "Filming yourselves having sex"),
      solo("mirror", "Mirror", "Watching yourselves in a mirror"),
      solo("porn", "Porn together", "Watching porn together"),
      solo("nude", "Nudity", "Spending time naked together (at home, nude beach)"),
      solo("phonesex", "Phone or video sex", "Phone or video sex when you're apart"),
      solo("seen", "Public or in front of others", "Anything sexual in public or in front of other people", { screener: true }),
      pair("pubtouch", "Secret touching in public", "Secretly touching your partner in public", "Being secretly touched in public",
        { gate: "seen", topRole: "touches", bottomRole: "is touched" }),
      solo("caught", "Risk of getting caught", "Sex somewhere you might get caught", { gate: "seen" }),
      solo("audience", "Audience", "Having sex while other people watch", { gate: "seen" }),
      solo("watchothers", "Watching others", "Watching other people have sex in person", { gate: "seen" }),
    ],
  },
  {
    id: "group",
    name: "Group and open play",
    items: [
      solo("others", "Other people", "Bringing other people into your sex life in any way", { screener: true }),
      solo("three_w", "Threesome with a woman", "A threesome with another woman", { gate: "others" }),
      solo("three_m", "Threesome with a man", "A threesome with another man", { gate: "others" }),
      solo("orgy", "Group sex", "Group sex or an orgy", { gate: "others" }),
      solo("softswap", "Soft swap", "Soft swap: everything but sex with another couple", { gate: "others" }),
      solo("swing", "Full swap", "Full swap with another couple", { gate: "others" }),
      solo("sameroom", "Same room", "Sex in the same room as another couple", { gate: "others" }),
      pair("cuck", "Watching your partner with someone", "Watching your partner with someone else", "Being with someone else while your partner watches",
        { gate: "others", topRole: "watches", bottomRole: "is with someone" }),
      pair("share", "Sharing", "Sharing your partner with others", "Being shared with others",
        { gate: "others", topRole: "shares", bottomRole: "is shared" }),
      pair("gangbang", "Gang bang", "Setting up a gang bang for your partner", "Being the center of a gang bang",
        { gate: "others", topRole: "sets it up", bottomRole: "is the center" }),
      solo("glory", "Glory hole", "Glory hole play", { gate: "others" }),
      solo("hallpass", "Hall pass", "A hall pass: a one-off night with someone else", { gate: "others" }),
      solo("open", "Open relationship", "An open relationship", { gate: "others" }),
      solo("poly", "Polyamory", "Polyamory: more than one loving relationship", { gate: "others" }),
      solo("club", "Sex club", "Going to a sex or kink club together"),
      solo("munch", "Kink meetups", "Kink social meetups (munches)"),
      solo("mono", "Just us", "Keeping it strictly between the two of you"),
    ],
  },
  {
    id: "fetish",
    name: "Fetishes and attire",
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
    items: [
      pair("inside", "Coming inside", "Coming inside your partner", "Your partner coming inside you", { tb: "p" }),
      pair("spit", "Spitting", "Spitting on your partner or in their mouth", "Being spat on or in your mouth",
        { topRole: "spits", bottomRole: "is spat on" }),
      solo("cumplay", "Cum play", "Cum play: facials, swallowing, coming on each other", { screener: true, any: "p" }),
      pair("facial", "Facials", "Coming on your partner's face", "Being come on, on your face", { gate: "cumplay", tb: "p" }),
      pair("cumbody", "Coming on the body", "Coming on your partner's body", "Being come on, on your body", { gate: "cumplay", tb: "p" }),
      pair("swallow", "Swallowing", "Your partner swallowing your cum", "Swallowing your partner's cum",
        { gate: "cumplay", tb: "p", topRole: "comes", bottomRole: "swallows" }),
      solo("snowball", "Snowballing", "Sharing cum by kissing (snowballing)", { gate: "cumplay", any: "p" }),
      solo("pee", "Pee and scat", "Pee or scat play of any kind", { screener: true }),
      pair("golden", "Golden showers", "Peeing on your partner", "Being peed on",
        { gate: "pee", topRole: "pees", bottomRole: "is peed on" }),
      solo("omorashi", "Wetting play", "Desperation and wetting play (omorashi)", { gate: "pee" }),
      solo("scat", "Scat play", "Scat play", { gate: "pee" }),
      solo("scent", "Scent", "Natural body scent, sweat and musk"),
      solo("messy", "Messy food play", "Messy food play (whipped cream, chocolate, oil)"),
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
export const ITEM_BY_ID = Object.fromEntries(CATEGORIES.flatMap((c) => c.items.map((i) => [i.id, i])));

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

// The screener prompt keys that decide whether this prompt is asked.
// All of them must be Hard no for the prompt to be skipped.
export function screenerKeys(prompt) {
  const gate = prompt.item.gate;
  if (!gate) return [];
  const s = ITEM_BY_ID[gate];
  if (s.kind === "solo") return [s.id];
  if (prompt.side === "solo") return [`${s.id}:t`, `${s.id}:b`];
  return [`${s.id}:${prompt.side === "top" ? "t" : "b"}`];
}

// True when a screener's Hard no means this prompt is skipped.
export function isScreenedOut(prompt, answers) {
  const keys = screenerKeys(prompt);
  return keys.length > 0 && keys.every((k) => answers[k] === 0);
}

// Prompts this person will be asked, in order.
export function livePrompts(answers, applies) {
  return PROMPTS.filter((p) => applies(p) && !isScreenedOut(p, answers));
}

// What gets sent to the partner: answers, with screened-out prompts as "skip".
export function effectiveAnswers(answers, applies) {
  const out = {};
  for (const p of PROMPTS) {
    if (!applies(p)) continue;
    if (isScreenedOut(p, answers)) out[p.key] = "skip";
    else if (answers[p.key] !== undefined) out[p.key] = answers[p.key];
  }
  return out;
}

// How many follow-ups a Hard no on this prompt would skip, given the other answers.
export function followUpsSkippedBy(prompt, answers, applies) {
  if (!prompt.item.screener) return 0;
  const asNo = { ...answers, [prompt.key]: 0 };
  const asYes = { ...answers, [prompt.key]: 2 };
  return PROMPTS.filter((p) => applies(p) && isScreenedOut(p, asNo) && !isScreenedOut(p, asYes)).length;
}
