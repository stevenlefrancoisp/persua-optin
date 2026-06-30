/* ============================================================
   Persua — données & logique du diagnostic (partagé index + resultat)
   ============================================================ */
window.QUIZ = (function () {

  const METIERS = [
    { id:'coach', emoji:'🏋️', label:'Coach sportif / bien-être',
      reine:'« Je vais réfléchir » — ou « c\'est cher pour du sport ».',
      angle:'Tu ne vends pas des séances, tu vends une transformation. Le cerveau paie pour une projection de soi (l\'anticipation du résultat) et fuit le coût de l\'inaction — ici, sa santé.',
      phrase:'« C\'est normal d\'hésiter sur un engagement comme ça (A). Dis-moi : c\'est le budget, le bon moment, ou un doute sur le fait que ça marche pour toi (I) ? Voyons ensemble comment on cale ça (R). »' },
    { id:'consultant', emoji:'💼', label:'Consultant / freelance / prestataire',
      reine:'« C\'est trop cher » — sur une offre immatérielle, au ROI flou.',
      angle:'Ton offre est invisible : le cerveau ne sait pas où l\'ancrer. Vends le résultat chiffré, pas tes heures. Ramène toujours le prix à la douleur en euros.',
      phrase:'« C\'est normal de regarder le budget (A). C\'est cher par rapport à la valeur que tu perçois, ou tu avais un montant précis en tête (I) ? Regardons comment on rentabilise ça ensemble (R). »' },
    { id:'artisan', emoji:'🔧', label:'Artisan / commerçant / TPE',
      reine:'« Je compare » — « je trouve moins cher ailleurs ».',
      angle:'Le cerveau compare des prix tant qu\'il ne voit pas de différence. Pose ton ancre + l\'effet de halo de ton expertise pour sortir du simple tableau de prix.',
      phrase:'« C\'est sain de comparer, fais-le (A). Tu compares sur le prix seul, ou sur ce que tu obtiens vraiment derrière (I) ? Voilà ce qui change concrètement chez moi (R). »' },
    { id:'therapeute', emoji:'🌿', label:'Thérapeute / praticien',
      reine:'Le malaise avec l\'argent — « je ne veux pas forcer ».',
      angle:'Le vrai blocage n\'est pas le sien, c\'est le tien. Annoncer ton prix calmement est un acte de soin : la clarté apaise la menace. Aligne valeur et accompagnement.',
      phrase:'« C\'est normal de prendre le temps (A). Qu\'est-ce qui te retient, là — le budget, ou un doute sur l\'accompagnement (I) ? Voyons ce qui t\'aiderait à te lancer sereinement (R). »' },
    { id:'enseigne', emoji:'🏬', label:'Commerce spécialisé (literie, opticien, immo, luxe, auto…)',
      reine:'« Je vais réfléchir / regarder ailleurs » — sur un achat important et rare.',
      angle:'Trop d\'options = surcharge cognitive → le cerveau reporte la décision. Simplifie le choix, crée la projection (marqueur somatique) et rends visible le coût d\'attendre.',
      phrase:'« C\'est un achat qui compte, normal d\'y réfléchir (A). Il te manque quoi pour décider — le budget, le bon modèle, ou le bon moment (I) ? Trouvons l\'info qui te débloque (R). »' },
    { id:'autre', emoji:'✨', label:'Autre activité',
      reine:'« C\'est trop cher » / « je vais réfléchir ».',
      angle:'Quel que soit ton métier, l\'objection dite n\'est jamais la vraie. Il n\'en existe que 3 : Temps, Argent, Effort. Le reste est un écran de fumée à dissiper.',
      phrase:'« C\'est normal d\'hésiter, tout le monde le fait (A). C\'est plutôt le budget, le timing, ou "est-ce que ça va marcher pour moi" (I) ? Voyons comment on avance ensemble (R). »' }
  ];

  const PROFILE_Q = [
    { q:'Fin de rendez-vous. Un prospect clairement chaud te dit : « C\'est exactement ce qu\'il me faut, je valide avec mon associé et je reviens vers toi. » Tu fais quoi ?', opts:[
      {t:'Je propose direct un point à trois cette semaine, tant que c\'est chaud.',          p:'F', em:'⚡'},
      {t:'Je lui prépare un récap chiffré, carré, pour qu\'il le présente sans rien oublier.', p:'E', em:'📊'},
      {t:'Je le remercie, je le laisse gérer à son rythme, je relance dans quelques jours.',   p:'R', em:'🤝'},
      {t:'Je glisse un « si ça ne tenait qu\'à toi, tu signerais aujourd\'hui ? » pour le sentir.', p:'C', em:'🦎'} ]},
    { q:'Le moment d\'annoncer ton prix. Concrètement, tu…', opts:[
      {t:'Je l\'annonce net, je tiens, et j\'enchaîne direct sur la suite.', p:'F', em:'💪'},
      {t:'Je déroule ce qui le justifie avant de lâcher le chiffre.',        p:'E', em:'📑'},
      {t:'Je l\'annonce… en précisant qu\'on peut s\'arranger si c\'est trop.', p:'R', em:'😬'},
      {t:'Je lis sa réaction en temps réel et j\'ajuste ma présentation.',    p:'C', em:'👀'} ]},
    { q:'Le prospect sort une objection que tu n\'avais pas vue venir. Ton instinct :', opts:[
      {t:'J\'ai du répondant : je réponds du tac au tac et je reprends la main.', p:'F', em:'🎯'},
      {t:'Je démonte l\'objection, exemples et preuves à l\'appui.',              p:'E', em:'🧩'},
      {t:'Je valide son ressenti, je dédramatise, je rassure.',                  p:'R', em:'☕'},
      {t:'Je rebondis sur sa formulation et je la retourne à ma façon.',         p:'C', em:'🌀'} ]},
    { q:'Sois honnête : ce qui te fait perdre le plus de deals, c\'est plutôt…', opts:[
      {t:'Je vais trop vite vers la conclusion, je grille des étapes.',  p:'F', em:'🏃'},
      {t:'Je donne trop d\'infos — le prospect sature et « réfléchit ».', p:'E', em:'🌊'},
      {t:'Je n\'ose pas provoquer la décision, alors ça traîne et ça meurt.', p:'R', em:'🙈'},
      {t:'Je m\'adapte tellement à lui que je perds le fil de MON offre.', p:'C', em:'🎭'} ]},
    { q:'Tu prépares un rendez-vous qui compte. Ton vrai focus, c\'est :', opts:[
      {t:'Mon plan pour décrocher un oui, vite.',                          p:'F', em:'🚀'},
      {t:'Connaître le dossier sur le bout des doigts pour parer à tout.', p:'E', em:'⚙️'},
      {t:'Installer un climat de confiance pour qu\'il se sente à l\'aise.', p:'R', em:'😌'},
      {t:'Pouvoir m\'ajuster à qui j\'aurai vraiment en face le jour J.',  p:'C', em:'🧭'} ]}
  ];

  const PROFILS = {
    F:{ titre:'Le Fonceur', emoji:'⚡',
        desc:'Tu as l\'énergie et le cran d\'aller au closing — c\'est rare et précieux.',
        piege:'Ton piège : la pression. Neurologiquement, quand tu pousses, le cerveau du client passe en mode menace… et se ferme.',
        levier:'Ton levier Persua : le silence de 8 secondes après le prix. Tu as déjà le cran — il te manque la patience qui fait dire oui.' },
    E:{ titre:'L\'Expert', emoji:'📊',
        desc:'Tu maîtrises ton sujet à fond, et ça inspire confiance.',
        piege:'Ton piège : sur-argumenter. Trop d\'arguments = surcharge cognitive → le client dit « je vais réfléchir » pour fuir l\'effort mental.',
        levier:'Ton levier Persua : poser UNE question au lieu de donner trois réponses. Moins tu prouves, plus il se convainc lui-même.' },
    R:{ titre:'Le Relationnel', emoji:'🤝',
        desc:'Tu crées du lien et de la confiance comme personne — les clients t\'apprécient.',
        piege:'Ton piège : la peur de déranger. Tu n\'oses pas demander la vente ni tenir tes prix… alors tu brades ou tu laisses filer.',
        levier:'Ton levier Persua : demander la vente est un service, pas une agression. Le client t\'a fait confiance — va au bout pour lui.' },
    C:{ titre:'Le Caméléon', emoji:'🦎',
        desc:'Tu lis les gens et tu t\'adaptes à chacun — une arme redoutable en vente.',
        piege:'Ton piège : te diluer. À force de t\'adapter, tu ne tranches pas et tu laisses le client décider seul (donc reporter).',
        levier:'Ton levier Persua : garde ton cap. Adapte la forme, oui — mais guide fermement vers la décision.' }
  };

  function computeProfile(answers){
    const sc={F:0,E:0,R:0,C:0};
    for(let i=1;i<answers.length;i++){ if(answers[i] && sc[answers[i]]!=null) sc[answers[i]]++; }
    let best='F', bv=-1;
    ['F','E','R','C'].forEach(k=>{ if(sc[k]>bv){ bv=sc[k]; best=k; } });
    return best;
  }
  function getProfile(answers){ return PROFILS[computeProfile(answers)]; }
  function getMetier(answers){ return METIERS.find(m=>m.id===answers[0]) || METIERS[METIERS.length-1]; }

  // Construit les 2 blocs du diagnostic (profil + objection-reine métier)
  function buildResultHTML(answers){
    const prof = getProfile(answers);
    const metier = getMetier(answers);
    let h = '';
    h += '<div class="res-block"><div class="lbl">Ton profil de vendeur</div>';
    h += '<h4>'+prof.emoji+' '+prof.titre+'</h4>';
    h += '<p>'+prof.desc+'</p>';
    h += '<p><b>⚠️ '+prof.piege+'</b></p>';
    h += '<p>'+prof.levier+'</p></div>';
    h += '<div class="res-block"><div class="lbl">L\'objection-reine de ton métier · '+metier.label+'</div>';
    h += '<h4>'+metier.emoji+' '+metier.reine+'</h4>';
    h += '<p>'+metier.angle+'</p>';
    h += '<p style="margin-bottom:6px"><b>Ta phrase-réflexe — méthode AIR (Accepte → Interroge → Réponds) — à tester dès ton prochain rendez-vous :</b></p>';
    h += '<div class="res-phrase">'+metier.phrase+'</div></div>';
    return h;
  }

  return { METIERS, PROFILE_Q, PROFILS, computeProfile, getProfile, getMetier, buildResultHTML };
})();
