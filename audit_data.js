/* ============================================================
   Persua · Audit profond de vente (étage 2 du quiz funnel)
   50 questions · 7 dimensions · score /100 global + par dimension
   Partagé entre audit.html (quiz) et audit_resultat.html (rapport)
   ============================================================ */
window.AUDIT = (function () {

  /* --- Les 7 dimensions du cycle de vente (ordre = ordre d'affichage) --- */
  const DIMS = [
    { id:'prospection',   emoji:'🎯', label:'Prospection',
      court:'générer des RDV qualifiés sans forcer', wa:'ta prospection',
      faible:'Ta machine à RDV est ton goulot. Quand l\'agenda est vide, tu vends sous pression, et la pression bascule le cerveau du client en mode menace (il se ferme). Priorité : UN canal, UN message centré sur la douleur du prospect (pas sur toi), une routine tenable. Un flux régulier enlève la peur de « rater » ce deal… donc enlève la pression.',
      fort:'Tu remplis ton agenda avec méthode. Ça te donne le luxe de vendre détendu : l\'arme la plus sous-estimée.' },
    { id:'decouverte',    emoji:'🔍', label:'Découverte',
      court:'questionner avant de proposer', wa:'ta phase de découverte',
      faible:'C\'est LA fuite n°1. La vente se gagne ici : 60-70 % du temps devrait être des questions. Tu présentes ta solution avant d\'avoir fait RESSENTIR le problème. Or le cerveau décide sur une sensation (marqueur somatique), pas sur une fiche technique. Plan : 3 questions de douleur chiffrée avant toute solution. « Combien ça te coûte, ce problème, chaque mois ? »',
      fort:'Tu creuses avant de proposer. C\'est rare, et c\'est précisément ce qui fait que le client se vend l\'offre tout seul.' },
    { id:'argumentation', emoji:'🗣️', label:'Argumentation',
      court:'convaincre sans saturer', wa:'ta façon d\'argumenter',
      faible:'Tu sur-argumentes. Trop d\'arguments = surcharge cognitive (la mémoire de travail tient ~4 éléments) → le client « va réfléchir » pour fuir l\'effort mental. Plan : UN message clé par échange, relié à SA douleur. Moins tu prouves, plus il se convainc lui-même.',
      fort:'Tu vas à l\'essentiel et tu relies tes arguments à sa douleur. Tu ne noies pas le poisson, tu le ferres.' },
    { id:'prix',          emoji:'💶', label:'Prix & objections',
      court:'tenir ton prix et désamorcer les objections', wa:'ta gestion du prix et des objections',
      faible:'Face au prix, tu te justifies, et te justifier confirme qu\'il y a un problème. Le cerveau ne compare pas ton prix à ta valeur, il le compare à une référence (ancrage), et perdre fait ~1,7× plus mal que gagner (aversion à la perte). Plan : la méthode AIR. Accepte (« c\'est normal de regarder le budget »), Interroge (sépare la valeur perçue du budget réel), Réponds (« comment on avance ensemble ? »). Tu désamorces au lieu de te justifier.',
      fort:'Tu annonces ton prix sans trembler et tu recadres les objections au lieu de les subir. C\'est de la posture, pas de la technique.' },
    { id:'closing',       emoji:'🤝', label:'Closing',
      court:'provoquer la décision', wa:'ton closing',
      faible:'Tu ne provoques pas la décision, alors elle traîne et meurt. Demander la vente n\'est pas une agression, c\'est un service : le client t\'a fait confiance, va au bout pour lui. Plan : UNE seule prochaine étape claire à chaque rendez-vous + le silence de 8 secondes après le prix (le cerveau lit le silence comme de l\'assurance).',
      fort:'Tu oses provoquer la décision et tu tiens le silence. C\'est ce qui transforme un « intéressé » en client.' },
    { id:'suivi',         emoji:'📌', label:'Suivi / relance',
      court:'ne pas laisser mourir un deal chaud', wa:'ton suivi et tes relances',
      faible:'Tu laisses filer des deals déjà chauds. Un « je vais réfléchir » sans relance structurée = deal perdu par défaut. Plan : une séquence de relance qui APPORTE (une info, un angle, une preuve). Jamais le « alors, vous avez réfléchi ? » qui réveille la menace. La constance vaut le talent ici.',
      fort:'Tu relances avec méthode et avec valeur. Tu ne laisses pas l\'argent sur la table par simple négligence.' },
    { id:'posture',       emoji:'🧠', label:'Posture mentale',
      court:'ton rapport à la vente', wa:'ta posture face à la vente',
      faible:'Le vrai blocage est dans ta tête, pas dans ta technique. La peur de « déranger » ou de « forcer » te fait brader, raccourcir, ou ne pas oser conclure. Plan : recadre la vente comme un acte de soin : tu déplaces le client d\'une chaise inconfortable vers un fauteuil. Vendre proprement, c\'est aider quelqu\'un à dire oui à son propre intérêt.',
      fort:'Tu es au clair avec ta légitimité à vendre. Tu ne portes pas la vente comme un fardeau. C\'est ton plus gros levier silencieux.' }
  ];

  /* --- Les 50 questions (banque complète, conservée). d = dimension. opts: t=texte, s=score de maturité 0..3 --- */
  const Q_FULL = [
    /* ===== PROSPECTION (7) ===== */
    { d:'prospection', q:'Pour décrocher de nouveaux rendez-vous, ton vrai moteur aujourd\'hui :', opts:[
      {t:'Surtout le bouche-à-oreille : j\'attends qu\'on me recommande.', s:1},
      {t:'Un canal que je travaille exprès, avec un message centré sur la douleur de ma cible.', s:3},
      {t:'Je poste du contenu et j\'espère qu\'on me contacte.', s:2},
      {t:'Du volume : un max de messages, le plus large possible.', s:0} ]},
    { d:'prospection', q:'Quand tu approches un prospect à froid, ton accroche parle d\'abord de :', opts:[
      {t:'Ce que je propose et mes résultats.', s:1},
      {t:'Une promo / offre pour capter l\'attention.', s:0},
      {t:'Une douleur précise et reconnaissable que vit sa cible.', s:3},
      {t:'Une question ouverte sur sa situation actuelle.', s:2} ]},
    { d:'prospection', q:'Le nombre de RDV que tu obtiens chaque semaine est plutôt :', opts:[
      {t:'Quasi nul : je galère à remplir mon agenda.', s:0},
      {t:'Irrégulier : je subis les périodes creuses.', s:1},
      {t:'Stable : j\'ai un système qui tourne tout seul.', s:3},
      {t:'Élevé mais mal qualifié : beaucoup de RDV pour rien.', s:2} ]},
    { d:'prospection', q:'Avant un premier échange, tu qualifies le prospect (besoin, budget, décideur) :', opts:[
      {t:'Non, je prends tout le monde, on verra bien.', s:0},
      {t:'Un peu, au feeling.', s:1},
      {t:'Oui, mais surtout le budget.', s:2},
      {t:'Oui, avec des critères clairs que j\'applique à chaque fois.', s:3} ]},
    { d:'prospection', q:'Les prospects pas encore prêts à acheter, tu les gères comment ?', opts:[
      {t:'Je les relance quand j\'y repense.', s:1},
      {t:'Une relance, puis je laisse tomber s\'il ne se passe rien.', s:0},
      {t:'Je les garde dans une liste et je relance par vagues.', s:2},
      {t:'J\'ai une séquence de valeur qui les nourrit jusqu\'à ce qu\'ils soient mûrs.', s:3} ]},
    { d:'prospection', q:'Ta visibilité auprès de ta cible (réseau, LinkedIn, recommandations) :', opts:[
      {t:'Quasi inexistante : on ne pense pas à moi.', s:0},
      {t:'Sporadique, quand j\'ai le temps.', s:1},
      {t:'Active, mais sans cible vraiment définie.', s:2},
      {t:'Régulière et alignée précisément sur qui je veux attirer.', s:3} ]},
    { d:'prospection', q:'Un prospect a montré de l\'intérêt puis disparaît. Tu fais quoi ?', opts:[
      {t:'Je n\'ose pas relancer, peur de l\'embêter.', s:0},
      {t:'Je relance une fois, gentiment, puis j\'abandonne.', s:1},
      {t:'Je le relance plusieurs fois avec le même message.', s:1},
      {t:'Je reviens avec un angle neuf : une info, une question, une preuve.', s:3} ]},

    /* ===== DÉCOUVERTE (8) ===== */
    { d:'decouverte', q:'Dans un premier rendez-vous, le temps que TU passes à parler, c\'est environ :', opts:[
      {t:'70 % : j\'ai beaucoup à présenter.', s:0},
      {t:'50/50 : je présente puis je l\'écoute.', s:1},
      {t:'30 % : surtout des questions, je le laisse parler.', s:3},
      {t:'Ça dépend, je ne mesure pas vraiment.', s:1} ]},
    { d:'decouverte', q:'Ta première vraie question à un prospect ressemble plutôt à :', opts:[
      {t:'« Laisse-moi te présenter ce que je fais. »', s:0},
      {t:'« Qu\'est-ce qui t\'amène à me parler aujourd\'hui ? »', s:2},
      {t:'« C\'est quoi, concrètement, le problème, et depuis quand ? »', s:3},
      {t:'« Quel est ton budget pour ça ? »', s:1} ]},
    { d:'decouverte', q:'Quand un prospect décrit son problème, ton réflexe :', opts:[
      {t:'Je rebondis vite avec ma solution, j\'ai la réponse.', s:0},
      {t:'Je note et je garde ça pour mon pitch.', s:1},
      {t:'Je creuse : « et ça t\'impacte comment, au quotidien ? »', s:3},
      {t:'Je compatis et je passe à la suite.', s:1} ]},
    { d:'decouverte', q:'Le coût du problème (en argent, temps, stress), tu le chiffres avec lui :', opts:[
      {t:'Jamais, ce n\'est pas mon rôle.', s:0},
      {t:'Parfois, si le sujet vient.', s:1},
      {t:'Souvent, j\'essaie d\'avoir un ordre de grandeur.', s:2},
      {t:'Toujours : je lui fais dire le coût de son inaction.', s:3} ]},
    { d:'decouverte', q:'Tu présentes ton offre…', opts:[
      {t:'Dès le début, pour cadrer le rendez-vous.', s:0},
      {t:'Au milieu, une fois la glace brisée.', s:1},
      {t:'Seulement après avoir bien compris son besoin réel.', s:3},
      {t:'Quand il me demande le prix.', s:1} ]},
    { d:'decouverte', q:'Tu sais ce qui va VRAIMENT déclencher la décision chez ce prospect précis :', opts:[
      {t:'Pas vraiment, je déroule le même pitch pour tout le monde.', s:0},
      {t:'J\'ai une intuition.', s:1},
      {t:'Oui, je l\'ai identifié en posant des questions.', s:3},
      {t:'Je suppose que c\'est le prix.', s:1} ]},
    { d:'decouverte', q:'Avant de proposer, tu reformules son besoin pour valider que tu as bien compris :', opts:[
      {t:'Rarement, je fonce.', s:0},
      {t:'De temps en temps.', s:1},
      {t:'Presque toujours.', s:2},
      {t:'Systématiquement : « si je résume, ton enjeu c\'est… c\'est ça ? »', s:3} ]},
    { d:'decouverte', q:'Quand le prospect est flou sur son besoin, tu :', opts:[
      {t:'Je propose quand même mon offre standard.', s:0},
      {t:'Je l\'aide à clarifier avec des questions ciblées.', s:3},
      {t:'Je lui envoie de la doc pour qu\'il réfléchisse.', s:1},
      {t:'Je remets le RDV à plus tard.', s:1} ]},

    /* ===== ARGUMENTATION (7) ===== */
    { d:'argumentation', q:'Pour convaincre, ton réflexe :', opts:[
      {t:'J\'empile les arguments : plus j\'en donne, mieux c\'est.', s:0},
      {t:'Je sors mes 2-3 meilleurs arguments.', s:1},
      {t:'Je relie UN bénéfice clé à SA douleur précise.', s:3},
      {t:'Je montre des preuves et des chiffres en rafale.', s:1} ]},
    { d:'argumentation', q:'Tes arguments sont surtout tournés vers :', opts:[
      {t:'Mes caractéristiques (ce que je fais, comment).', s:0},
      {t:'Mes résultats avec d\'autres clients.', s:2},
      {t:'Le résultat concret que LUI va vivre.', s:3},
      {t:'Mon prix et mes garanties.', s:1} ]},
    { d:'argumentation', q:'Quand tu sens que le prospect décroche pendant ta présentation, tu :', opts:[
      {t:'J\'en rajoute pour le reconvaincre.', s:0},
      {t:'Je continue mon plan jusqu\'au bout.', s:1},
      {t:'Je m\'arrête et je lui pose une question.', s:3},
      {t:'Je vais plus vite vers le prix.', s:1} ]},
    { d:'argumentation', q:'Le storytelling / les exemples concrets dans ta présentation :', opts:[
      {t:'Absents, je vais droit au but.', s:0},
      {t:'Rares.', s:1},
      {t:'Présents quand j\'y pense.', s:2},
      {t:'Au cœur de mon approche : je fais projeter le résultat.', s:3} ]},
    { d:'argumentation', q:'Tu adaptes tes arguments au profil de la personne en face :', opts:[
      {t:'Non, même présentation pour tous.', s:0},
      {t:'Un peu, à l\'instinct.', s:1},
      {t:'Oui, selon ce que j\'ai capté en découverte.', s:3},
      {t:'Seulement si elle me le demande.', s:1} ]},
    { d:'argumentation', q:'À la fin de ta présentation, le prospect pourrait résumer ton offre en une phrase :', opts:[
      {t:'Non, il a reçu trop d\'infos d\'un coup.', s:0},
      {t:'À peu près.', s:1},
      {t:'Oui, parce que j\'ai un message clé simple.', s:3},
      {t:'Je ne sais pas, je ne vérifie pas.', s:1} ]},
    { d:'argumentation', q:'Les bénéfices que tu mets en avant, tu les as :', opts:[
      {t:'En tête, je les sors au feeling.', s:1},
      {t:'Standardisés, les mêmes pour tous.', s:0},
      {t:'Choisis selon la douleur exprimée par CE prospect.', s:3},
      {t:'Listés dans une plaquette que je déroule.', s:1} ]},

    /* ===== PRIX & OBJECTIONS (8) ===== */
    { d:'prix', q:'Au moment d\'annoncer ton prix, concrètement tu :', opts:[
      {t:'Je l\'annonce net, je tiens, et j\'enchaîne.', s:3},
      {t:'Je déroule tout ce qui le justifie AVANT de lâcher le chiffre.', s:1},
      {t:'Je l\'annonce en précisant qu\'on peut s\'arranger si c\'est trop.', s:0},
      {t:'Je le glisse vite, un peu gêné.', s:0} ]},
    { d:'prix', q:'« C\'est trop cher. » Ta première réaction :', opts:[
      {t:'Je justifie ma valeur, arguments à l\'appui.', s:1},
      {t:'Je propose une réduction ou une facilité.', s:0},
      {t:'Je laisse un silence, puis : « trop cher par rapport à quoi ? »', s:3},
      {t:'Je rappelle tout ce qui est inclus.', s:1} ]},
    { d:'prix', q:'Tes prix, par rapport à ta valeur réelle, tu les trouves :', opts:[
      {t:'Sûrement trop bas, mais je n\'ose pas augmenter.', s:1},
      {t:'Bas, et je le sais : je brade pour signer.', s:0},
      {t:'Justes, et je les assume.', s:3},
      {t:'Je ne sais pas trop où me situer.', s:1} ]},
    { d:'prix', q:'Quand tu poses la première référence de prix dans l\'échange :', opts:[
      {t:'C\'est le prospect qui annonce son budget en premier.', s:1},
      {t:'J\'évite le sujet le plus longtemps possible.', s:0},
      {t:'Je pose une ancre haute consciemment, tôt.', s:3},
      {t:'Au hasard, selon le feeling.', s:1} ]},
    { d:'prix', q:'Face à une objection, ton ressenti dominant :', opts:[
      {t:'Du stress : j\'ai peur de perdre le deal.', s:0},
      {t:'Je me mets en mode défense.', s:1},
      {t:'De la curiosité : une objection = un signal d\'intérêt à creuser.', s:3},
      {t:'De l\'agacement, mais je gère.', s:1} ]},
    { d:'prix', q:'« Je vais réfléchir. » Pour toi, ça veut surtout dire :', opts:[
      {t:'Qu\'il a besoin de temps, c\'est normal, je le laisse.', s:1},
      {t:'Que c\'est mort, mais je n\'insiste pas.', s:0},
      {t:'Qu\'il reste une objection cachée que je n\'ai pas traitée.', s:3},
      {t:'Que mon prix est trop élevé.', s:1} ]},
    { d:'prix', q:'Les objections que tu rencontres, tu les anticipes :', opts:[
      {t:'Non, je découvre sur le moment.', s:0},
      {t:'Les plus courantes, de tête.', s:2},
      {t:'Oui, j\'ai préparé une réponse calme à chacune.', s:3},
      {t:'Je préfère éviter qu\'elles arrivent.', s:1} ]},
    { d:'prix', q:'Quand tu dois défendre un écart de prix avec un concurrent moins cher :', opts:[
      {t:'Je m\'aligne ou je baisse.', s:0},
      {t:'Je liste ce que j\'ai en plus.', s:1},
      {t:'Je recadre les critères de comparaison (« moins cher sur quoi, au juste ? »).', s:3},
      {t:'Je dis que la qualité a un prix.', s:1} ]},

    /* ===== CLOSING (7) ===== */
    { d:'closing', q:'En fin de rendez-vous chaud, tu :', opts:[
      {t:'Je propose une prochaine étape claire, maintenant.', s:3},
      {t:'Je le remercie et je le laisse revenir vers moi.', s:0},
      {t:'Je lui envoie un récap et j\'attends.', s:1},
      {t:'Je lui demande ce qu\'il en pense.', s:2} ]},
    { d:'closing', q:'Demander explicitement la vente (« on y va ? »), pour toi c\'est :', opts:[
      {t:'Gênant : j\'ai peur de paraître insistant.', s:0},
      {t:'Pas naturel, je tourne autour.', s:1},
      {t:'Un service que je rends au client.', s:3},
      {t:'À faire seulement s\'il est à 100 %.', s:1} ]},
    { d:'closing', q:'Après avoir annoncé ton prix, tu :', opts:[
      {t:'Je remplis le silence en rajoutant des choses.', s:0},
      {t:'Je pose une question pour détendre.', s:1},
      {t:'Je me tais et je laisse le silence travailler.', s:3},
      {t:'J\'enchaîne vite sur la suite.', s:1} ]},
    { d:'closing', q:'Tes rendez-vous se terminent le plus souvent par :', opts:[
      {t:'« Je reviens vers vous. » (et souvent plus de nouvelles)', s:0},
      {t:'Un devis envoyé, sans date de décision.', s:1},
      {t:'Une décision OU une prochaine étape datée.', s:3},
      {t:'Un « il faut que j\'en parle à… ».', s:1} ]},
    { d:'closing', q:'Quand le prospect hésite à conclure, tu :', opts:[
      {t:'Je n\'insiste pas, je respecte son rythme.', s:1},
      {t:'Je baisse le prix pour débloquer.', s:0},
      {t:'Je fais ressortir l\'objection cachée et je la traite.', s:3},
      {t:'Je relance dans quelques jours.', s:1} ]},
    { d:'closing', q:'Ton taux de transformation (RDV qualifiés → signatures) :', opts:[
      {t:'Faible : beaucoup de RDV pour peu de ventes.', s:0},
      {t:'Moyen et imprévisible.', s:1},
      {t:'Correct, je sais à peu près où je vais.', s:2},
      {t:'Bon et régulier : je maîtrise ma fin de cycle.', s:3} ]},
    { d:'closing', q:'Quand tu es SÛR que le prospect va signer, tu :', opts:[
      {t:'Je relâche et je le laisse venir.', s:0},
      {t:'Je traite quand même chaque objection à fond.', s:3},
      {t:'Je passe direct au contrat.', s:1},
      {t:'Je me détends, c\'est plié.', s:0} ]},

    /* ===== SUIVI / RELANCE (6) ===== */
    { d:'suivi', q:'Après un RDV sans décision, ta relance arrive :', opts:[
      {t:'Quand j\'y pense, sans vrai timing.', s:1},
      {t:'Rarement : je n\'aime pas relancer.', s:0},
      {t:'À un moment prévu, avec un prétexte de valeur.', s:3},
      {t:'Le lendemain : « alors, vous avez réfléchi ? »', s:1} ]},
    { d:'suivi', q:'Le contenu de tes relances :', opts:[
      {t:'« Je me permets de revenir vers vous… »', s:1},
      {t:'« Avez-vous pris votre décision ? »', s:0},
      {t:'Une vraie valeur ajoutée (cas, info, réponse à un doute).', s:3},
      {t:'Un rappel de mon offre.', s:1} ]},
    { d:'suivi', q:'Tu sais combien de deals « tièdes » tu as en cours en ce moment :', opts:[
      {t:'Aucune idée précise.', s:0},
      {t:'À peu près, de tête.', s:1},
      {t:'Oui, j\'ai une liste à jour.', s:2},
      {t:'Oui, avec la prochaine action prévue pour chacun.', s:3} ]},
    { d:'suivi', q:'Combien de fois relances-tu avant de lâcher un prospect intéressé ?', opts:[
      {t:'Une, maximum.', s:0},
      {t:'2-3 fois, gentiment.', s:1},
      {t:'Autant qu\'il faut, tant que j\'apporte de la valeur.', s:3},
      {t:'Je n\'ai pas de règle.', s:1} ]},
    { d:'suivi', q:'Un deal chaud qui n\'aboutit pas, pour toi c\'est :', opts:[
      {t:'Normal, on ne signe pas tout.', s:1},
      {t:'De l\'argent que j\'ai laissé filer faute de suivi.', s:3},
      {t:'La faute du prospect pas assez sérieux.', s:0},
      {t:'Pas grave, il y en aura d\'autres.', s:0} ]},
    { d:'suivi', q:'Ton système pour ne perdre aucun suivi :', opts:[
      {t:'Ma mémoire et mes post-it.', s:0},
      {t:'Un fichier que je tiens quand j\'y pense.', s:1},
      {t:'Un CRM / tableau que je tiens à jour avec relances datées.', s:3},
      {t:'Ma boîte mail.', s:1} ]},

    /* ===== POSTURE MENTALE (7) ===== */
    { d:'posture', q:'Au fond, vendre, pour toi, c\'est plutôt :', opts:[
      {t:'Un mal nécessaire que je subis.', s:0},
      {t:'Pas naturel, mais je fais avec.', s:1},
      {t:'Aider quelqu\'un à dire oui à son propre intérêt.', s:3},
      {t:'Une compétence technique parmi d\'autres.', s:2} ]},
    { d:'posture', q:'Quand tu dois parler d\'argent / annoncer un prix, ton corps :', opts:[
      {t:'Se crispe, je n\'aime pas ce moment.', s:0},
      {t:'Est un peu tendu mais ça passe.', s:1},
      {t:'Est calme : j\'ai fait la paix avec le sujet.', s:3},
      {t:'Ça dépend des jours.', s:1} ]},
    { d:'posture', q:'L\'idée d\'« insister » auprès d\'un prospect te fait :', opts:[
      {t:'Très peur : je préfère lâcher.', s:0},
      {t:'Hésiter souvent.', s:1},
      {t:'Aucun souci si je crois à la valeur que j\'apporte.', s:3},
      {t:'Un peu mal à l\'aise.', s:1} ]},
    { d:'posture', q:'Après une vente signée, tu ressens surtout :', opts:[
      {t:'Un léger malaise, comme si j\'avais « pris » quelque chose.', s:0},
      {t:'Du soulagement.', s:1},
      {t:'La fierté d\'avoir aidé quelqu\'un à avancer.', s:3},
      {t:'De la satisfaction pour le chiffre.', s:2} ]},
    { d:'posture', q:'Ta confiance en TES résultats commerciaux :', opts:[
      {t:'Faible : je doute beaucoup.', s:0},
      {t:'Variable selon les semaines.', s:1},
      {t:'Solide : je sais ce que je vaux et ce que je livre.', s:3},
      {t:'Correcte, mais fragile face à un refus.', s:1} ]},
    { d:'posture', q:'Un « non » d\'un prospect, ça t\'atteint :', opts:[
      {t:'Beaucoup, je le prends personnellement.', s:0},
      {t:'Un peu, ça plombe ma journée.', s:1},
      {t:'Peu : c\'est une info, pas un jugement sur moi.', s:3},
      {t:'Ça dépend de l\'enjeu.', s:1} ]},
    { d:'posture', q:'Te former à la vente, tu le vois comme :', opts:[
      {t:'Un aveu de faiblesse : je devrais déjà savoir.', s:0},
      {t:'Utile mais pas prioritaire.', s:1},
      {t:'Un investissement direct sur mon chiffre.', s:3},
      {t:'Quelque chose à faire « un jour ».', s:1} ]}
  ];

  /* --- Version courte (v2.7 · deux temps) : 2 questions les plus discriminantes par levier.
     Indices dans Q_FULL. 7 leviers × 2 = 14 questions. Score /100 conservé (max 6/levier). --- */
  const SHORT_IDX = [1,2, 7,10, 15,16, 22,23, 31,32, 37,38, 43,48];
  const Q = SHORT_IDX.map(i => Q_FULL[i]);

  /* --- Scoring : % par dimension + score global /100 --- */
  function score(answers){
    const per = {};
    DIMS.forEach(d => per[d.id] = { pts:0, max:0 });
    Q.forEach((qq, i) => {
      const a = answers[i];
      per[qq.d].max += 3;
      if (a && typeof a.s === 'number') per[qq.d].pts += a.s;
    });
    const dims = DIMS.map(d => {
      const o = per[d.id];
      const pct = o.max ? Math.round((o.pts / o.max) * 100) : 0;
      return { id:d.id, label:d.label, emoji:d.emoji, pct, court:d.court };
    });
    const global = Math.round(dims.reduce((s,d)=>s+d.pct,0) / dims.length);
    const sorted = [...dims].sort((a,b)=>a.pct-b.pct);
    return { global, dims, weakest:sorted.slice(0,2), strongest:sorted[sorted.length-1] };
  }

  /* --- Bande de score globale --- */
  function band(g){
    if (g <= 40) return { titre:'Tu laisses beaucoup d\'argent sur la table.', sub:'Bonne nouvelle : ce ne sont pas tes capacités, ce sont des fuites précises et réparables.' };
    if (g <= 70) return { titre:'Des bases solides, et des fuites identifiées.', sub:'Tu vends déjà, mais quelques points te coûtent des deals que tu pourrais signer.' };
    return { titre:'Tu vends déjà bien. On passe en mode optimisation.', sub:'Le gros est là. Il reste des marges fines, mais à fort effet de levier.' };
  }

  function getDim(id){ return DIMS.find(d=>d.id===id); }

  return { DIMS, Q, score, band, getDim };
})();
